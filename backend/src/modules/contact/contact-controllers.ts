import { Context } from "hono";
import { query } from "../../utils/db";

export const createContactMessage = async (c: Context) => {
    try {
        const body = await c.req.json();
        const { name, email, subject, message } = body;
        
        if (!name || !email || !subject || !message) {
            return c.json({ error: "All fields are required" }, 400);
        }
        
        await query(
            "INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4)",
            [name, email, subject, message]
        );
        
        return c.json({ message: "Message received successfully" }, 201);
    } catch (err: any) {
        return c.json({ error: err.message }, 500);
    }
}
