import { defineConfig } from "drizzle-kit";
import dotenvFlow from "dotenv-flow";

// Load environment variables
dotenvFlow.config();
const DB_URL = process.env.DB_URL;

if (!DB_URL) {
  throw new Error("DB_URL is not defined in the environment variables.");
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
    url: DB_URL,
  },
});
