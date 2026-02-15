import { redis } from "../../config/redis";
import { TARGETING_CONFIG } from "../../config/targeting-config";

/**
 * Redis sliding-window rate limiter middleware.
 * Uses sorted sets with timestamps for precise sliding windows.
 * Falls back to allowing requests if Redis is unavailable.
 */
export const rateLimiter = async (c: Context, next: Next) => {
  const { windowSeconds, maxRequests } = TARGETING_CONFIG.rateLimit;

  try {
    const ip =
      c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
      c.req.header("x-real-ip") ||
      "unknown";

    const key = `ratelimit:${ip}:${c.req.path}`;
    const now = Date.now();
    const windowStart = now - windowSeconds * 1000;

    // Atomic pipeline: clean old entries, add current, count, set expiry
    const pipeline = redis.pipeline();
    pipeline.zremrangebyscore(key, 0, windowStart);
    pipeline.zadd(key, now, `${now}:${Math.random().toString(36).slice(2, 8)}`);
    pipeline.zcard(key);
    pipeline.expire(key, windowSeconds);

    const results = await pipeline.exec();

    // results[2] = [error, count] from zcard
    const requestCount = (results?.[2]?.[1] as number) ?? 0;

    if (requestCount > maxRequests) {
      c.header("Retry-After", String(windowSeconds));
      c.header("X-RateLimit-Limit", String(maxRequests));
      c.header("X-RateLimit-Remaining", "0");
      return c.json(
        { error: "Rate limit exceeded", retryAfter: windowSeconds },
        429,
      );
    }

    // Set rate limit headers
    c.header("X-RateLimit-Limit", String(maxRequests));
    c.header("X-RateLimit-Remaining", String(maxRequests - requestCount));

    await next();
  } catch (error) {
    // Fail open — allow request if Redis is down
    console.warn("[rate-limiter] Redis error, allowing request:", error);
    await next();
  }
};
