import { Context, Next } from "hono";
import { redis, isRedisAvailable } from "../../config/redis";
import { TARGETING_CONFIG } from "../../config/targeting-config";
import { RATE_LIMIT_TIERS, type RateLimitTier } from "../../modules/models/apikey-model";

/**
 * Redis sliding-window rate limiter middleware.
 *
 * Dual-layer limiting:
 *   Layer 1 — Per-IP rate limit (public abuse prevention)
 *   Layer 2 — Per-API-key rate limit (bank tier-based, if x-api-key present)
 *
 * Falls back to allowing requests if Redis is unavailable.
 */
export const rateLimiter = async (c: Context, next: Next) => {
  if (!isRedisAvailable()) {
    await next();
    return;
  }

  const { windowSeconds, maxRequests } = TARGETING_CONFIG.rateLimit;

  try {
    const ip =
      c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
      c.req.header("x-real-ip") ||
      "unknown";

    // ── Layer 1: Per-IP rate limit ────────────────────────────────────
    const ipKey = `ratelimit:ip:${ip}:${c.req.path}`;
    const ipResult = await checkRateLimit(ipKey, windowSeconds, maxRequests);

    if (ipResult.exceeded) {
      console.warn(
        `[rate-limit] IP ${ip} exceeded limit (${ipResult.count}/${maxRequests}) on ${c.req.path}`,
      );
      c.header("Retry-After", String(windowSeconds));
      c.header("X-RateLimit-Limit", String(maxRequests));
      c.header("X-RateLimit-Remaining", "0");
      return c.json(
        { error: "Rate limit exceeded", retryAfter: windowSeconds },
        429,
      );
    }

    // ── Layer 2: Per-API-key rate limit (if present) ──────────────────
    const apiKey = c.req.header("x-api-key");
    if (apiKey) {
      const bank = c.get("bank") as { rateLimitTier?: RateLimitTier };
      const tier: RateLimitTier = bank?.rateLimitTier || "standard";
      const tierConfig = RATE_LIMIT_TIERS[tier];

      const apiKeyHash = apiKey.slice(-8); // last 8 chars for key privacy
      const apiKeyKey = `ratelimit:apikey:${apiKeyHash}:${c.req.path}`;
      const apiKeyResult = await checkRateLimit(
        apiKeyKey,
        tierConfig.windowSeconds,
        tierConfig.maxRequests,
      );

      if (apiKeyResult.exceeded) {
        console.warn(
          `[rate-limit] API key ...${apiKeyHash} (tier:${tier}) exceeded limit ` +
            `(${apiKeyResult.count}/${tierConfig.maxRequests}) on ${c.req.path}`,
        );
        c.header("Retry-After", String(tierConfig.windowSeconds));
        c.header("X-RateLimit-Limit", String(tierConfig.maxRequests));
        c.header("X-RateLimit-Remaining", "0");
        return c.json(
          {
            error: "API key rate limit exceeded",
            tier,
            retryAfter: tierConfig.windowSeconds,
          },
          429,
        );
      }

      c.header("X-RateLimit-Limit", String(tierConfig.maxRequests));
      c.header(
        "X-RateLimit-Remaining",
        String(tierConfig.maxRequests - apiKeyResult.count),
      );
    } else {
      // No API key — use IP-based headers
      c.header("X-RateLimit-Limit", String(maxRequests));
      c.header(
        "X-RateLimit-Remaining",
        String(maxRequests - ipResult.count),
      );
    }

    await next();
  } catch (error) {
    // Fail open — allow request if Redis is down
    console.warn("[rate-limiter] Redis error, allowing request:", error);
    await next();
  }
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Atomic sliding-window check using Redis sorted set + pipeline.
 * Returns whether the limit was exceeded and the current count.
 */
async function checkRateLimit(
  key: string,
  windowSeconds: number,
  maxRequests: number,
): Promise<{ exceeded: boolean; count: number }> {
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;

  const pipeline = redis.pipeline();
  pipeline.zremrangebyscore(key, 0, windowStart);
  pipeline.zadd(key, now, `${now}:${Math.random().toString(36).slice(2, 8)}`);
  pipeline.zcard(key);
  pipeline.expire(key, windowSeconds);

  const results = await pipeline.exec();

  // Check for pipeline errors — fail open if any command errored
  if (!results || results[2]?.[0]) {
    return { exceeded: false, count: 0 };
  }

  const count = (results[2][1] as number) ?? 0;

  return { exceeded: count > maxRequests, count };
}
