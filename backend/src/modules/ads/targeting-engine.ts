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

/** 
 * adDocument represents a row from the 'campaigns' table.
 * Note: Postgres returns snake_case by default, we'll map them here.
 */
export interface AdDocument {
  id: string;
  _id: string; // Alias for frontend compatibility
  title: string;
  imageUrl: string;
  videoUrl?: string;
  cta?: string;
  segments: string[];
  channels: string[];
  startDate: Date;
  endDate: Date;
  status: string;
  priority: number;
  impressions: number;
  clicks: number;
  timeSlots?: string[];
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

  return {
    customerId,
    impressions: [],
    lastUpdated: Date.now(),
  };
};

export const recordImpression = async (
  customerId: string,
  adId: string,
): Promise<void> => {
  try {
    const profile = await getUserProfile(customerId);
    const now = Date.now();

    profile.impressions.push({ adId, timestamp: now });

    const oneDayAgo = now - 86400 * 1000;
    profile.impressions = profile.impressions.filter(
      (imp) => imp.timestamp > oneDayAgo,
    );

    const MAX_IMPRESSIONS = 500;
    if (profile.impressions.length > MAX_IMPRESSIONS) {
      profile.impressions = profile.impressions.slice(-MAX_IMPRESSIONS);
    }

    profile.lastUpdated = now;

    const key = getUserProfileKey(customerId);
    const pipeline = redis.pipeline();
    pipeline.set(key, JSON.stringify(profile));
    pipeline.expire(key, TARGETING_CONFIG.userProfile.ttl);
    await pipeline.exec();
  } catch (error) {
    console.error("[targeting] Redis recordImpression error:", error);
  }
};

// ─── CTR Calculator ──────────────────────────────────────────────────────────

export const calculateCtr = (impressions: number, clicks: number): number => {
  if (impressions < TARGETING_CONFIG.ctr.minimumImpressions) {
    return TARGETING_CONFIG.ctr.defaultCtr;
  }
  return clicks / impressions;
};

// ─── Frequency Cap Filter ────────────────────────────────────────────────────

export const filterByFrequencyCap = (
  ads: AdDocument[],
  profile: UserProfile,
): { eligible: AdDocument[]; excluded: string[] } => {
  const { maxImpressionsPerDay, cooldownHours } = TARGETING_CONFIG.frequencyCap;
  const now = Date.now();
  const oneDayAgo = now - 86400 * 1000;
  const cooldownMs = cooldownHours * 3600 * 1000;

  const impressionMap = new Map<string, { count: number; lastShown: number }>();
  for (const imp of profile.impressions) {
    if (imp.timestamp <= oneDayAgo) continue;
    const entry = impressionMap.get(imp.adId);
    if (entry) {
      entry.count++;
      entry.lastShown = Math.max(entry.lastShown, imp.timestamp);
    } else {
      impressionMap.set(imp.adId, { count: 1, lastShown: imp.timestamp });
    }
  }

  const excluded: string[] = [];

  const eligible = ads.filter((ad) => {
    const adId = ad.id.toString();
    const entry = impressionMap.get(adId);

    if (!entry) return true;

    if (entry.count >= maxImpressionsPerDay) {
      excluded.push(`${adId}:daily_cap(${entry.count}/${maxImpressionsPerDay})`);
      return false;
    }

    if (now - entry.lastShown < cooldownMs) {
      const minutesAgo = Math.round((now - entry.lastShown) / 60000);
      excluded.push(`${adId}:cooldown(${minutesAgo}min_ago)`);
      return false;
    }

    return true;
  });

  return { eligible, excluded };
};

// ─── Time Slot Filter ────────────────────────────────────────────────────────

export const filterByTimeSlot = (
  ads: AdDocument[],
): { eligible: AdDocument[]; excluded: string[] } => {
  const currentSlot = getCurrentTimeSlot();
  const excluded: string[] = [];

  const eligible = ads.filter((ad) => {
    if (!ad.timeSlots || ad.timeSlots.length === 0) return true;
    const matches = ad.timeSlots.includes(currentSlot);
    if (!matches) {
      excluded.push(`${ad.id}:timeslot(needs:${ad.timeSlots.join(",")} current:${currentSlot})`);
    }
    return matches;
  });

  return { eligible, excluded };
};

// ─── Composite Scoring ───────────────────────────────────────────────────────

export const scoreAds = (ads: AdDocument[]): ScoredAd[] => {
  if (ads.length === 0) return [];

  const weights = TARGETING_CONFIG.scoreWeights;

  const maxPriority = Math.max(...ads.map((a) => a.priority || 1), 1);
  const maxImpressions = Math.max(...ads.map((a) => a.impressions || 0), 1);
  const now = Date.now();

  return ads.map((ad) => {
    const priorityScore = (ad.priority || 1) / maxPriority;

    const rawCtr = calculateCtr(ad.impressions, ad.clicks);
    const ctrScore = Math.min(rawCtr / 0.1, 1);

    const startTs = ad.startDate instanceof Date ? ad.startDate.getTime() : new Date(ad.startDate).getTime();
    const ageMs = now - startTs;
    const maxAge = TARGETING_CONFIG.score.recencyMaxAgeDays * 86400 * 1000;
    const recencyScore = Math.max(0, 1 - ageMs / maxAge);

    const freshnessScore = 1 - (ad.impressions || 0) / maxImpressions;

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
