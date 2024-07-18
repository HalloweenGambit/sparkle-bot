import { Snowflake } from 'discord.js'
import dbClient from '../../config/dbConfig.js'
import {
  compareMessages,
  findMessage,
  formatMessage,
  getChangedFields,
  loadMessage,
} from '../../utils/messagesUtils.js'
import { Messages } from '../../db/schema.js'
import { eq } from 'drizzle-orm'

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

    if (await compareMessages(newMessage, oldMessage)) {
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
  const res = await db
    .delete(Messages)
    .where(eq(Messages.discordId, discordId))
    .returning()
  return res
}
