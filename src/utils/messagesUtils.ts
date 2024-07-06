import dbClient from '../config/dbConfig'
import { FormattedMessage, queryMessage } from '../types'
import { loadGuildChannel } from './channelUtils'
import { Messages } from '../db/schema'
import { eq } from 'drizzle-orm'
import { Message, Snowflake } from 'discord.js'

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

export const findMessage = async (
  discordId: Snowflake
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

export const formatMessage = (message: Message<true>): FormattedMessage => {
  return {
    discordId: message.id,
    channelId: message.channelId,
    guildId: message.guildId,
    authorId: message.author.id,
    content: message.content,
    isPinned: message.pinned,
    discordCreatedAt: message.createdAt ?? null,
  }
}

export const compareMessages = (
  newMessage: Message<true>,
  oldMessage: queryMessage
): boolean => {
  const channel = formatMessage(newMessage)

  const keys = Object.keys(channel) as (keyof FormattedMessage)[]
  for (const key of keys) {
    if (channel[key] !== oldMessage[key]) {
      return false
    }
  }
  return true
}

export const getChangedFields = (
  newData: Message<true>,
  oldData: queryMessage
): Partial<FormattedMessage> => {
  const formattedMessage = formatMessage(newData)
  const changedFields = Object.entries(formattedMessage).reduce(
    (changedFields, [key, value]) => {
      if (value !== oldData[key as keyof FormattedMessage]) {
        return { ...changedFields, [key]: value }
      }
      return changedFields
    },
    {}
  )

  return changedFields
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
