import mongoose, { Schema } from "mongoose";

/** Rate limit tiers for bank API keys */
export const RATE_LIMIT_TIERS = {
  standard: { maxRequests: 500, windowSeconds: 60 },
  premium: { maxRequests: 1000, windowSeconds: 60 },
  enterprise: { maxRequests: 5000, windowSeconds: 60 },
} as const;

export type RateLimitTier = keyof typeof RATE_LIMIT_TIERS;

const apiKeySchema = new Schema({
  bankName: {
    type: String,
    required: true,
  }, // e.g., GTB, Access Bank

  apiKey: {
    type: String,
    required: true,
    unique: true,
  },

  contactEmail: {
    type: String,
    lowercase: true,
    trim: true,
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },

  /** Rate limit tier — controls per-API-key request limits */
  rateLimitTier: {
    type: String,
    enum: ["standard", "premium", "enterprise"],
    default: "standard",
  },

  plan: {
    type: String,
    enum: ["basic", "pro", "enterprise"],
    default: "basic",
  },

  billingCycle: {
    type: String,
    enum: ["monthly", "annual"],
    default: "monthly",
  },

  subscriptionStatus: {
    type: String,
    enum: ["pending", "active", "expired", "past_due"],
    default: "pending",
  },

  subscriptionStartDate: {
    type: Date,
  },

  subscriptionEndDate: {
    type: Date,
  },

  lastPaymentReference: {
    type: String,
  },

  lastPaymentAmount: {
    type: Number,
  },

  lastVerifiedAt: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const ApiKey = mongoose.model("ApiKey", apiKeySchema);
