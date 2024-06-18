import { drizzle } from "drizzle-orm/node-postgres";
import postgres from "postgres";

const connectionString = process.env.DB_URL;

// Disable prefetch as it is not supported for "Transaction" pool mode
const db = postgres(connectionString, { prepare: false });

const dbClient = drizzle(db);

try {
  // No need to explicitly connect, as the connection is established automatically
  console.log("Database connected successfully.");
} catch (error) {
  console.error("Failed to connect to the database:", error);
  process.exit(1); // Exit the process if database connection fails
}

export default dbClient;
