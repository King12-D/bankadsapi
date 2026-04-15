import { Context } from "hono";
import { query } from "../../utils/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_bankads";

export const register = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { name, email, password, plan } = body;

    const existingUser = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return c.json({ error: "Email already exists" }, 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const role = email === "ikewisdom92@gmail.com" ? "admin" : "user";
    const userPlan = plan || "basic";

    const insertResult = await query(
      "INSERT INTO users (name, email, password, role, plan) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, email, hashedPassword, role, userPlan]
    );

    const newUser = insertResult.rows[0];
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: "1d" });

    return c.json({
      message: "User created successfully",
      token,
      user: { 
        id: newUser.id, 
        _id: newUser.id, // Alias for frontend compatibility 
        name: newUser.name, 
        email: newUser.email, 
        role: newUser.role, 
        plan: newUser.plan 
      }
    }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const login = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();

    // Implicit admin seeder check
    if (email === "ikewisdom92@gmail.com" && password === "admin") {
      const existingAdmin = await query("SELECT id FROM users WHERE email = $1", [email]);
      if (existingAdmin.rows.length === 0) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin", salt);
        await query(
          "INSERT INTO users (name, email, password, role, plan) VALUES ($1, $2, $3, $4, $5)",
          ["Ike Wisdom (Admin)", "ikewisdom92@gmail.com", hashedPassword, "admin", "enterprise"]
        );
      } else {
          // Ensure password is 'admin' even if user existed with different password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash("admin", salt);
          await query("UPDATE users SET password = $1, role = 'admin' WHERE email = $2", [hashedPassword, email]);
      }
    }


    const userResult = await query("SELECT * FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) {
      return c.json({ error: "Invalid credentials" }, 400);
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return c.json({ error: "Invalid credentials" }, 400);
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

    return c.json({
      message: "Login successful",
      token,
      user: { 
        id: user.id, 
        _id: user.id, // Alias for frontend compatibility
        name: user.name, 
        email: user.email, 
        role: user.role, 
        plan: user.plan 
      }
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const getMe = async (c: Context) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) return c.json({ error: "No token provided" }, 401);
    
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
    
    const userResult = await query("SELECT id, name, email, role, plan, created_at FROM users WHERE id = $1", [decoded.id]);
    if (userResult.rows.length === 0) return c.json({ error: "User not found" }, 404);

    const user = userResult.rows[0];
    return c.json({
        ...user,
        _id: user.id // Compatibility
    });
  } catch (error: any) {
    return c.json({ error: "Invalid token" }, 401);
  }
};
