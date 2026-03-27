import { ApiKey } from "../../modules/models/apikey-model";

export const apiKeyAuth = async (c: any, next: any) => {
  try {
    const apiKey = c.req.header("x-api-key");

    if (!apiKey) {
      return c.json({ error: "API key required" }, 401);
    }

    const bank = await ApiKey.findOne({ apiKey, status: "active" });

    if (!bank) {
      return c.json({ error: "Invalid API key" }, 403);
    }

    const subscriptionStatus = bank.subscriptionStatus ?? "pending";
    const subscriptionEndDate = bank.subscriptionEndDate
      ? new Date(bank.subscriptionEndDate)
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
    c.set("bank", bank);

    await next();
  } catch (err) {
    console.error("API key authentication error:", err);
    return c.json({ error: "Authentication failed" }, 500);
  }
};
