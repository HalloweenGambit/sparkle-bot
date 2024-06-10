import dotenv from "dotenv-flow";
import { drizzle } from "drizzle-orm/node-postgres";
import postgres from "postgres";

dotenv.config();

const connectionString = process.env.DB_URL;

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client);
