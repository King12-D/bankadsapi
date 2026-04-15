import { query } from "../../utils/db";

export const apiKeyAuth = async (c: any, next: any) => {
  try {
    const apiKey = c.req.header("x-api-key");

    if (!apiKey) {
      return c.json({ error: "API key required" }, 401);
    }

    const res = await query("SELECT * FROM bank_api_keys WHERE api_key = $1 AND status = 'active'", [apiKey]);
    const bank = res.rows[0];

    if (!bank) {
      return c.json({ error: "Invalid API key" }, 403);
    }

    const subscriptionStatus = bank.subscription_status ?? "pending";
    const subscriptionEndDate = bank.subscription_end_date
      ? new Date(bank.subscription_end_date)
      : null;

    if (
      subscriptionStatus !== "active" ||
      (subscriptionEndDate && subscriptionEndDate.getTime() < Date.now())
    ) {
      return c.json(
        {
          error: "Subscription inactive. Please complete or renew billing to continue.",
        },
        403,
      );
    }

    // Attach bank info to context for use in controllers
    // Map snake_case to camelCase for potential internal usage consistency
    c.set("bank", {
        ...bank,
        rateLimitTier: bank.rate_limit_tier,
        subscriptionStatus: bank.subscription_status,
        subscriptionEndDate: bank.subscription_end_date
    });

    await next();
  } catch (err) {
    console.error("API key authentication error:", err);
    return c.json({ error: "Authentication failed" }, 500);
  }
};
