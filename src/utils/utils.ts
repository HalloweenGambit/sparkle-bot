import { Guild, Collection, OAuth2Guild } from "discord.js";
import discordClient from "../config/discordConfig";
import dbClient from "../config/dbConfig";
import { Servers } from "../db/schema";
import { eq } from "drizzle-orm";

// Load all guilds
export const loadGuilds = async (): Promise<
  Collection<string, OAuth2Guild>
> => {
  try {
    return discordClient.guilds.fetch();
  } catch (error) {
    console.error("Error fetching all Discord servers:", error);
    throw error;
  }
};

// Load a specific guild by ID
export const loadGuild = async (id: string): Promise<Guild> => {
  try {
    const guildDetails = await discordClient.guilds.fetch(id);
    return guildDetails;
  } catch (error) {
    console.error(`Error fetching Discord server with ID ${id}:`, error);
    throw error;
  }
};

// Load detailed information for all guilds
export const loadCompleteGuilds = async (): Promise<Guild[]> => {
  try {
    const guilds = await loadGuilds();
    const detailedGuildsPromises = await guilds.map((guild) =>
      loadGuild(guild.id)
    );
    const detailedGuilds = await Promise.all(detailedGuildsPromises);
    return detailedGuilds;
  } catch (error) {
    console.error("Error loading complete guilds:", error);
    return []; // Handle error gracefully, return empty array or rethrow
  }
};

export interface FormattedGuild {
  discordId: string;
  guildDescription: string;
  guildName: string;
  guildOwnerId: string;
  verificationLevel: number;
  guildNsfwLevel: number;
  approxMemberCount: number;
}

// Format guild details
// TODO: type: my schema server table
export const formatGuild = (guild: Guild) => {
  return {
    discordId: guild.id as string,
    guildDescription: guild.description ?? null,
    guildName: guild.name,
    guildOwnerId: guild.ownerId,
    verificationLevel: guild.verificationLevel,
    guildNsfwLevel: guild.nsfwLevel,
    approxMemberCount: guild.memberCount,
  };
};

// Find the guild
// TODO: type: my schema server table or empty object
export const findGuild = async (discordId: string) => {
  try {
    let db = await dbClient;
    const foundGuild = await db.query.Servers.findFirst({
      where: eq(Servers.discordId, discordId),
    });
    if (!foundGuild) {
      return {};
    }

    return await foundGuild;
  } catch (error) {
    console.error("Error finding guild:", error);
    return { error: "Failed to find guild. Please try again later." };
  }
};

// Create new guild
// TODO: make this the promise you get from drizzle
export const createGuild = async (formattedGuild) => {
  try {
    let db = await dbClient;
    const res = await db.insert(Servers).values(formattedGuild).returning();

    // Check if res is falsy (null, undefined, empty, etc.)
    if (!res) {
      return []; // Return an empty array if res is falsy
    }

    return res;
  } catch (error) {
    console.error("Error creating guild:", error);
    return { error: "Failed to create guild. Please try again later." };
  }
};

// compare to see if guild and stored guild is the same
// TODO: type: boolean
export const compareGuilds = (guild, storedGuild) => {
  const keys = Object.keys(storedGuild);
  // Iterate through each key
  for (let key of keys) {
    // Compare values of the same key
    if (guild[key] !== storedGuild[key]) {
      return false; // If any value differs, return false
    }
  }

  // Ensure both objects have the same number of keys
  return keys.length === Object.keys(guild).length;
};

export const updateGuild = () => {};

export const handleMemberCountChange = () => {};
