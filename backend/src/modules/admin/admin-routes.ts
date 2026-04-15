import { Hono } from "hono";
import { getPlatformSettings, updatePlatformSettings, getContactMessages } from "./admin-controllers";

const adminRoutes = new Hono();

adminRoutes.get("/settings", getPlatformSettings);
adminRoutes.post("/settings", updatePlatformSettings);
adminRoutes.get("/messages", getContactMessages);

export default adminRoutes;
