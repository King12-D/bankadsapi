import { Hono } from "hono";
import { connectDB } from "./utils/db";
import mongoose from "mongoose";
import adsRoutes from "./modules/ads/ads-routes";
import swaggerRoutes from "./docs/swagger-routes";
import billingRoutes from "./modules/billing/billing-routes";

const buildServer = async () => {
  const app = new Hono();
  try {
    await connectDB();

    //Health check endpoint
    app.get("/api/v1/health", (c) => {
      const dbstate = mongoose.connection.readyState;
      const dbStatus = dbstate === 1 ? "connected" : "disconnected";

      return c.json({
        status: "ok",
        message: "API is healthy",
        database: dbStatus,
        timestamp: new Date().toISOString(),
      });
    });

    //Ads routes
    app.route("/api/v1/ads", adsRoutes);
    app.route("/api/v1/billing", billingRoutes);
    app.route("/api/v1", swaggerRoutes);
    app.get("/api/v1", (c) => c.redirect("/api/v1/docs"));
  } catch (error: any) {
    console.error("Error building app:", error);
  }
  return app;
};

export default buildServer;
