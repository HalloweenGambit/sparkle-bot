import { Guild, GuildBasedChannel } from 'discord.js'
import dbClient from '../config/dbConfig'
import { Channels, Servers } from '../db/schema'
import { eq } from 'drizzle-orm'
import { FormattedChannel, FormattedGuild, queryChannel } from '../types'
import { loadCompleteGuilds, loadGuilds } from './utils'

export const loadGuildChannels = async (
  guild: Guild
): Promise<GuildBasedChannel[]> => {
  const guildChannels: GuildBasedChannel[] = []
  try {
    const channels = await guild.channels.fetch()
    channels.forEach((channel) => {
      guildChannels.push(channel as GuildBasedChannel)
    })

    await Promise.all(guildChannels)
    return guildChannels
  } catch (error) {
    console.error(
      `Error fetching Discord channels for guild ${guild.id}:`,
      error
    )
    throw error
  }
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
      messageCount: (channel as any).messages?.cache.size ?? null,
      totalMessageCount: (channel as any).totalMessageCount ?? null,
      userRateLimit: (channel as any).rateLimitPerUser ?? null,
      userLimit: (channel as any).userLimit ?? null,
      permissions: (channel as any).permissions?.bitfield.toString() ?? null,
      nsfw: (channel as any).nsfw ?? null,
      flags: (channel as any).flags?.bitfield ?? null,
    }

    return formattedChannel
  } catch (error) {
    console.error('Error creating formatting channel:', error)
    throw error
  }
}

// Function to format an array of guild channels into our database type
export const formatGuildChannels = async (
  channels: GuildBasedChannel[]
): Promise<FormattedChannel[]> => {
  try {
    const formattedChannels = await Promise.all(
      channels.map((channel) => formatGuildChannel(channel))
    )
    return formattedChannels
  } catch (error) {
    console.error('Error formatting guild channels:', error)
    throw error
  }
}

export const findChannel = async (
  discordId: string
): Promise<queryChannel | null> => {
  try {
    let db = await dbClient
    const storedChannel = await db.query.Channels.findFirst({
      where: eq(Channels.discordId, discordId),
    })
    if (!storedChannel) {
      console.log(`No Stored channel with ${discordId} was found`)
      // should i return an empty object if not found? how to handle
      return null
    }
    return await storedChannel
  } catch (error) {
    console.error('Error finding channel:', error)
    throw { error: 'Failed finding channel. Please try again later.' }
  }
}

export const compareChannels = (
  newChannel: FormattedChannel,
  oldChannel: queryChannel
): boolean => {
  const keys = Object.keys(newChannel) as (keyof FormattedChannel)[]
  for (const key of keys) {
    if (newChannel[key] !== oldChannel[key]) {
      return false
    }
  }
  return true
}

export const getChangedFields = (
  newData: FormattedChannel,
  oldData: queryChannel
): Partial<FormattedChannel> => {
  let changedFields: Partial<FormattedChannel> = {}

  for (let key in newData) {
    if (
      newData[key as keyof FormattedChannel] !==
      oldData[key as keyof FormattedChannel]
    ) {
      changedFields[key as keyof FormattedChannel] =
        newData[key as keyof FormattedChannel]
    }
  }

  return changedFields
}

export const createChannel = async (channel: FormattedChannel) => {
  try {
    const db = await dbClient
    await db.insert(Channels).values([channel])
  } catch (error) {
    console.error(
      `Error inserting channel ${channel.discordId}:${channel.channelName}`,
      error
    )
    throw error
  }
}

export const updateChannel = async (
  newChannel: FormattedChannel
): Promise<void> => {
  try {
    let db = await dbClient
    const id = newChannel.discordId
    const found = await findChannel(id)
    if (!found) {
      return
    }
    // Get the fields that have changed
    const changedFields = getChangedFields(newChannel, found)

    // Perform the update in the database
    await db
      .update(Channels)
      .set(changedFields)
      .where(eq(Channels.discordId, found.discordId))

    console.log(
      `Updated channel: ${found.id}, changed fields: ${changedFields}`
    )
  } catch (error) {
    console.error(
      `Error updating channel ${newChannel.discordId}, ${newChannel.channelName}`,
      error
    )
  }
}
// Function to create multiple channels in the database
export const createChannels = async (
  channels: FormattedChannel[]
): Promise<any[]> => {
  try {
    const db = await dbClient

    // Map each channel to a promise that inserts it into the database
    const createChannelPromises = channels.map(async (channel) => {
      try {
        // Insert the channel into the database
        const res = await db.insert(Channels).values([channel])
        return res
      } catch (error) {
        console.error(`Error inserting channel ${channel.channelName}:`, error)
        throw error // Throw the error to stop processing further
      }
    })

    // Wait for all insert operations to complete
    const insertedChannels = await Promise.all(createChannelPromises)
    console.log(`Inserted ${insertedChannels.length} channels.`)

    return insertedChannels
  } catch (error) {
    console.error('Error creating channels:', error)
    throw error // Re-throw the error to be handled by the caller
  }
}

// Function to compare two objects and return a list of keys with different values

//! make sure to be able to differentiate between an error and null
// Function to sync guild channels
export const syncGuildChannels = async (guild: Guild) => {
  const newChannels: Promise<void>[] = []
  const modifiedChannels: Promise<void>[] = []
  const unchangedChannels: FormattedChannel[] = []

  const channels = await loadGuildChannels(guild)
  const formattedChannels = await formatGuildChannels(channels)

  for (const newChannel of formattedChannels) {
    const found = await findChannel(newChannel.discordId)
    if (found === null) {
      const newChannelPromise = createChannel(newChannel)
      newChannels.push(newChannelPromise)
    } else if (!compareChannels(newChannel, found)) {
      const modifiedChannel = updateChannel(newChannel)
      modifiedChannels.push(modifiedChannel)
    } else {
      unchangedChannels.push(newChannel)
      console.log(`Unchanged channel: ${newChannel.discordId}`)
    }
  }

  // await Promise.all(newChannels)
  // await Promise.all(modifiedChannels)
  return { newChannels, modifiedChannels, unchangedChannels }
}
export const syncAllChannels = async () => {
  console.log(`Started syncing channels`)
  const allChannels = await loadCompleteGuilds()

  const newChannels: Promise<void>[] = []
  const modifiedChannels: Promise<void>[] = []
  const unchangedChannels: FormattedChannel[] = []

  for (const guild of allChannels) {
    const channels = await loadGuildChannels(guild)
    const formattedChannels = await formatGuildChannels(channels)
    // console.log(`formatted ${channels.length} channels`)

    for (const newChannel of formattedChannels) {
      const found = await findChannel(newChannel.discordId)
      if (found === null) {
        const newChannelPromise = createChannel(newChannel)
        newChannels.push(newChannelPromise)
      } else if (!compareChannels(newChannel, found)) {
        const modifiedChannel = updateChannel(newChannel)
        modifiedChannels.push(modifiedChannel)
      } else {
        unchangedChannels.push(newChannel)
        // console.log(`Unchanged channel: ${newChannel.discordId}`)
      }
    }
  }

  await Promise.all([...newChannels, ...modifiedChannels])
  console.log(
    `new channels: ${newChannels.length}, modified channels: ${modifiedChannels.length}, unchanged channels: ${unchangedChannels.length}`
  )

  return { newChannels, modifiedChannels, unchangedChannels }
}
