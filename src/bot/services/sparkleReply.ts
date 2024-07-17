// check if its the additon or removal of a sparkle reaction
// check the discord configuration
// check the user permissions
// check if the message is already saved

import {
  formatMessageEmbedding,
  loadMessage,
  saveMessageEmbedding,
} from '../../utils/messagesUtils'
import { deleteMessage, saveMessage } from './messageService'

export const addSparkle = async (reaction, user) => {
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

    const res = await saveMessage(guildId, channelId, messageId)
    console.log(`formatting embedding`)
    const formattedEmbedding = await formatMessageEmbedding(message)
    console.log(`finished formatting embedding`)
    console.log(`saving embedding`)
    saveMessageEmbedding(formattedEmbedding)
    console.log(`message ${messageId} and ambedding saved to the database!`)
  } catch (error) {
    console.error('Error handling addSparkle', error)
  }
}

export const removeSparkle = async (reaction, user) => {
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

    const res = await deleteMessage(reaction.message.id)

    if (!res) {
      console.log(`Message not found in database, cannot delete`)
      return
    }

    user.send({
      content: `Message ${reaction.message.id} removed from the database`,
    })
    console.log(
      `User ${user.globalName} removed ${reaction.message.id} from the database!`
    )
  } catch (error) {
    console.error('Error handling messageReactionRemove event:', error)
  }
}
