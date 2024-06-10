import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
// Load environment variables
const envFile =
  process.env.NODE_ENV === "production" ? ".env" : ".env.development";
console.log(envFile);

dotenv.config({ path: envFile });
export const DB_URL = process.env.DB_URL;

// Create configuration
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./src/db/drizzle",
  migrations: {
    table: "migrations_custom", // default `__drizzle_migrations`,
    schema: "public", // used in PostgreSQL only and default to `drizzle`
  },
  dbCredentials: { url: `${process.env.DEV_URL}` },
});
