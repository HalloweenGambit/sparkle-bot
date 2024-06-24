import dbClient from "../../config/dbConfig";
import { Servers } from "../../db/schema";
import { Guild } from "discord.js";
import { formatGuild } from "../../utils/formatServer";

// Function to format Discord Guild object into Server type
type Server = typeof Servers.$inferInsert;

export const createServer = async (guild: Guild | Guild[]) => {
  try {
    const formattedServers: Server[] = Array.isArray(guild)
      ? guild.map(formatGuild)
      : [formatGuild(guild)];

    const response = await dbClient.insert(Servers).values(formattedServers);
    return response;
  } catch (error) {
    console.error("Error saving Discord servers:", error);
    throw error;
  }
};
