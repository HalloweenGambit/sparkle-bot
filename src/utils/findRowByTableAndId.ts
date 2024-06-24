import dbClient from "../config/dbConfig";
import { eq } from "drizzle-orm";

// todo: discuss whether this is more work than it's worth in the long run
export async function findRowByTableAndId(table: any, id: string) {
  try {
    const found = await dbClient.query[table].findFirst({
      where: eq(table.discordId, id),
    });

    if (!found) {
      return null;
    }

    return found;
  } catch (error) {
    console.error("Error fetching row:", error);
  }
}
