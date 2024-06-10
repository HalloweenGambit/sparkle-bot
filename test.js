import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
import path from "path";

// Function to load environment variables
const loadEnv = () => {
  const envFile =
    process.env.NODE_ENV === "production" ? ".env" : ".env.development";
  const absolutePath = path.resolve(process.cwd(), envFile);

  console.log("Loading environment variables from:", absolutePath);
  dotenv.config({ path: absolutePath });

  console.log("Loaded environment variables:", process.env);
};

// Load environment variables
loadEnv();

// Create configuration
const createConfig = () => {
  const DB_URL = process.env.DB_URL;

  console.log("DB_URL:", DB_URL);

  if (!DB_URL) {
    throw new Error("DB_URL is not defined in the environment variables.");
  }

  return defineConfig({
    dialect: "postgresql",
    schema: "./src/db/schema.ts",
    out: "./src/db/drizzle",
    dbCredentials: {
      url: DB_URL,
    },
  });
};

export default createConfig();
