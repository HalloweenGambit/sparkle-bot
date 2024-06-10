import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

const envFile =
  process.env.NODE_ENV === "production" ? ".env" : ".env.development";
dotenv.config({ path: envFile });

/** @type { import("drizzle-kit").Config } */
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./src/db/drizzle",
  dbCredentials: {
    url: `${process.env.URL}`,
  },
});
