import { envConfig } from "./config-schema";
import * as dotenv from "dotenv";
import * as z from "zod";

dotenv.config();

//Check if the environment variables are valid and throw an error if not
const validateEnv = (): z.infer<typeof envConfig> => {
  try {
    return envConfig.parse(process.env);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      error.issues.forEach((err) => {
        console.error(`${err.message} through ${String(err.path[0])}`);
      });
    }
  }
  process.exit(1);
};

export const getOrThrowEnv = validateEnv();
