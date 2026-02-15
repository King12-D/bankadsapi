/**
 * Targeting Engine Configuration
 * All targeting parameters are centralized here for easy tuning.
 */

export const TARGETING_CONFIG = {
  /** Frequency capping */
  frequencyCap: {
    maxImpressionsPerDay: 3,
    cooldownHours: 2,
  },

  /** Composite scoring weights (must sum to 1.0) */
  scoreWeights: {
    priority: 0.35,
    ctr: 0.25,
    recency: 0.20,
    freshness: 0.20,
  },

  /** CTR calculation */
  ctr: {
    minimumImpressions: 10,
    defaultCtr: 0.02,
  },

  /** Time slot definitions (24h format) */
  timeSlots: {
    morning: { start: 6, end: 12 },
    afternoon: { start: 12, end: 17 },
    evening: { start: 17, end: 21 },
    night: { start: 21, end: 6 },
  } as Record<string, { start: number; end: number }>,

  /** Cache TTLs (in seconds) */
  cache: {
    defaultTtl: 60,
    highAvailabilityTtl: 30,
    lowAvailabilityTtl: 120,
    adThresholdForLowAvailability: 3,
    userProfileTtl: 3600,
  },

  /** Rate limiting */
  rateLimit: {
    windowSeconds: 60,
    maxRequests: 100,
  },

  /** Segment derivation thresholds */
  segmentThresholds: {
    low: 50000,
    mass: 200000,
    affluent: 1000000,
  },

  /** Scoring config */
  score: {
     recencyMaxAgeDays: 30,
  },

  /** User profile TTL in Redis (seconds) */
  userProfile: {
    ttl: 86400,
  },
} as const;

// ─── Runtime validation ──────────────────────────────────────────────────────

const weightSum = Object.values(TARGETING_CONFIG.scoreWeights).reduce(
  (sum, w) => sum + w,
  0,
);
if (Math.abs(weightSum - 1.0) > 0.001) {
  throw new Error(
    `[targeting-config] scoreWeights must sum to 1.0, got ${weightSum}`,
  );
}

/** Segment derivation from balance */
export const getSegment = (balance: number): string => {
  if (balance < TARGETING_CONFIG.segmentThresholds.low) return "low";
  if (balance < TARGETING_CONFIG.segmentThresholds.mass) return "mass";
  if (balance < TARGETING_CONFIG.segmentThresholds.affluent) return "affluent";
  return "hnw";
};

/** Get current time slot name */
export const getCurrentTimeSlot = (): string => {
  const hour = new Date().getHours();
  for (const [slot, range] of Object.entries(TARGETING_CONFIG.timeSlots)) {
    if (range.start < range.end) {
      if (hour >= range.start && hour < range.end) return slot;
    } else {
      // Wraps midnight (e.g. night: 21–6)
      if (hour >= range.start || hour < range.end) return slot;
    }
  }
  return "morning";
};
