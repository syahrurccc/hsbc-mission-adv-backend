import { Pool, type QueryResult } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export function query(
  text: string, 
  params?: any[]
): Promise<QueryResult> {
  return pool.query(text, params);
}