import { Message, Snowflake } from 'discord.js'
import { loadGuildChannel } from '../../utils/channelUtils'
import dbClient from '../../config/dbConfig'
import {
  compareMessages,
  findMessage,
  formatMessage,
  getChangedFields,
  loadMessage,
} from '../../utils/messagesUtils'
import { MessageEmbeddings, Messages } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { Tensor2D } from '@tensorflow/tfjs'

export const saveMessage = async (
  guildId: Snowflake,
  channelId: Snowflake,
  messageId: Snowflake
) => {
  try {
    let db = await dbClient
    const message = await loadMessage(guildId, channelId, messageId)
    if (!message) {
      console.log(`Message not found`)
      return
    }
    const formattedMessage = await formatMessage(message)
    const res = await db.insert(Messages).values(formattedMessage).returning()
    console.log(`Inserted message ${message.id}`)
    return res
  } catch (error) {
    console.error('Error saving message:', error)
    throw { error: 'Failed saving message. Please try again later.' }
  }
}

export const updateMessage = async (
  guildId: string,
  channelId: string,
  discordId: string
) => {
  try {
    let db = await dbClient
    const newMessage = await loadMessage(guildId, channelId, discordId)
    const oldMessage = await findMessage(discordId)
    if (!oldMessage || !newMessage) {
      console.log(`Cannot update. Missing old or new message`)
      return
    }

    if (compareMessages(newMessage, oldMessage)) {
      console.log(`Messages are the same, no need to update`)
      return
    }
    const changedFields = getChangedFields(newMessage, oldMessage)

    await db
      .update(Messages)
      .set(changedFields)
      .where(eq(Messages.discordId, oldMessage.discordId))
  } catch (error) {
    console.error('Error finding message:', error)
    throw { error: 'Failed finding message. Please try again later.' }
  }
}

export const deleteMessage = async (discordId: Snowflake) => {
  const db = await dbClient

  await db.delete(Messages).where(eq(Messages.discordId, discordId))
}

export type FormattedQuestion = {
  userId: Snowflake
  originalText: string
  lemmas: string[]
  tokens: string[]
}
export const formatQuestion = (message: Message) => {}

// TODO: Implement an update and delete function
export const saveMessageEmbedding = async (
  messageId: Snowflake,
  embedding: number[],
  tokens: string[],
  lemmas: string[]
) => {
  if (!embedding) {
    return
  }
  try {
    const db = await dbClient
    await db.insert(MessageEmbeddings).values({
      messageId: messageId,
      embedding: embedding,
      tokens: tokens,
      lemmas: lemmas,
    })
    console.log(`Saved embedding for message ${messageId}`)
  } catch (error) {
    console.log(`Error saving message embedding: ${error}`)
    throw { error: 'Failed saving embedding. Please try again later.' }
  }
}

export const updateMessageEmbedding = async (
  messageId: Snowflake,
  embedding: number[]
) => {
  if (!embedding) {
    return
  }
  try {
    const db = await dbClient
    const res = await db
      .update(MessageEmbeddings)
      .set({ embedding: embedding })
      .where(eq(MessageEmbeddings.messageId, messageId))
    console.log(`Updated embedding for message ${messageId}`)
    return res
  } catch (error) {
    console.error(`Error updating message embedding: ${error}`)
    throw { error: 'Failed updating embedding. Please try again later.' }
  }
}

export const deleteMessageEmbedding = async (messageId: Snowflake) => {
  try {
    const db = await dbClient
    await db
      .delete(MessageEmbeddings)
      .where(eq(MessageEmbeddings.messageId, messageId))
    console.log(`Deleted embedding for message ${messageId}`)
  } catch (error) {
    console.error(`Error deleting message embedding: ${error}`)
    throw { error: 'Failed deleting embedding. Please try again later.' }
  }
}
