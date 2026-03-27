import { Hono } from "hono";
import {
  getPlans,
  initiateCheckout,
  verifyCheckout,
} from "./billing-controllers";

const billingRoutes = new Hono();

billingRoutes.get("/plans", getPlans);
billingRoutes.post("/checkout/initiate", initiateCheckout);
billingRoutes.get("/checkout/verify", verifyCheckout);

export default billingRoutes;
