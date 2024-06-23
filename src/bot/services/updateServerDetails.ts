import dbClient from "../../config/dbConfig";
import { Servers } from "../../db/schema";
import { Guild } from "discord.js";
import { eq } from "drizzle-orm";

// Define Server type based on schema
type Server = typeof Servers.$inferInsert;

export const updateServerDetails = async (
  updatedGuild: Partial<Guild>
): Promise<Server[] | null> => {
  try {
    console.log(`Processing server with ID: ${updatedGuild.id}`);
    // Find the server in the database by discordId
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

    // Prepare the update object with defined values only
    const updateObject: Partial<Server> = {
      serverName: updatedGuild.name,
      serverDescription: updatedGuild.description,
      serverOwnerId: updatedGuild.ownerId,
      verificationLevel: updatedGuild.verificationLevel,
      serverNsfwLevel: updatedGuild.nsfwLevel,
      approxMemberCount: updatedGuild.approximateMemberCount,
    };

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
