import { Guild, Collection, OAuth2Guild } from "discord.js";
import discordClient from "../config/discordConfig";
import dbClient from "../config/dbConfig";
import { Servers } from "../db/schema";
import { eq } from "drizzle-orm";

// Load all guilds from discordApi
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

// Load a specific guild by ID from discordApi
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

// Format guild to a subset of the schema defining 'guild'
export interface FormattedGuild {
  discordId: string;
  guildDescription: string;
  guildName: string;
  guildOwnerId: string;
  verificationLevel: number;
  guildNsfwLevel: number;
  approxMemberCount: number;
}

type queryServer = typeof Servers.$inferSelect;

// Format guild details
export const formatGuild = (guild: Guild): Partial<queryServer> => {
  return {
    discordId: guild.id,
    guildName: guild.name,
    guildDescription: guild.description,
    guildOwnerId: guild.ownerId,
    verificationLevel: guild.verificationLevel,
    guildNsfwLevel: guild.nsfwLevel,
    approxMemberCount: guild.memberCount,
  };
};

// Find the guild
export const findGuild = async (
  discordId: string
): Promise<queryServer | {}> => {
  try {
    let db = await dbClient;
    const storedGuild = await db.query.Servers.findFirst({
      where: eq(Servers.discordId, discordId),
    });
    if (!storedGuild) {
      console.log(`No Stored guild with ${discordId} was found`);
      return {};
    }

    return await storedGuild;
  } catch (error) {
    console.error("Error finding guild:", error);
    return { error: "Failed to find guild. Please try again later." };
  }
};

type insertServer = typeof Servers.$inferInsert;

// Create new guild
type InsertServer = typeof Servers.$inferInsert;
type CreateGuildResponse = InsertServer | { error: string };

export const createGuild = async (
  formattedGuild: InsertServer
): Promise<CreateGuildResponse> => {
  try {
    const db = await dbClient;

    // Insert the new guild into the database
    const res = await db.insert(Servers).values(formattedGuild).returning();

    // If no result, return an error
    if (!res || res.length === 0) {
      console.error("Insert operation did not return any results");
      return { error: "Failed to create guild. No result returned." };
    }

    return res[0]; // Assuming res is an array and we need to return the first inserted guild
  } catch (error) {
    console.error("Error creating guild:", error);
    return { error: "Failed to create guild. Please try again later." };
  }
};

// compare to see if guild and stored guild is the same
export const compareGuilds = (
  guild: FormattedGuild,
  storedGuild: StoredGuild
): boolean => {
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

// Function to compare two objects and return a list of keys with different values
const getChangedFields = (
  newData: FormattedGuild,
  oldData: FormattedGuild
): Partial<FormattedGuild> => {
  const changedFields: Partial<FormattedGuild> = {};

  for (let key in newData) {
    if (newData.hasOwnProperty(key) && newData[key] !== oldData[key]) {
      changedFields[key] = newData[key];
    }
  }

  return changedFields;
};

// Function to update guild in the database
export const updateGuild = async (
  guild: FormattedGuild,
  storedGuild: FormattedGuild
): Promise<void> => {
  try {
    let db = await dbClient;
    // Get the fields that have changed
    const changedFields = getChangedFields(guild, storedGuild);

    // If there are no changes, exit early
    if (Object.keys(changedFields).length === 0) {
      console.log(`No changes detected for guild: ${storedGuild.guildName}`);
      return;
    }

    // Perform the update in the database
    await db
      .update(Servers)
      .set(changedFields)
      .where(eq(Servers.discordId, storedGuild.discordId));

    console.log(`Updated guild: ${storedGuild.guildName}`);
  } catch (error) {
    console.error(`Error updating guild ${storedGuild.discordId}:`, error);
  }
};

// Update the memberCount table
// decide the data structure for storing changes in member memberCount
// investigate if there are any more
export const handleMemberCountChange = () => {};
