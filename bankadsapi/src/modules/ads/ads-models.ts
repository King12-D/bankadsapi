import mongoose, { Schema } from "mongoose";

const adsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    videoUrl: {
      type: String,
    },

    cta: {
      type: String,
    },

    // Financial segments
    segments: {
      type: [String],
      enum: ["low", "mass", "affluent", "hnw"],
      required: true,
      index: true,
    },

    // Where this ad should appear
    channels: {
      type: [String],
      enum: ["ATM", "mobile", "web", "USSD"],
      default: ["ATM"],
      index: true,
    },

    // Optional location targeting
    locations: {
      type: [String], // e.g. ["Lagos", "Port Harcourt"]
    },

    // Time-of-day targeting (empty = all day)
    timeSlots: {
      type: [String],
      enum: ["morning", "afternoon", "evening", "night"],
      index: true,
    },

    // Ad scheduling
    startDate: {
      type: Date,
      required: true,
      index: true,
    },

    endDate: {
      type: Date,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },

    // Priority / bidding weight
    priority: {
      type: Number,
      default: 1,
    },

    // Analytics
    impressions: {
      type: Number,
      default: 0,
    },

    clicks: {
      type: Number,
      default: 0,
    },

    // Advertiser info
    advertiser: {
      name: String,
      contactEmail: String,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for fast ad serving
adsSchema.index({
  status: 1,
  startDate: 1,
  endDate: 1,
});

export const Ads = mongoose.model("Ads", adsSchema);
