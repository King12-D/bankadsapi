import { Pool } from 'pg';
import 'dotenv/config';

// Initialize a connection pool to Neon PostgreSQL
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Neon in some environments
  }
});

// Helper for executing queries
export const query = (text: string, params?: any[]) => pool.query(text, params);

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL Connected to Neon successfully');
    client.release();
  } catch (err: any) {
    console.error('Error connecting to Neon PostgreSQL:', err.message);
    process.exit(1);
  }
};
