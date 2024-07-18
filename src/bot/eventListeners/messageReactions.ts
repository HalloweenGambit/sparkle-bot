import { Client } from 'discord.js'
import {
  deleteSparkleMessage,
  replyToAddSparkle,
  saveSparkleMessage,
} from '../../utils/sparkleUtils.js'

// TODOLATER: check for user permissions before proceeding
// TODOLATER: decide if we want to delete the message or just remove the reaction
// TODOLATER: add a cooldown to prevent spamming the database
// TODOLATER: add a check to ensure the message is not already saved
// TODO: create a function that saves the message embedding to the database
// TODO: check to see if the message is already saved in the database before proceeding

export default (client: Client) => {
  client.on('messageReactionAdd', async (reaction, user) => {
    try {
      await saveSparkleMessage(reaction, user)
      await replyToAddSparkle(reaction, user)
    } catch (error) {
      console.error('Error handling messageReactionAdd event:', error)
    }
  })

  client.on('messageReactionRemove', async (reaction, user) => {
    try {
      deleteSparkleMessage(reaction, user)
    } catch (error) {
      console.error('Error handling messageReactionRemove event:', error)
    }
  })
}
