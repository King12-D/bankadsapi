import { Context } from "hono";
import { query } from "../../utils/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_bankads";

export const generateApiKey = async (c: Context) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) return c.json({ error: "Unauthorized" }, 401);
    const decoded = jwt.verify(authHeader.split(" ")[1], JWT_SECRET) as any;

    const { bankName, contactEmail } = await c.req.json();
    
    // Generate a random 32-char key
    const rawKey = "pk_live_" + Array.from({length: 24}, () => Math.floor(Math.random()*36).toString(36)).join('');

    const bName = bankName || "My Bank";
    const cEmail = contactEmail || "admin@bank.com";

    const insertResult = await query(
      "INSERT INTO bank_api_keys (user_id, bank_name, api_key, contact_email, status, plan) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [decoded.id, bName, rawKey, cEmail, "active", "pro"]
    );

    const newKey = insertResult.rows[0];

    return c.json({ 
        message: "API Key Generated", 
        key: {
            ...newKey,
            _id: newKey.id // Compatibility
        } 
    }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const getApiKeys = async (c: Context) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) return c.json({ error: "Unauthorized" }, 401);
    const decoded = jwt.verify(authHeader.split(" ")[1], JWT_SECRET) as any;

    // Filter by user_id
    const keysResult = await query("SELECT * FROM bank_api_keys WHERE user_id = $1", [decoded.id]);
    
    // Map id to _id for frontend compatibility
    const keys = keysResult.rows.map(k => ({ ...k, _id: k.id }));
    
    return c.json(keys);
  } catch (error) {
    return c.json({ error: "Internal Error" }, 500);
  }
};
