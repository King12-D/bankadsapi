import * as z from "zod";

export const envConfig = z.object({
  PORT: z.string().default("3030"),
  DATABASE_URL: z.string("DATABASE_URL environment variable is required"),
  JWT_SECRET: z.string("JWT_SECRET environment variable is required").min(10),
  INTERSWITCH_MERCHANT_CODE: z.string().optional(),
  INTERSWITCH_PAY_ITEM_ID: z.string().optional(),
  INTERSWITCH_SITE_REDIRECT_URL: z.string().url().optional(),
  INTERSWITCH_MODE: z.enum(["TEST", "LIVE"]).default("TEST"),
  INTERSWITCH_TRANSACTION_BASE_URL: z.string().url().optional(),
  PAYSTACK_SECRET_KEY: z.string().optional(),
  PAYSTACK_PUBLIC_KEY: z.string().optional(),
  PLATFORM_FEE_ACCOUNT: z.string().optional(),
});

export default envConfig;

export type Config = z.infer<typeof envConfig>;
