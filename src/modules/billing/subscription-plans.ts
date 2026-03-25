export const SUBSCRIPTION_PLANS = {
  basic: {
    label: "Basic",
    description: "Starter plan for a single acquisition channel and core analytics.",
    features: [
      "1 active campaign at a time",
      "ATM and web ad channels",
      "Basic impression and click analytics",
    ],
    pricing: {
      monthly: {
        amount: 250000,
        currency: "NGN",
        displayAmount: "NGN 2,500",
      },
      annual: {
        amount: 2500000,
        currency: "NGN",
        displayAmount: "NGN 25,000",
      },
    },
    rateLimitTier: "standard",
  },
  pro: {
    label: "Pro",
    description: "Growth plan for banks running multiple targeted campaigns.",
    features: [
      "Unlimited active campaigns",
      "ATM, mobile, web, and USSD channels",
      "Priority targeting support and richer analytics",
    ],
    pricing: {
      monthly: {
        amount: 750000,
        currency: "NGN",
        displayAmount: "NGN 7,500",
      },
      annual: {
        amount: 7500000,
        currency: "NGN",
        displayAmount: "NGN 75,000",
      },
    },
    rateLimitTier: "premium",
  },
  enterprise: {
    label: "Enterprise",
    description: "High-volume plan for multi-team deployments and custom support.",
    features: [
      "Dedicated onboarding and support",
      "Highest throughput for ad delivery APIs",
      "Enterprise-grade reporting and rollout flexibility",
    ],
    pricing: {
      monthly: {
        amount: 1500000,
        currency: "NGN",
        displayAmount: "NGN 15,000",
      },
      annual: {
        amount: 15000000,
        currency: "NGN",
        displayAmount: "NGN 150,000",
      },
    },
    rateLimitTier: "enterprise",
  },
} as const;

export type SubscriptionPlanCode = keyof typeof SUBSCRIPTION_PLANS;
export type BillingCycle = "monthly" | "annual";

export const BILLING_CYCLES: BillingCycle[] = ["monthly", "annual"];
