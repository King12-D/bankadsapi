import { Hono } from "hono";
import { getWalletBalance, fundWallet, verifyFunding, withdrawFunds } from "./wallet-controllers";

const walletRoutes = new Hono();

walletRoutes.get("/balance", getWalletBalance);
walletRoutes.post("/fund", fundWallet);
walletRoutes.post("/verify", verifyFunding);
walletRoutes.post("/withdraw", withdrawFunds);

export default walletRoutes;
