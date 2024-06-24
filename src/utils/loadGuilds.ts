import { Collection } from "discord.js";
import discordClient from "../config/discordConfig";
import DotenvFlow from "dotenv-flow";
// return formatted Server[]

export const loadGuilds = async () => {
  try {
    return discordClient.guilds.fetch();
  } catch (error) {
    console.error("Error fetching Discord servers:", error);
    throw error;
  }
};

export const loadGuild = async (id: string) => {
  try {
    const guildDetails = discordClient.guilds.fetch(id);
    return guildDetails;
  } catch (error) {
    console.error("Error fetching Discord servers:", error);
    throw error;
  }
};

export const loadCompleteGuilds = async () => {
  try {
    const guilds = await loadGuilds();
    // Collections are mapped with value, key parameters
    const detailedGuildsPromises = guilds.map(async (guild, key) => {
      return loadGuild(key);
    });
    const detailedGuilds = await Promise.all(detailedGuildsPromises);
    return detailedGuilds;
  } catch (error) {
    console.error("Error loading complete guilds:", error);
    return []; // Handle error gracefully, return empty array or rethrow
  }
};
