import { Hono } from "hono";
import {
  createAd,
  serveAds,
  trackImpression,
  getCampaigns,
  getAnalytics,
} from "./ads-controllers";
import { apiKeyAuth } from "../../common/middleware/apikey-auth";
import { rateLimiter } from "../../common/middleware/rate-limiter";

const adsRoutes = new Hono();

// POST /ads/serve — rate limited, public
adsRoutes.post("/serve", rateLimiter, serveAds);

// POST /ads/create — API key protected
adsRoutes.post("/create", apiKeyAuth, createAd);

// POST /ads/impression — API key protected + rate limited
adsRoutes.post("/impression", apiKeyAuth, rateLimiter, trackImpression);

// GET /ads/campaigns
adsRoutes.get("/campaigns", getCampaigns);

// GET /ads/analytics
adsRoutes.get("/analytics", getAnalytics);

export default adsRoutes;
