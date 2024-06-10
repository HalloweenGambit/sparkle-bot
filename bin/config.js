import { drizzle } from "drizzle-orm/node-postgres";
import postgres from "postgres";

// Load environment variables
const envFile =
  process.env.NODE_ENV === "production" ? ".env" : ".env.development";
dotenv.config({ path: envFile });

const connectionString = process.env.DATABASE_URL;

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client);
