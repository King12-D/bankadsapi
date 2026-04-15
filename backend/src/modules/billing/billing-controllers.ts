import * as crypto from "crypto";
import { query } from "../../utils/db";
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
  return { startDate: now, endDate: next };
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
    interswitch: { mode: getInterswitchConfig().mode },
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
      return c.json({ error: "Missing required fields" }, 400);
    }

    const amount = getPlanAmount(plan, billingCycle);
    const transactionReference = `isw_${plan}_${billingCycle}_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    // Find or Create Account
    let account;
    const existing = await query("SELECT * FROM bank_api_keys WHERE bank_name = $1 AND contact_email = $2", [bankName, contactEmail]);
    
    if (existing.rows.length === 0) {
      const apiKey = crypto.randomBytes(32).toString("hex");
      const insert = await query(
        "INSERT INTO bank_api_keys (bank_name, contact_email, api_key, status, subscription_status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [bankName, contactEmail, apiKey, "inactive", "pending"]
      );
      account = insert.rows[0];
    } else {
      account = existing.rows[0];
    }

    // Update with checkout info
    await query(
      `UPDATE bank_api_keys 
       SET plan = $1, billing_cycle = $2, rate_limit_tier = $3, 
       subscription_status = 'pending', last_payment_reference = $4, last_payment_amount = $5
       WHERE id = $6`,
      [plan, billingCycle, SUBSCRIPTION_PLANS[plan].rateLimitTier, transactionReference, amount, account.id]
    );

    const paymentRequest = buildPaymentRequest({
      amount,
      billingCycle,
      customerEmail: contactEmail,
      customerId: String(account.id),
      customerName: bankName,
      plan,
      transactionReference,
    });

    return c.json({
      message: "Interswitch checkout initialized",
      subscription: { bankName, contactEmail, plan, billingCycle, amount },
      apiKey: account.api_key,
      checkout: {
        method: "POST",
        checkoutUrl: getInterswitchConfig().checkoutUrl,
        inlineScriptUrl: getInterswitchConfig().mode === "LIVE"
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
    if (!transactionReference) return c.json({ error: "transactionReference required" }, 400);

    const res = await query("SELECT * FROM bank_api_keys WHERE last_payment_reference = $1", [transactionReference]);
    const account = res.rows[0];

    if (!account) return c.json({ error: "Subscription record not found" }, 404);

    const verification = await verifyTransaction({
      amount: Number(account.last_payment_amount),
      transactionReference,
    });

    const successful = ACTIVE_RESPONSE_CODES.has(String(verification.ResponseCode ?? ""));

    if (!successful) {
      return c.json({ message: "Payment not yet approved", status: "pending", verification });
    }

    const { startDate, endDate } = addBillingDuration(account.billing_cycle as BillingCycle);
    
    await query(
      `UPDATE bank_api_keys 
       SET status = 'active', subscription_status = 'active', 
       subscription_start_date = $1, subscription_end_date = $2, last_verified_at = NOW()
       WHERE id = $3`,
      [startDate, endDate, account.id]
    );

    return c.json({
      message: "Subscription activated",
      status: "active",
      apiKey: account.api_key,
      subscription: { plan: account.plan, billingCycle: account.billing_cycle, startDate, endDate },
      verification,
    });
  } catch (error) {
    console.error("[billing/verifyCheckout] Error:", error);
    return c.json({ error: "Failed to verify checkout" }, 500);
  }
};
