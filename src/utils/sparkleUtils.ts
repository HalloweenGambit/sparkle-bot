import { User } from 'discord.js'
import {
  deleteMessageEmbedding,
  formatMessageEmbedding,
  loadMessage,
  saveMessageEmbedding,
} from './messagesUtils'
import { deleteMessage, saveMessage } from '../bot/services/messageService'

// !correct types
export const replyToAddSparkle = async (reaction, user) => {
  try {
    user.send(`You added message ${reaction.message.id} to the database!`)
    reaction.message.reply(
      `You added message ${reaction.message.id} to the database!`
    )
  } catch (error) {}
}

export const replyTotDeleteSparkle = async (reaction, user) => {
  try {
    user.send(`You deleted message ${reaction.message.id} from the database!`)
    reaction.message.reply(
      `You deleted message ${reaction.message.id} from the database!`
    )
    console.log(user)
    console.log(reaction)
  } catch (error) {}
}

export const saveSparkleMessage = async (reaction, user) => {
  try {
    if (user.bot) return
    if (reaction.emoji.name !== '✨') return

    if (!reaction.message.guild) {
      console.log('Reaction is not in a guild')
      return
    }

    // TODO: check for user permissions before proceeding
    // TODO: check if channel is configured to allow saving messages

    console.log(
      `User ${user.globalName} reacted to message ${reaction.message.id}with a sparkle!`
    )

    const guildId = reaction.message.guild.id
    const channelId = reaction.message.channel.id
    const messageId = reaction.message.id

    const message = await loadMessage(guildId, channelId, messageId)
    if (!message) {
      return
    }

    await saveMessage(guildId, channelId, messageId)
    console.log(`formatting embedding`)
    const formattedEmbedding = await formatMessageEmbedding(message)
    console.log(`finished formatting embedding`)
    saveMessageEmbedding(formattedEmbedding)
    console.log(
      `user ${user.globalName} added message ${messageId} and embedding to the database!`
    )
  } catch (error) {
    console.error('Error handling addSparkle', error)
  }
}

export const deleteSparkleMessage = async (reaction, user) => {
  try {
    if (user.bot) return
    if (reaction.emoji.name !== '✨') return

    if (!reaction.message.guild) {
      console.log('Reaction is not in a guild')
      return
    }

    // TODO: check for user permissions before proceeding
    // TODO: check if channel is configured to allow deleting messages
    // TODO: delete message embedding from the database

    const embeddingRes = await deleteMessageEmbedding(reaction.message.id)
    const msgRes = await deleteMessage(reaction.message.id)

    if (!msgRes || !embeddingRes) {
      console.log(`Embedding or Message not found in database, cannot delete`)
      return
    }

    user.send({
      content: `You removed message ${reaction.message.id} from the database`,
    })
    reaction.message.reply({
      content: `You removed message ${reaction.message.id} from the database`,
    })
    console.log(
      `User ${user.globalName} removed ${reaction.message.id} from the database!`
    )
  } catch (error) {
    console.error('Error handling messageReactionRemove event:', error)
  }
}
