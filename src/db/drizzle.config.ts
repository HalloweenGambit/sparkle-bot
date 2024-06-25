import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import DotenvFlow from "dotenv-flow";

DotenvFlow.config();

const DB_URL = process.env.DB_URL;

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/supabase/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: DB_URL!,
  },
});
