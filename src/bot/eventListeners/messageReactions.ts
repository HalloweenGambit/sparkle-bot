import { Client, GatewayIntentBits, Collection } from 'discord.js'
import { deleteMessage, saveMessage } from '../services/messageService'
import {
  formatMessageEmbedding,
  loadMessage,
  saveMessageEmbedding,
} from '../../utils/messagesUtils'
import { load } from 'dotenv-flow'

// TODOLATER: check for user permissions before proceeding
// TODOLATER: decide if we want to delete the message or just remove the reaction
// TODOLATER: add a cooldown to prevent spamming the database
// TODOLATER: add a check to ensure the message is not already saved
// TODO: create a function that saves the message embedding to the database
// TODO: check to see if the message is already saved in the database before proceeding

export default (client: Client) => {
  client.on('messageReactionAdd', async (reaction, user) => {
    try {
      // Ensure the reaction is in a guild
      if (!reaction.message.guild) {
        console.log('Reaction is not in a guild')
        return
      }

      console.log('Reaction added:', reaction.emoji.name)
      // TODO: add user to the database
      console.log('User who added the reaction:', user.globalName)

      // Your additional logic here
      if (reaction.emoji.name === '✨') {
        const guildId = reaction.message.guild.id
        const channelId = reaction.message.channel.id
        const messageId = reaction.message.id

        const message = await loadMessage(guildId, channelId, messageId)
        if (!message) {
          return
        }

        const res = await saveMessage(guildId, channelId, messageId)
        const formattedEmbedding = await formatMessageEmbedding(message)
        saveMessageEmbedding(formattedEmbedding)

        await console.log(res)
        console.log('User reacted with a sparkle!')
      }
    } catch (error) {
      console.error('Error handling messageReactionAdd event:', error)
    }
  })

  client.on('messageReactionRemove', async (reaction, user) => {
    try {
      if (!reaction.message.guild) {
        console.log('Reaction is not in a guild')
        return
      }

      console.log('Reaction removed:', reaction.emoji.name)
      console.log('User who removed the reaction:', user.globalName)

      // Your additional logic here
      if (reaction.emoji.name === '✨') {
        const res = await deleteMessage(reaction.message.id)
        console.log('User removed sparkle reaction!')
      }
    } catch (error) {
      console.error('Error handling messageReactionRemove event:', error)
    }
  })
}
