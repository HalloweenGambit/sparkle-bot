import { Client, GatewayIntentBits, Collection } from 'discord.js'
import { deleteMessage, saveMessage } from '../services/messageService.js'
import {
  formatMessageEmbedding,
  loadMessage,
  saveMessageEmbedding,
} from '../../utils/messagesUtils.js'
import { load } from 'dotenv-flow'
import { addSparkle, removeSparkle } from '../services/sparkleReply.js'

// TODOLATER: check for user permissions before proceeding
// TODOLATER: decide if we want to delete the message or just remove the reaction
// TODOLATER: add a cooldown to prevent spamming the database
// TODOLATER: add a check to ensure the message is not already saved
// TODO: create a function that saves the message embedding to the database
// TODO: check to see if the message is already saved in the database before proceeding

export default (client: Client) => {
  client.on('messageReactionAdd', async (reaction, user) => {
    try {
      addSparkle(reaction, user)
    } catch (error) {
      console.error('Error handling messageReactionAdd event:', error)
    }
  })

  client.on('messageReactionRemove', async (reaction, user) => {
    try {
      removeSparkle(reaction, user)
    } catch (error) {
      console.error('Error handling messageReactionRemove event:', error)
    }
  })
}
