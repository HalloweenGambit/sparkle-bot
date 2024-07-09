import dbClient from '../config/dbConfig'
import {
  FormattedMessage,
  FormattedMessageEmbedding,
  FormattedQuestion,
  queryMessage,
} from '../types'
import { loadGuildChannel } from './channelUtils'
import { MessageEmbeddings, Messages } from '../db/schema'
import { eq } from 'drizzle-orm'
import { Message, Snowflake } from 'discord.js'
import { preProcessQuestion } from '../bot/services/preProcessMessageContent'
import embedMessageContent from '../bot/services/embedMessageContent'

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
      return null
    }
    if (!channel.isTextBased()) {
      console.log(`channel ${channelId} of guild ${guildId} is not textBased`)
      return null
    }

    const message = await channel.messages.fetch(messageId)
    if (message) return message
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

//! change to preProcessMessage > general
export const formatMessage = async (
  message: Message
): Promise<FormattedMessage> => {
  const { lemmas, tokens } = await preProcessQuestion(message.content)
  return {
    discordId: message.id,
    channelId: message.channelId,
    guildId: (message.guildId as string) ?? null,
    authorId: message.author.id,
    content: message.content,
    lemmas: lemmas,
    tokens: tokens,
    isPinned: message.pinned,
    discordCreatedAt: message.createdAt ?? null,
  }
}

export const formatMessageEmbedding = async (message: Message) => {
  const discordId = message.id
  const { lemmas, tokens } = await preProcessQuestion(message.content)
  const embedding = await embedMessageContent(tokens)

  return { discordId, tokens, lemmas, embedding }
}

export const saveMessageEmbedding = async (
  formattedMessageEmbedding: FormattedMessageEmbedding
) => {
  const db = await dbClient
  await db.insert(MessageEmbeddings).values(formattedMessageEmbedding)
}

export const compareMessages = async (
  newMessage: Message<true>,
  oldMessage: queryMessage
): Promise<boolean> => {
  const channel = await formatMessage(newMessage)

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

// export const loadPinneGuildMessages = async (guildId: string) => {
//   try {
//     let db = await dbClient

//     if (channel.isTextBased()) {
//       const pinnedMessages = await channel.messages.fetchPinned()
//     }
//   } catch (error) {
//     console.error(
//       `Error fetching pinned messages for channel: ${channel.id}`,
//       error
//     )
//     throw {
//       error: 'Failed fetching pinned messages. Please try again later.',
//     }
//   }
// }

// ! Make this work with a Message object
export const formatQuestion = async (
  message: Message
): Promise<FormattedQuestion> => {
  const { lemmas, tokens } = await preProcessQuestion(message.content)
  return {
    userId: message.author.id,
    discordId: message.id,
    originalText: message.content,
    tokens,
    lemmas,
    discordCreatedAt: message.createdAt,
  }
}

export const formatQuestionEmbedding = async (
  questionId: Snowflake,
  tokens: string[]
) => {
  const embeddings = await embedMessageContent(tokens)
  return { questionId, embeddings }
}
