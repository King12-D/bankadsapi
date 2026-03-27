import * as z from "zod";

export const envConfig = z.object({
  PORT: z.string("PORT environment variable is required"),
  MONGODB_URI: z.string("MONGODB_URI environment variable is required"),
  JWT_SECRET: z.string("JWT_SECRET environment variable is required").min(90),
  INTERSWITCH_MERCHANT_CODE: z.string().optional(),
  INTERSWITCH_PAY_ITEM_ID: z.string().optional(),
  INTERSWITCH_SITE_REDIRECT_URL: z.string().url().optional(),
  INTERSWITCH_MODE: z.enum(["TEST", "LIVE"]).default("TEST"),
  INTERSWITCH_TRANSACTION_BASE_URL: z.string().url().optional(),
});

export default envConfig;

export type Config = z.infer<typeof envConfig>;
