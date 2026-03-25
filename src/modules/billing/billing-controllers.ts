import * as crypto from "crypto";
import { ApiKey } from "../models/apikey-model";
import {
  BILLING_CYCLES,
  SUBSCRIPTION_PLANS,
  type BillingCycle,
  type SubscriptionPlanCode,
} from "./subscription-plans";
import {
  buildPaymentRequest,
  getInterswitchConfig,
  getPlanAmount,
  verifyTransaction,
} from "./interswitch";

const ACTIVE_RESPONSE_CODES = new Set(["00", "10", "11"]);

const addBillingDuration = (billingCycle: BillingCycle) => {
  const now = new Date();
  const next = new Date(now);

  if (billingCycle === "annual") {
    next.setFullYear(next.getFullYear() + 1);
  } else {
    next.setMonth(next.getMonth() + 1);
  }

  return {
    startDate: now,
    endDate: next,
  };
};

const isPlanCode = (plan: string): plan is SubscriptionPlanCode =>
  Object.prototype.hasOwnProperty.call(SUBSCRIPTION_PLANS, plan);

const isBillingCycle = (value: string): value is BillingCycle =>
  BILLING_CYCLES.includes(value as BillingCycle);

export const getPlans = async (c: any) => {
  const plans = Object.entries(SUBSCRIPTION_PLANS).map(([code, plan]) => ({
    code,
    label: plan.label,
    description: plan.description,
    features: plan.features,
    monthly: plan.pricing.monthly,
    annual: plan.pricing.annual,
  }));

  return c.json({
    billingCycles: BILLING_CYCLES,
    interswitch: {
      mode: getInterswitchConfig().mode,
    },
    plans,
  });
};

export const initiateCheckout = async (c: any) => {
  try {
    const body = await c.req.json();
    const bankName = String(body.bankName ?? "").trim();
    const contactEmail = String(body.contactEmail ?? "").trim().toLowerCase();
    const plan = String(body.plan ?? "").trim().toLowerCase();
    const billingCycle = String(body.billingCycle ?? "").trim().toLowerCase();

    if (!bankName || !contactEmail || !isPlanCode(plan) || !isBillingCycle(billingCycle)) {
      return c.json(
        {
          error:
            "bankName, contactEmail, plan (basic|pro|enterprise), and billingCycle (monthly|annual) are required",
        },
        400,
      );
    }

    const amount = getPlanAmount(plan, billingCycle);
    const transactionReference = `isw_${plan}_${billingCycle}_${Date.now()}_${crypto
      .randomBytes(4)
      .toString("hex")}`;

    let account = await ApiKey.findOne({ bankName, contactEmail });

    if (!account) {
      account = await ApiKey.create({
        bankName,
        contactEmail,
        apiKey: crypto.randomBytes(32).toString("hex"),
        status: "inactive",
      });
    }

    account.plan = plan;
    account.billingCycle = billingCycle;
    account.rateLimitTier = SUBSCRIPTION_PLANS[plan].rateLimitTier;
    account.subscriptionStatus = "pending";
    account.lastPaymentReference = transactionReference;
    account.lastPaymentAmount = amount;
    await account.save();

    const paymentRequest = buildPaymentRequest({
      amount,
      billingCycle,
      customerEmail: contactEmail,
      customerId: String(account._id),
      customerName: bankName,
      plan,
      transactionReference,
    });

    return c.json({
      message: "Interswitch checkout initialized",
      subscription: {
        bankName,
        contactEmail,
        plan,
        billingCycle,
        amount,
      },
      apiKey: account.apiKey,
      checkout: {
        method: "POST",
        checkoutUrl: getInterswitchConfig().checkoutUrl,
        inlineScriptUrl:
          getInterswitchConfig().mode === "LIVE"
            ? "https://newwebpay.interswitchng.com/inline-checkout.js"
            : "https://newwebpay.qa.interswitchng.com/inline-checkout.js",
        paymentRequest,
      },
    });
  } catch (error) {
    console.error("[billing/initiateCheckout] Error:", error);
    return c.json({ error: "Failed to initialize checkout" }, 500);
  }
};

export const verifyCheckout = async (c: any) => {
  try {
    const transactionReference = c.req.query("transactionReference");

    if (!transactionReference) {
      return c.json({ error: "transactionReference is required" }, 400);
    }

    const account = await ApiKey.findOne({
      lastPaymentReference: transactionReference,
    });

    if (!account || !account.lastPaymentAmount || !account.plan || !account.billingCycle) {
      return c.json({ error: "Subscription payment record not found" }, 404);
    }

    const verification = await verifyTransaction({
      amount: account.lastPaymentAmount,
      transactionReference,
    });

    const successful = ACTIVE_RESPONSE_CODES.has(String(verification.ResponseCode ?? ""));

    if (!successful) {
      account.subscriptionStatus = "pending";
      await account.save();

      return c.json({
        message: "Payment not yet approved",
        status: "pending",
        verification,
      });
    }

    const { startDate, endDate } = addBillingDuration(account.billingCycle);
    account.status = "active";
    account.subscriptionStatus = "active";
    account.subscriptionStartDate = startDate;
    account.subscriptionEndDate = endDate;
    account.lastVerifiedAt = new Date();
    await account.save();

    return c.json({
      message: "Subscription activated",
      status: "active",
      apiKey: account.apiKey,
      subscription: {
        plan: account.plan,
        billingCycle: account.billingCycle,
        startDate,
        endDate,
      },
      verification,
    });
  } catch (error) {
    console.error("[billing/verifyCheckout] Error:", error);
    return c.json({ error: "Failed to verify checkout" }, 500);
  }
};
