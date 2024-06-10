import dotenv from "dotenv";
import path from "path";
import { drizzle } from "drizzle-orm/node-postgres";
import postgres from "postgres";

// Load environment variables
const envFile =
  process.env.NODE_ENV === "production" ? ".env" : ".env.development";
const absolutePath = path.resolve(process.cwd(), envFile);

dotenv.config({ path: absolutePath });

const connectionString = process.env.DB_URL;

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client);
