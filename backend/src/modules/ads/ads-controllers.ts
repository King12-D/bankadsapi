import { query } from "../../utils/db";
import { redis, isRedisAvailable } from "../../config/redis";
import {
  TARGETING_CONFIG,
  getSegment,
  getCurrentTimeSlot,
} from "../../config/targeting-config";
import {
  getUserProfile,
  recordImpression,
  filterByFrequencyCap,
  filterByTimeSlot,
  scoreAds,
  type AdDocument,
} from "./targeting-engine";

// Helper to map DB row to AdDocument
const mapRowToAd = (row: any): AdDocument => ({
  id: row.id,
  _id: row.id, // Aliasing for frontend
  title: row.title,
  imageUrl: row.image_url,
  videoUrl: row.video_url,
  cta: row.cta,
  segments: row.segments || [],
  channels: row.channels || [],
  startDate: row.start_date,
  endDate: row.end_date,
  status: row.status,
  priority: row.priority || 1,
  impressions: row.impressions || 0,
  clicks: row.clicks || 0,
});

export const serveAds = async (c: any) => {
  const startTime = Date.now();
  const log: string[] = [];
  let body: any = {};

  try {
    body = await c.req.json().catch(() => ({}));
    const { balance, channel = "ATM", customerId } = body;

    if (!customerId) return c.json({ error: "customerId is required" }, 400);

    const safeCustomerId = customerId.replace(/[:\s]/g, "_");
    const segment = getSegment(balance ?? 0);
    const currentSlot = getCurrentTimeSlot();
    log.push(`segment=${segment} channel=${channel} slot=${currentSlot}`);

    // Cache check
    const cacheKey = `ad:${segment}:${channel}:${safeCustomerId}`;
    if (isRedisAvailable()) {
      const cached = await redis.get(cacheKey).catch(() => null);
      if (cached) {
          console.log(`[serveAds] ${log.join(" | ")} | cache=HIT | ${Date.now() - startTime}ms`);
          return c.json(JSON.parse(cached));
      }
    }

    const userProfile = await getUserProfile(safeCustomerId);

    // Query Neon PG
    // Note: $1 = ANY(array_column) is the way to check if a value exists in a PG array
    // Adding wallet balance check
    const adsResult = await query(
      `SELECT c.* FROM campaigns c
       JOIN wallets w ON c.user_id = w.user_id
       WHERE c.status = 'active' 
       AND w.balance > 0
       AND $1 = ANY(c.segments) 
       AND $2 = ANY(c.channels) 
       AND c.start_date <= NOW() 
       AND c.end_date >= NOW()
       ORDER BY c.priority DESC`,
      [segment, channel]
    );

    const eligibleAds = adsResult.rows.map(mapRowToAd);

    if (eligibleAds.length === 0) {
      return c.json({ message: "No ad available" }, 404);
    }

    // Filters & Scoring
    const timeSlotResult = filterByTimeSlot(eligibleAds);
    let candidates = timeSlotResult.eligible;

    const freqResult = filterByFrequencyCap(candidates, userProfile);
    candidates = freqResult.eligible;

    if (candidates.length === 0) {
      candidates = [eligibleAds.sort((a,b) => a.impressions - b.impressions)[0]];
    }

    const scored = scoreAds(candidates);
    scored.sort((a, b) => b.score - a.score);

    const winner = scored[0].ad;
    
    const response = {
      adId: winner.id,
      _id: winner.id,
      title: winner.title,
      imageUrl: winner.imageUrl,
      videoUrl: winner.videoUrl,
      cta: winner.cta,
      segment,
      channel,
    };

    recordImpression(safeCustomerId, winner.id);

    if (isRedisAvailable()) {
      const ttl = candidates.length <= 5 ? 300 : 3600;
      redis.set(cacheKey, JSON.stringify(response), "EX", ttl).catch(() => {});
    }

    return c.json(response);
  } catch (error: any) {
    console.error("[serveAds] Fatal error:", error);
    return c.json({ error: "Failed to serve ad" }, 500);
  }
};

export const createAd = async (c: any) => {
  try {
    const body = await c.req.json();
    const { title, imageUrl, videoUrl, cta, segments, channels, startDate, endDate, priority, userId } = body;

    const res = await query(
      `INSERT INTO campaigns 
       (title, image_url, video_url, cta, segments, channels, start_date, end_date, priority, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [title, imageUrl, videoUrl, cta, segments, channels, startDate, endDate, priority || 1, userId]
    );

    return c.json({ message: "Ad created", ad: mapRowToAd(res.rows[0]) });
  } catch (error: any) {
    console.error(error);
    return c.json({ error: "Failed to create ad" }, 500);
  }
};

export const trackImpression = async (c: any) => {
  try {
    const { adId, customerId } = await c.req.json();
    const bank = c.get("bank"); // from apikey-auth middleware
    const publisherUserId = bank?.user_id;

    if (!adId) return c.json({ error: "adId required" }, 400);

    // 1. Get Campaign and Advertiser
    const campRes = await query("SELECT id, user_id FROM campaigns WHERE id = $1", [adId]);
    if (campRes.rows.length === 0) return c.json({ error: "Ad not found" }, 404);
    const advertiserUserId = campRes.rows[0].user_id;

    // 2. Determine Cost Per Impression (CPM / 1000). Let's say fixed 2 NGN per impression for now
    const costPerImpression = 2.00;

    // 3. Get Platform Fee Setting
    const setRes = await query("SELECT value FROM platform_settings WHERE key = 'revenue_split_platform_pct'");
    const platformPct = setRes.rows.length > 0 ? Number(setRes.rows[0].value) : 30;
    
    const publisherEarnings = costPerImpression * ((100 - platformPct) / 100);

    // 4. Perform Wallet Transactions
    // Deduct Advertiser
    await query("UPDATE wallets SET balance = balance - $1 WHERE user_id = $2", [costPerImpression, advertiserUserId]);
    
    // Credit Publisher (if valid API key context exists)
    if (publisherUserId) {
        // Ensure publisher wallet exists
        let pWalletRes = await query("SELECT id FROM wallets WHERE user_id = $1", [publisherUserId]);
        if (pWalletRes.rows.length === 0) {
            pWalletRes = await query("INSERT INTO wallets (user_id) VALUES ($1) RETURNING id", [publisherUserId]);
        }
        await query("UPDATE wallets SET balance = balance + $1 WHERE id = $2", [publisherEarnings, pWalletRes.rows[0].id]);
        
        // Log Publisher Earn
        await query(
            "INSERT INTO transactions (wallet_id, amount, type, reference, status, description) VALUES ($1, $2, 'credit', $3, 'success', 'Ad Impression Revenue')",
            [pWalletRes.rows[0].id, publisherEarnings, `earning_${Date.now()}_${adId}`]
        );
    }

    // Log Advertiser Spend
    const aWalletRes = await query("SELECT id FROM wallets WHERE user_id = $1", [advertiserUserId]);
    if (aWalletRes.rows.length > 0) {
        await query(
            "INSERT INTO transactions (wallet_id, amount, type, reference, status, description) VALUES ($1, $2, 'debit', $3, 'success', 'Ad Impression Cost')",
            [aWalletRes.rows[0].id, costPerImpression, `spend_${Date.now()}_${adId}`]
        );
    }

    await query("UPDATE campaigns SET impressions = impressions + 1, spent = spent + $1 WHERE id = $2", [costPerImpression, adId]);
    
    if (customerId) recordImpression(customerId, adId);
    
    return c.json({ message: "Impression recorded and wallets updated" });
  } catch (error: any) {
    console.error("[trackImpression] Error:", error);
    return c.json({ error: "Failed to process impression" }, 500);
  }
};


export const getCampaigns = async (c: any) => {
  try {
    const res = await query("SELECT * FROM campaigns ORDER BY created_at DESC");
    return c.json(res.rows.map(mapRowToAd));
  } catch (error) {
    return c.json({ error: "Failed" }, 500);
  }
};

export const getAnalytics = async (c: any) => {
    // Keep mock for now as requested
    return c.json({
        impressions: { labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], data: [12000, 19000, 15000, 22000, 18000, 25000, 30000] },
        clicks: { labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], data: [800, 1100, 950, 1500, 1200, 2100, 2500] }
    });
};
