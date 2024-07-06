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
import { Messages } from '../../db/schema'
import { eq } from 'drizzle-orm'

export const saveMessage = async (message: Message<true>) => {
  try {
    let db = await dbClient
    const formattedMessage = await formatMessage(message)
    await db.insert(Messages).values(formattedMessage)
    console.log(`Inserted message ${message.id}`)
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
