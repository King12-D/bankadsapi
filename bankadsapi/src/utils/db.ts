import mongoose from "mongoose";
import { getOrThrowEnv } from "../config/config";

const dropLegacyAdsParallelArrayIndex = async () => {
  try {
    const db = mongoose.connection.db;

    if (!db) return;

    const adsCollection = db.collection("ads");
    const indexes = await adsCollection.indexes();

    const legacyIndex = indexes.find((index) => {
      const keys = Object.keys(index.key ?? {});
      return keys.includes("segments") && keys.includes("channels");
    });

    if (!legacyIndex?.name) return;

    await adsCollection.dropIndex(legacyIndex.name);
    console.log(`Dropped legacy ads index: ${legacyIndex.name}`);
  } catch (error: any) {
    // Ignore missing-namespace errors when collection does not exist yet.
    if (error?.code === 26) return;
    throw error;
  }
};

export const connectDB = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(getOrThrowEnv.MONGODB_URI);
    await dropLegacyAdsParallelArrayIndex();
    console.log("Database connected successfully");
  } catch (error: any) {
    console.error("Error connecting to database:", error);
  }
};
