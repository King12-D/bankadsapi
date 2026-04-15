import * as crypto from "crypto";
import { query } from "./db";

export const generateApiKey = async (bankName: string, contactEmail?: string) => {
  const key = crypto.randomBytes(32).toString("hex");
  
  await query(
    "INSERT INTO bank_api_keys (api_key, bank_name, contact_email, status, subscription_status) VALUES ($1, $2, $3, $4, $5)",
    [key, bankName, contactEmail, "inactive", "pending"]
  );
  
  return key;
};
