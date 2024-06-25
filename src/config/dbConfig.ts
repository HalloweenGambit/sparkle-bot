// dbConfig.ts

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema";
import DotenvFlow from "dotenv-flow";

DotenvFlow.config();

const connectionString = process.env.DB_URL || "";

const initializeDbClient = async () => {
  try {
    // Disable prefetch as it is not supported for "Transaction" pool mode
    const db = await postgres(connectionString, { prepare: false });
    const dbClient = await drizzle(db, { schema });

    // No need to explicitly connect, as the connection is established automatically
    console.log("Database connected successfully.");
    return dbClient;
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Exit the process if database connection fails
  }
};

// Export the promise that resolves to dbClient
const dbClient = initializeDbClient();

export default dbClient;
