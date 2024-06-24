import dbClient from "../../config/dbConfig";
import { Servers } from "../../db/schema";
import { Guild } from "discord.js";
import { eq } from "drizzle-orm";
import { formatGuild } from "../../utils/formatServer";

// Define Server type based on schema
type Server = typeof Servers.$inferInsert;

export const updateServerDetails = async (
  id: Guild["id"],
  updatedGuild: Partial<Guild>
): Promise<Server[] | null> => {
  try {
    console.log(`Processing server with ID: ${updatedGuild.id}`);

    const found = await dbClient.query.Servers.findFirst({
      where: eq(Servers.discordId, updatedGuild.id as string),
    });

    if (!found) {
      console.warn(
        `Server with discordId ${updatedGuild.id} not found in the database.`
      );
      return null;
    }

    console.log(`Server with ID: ${updatedGuild.id} found in the database.`);

    // Filter out undefined values
    const definedUpdateObject: Partial<Server> = {};

    for (const key in updateObject) {
      if (updateObject[key] !== undefined) {
        definedUpdateObject[key] = updateObject[key];
      }
    }

    // TODO: create a function that stores changes in discord size
    // TODO: create a function that stores changes in discord messages

    console.log("Defined Update Object:", definedUpdateObject);

    // Update the server in the database
    const updateResponse = await dbClient
      .update(Servers)
      .set(definedUpdateObject)
      .where(eq(Servers.discordId, updatedGuild.id as string))
      .returning();

    console.log(
      `Server with ID: ${updatedGuild.id} updated successfully.`,
      updateResponse
    );
    return updateResponse;
  } catch (error) {
    console.error("Error updating Discord server:", error);
    throw error;
  }
};
