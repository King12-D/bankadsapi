import * as crypto from "crypto";
import { ApiKey } from "../modules/models/apikey-model";

export const generateApiKey = async (bankName: string, contactEmail?: string) => {
  const key = crypto.randomBytes(32).toString("hex");
  const apiKey = new ApiKey({
    apiKey: key,
    bankName,
    contactEmail,
    status: "inactive",
    subscriptionStatus: "pending",
  });
  await apiKey.save();
  return key;
};
