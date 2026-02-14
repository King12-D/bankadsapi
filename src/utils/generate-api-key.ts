import * as crypto from "crypto";
import { ApiKey } from "../modules/models/apikey-model";

export const generateApiKey = async (owner: string) => {
  const key = crypto.randomBytes(32).toString("hex");
  const apiKey = new ApiKey({ key, owner });
  await apiKey.save();
  return key;
};
