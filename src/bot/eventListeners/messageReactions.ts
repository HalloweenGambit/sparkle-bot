import { Client, GatewayIntentBits, Collection } from 'discord.js'
import { deleteMessage, saveMessage } from '../services/messageService'

// TODOLATER: check for user permissions before proceeding
// TODOLATER: decide if we want to delete the message or just remove the reaction
// TODOLATER: add a cooldown to prevent spamming the database
// TODOLATER: add a check to ensure the message is not already saved
// TODO: create a function that saves the message embedding to the database

export default (client: Client) => {
  client.on('messageReactionAdd', async (reaction, user) => {
    try {
      // Ensure the reaction is in a guild
      if (!reaction.message.guild) {
        console.log('Reaction is not in a guild')
        return
      }

      console.log('Reaction added:', reaction.emoji.name)
      console.log('User who added the reaction:', user.globalName)

      // Your additional logic here
      if (reaction.emoji.name === '✨') {
        const res = await saveMessage(
          reaction.message.guild.id,
          reaction.message.channel.id,
          reaction.message.id
        )
        console.log(res)
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
