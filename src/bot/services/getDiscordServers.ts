import { Guild } from "discord.js";
import discordClient from "../../config/discordConfig";

export const getDiscordServersFromAPI = async (id?: string) => {
  try {
    if (!id) {
      return discordClient.guilds.fetch();
    }
    const discordServer = await discordClient.guilds.fetch(id);
    return discordServer;
  } catch (error) {
    console.error("Error fetching Discord servers:", error);
    throw error;
  }
};
