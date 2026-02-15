import { redis } from "../../config/redis";
import { TARGETING_CONFIG, getCurrentTimeSlot } from "../../config/targeting-config";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ImpressionRecord {
  adId: string;
  timestamp: number;
}

export interface UserProfile {
  customerId: string;
  impressions: ImpressionRecord[];
  lastUpdated: number;
}

export interface AdDocument {
  _id: any;
  title: string;
  imageUrl: string;
  videoUrl?: string;
  cta?: string;
  segments: string[];
  channels: string[];
  locations?: string[];
  startDate: Date;
  endDate: Date;
  status: string;
  priority: number;
  impressions: number;
  clicks: number;
  timeSlots?: string[];
  advertiser?: {
    name?: string;
    contactEmail?: string;
  };
}

export interface ScoredAd {
  ad: AdDocument;
  score: number;
  breakdown: {
    priorityScore: number;
    ctrScore: number;
    recencyScore: number;
    freshnessScore: number;
  };
}

// ─── User Profile Management ─────────────────────────────────────────────────

const getUserProfileKey = (customerId: string) => `userprofile:${customerId}`;

/**
 * Retrieve or create a user profile from Redis.
 * Returns a new empty profile if Redis is unavailable or no profile exists.
 */
export const getUserProfile = async (customerId: string): Promise<UserProfile> => {
  try {
    const key = getUserProfileKey(customerId);
    const data = await redis.get(key);

    if (data) {
      return JSON.parse(data) as UserProfile;
    }
  } catch (error) {
    console.warn("[targeting] Redis getUserProfile error:", error);
  }

  // Return fresh profile
  return {
    customerId,
    impressions: [],
    lastUpdated: Date.now(),
  };
};

/**
 * Save user profile to Redis after recording an impression.
 * Uses pipeline for atomic set + expire.
 */
export const recordImpression = async (
  customerId: string,
  adId: string,
): Promise<void> => {
  try {
    const profile = await getUserProfile(customerId);
    const now = Date.now();

    // Add new impression
    profile.impressions.push({ adId, timestamp: now });

    // Prune impressions older than 24h to keep profile lean
    const oneDayAgo = now - 86400 * 1000;
    profile.impressions = profile.impressions.filter(
      (imp) => imp.timestamp > oneDayAgo,
    );
    profile.lastUpdated = now;

    const key = getUserProfileKey(customerId);
    const pipeline = redis.pipeline();
    pipeline.set(key, JSON.stringify(profile));
    pipeline.expire(key, TARGETING_CONFIG.userProfile.ttl);
    await pipeline.exec();
  } catch (error) {
    console.error("[targeting] Redis recordImpression error:", error);
    // Non-blocking: don't fail the ad serve if profile update fails
  }
};

// ─── CTR Calculator ──────────────────────────────────────────────────────────

/**
 * Calculate click-through rate with minimum impression threshold.
 * Returns defaultCtr if impressions are below the minimum threshold.
 */
export const calculateCtr = (impressions: number, clicks: number): number => {
  if (impressions < TARGETING_CONFIG.ctr.minimumImpressions) {
    return TARGETING_CONFIG.ctr.defaultCtr;
  }
  return clicks / impressions;
};

// ─── Frequency Cap Filter ────────────────────────────────────────────────────

/**
 * Filter out ads that the customer has seen too many times today
 * or within the cooldown period.
 *
 * Rules:
 * - Exclude ads shown >= maxImpressionsPerDay times in the last 24h
 * - Exclude ads shown within the last cooldownHours
 */
export const filterByFrequencyCap = (
  ads: AdDocument[],
  profile: UserProfile,
): { eligible: AdDocument[]; excluded: string[] } => {
  const { maxImpressionsPerDay, cooldownHours } = TARGETING_CONFIG.frequencyCap;
  const now = Date.now();
  const oneDayAgo = now - 86400 * 1000;
  const cooldownMs = cooldownHours * 3600 * 1000;

  const excluded: string[] = [];

  const eligible = ads.filter((ad) => {
    const adId = ad._id.toString();
    const todayImpressions = profile.impressions.filter(
      (imp) => imp.adId === adId && imp.timestamp > oneDayAgo,
    );

    // Check daily cap
    if (todayImpressions.length >= maxImpressionsPerDay) {
      excluded.push(`${adId}:daily_cap(${todayImpressions.length}/${maxImpressionsPerDay})`);
      return false;
    }

    // Check cooldown
    const lastShown = todayImpressions.reduce(
      (max, imp) => Math.max(max, imp.timestamp),
      0,
    );
    if (lastShown > 0 && now - lastShown < cooldownMs) {
      const minutesAgo = Math.round((now - lastShown) / 60000);
      excluded.push(`${adId}:cooldown(${minutesAgo}min_ago)`);
      return false;
    }

    return true;
  });

  return { eligible, excluded };
};

// ─── Time Slot Filter ────────────────────────────────────────────────────────

/**
 * Filter ads by time slot. Ads without timeSlots field pass through
 * (they're considered to run all day).
 */
export const filterByTimeSlot = (
  ads: AdDocument[],
): { eligible: AdDocument[]; excluded: string[] } => {
  const currentSlot = getCurrentTimeSlot();
  const excluded: string[] = [];

  const eligible = ads.filter((ad) => {
    if (!ad.timeSlots || ad.timeSlots.length === 0) return true;
    const matches = ad.timeSlots.includes(currentSlot);
    if (!matches) {
      excluded.push(`${ad._id}:timeslot(needs:${ad.timeSlots.join(",")} current:${currentSlot})`);
    }
    return matches;
  });

  return { eligible, excluded };
};

// ─── Composite Scoring ───────────────────────────────────────────────────────

/**
 * Calculate a composite score for each ad based on:
 * - Priority weight (normalized)
 * - CTR (clicks/impressions or default)
 * - Recency (how fresh the ad campaign is — newer = higher)
 * - Content freshness (inverse of total impressions — less shown = higher)
 *
 * All components are normalized 0–1 and weighted according to config.
 */
export const scoreAds = (ads: AdDocument[]): ScoredAd[] => {
  if (ads.length === 0) return [];

  const weights = TARGETING_CONFIG.scoreWeights;

  // Find max values for normalization
  const maxPriority = Math.max(...ads.map((a) => a.priority || 1));
  const maxImpressions = Math.max(...ads.map((a) => a.impressions || 0), 1);
  const now = Date.now();

  return ads.map((ad) => {
    // 1. Priority score (0–1)
    const priorityScore = (ad.priority || 1) / maxPriority;

    // 2. CTR score (0–1, capped at 0.1 for normalization)
    const rawCtr = calculateCtr(ad.impressions, ad.clicks);
    const ctrScore = Math.min(rawCtr / 0.1, 1);

    // 3. Recency score — newer campaigns score higher
    const startTs = ad.startDate instanceof Date ? ad.startDate.getTime() : new Date(ad.startDate as unknown as string).getTime();
    const ageMs = now - startTs;
    const maxAge = TARGETING_CONFIG.score.recencyMaxAgeDays * 86400 * 1000;
    const recencyScore = Math.max(0, 1 - ageMs / maxAge);

    // 4. Freshness score — less shown ads get priority
    const freshnessScore = 1 - (ad.impressions || 0) / maxImpressions;

    // Composite
    const score =
      weights.priority * priorityScore +
      weights.ctr * ctrScore +
      weights.recency * recencyScore +
      weights.freshness * freshnessScore;

    return {
      ad,
      score,
      breakdown: { priorityScore, ctrScore, recencyScore, freshnessScore },
    };
  });
};
