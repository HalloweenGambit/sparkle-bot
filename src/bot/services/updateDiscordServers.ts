import dbClient from "../../config/dbConfig";
import { Servers } from "../../db/schema";
import { Guild } from "discord.js";
import { eq } from "drizzle-orm";

// Define Server type based on schema
type Server = typeof Servers.$inferInsert;

export const updateDiscordServers = async (
  server: Partial<Guild>
): Promise<Server[] | null> => {
  try {
    console.log(`Processing server with ID: ${server.id}`);

    // Find the server in the database by discordId
    const found = await dbClient.query.Servers.findFirst({
      with: { discordId: server.id },
    });

    await console.log(found);

    if (!found) {
      console.warn(
        `Server with discordId ${server.id} not found in the database.`
      );
      return null;
    }

    console.log(`Server with ID: ${server.id} found in the database.`);

    //compare both objects found what is different
    const updateObject: Partial<Server> = {
      serverName: server.name,
      serverDescription: server.description,
      serverOwnerId: server.ownerId as string,
      verificationLevel: server.verificationLevel as number,
      serverNsfwLevel: server.nsfwLevel as number,
      approxMemberCount: server.approximateMemberCount ?? null,
    };

    // Update the server in the database
    const updatedServer = await dbClient
      .update(Servers)
      .set(updateObject)
      .where(eq(Servers.discordId, server.id as string))
      .returning();

    console.log(
      `Server with ID: ${server.id} updated successfully.`,
      updatedServer
    );

    return updatedServer;
  } catch (error) {
    console.error("Error updating Discord server:", error);
    throw error;
  }
};
