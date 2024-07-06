import dbClient from '../config/dbConfig'
import { FormattedMessage, queryMessage } from '../types'
import { loadGuildChannel } from './channel'
import { Messages } from '../db/schema'
import { eq } from 'drizzle-orm'
import { Message } from 'discord.js'

export const loadAllChannelMessages = async (
  guildId: string,
  channelId: string
) => {
  try {
    const channel = await loadGuildChannel(guildId, channelId)
    if (!channel) {
      console.log(`channel not found`)
      return
    }
    if (!channel.isTextBased()) {
      console.log(`channel ${channelId} of guild ${guildId} is not textBased`)
      return
    }

    const channelMessages = await channel.messages.fetch()
    return channelMessages
  } catch (error) {}
}
export const loadMessage = async (
  guildId: string,
  channelId: string,
  messageId: string
) => {
  try {
    const channel = await loadGuildChannel(guildId, channelId)
    if (!channel) {
      console.log(`channel not found`)
      return
    }
    if (!channel.isTextBased()) {
      console.log(`channel ${channelId} of guild ${guildId} is not textBased`)
      return
    }

    const message = await channel.messages.fetch(messageId)

    return message
  } catch (error) {}
}

export const formatMessage = (message): FormattedMessage => {
  return {
    discordId: message.id,
    channelId: message.channelId,
    guildId: message.guildId,
    authorId: message.authorId,
    content: message.content,
    isPinned: message.isPinned,
    pinnedAt: message.pinnedAt ?? null,
  }
}

export const saveMessage = async (message) => {
  try {
    let db = await dbClient
    const formattedMessage = formatMessage(message)
    await db.insert(Messages).values(formattedMessage)
    console.log(`Inserted message ${message.discordId}`)
  } catch (error) {
    console.error('Error saving message:', error)
    throw { error: 'Failed saving message. Please try again later.' }
  }
}

export const findMessage = async (
  discordId: string
): Promise<queryMessage | null> => {
  try {
    let db = await dbClient
    const storedMessage = await db.query.Messages.findFirst({
      where: eq(Messages.discordId, discordId),
    })
    if (!storedMessage) {
      console.log(`No Stored message with ${discordId} was found`)
      // should i return an empty object if not found? how to handle
      return null
    }
    return await storedMessage
  } catch (error) {
    console.error('Error finding message:', error)
    throw { error: 'Failed finding message. Please try again later.' }
  }
}

export const updateMessage = async (
  discordId: string
): Promise<queryMessage | null> => {
  try {
    let db = await dbClient

    if (!storedMessage) {
      console.log(`No Stored message with ${discordId} was found`)
      // should i return an empty object if not found? how to handle
      return null
    }
    return await storedMessage
  } catch (error) {
    console.error('Error finding message:', error)
    throw { error: 'Failed finding message. Please try again later.' }
  }
}

export const formatAttachments = () => {}
export const formatEmbeds = () => {}
export const loadStarredMessages = (channelId: string) => {}
export const loadPinnedMessages = (channelId: string) => {}
export const saveGuildMessage = (messageId: string) => {
  // fbreak out the message, embed, attachments
}

export const loadPinneGuildMessages = async (guildId: string) => {
  try {
    let db = await dbClient
    if (channel.isTextBased()) {
      const pinnedMessages = await channel.messages.fetchPinned()
    }
  } catch (error) {
    console.error(
      `Error fetching pinned messages for channel: ${channel.id}`,
      error
    )
    throw {
      error: 'Failed fetching pinned messages. Please try again later.',
    }
  }
}
