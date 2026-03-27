import * as jwt from "jsonwebtoken";
import { getOrThrowEnv } from "../../config/config";

export const authenticate = async (c: any, next: any) => {
  try {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Verify token
    const decoded = jwt.verify(token, getOrThrowEnv.JWT_SECRET);

    // Attach to context
    c.set("auth", decoded);

    await next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return c.json({ error: "Token expired" }, 401);
    }

    if (error.name === "JsonWebTokenError") {
      return c.json({ error: "Invalid token" }, 401);
    }

    console.error("Authentication error:", error);
    return c.json({ error: "Authentication failed" }, 401);
  }
};
