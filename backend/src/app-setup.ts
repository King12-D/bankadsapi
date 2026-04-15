import { Hono } from "hono";
import { connectDB } from "./utils/db";
import { pool } from "./utils/db";
import adsRoutes from "./modules/ads/ads-routes";
import swaggerRoutes from "./docs/swagger-routes";
import billingRoutes from "./modules/billing/billing-routes";
import authRoutes from "./modules/auth/auth-routes";
import apiKeyRoutes from "./modules/apikeys/apikey-routes";
import walletRoutes from "./modules/wallet/wallet-routes";
import adminRoutes from "./modules/admin/admin-routes";
import contactRoutes from "./modules/contact/contact-routes";
import { cors } from "hono/cors";

const buildServer = async () => {
  const app = new Hono();
  
  // Enable CORS
  app.use("/*", cors());

  try {
    await connectDB();

    //Health check endpoint
    app.get("/api/v1/health", (c) => {
      return c.json({
        status: "ok",
        message: "API is healthy",
        database: "connected", // PG connection is managed by pool
        timestamp: new Date().toISOString(),
      });
    });


    //Ads routes
    app.route("/api/v1/ads", adsRoutes);
    app.route("/api/v1/billing", billingRoutes);
    app.route("/api/v1/auth", authRoutes);
    app.route("/api/v1/apikeys", apiKeyRoutes);
    app.route("/api/v1/wallet", walletRoutes);
    app.route("/api/v1/admin", adminRoutes);
    app.route("/api/v1/contact", contactRoutes);
    app.route("/api/v1", swaggerRoutes);
    app.get("/api/v1", (c) => c.redirect("/api/v1/docs"));
  } catch (error: any) {
    console.error("Error building app:", error);
  }
  return app;
};

export default buildServer;
