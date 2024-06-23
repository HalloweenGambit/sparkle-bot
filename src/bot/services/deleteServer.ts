import { Guild } from "discord.js";
import dbClient from "../../config/dbConfig";
import { Servers } from "../../db/schema";
import { eq } from "drizzle-orm";

export const deleteServer = async ({ id }: Partial<Guild>) => {
  // find server based on id
  try {
    const found = await dbClient.query.Servers.findFirst({
      where: eq(Servers.discordId, id as string),
    });

    if (!found) {
      console.warn(`Server with discordId ${id} not found in the database.`);
      return null;
    }

    console.log(`Server with ID: ${id} found in the database.`);
  } catch (error) {
    console.log(`Failed to delete server with id: ${id}`);
  }
};
