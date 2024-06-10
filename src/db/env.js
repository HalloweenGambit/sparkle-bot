import dotenv from "dotenv";
import path from "path";

// Load environment variables
const envFile =
  process.env.NODE_ENV === "production" ? ".env" : ".env.development";
const absolutePath = path.resolve(process.cwd(), "../../", envFile);
dotenv.config({ path: envFile });
export const DB_URL = process.env.DB_URL;

console.log(DB_URL);
