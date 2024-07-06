import { GuildBasedChannel } from 'discord.js'
import { FormattedChannel } from '../../types'
import {
  findChannel,
  formatGuildChannel,
  getChangedFields,
} from '../../utils/channelUtils'
import dbClient from '../../config/dbConfig'
import { Channels } from '../../db/schema'
import { eq } from 'drizzle-orm'

export const createChannel = async (channel: GuildBasedChannel) => {
  try {
    let newChannel: FormattedChannel

    // Format the channel
    newChannel = await formatGuildChannel(channel)

    // Insert the formatted channel into the database
    const db = await dbClient
    await db.insert(Channels).values([newChannel])
    console.log(
      `Inserted channel ${newChannel.discordId}:${newChannel.channelName}`
    )
  } catch (error) {
    console.error(
      `Error inserting channel ${channel.id}:${channel.name}`,
      error
    )
    throw error
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

export const updateChannel = async (channel: GuildBasedChannel) => {
  try {
    let updatedChannel: FormattedChannel
    updatedChannel = await formatGuildChannel(channel)

    let db = await dbClient
    const id = updatedChannel.discordId
    const found = await findChannel(id)
    if (!found) {
      return
    }
    // Get the fields that have changed
    const changedFields = getChangedFields(updatedChannel, found)

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
      `Error updating channel ${channel.id}, ${channel.name}`,
      error
    )
  }
}

export const deleteChannel = async (channelId: string) => {
  try {
    const db = await dbClient
    const found = findChannel(channelId)
    if (!found) {
      return
    }
    await db
      .update(Channels)
      .set({ isActive: false })
      .where(eq(Channels.discordId, channelId))
  } catch (error) {
    console.error('Error deleting channel:', error)
    throw error
  }
}
