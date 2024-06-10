import { defineConfig } from "drizzle-kit";
import dotenvFlow from "dotenv-flow";

// Load environment variables
dotenvFlow.config();

export const DEV_URL = process.env.DEV_URL;

if (!DEV_URL) {
  throw new Error("DEV_URL is not defined in the environment variables.");
}

// Create configuration
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./src/db/drizzle",
  migrations: {
    table: "migrations_custom", // default `__drizzle_migrations`
    schema: "public", // used in PostgreSQL only and defaults to `drizzle`
  },
  dbCredentials: {
    url: DEV_URL,
  },
});
