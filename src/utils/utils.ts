import { Guild } from "discord.js";
import discordClient from "../config/discordConfig";
import dbClient from "../config/dbConfig";
import { eq } from "drizzle-orm";
import { Servers } from "../db/schema";

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

export const formatGuild = (guild: Guild) => {
  return {
    discordId: guild.id,
    guildDescription: guild.description,
    features: guild.features,
    guildName: guild.name,
    guildOwnerId: guild.ownerId,
    verificationLevel: guild.verificationLevel,
    guildNsfwLevel: guild.nsfwLevel,
    approxMemberCount: guild.memberCount,
  };
};

export const findGuild = async (id: string) => {
  try {
    await dbClient;
    console.log(id);
    const found = await dbClient.query.Servers.findFirst({
      where: eq(Servers.discordId, id),
    });

    if (!found) {
      return null;
    }

    return found;
  } catch (error) {
    console.error("Error fetching row:", error);
  }
};
