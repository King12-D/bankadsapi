import { getOrThrowEnv } from "../../config/config";
import type { BillingCycle, SubscriptionPlanCode } from "./subscription-plans";
import { SUBSCRIPTION_PLANS } from "./subscription-plans";

const DEFAULT_TEST_VERIFY_URL = "https://qa.interswitchng.com";
const DEFAULT_LIVE_VERIFY_URL = "https://webpay.interswitchng.com";
const DEFAULT_TEST_CHECKOUT_URL =
  "https://newwebpay.qa.interswitchng.com/collections/w/pay";
const DEFAULT_LIVE_CHECKOUT_URL =
  "https://newwebpay.interswitchng.com/collections/w/pay";

export const getInterswitchConfig = () => {
  const mode = getOrThrowEnv.INTERSWITCH_MODE;

  return {
    mode,
    merchantCode: getOrThrowEnv.INTERSWITCH_MERCHANT_CODE ?? "MX000000",
    payItemId: getOrThrowEnv.INTERSWITCH_PAY_ITEM_ID ?? "DefaultPayItem",
    siteRedirectUrl:
      getOrThrowEnv.INTERSWITCH_SITE_REDIRECT_URL ??
      "http://localhost:3000/payment-response",
    checkoutUrl:
      mode === "LIVE" ? DEFAULT_LIVE_CHECKOUT_URL : DEFAULT_TEST_CHECKOUT_URL,
    transactionBaseUrl:
      getOrThrowEnv.INTERSWITCH_TRANSACTION_BASE_URL ??
      (mode === "LIVE" ? DEFAULT_LIVE_VERIFY_URL : DEFAULT_TEST_VERIFY_URL),
  };
};

export const getPlanAmount = (
  plan: SubscriptionPlanCode,
  billingCycle: BillingCycle,
) => SUBSCRIPTION_PLANS[plan].pricing[billingCycle].amount;

export const buildPaymentRequest = ({
  amount,
  billingCycle,
  customerEmail,
  customerName,
  customerId,
  plan,
  transactionReference,
}: {
  amount: number;
  billingCycle: BillingCycle;
  customerEmail: string;
  customerId: string;
  customerName: string;
  plan: SubscriptionPlanCode;
  transactionReference: string;
}) => {
  const config = getInterswitchConfig();
  const planLabel = SUBSCRIPTION_PLANS[plan].label;

  return {
    merchant_code: config.merchantCode,
    pay_item_id: config.payItemId,
    pay_item_name: `${planLabel} ${billingCycle} subscription`,
    txn_ref: transactionReference,
    amount,
    currency: 566,
    cust_email: customerEmail,
    cust_name: customerName,
    cust_id: customerId,
    site_redirect_url: config.siteRedirectUrl,
    mode: config.mode,
  };
};

export const verifyTransaction = async ({
  amount,
  transactionReference,
}: {
  amount: number;
  transactionReference: string;
}) => {
  const config = getInterswitchConfig();
  const url = new URL("/collections/api/v1/gettransaction.json", config.transactionBaseUrl);
  url.searchParams.set("merchantcode", config.merchantCode);
  url.searchParams.set("transactionreference", transactionReference);
  url.searchParams.set("amount", String(amount));

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Interswitch verification failed with status ${response.status}`);
  }

  return (await response.json()) as {
    Amount?: number;
    MerchantReference?: string;
    PaymentReference?: string;
    ResponseCode?: string;
    ResponseDescription?: string;
    TransactionDate?: string;
  };
};
