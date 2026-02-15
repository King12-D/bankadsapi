import { Ads } from "./ads-models";
import { redis, isRedisAvailable } from "../../config/redis";
import { TARGETING_CONFIG, getSegment, getCurrentTimeSlot } from "../../config/targeting-config";
import {
  getUserProfile,
  recordImpression,
  filterByFrequencyCap,
  filterByTimeSlot,
  scoreAds,
  type AdDocument,
} from "./targeting-engine";

// ─── Serve Ads (Targeting Engine) ────────────────────────────────────────────

export const serveAds = async (c: any) => {
  const startTime = Date.now();
  const log: string[] = [];

  let body: any = {};

  try {
    body = await c.req.json().catch(() => ({}));
    const { balance, channel = "ATM", customerId } = body;

    if (!customerId || (typeof customerId === "string" && customerId.trim() === "")) {
      return c.json({ error: "customerId is required" }, 400);
    }

    // Input sanitization: cap length and strip cache-key-breaking chars
    const MAX_CUSTOMER_ID_LEN = 64;
    if (typeof customerId !== "string" || customerId.length > MAX_CUSTOMER_ID_LEN) {
      return c.json({ error: `customerId must be a string of max ${MAX_CUSTOMER_ID_LEN} characters` }, 400);
    }
    const safeCustomerId = customerId.replace(/[:\s]/g, "_");

    if (typeof balance !== "number" || balance < 0) {
      return c.json({ error: "balance must be a non-negative number" }, 400);
    }

    const segment = getSegment(balance);
    const currentSlot = getCurrentTimeSlot();
    log.push(`segment=${segment} channel=${channel} slot=${currentSlot}`);

    // ── Step 1: Check personalized cache ──────────────────────────────
    const cacheKey = `ad:${segment}:${channel}:${safeCustomerId}`;

    if (isRedisAvailable()) {
      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          log.push("cache=HIT");
          console.log(`[serveAds] ${log.join(" | ")} | ${Date.now() - startTime}ms`);
          return c.json(JSON.parse(cached));
        }
      } catch {
        log.push("cache=ERROR");
      }
    }
    log.push("cache=MISS");

    // ── Step 2: Get user profile ──────────────────────────────────────
    let userProfile;
    try {
      userProfile = await getUserProfile(safeCustomerId);
      log.push(`profile_impressions=${userProfile.impressions.length}`);
    } catch {
      // Fallback: empty profile if Redis fails
      userProfile = { customerId: safeCustomerId, impressions: [], lastUpdated: Date.now() };
      log.push("profile=FALLBACK");
    }

    // ── Step 3: Query eligible ads from DB ────────────────────────────
    const now = new Date();
    const eligibleAds = (await Ads.find({
      segments: segment,
      channels: channel,
      status: "active",
      startDate: { $lte: now },
      endDate: { $gte: now },
    })
      .sort({ priority: -1 })
      .maxTimeMS(2000)
      .lean()) as unknown as AdDocument[];

    log.push(`db_matches=${eligibleAds.length}`);

    if (eligibleAds.length === 0) {
      console.log(`[serveAds] ${log.join(" | ")} | NO_ADS | ${Date.now() - startTime}ms`);
      return c.json({ message: "No ad available" }, 404);
    }

    // ── Step 4: Filter by time slot ───────────────────────────────────
    const timeSlotResult = filterByTimeSlot(eligibleAds);
    let candidates = timeSlotResult.eligible;
    if (timeSlotResult.excluded.length > 0) {
      log.push(`timeslot_filtered=${timeSlotResult.excluded.length}`);
    }

    // ── Step 5: Filter by frequency cap ───────────────────────────────
    const freqResult = filterByFrequencyCap(candidates, userProfile);
    candidates = freqResult.eligible;
    if (freqResult.excluded.length > 0) {
      log.push(`freq_filtered=${freqResult.excluded.length}`);
    }

    if (candidates.length === 0) {
      // All ads were filtered out — fall back to least-shown ad from original set
      log.push("FALLBACK_LEAST_SHOWN");
      candidates = [...eligibleAds].sort(
        (a, b) => (a.impressions || 0) - (b.impressions || 0),
      );
      candidates = candidates.slice(0, 1);
    }

    // ── Step 6: Score and rank ────────────────────────────────────────
    const scored = scoreAds(candidates);
    scored.sort((a, b) => b.score - a.score);

    const winner = scored[0];
    log.push(
      `winner=${winner.ad._id} score=${winner.score.toFixed(3)} ` +
        `(p=${winner.breakdown.priorityScore.toFixed(2)} ` +
        `ctr=${winner.breakdown.ctrScore.toFixed(2)} ` +
        `rec=${winner.breakdown.recencyScore.toFixed(2)} ` +
        `fresh=${winner.breakdown.freshnessScore.toFixed(2)})`,
    );

    const response = {
      adId: winner.ad._id,
      title: winner.ad.title,
      imageUrl: winner.ad.imageUrl,
      videoUrl: winner.ad.videoUrl,
      cta: winner.ad.cta,
      segment,
      channel,
    };

    // ── Step 7: Update user profile (non-blocking) ────────────────────
    recordImpression(safeCustomerId, winner.ad._id.toString()).catch((err) =>
      console.error("[serveAds] recordImpression error:", err),
    );

    // ── Step 8: Cache with smart TTL ──────────────────────────────────
    if (isRedisAvailable()) {
      const ttl =
        candidates.length <= TARGETING_CONFIG.cache.adThresholdForLowAvailability
          ? TARGETING_CONFIG.cache.highAvailabilityTtl
          : TARGETING_CONFIG.cache.lowAvailabilityTtl;

      redis
        .set(cacheKey, JSON.stringify(response), "EX", ttl)
        .catch((err) => console.error("[serveAds] cache set error:", err));

      log.push(`cached_ttl=${ttl}s`);
    }

    console.log(`[serveAds] ${log.join(" | ")} | ${Date.now() - startTime}ms`);
    return c.json(response);
  } catch (error) {
    console.error("[serveAds] Fatal error:", error);
    console.log(`[serveAds] ${log.join(" | ")} | ERROR | ${Date.now() - startTime}ms`);

    // ── Fallback: Basic serving without targeting ─────────────────────
    try {
      const { balance = 0, channel = "ATM" } = body;
      const segment = getSegment(balance);

      const ad = await Ads.findOne({
        segments: segment,
        channels: channel,
        status: "active",
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
      }).sort({ priority: -1 }).maxTimeMS(2000);

      if (ad) {
        return c.json({
          adId: ad._id,
          title: ad.title,
          imageUrl: ad.imageUrl,
          videoUrl: ad.videoUrl,
          cta: ad.cta,
          segment,
          channel,
          fallback: true,
        });
      }
    } catch {
      // Double fallback failed
    }

    return c.json({ error: "Failed to serve ad" }, 500);
  }
};

// ─── Admin: Create Ad ────────────────────────────────────────────────────────

export const createAd = async (c: any) => {
  try {
    const body = await c.req.json();
    if (
      !body.title ||
      !body.imageUrl ||
      !body.segments ||
      !body.startDate ||
      !body.endDate
    ) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const ads = await Ads.create(body);

    // Fire-and-forget cache invalidation (non-blocking)
    if (isRedisAvailable()) {
      invalidateCacheForAd(body).catch((err) =>
        console.warn("[createAd] Cache invalidation error:", err),
      );
    }

    return c.json({
      message: "Ad created",
      ads,
    });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to create ad" }, 500);
  }
};

// ─── Track Impression ────────────────────────────────────────────────────────

export const trackImpression = async (c: any) => {
  try {
    const { adId, customerId } = await c.req.json();

    if (!adId) {
      return c.json({ error: "adId required" }, 400);
    }

    // Update DB impression count
    await Ads.updateOne({ _id: adId }, { $inc: { impressions: 1 } });

    // Also update user profile if customerId provided
    if (customerId) {
      recordImpression(customerId, adId).catch((err) =>
        console.error("[trackImpression] recordImpression error:", err),
      );
    }

    return c.json({ message: "Impression recorded" });
  } catch (error) {
    return c.json({ error: "Failed to track impression" }, 500);
  }
};

// ─── Track Click ─────────────────────────────────────────────────────────────

export const trackClick = async (c: any) => {
  try {
    const { adId } = await c.req.json();

    if (!adId) {
      return c.json({ error: "adId required" }, 400);
    }

    await Ads.updateOne({ _id: adId }, { $inc: { clicks: 1 } });

    return c.json({ message: "Click recorded" });
  } catch (error) {
    return c.json({ error: "Failed to track click" }, 500);
  }
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Async cache invalidation using SCAN (non-blocking).
 * Runs as fire-and-forget from createAd so the response isn't delayed.
 */
async function invalidateCacheForAd(body: any): Promise<void> {
  const segments = Array.isArray(body.segments) ? body.segments : [body.segments];
  const channels = Array.isArray(body.channels) ? body.channels : ["ATM"];
  const keys: string[] = [];

  for (const seg of segments) {
    for (const ch of channels) {
      const pattern = `ad:${seg}:${ch}:*`;
      let cursor = "0";
      do {
        const [nextCursor, matchedKeys] = await redis.scan(
          cursor,
          "MATCH",
          pattern,
          "COUNT",
          100,
        );
        cursor = nextCursor;
        if (matchedKeys.length > 0) {
          keys.push(...matchedKeys);
        }
      } while (cursor !== "0");
    }
  }

  if (keys.length > 0) {
    await redis.del(...keys);
    console.log(`[createAd] Invalidated ${keys.length} cache keys`);
  }
}
