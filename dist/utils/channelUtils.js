import dbClient from '../config/dbConfig.js';
import { Channels } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { loadCompleteGuilds, loadGuild } from './guildUtils.js';
import { createChannel, updateChannel } from '../bot/services/channelService.js';
export const loadGuildChannels = async (guild) => {
    const guildChannels = [];
    try {
        const channels = await guild.channels.fetch();
        channels.forEach((channel) => {
            guildChannels.push(channel);
        });
        await Promise.all(guildChannels);
        return guildChannels;
    }
    catch (error) {
        console.error(`Error fetching Discord channels for guild ${guild.id}:`, error);
        throw error;
    }
};
export const loadGuildChannel = async (guildId, channelId) => {
    const guild = await loadGuild(guildId);
    try {
        const channel = await guild.channels.fetch(channelId);
        return channel;
    }
    catch (error) {
        console.log(`Channel ${channelId} not found in guild ${guild.name}, ${guildId}`);
    }
};
// Function to format a single guild channel into our database type
export const formatGuildChannel = async (channel) => {
    try {
        const formattedChannel = {
            discordId: channel.id,
            guildId: channel.guild.id,
            channelName: channel.name,
            channelType: channel.type,
            messageCount: channel.messages?.cache.size ?? null,
            totalMessageCount: channel.totalMessageCount ?? null,
            userRateLimit: channel.rateLimitPerUser ?? null,
            userLimit: channel.userLimit ?? null,
            permissions: channel.permissions?.bitfield.toString() ?? null,
            nsfw: channel.nsfw ?? null,
            flags: channel.flags?.bitfield ?? null,
            discordCreatedAt: channel.createdAt ?? null,
        };
        return formattedChannel;
    }
    catch (error) {
        console.error('Error creating formatting channel:', error);
        throw error;
    }
};
// Function to format an array of guild channels into our database type
export const formatGuildChannels = async (channels) => {
    try {
        const formattedChannels = await Promise.all(channels.map((channel) => formatGuildChannel(channel)));
        return formattedChannels;
    }
    catch (error) {
        console.error('Error formatting guild channels:', error);
        throw error;
    }
};
export const findChannel = async (discordId) => {
    try {
        let db = await dbClient;
        const storedChannel = await db.query.Channels.findFirst({
            where: eq(Channels.discordId, discordId),
        });
        if (!storedChannel) {
            console.log(`No Stored channel with ${discordId} was found`);
            // should i return an empty object if not found? how to handle
            return null;
        }
        return await storedChannel;
    }
    catch (error) {
        console.error('Error finding channel:', error);
        throw { error: 'Failed finding channel. Please try again later.' };
    }
};
export const compareChannels = async (newChannel, oldChannel) => {
    const channel = await formatGuildChannel(newChannel);
    const keys = Object.keys(channel);
    for (const key of keys) {
        if (channel[key] !== oldChannel[key]) {
            return false;
        }
    }
    return true;
};
export const getChangedFields = (newData, oldData) => {
    const changedFields = Object.entries(newData).reduce((changedFields, [key, value]) => {
        if (value !== oldData[key]) {
            return { ...changedFields, [key]: value };
        }
        return changedFields;
    }, {});
    return changedFields;
};
// Function to compare two objects and return a list of keys with different values
//! make sure to be able to differentiate between an error and null and fix
// Function to sync guild channels
// export const syncGuildChannels = async (guild: Guild) => {
//   const newChannels: Promise<void>[] = []
//   const modifiedChannels: Promise<void>[] = []
//   const unchangedChannels: FormattedChannel[] = []
//   const channels = await loadGuildChannels(guild)
//   const formattedChannels = await formatGuildChannels(channels)
//   for (const newChannel of formattedChannels) {
//     const found = await findChannel(newChannel.discordId)
//     if (found === null) {
//       const newChannelPromise = createChannel(newChannel)
//       newChannels.push(newChannelPromise)
//     } else if (!compareChannels(newChannel, found)) {
//       const modifiedChannel = updateChannel(newChannel)
//       modifiedChannels.push(modifiedChannel)
//     } else {
//       unchangedChannels.push(newChannel)
//       console.log(`Unchanged channel: ${newChannel.discordId}`)
//     }
//   }
//   // await Promise.all(newChannels)
//   // await Promise.all(modifiedChannels)
//   return { newChannels, modifiedChannels, unchangedChannels }
// }
export const syncAllChannels = async () => {
    console.log(`Started syncing channels`);
    const allChannels = await loadCompleteGuilds();
    const newChannels = [];
    const modifiedChannels = [];
    const unchangedChannels = [];
    for (const guild of allChannels) {
        const channels = await loadGuildChannels(guild);
        // const formattedChannels = await formatGuildChannels(channels)
        // console.log(`formatted ${channels.length} channels`)
        for (const newChannel of channels) {
            const found = await findChannel(newChannel.id);
            if (found === null) {
                const newChannelPromise = createChannel(newChannel);
                newChannels.push(newChannelPromise);
            }
            else if (!compareChannels(newChannel, found)) {
                const modifiedChannel = updateChannel(newChannel);
                modifiedChannels.push(modifiedChannel);
            }
            else {
                unchangedChannels.push(newChannel);
                // console.log(`Unchanged channel: ${newChannel.discordId}`)
            }
        }
    }
    await Promise.all([...newChannels, ...modifiedChannels]);
    console.log(`new channels: ${newChannels.length}, modified channels: ${modifiedChannels.length}, unchanged channels: ${unchangedChannels.length}`);
    return { newChannels, modifiedChannels, unchangedChannels };
};
