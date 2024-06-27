import discordClient from "../config/discordConfig";
import { Guild, GuildBasedChannel, GuildChannel } from "discord.js";
import { CategoryChannel, NewsChannel, StageChannel } from "discord.js";
import { TextChannel, VoiceChannel, MediaChannel } from "discord.js";
import { ForumChannel } from "discord.js";
import dbClient from "../config/dbConfig";
import { Channels, Servers } from "../db/schema";

export const loadGuildChannels = async (
  guild: Guild
): Promise<GuildBasedChannel[]> => {
  const guildChannels: GuildBasedChannel[] = [];
  try {
    const channels = await guild.channels.fetch();

    channels.forEach((channel) => {
      // You may need to filter or map channels to ensure they match GuildBasedChannel
      guildChannels.push(channel as GuildBasedChannel);
    });

    return guildChannels;
  } catch (error) {
    console.error(
      `Error fetching Discord channels for guild ${guild.id}:`,
      error
    );
    throw error;
  }
};

interface FormattedChannel {
  guildId: string;
  discordId: string;
  channelName: string;
  channelType: number;
  memberCount: number | null;
  nsfw: boolean | null;
  messageCount: number | null;
  totalMessageCount: number | null;
  userLimit: number | null;
  userRateLimit: number | null;
  permissions: string | null;
  flags: number | null;
}

// Function to format a single guild channel into our database type
export const formatGuildChannel = async (
  channel: GuildBasedChannel
): Promise<FormattedChannel> => {
  try {
    const formattedChannel: FormattedChannel = {
      discordId: channel.id,
      guildId: channel.guild.id,
      channelName: channel.name,
      channelType: channel.type,
      memberCount: (channel as any).memberCount ?? null,
      nsfw: (channel as any).nsfw ?? null,
      messageCount: (channel as any).messages.cache.size ?? null,
      totalMessageCount: (channel as any).totalMessageCount ?? null,
      userRateLimit: (channel as any).rateLimitPerUser ?? null,
      userLimit: (channel as any).userLimit ?? null,
      permissions: (channel as any).permissions?.bitfield.toString() ?? null,
      flags: (channel as any).flags ?? null,
    };

    return formattedChannel;
  } catch (error) {
    console.error("Error creating guild channel:", error);
    throw error;
  }
};

// Function to format an array of guild channels into our database type
export const formatGuildChannels = async (
  channels: GuildBasedChannel[]
): Promise<FormattedChannel[]> => {
  try {
    const formattedChannels = await Promise.all(
      channels.map((channel) => formatGuildChannel(channel))
    );
    return formattedChannels;
  } catch (error) {
    console.error("Error creating guild channels:", error);
    throw error;
  }
};

// Function to create multiple channels in the database
export const createChannels = async (
  channels: FormattedChannel[]
): Promise<any[]> => {
  try {
    const db = await dbClient;

    // Map each channel to a promise that inserts it into the database
    const createChannelPromises = channels.map(async (channel) => {
      try {
        // Insert the channel into the database
        const res = await db.insert(Channels).values(channel);
        return res;
      } catch (error) {
        console.error(`Error inserting channel ${channel.channelName}:`, error);
        throw error; // Throw the error to stop processing further
      }
    });

    // Wait for all insert operations to complete
    const insertedChannels = await Promise.all(createChannelPromises);
    console.log(`Inserted ${insertedChannels.length} channels.`);

    return insertedChannels;
  } catch (error) {
    console.error("Error creating channels:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const updateChannels = async () => {};
