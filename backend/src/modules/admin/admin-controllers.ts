import { Context } from "hono";
import { query } from "../../utils/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_bankads";

const verifyAdmin = async (c: Context) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) throw new Error("Unauthorized");
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
    
    if (decoded.role !== "admin") {
        throw new Error("Forbidden: Admin access required");
    }
}

export const getPlatformSettings = async (c: Context) => {
    try {
        await verifyAdmin(c);
        const res = await query("SELECT key, value FROM platform_settings");
        const settings = res.rows.reduce((acc: any, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
        return c.json(settings);
    } catch (err: any) {
        return c.json({ error: err.message }, err.message.includes("Unauthorized") ? 401 : 403);
    }
}

export const updatePlatformSettings = async (c: Context) => {
    try {
        await verifyAdmin(c);
        const body = await c.req.json();
        
        for (const [key, value] of Object.entries(body)) {
            await query(
                "INSERT INTO platform_settings (key, value, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()",
                [key, String(value)]
            );
        }
        
        return c.json({ message: "Settings updated successfully" });
    } catch (err: any) {
        return c.json({ error: err.message }, 500);
    }
}

export const getContactMessages = async (c: Context) => {
    try {
        await verifyAdmin(c);
        const res = await query("SELECT * FROM contact_messages ORDER BY created_at DESC");
        return c.json(res.rows);
    } catch (err: any) {
        return c.json({ error: err.message }, err.message.includes("Unauthorized") ? 401 : 403);
    }
}
