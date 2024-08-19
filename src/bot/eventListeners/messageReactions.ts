import { Client, Role } from 'discord.js'
import {
  authorizeUserSparkle,
  deleteSparkleMessage,
  replyToDeleteSparkle,
  saveSparkleMessage,
} from '../../utils/sparkleUtils.js'
import { findConfig, loadConfigData } from '../services/configService.js'

// TODOLATER: check for user permissions before proceeding
// TODOLATER: decide if we want to delete the message or just remove the reaction
// TODOLATER: add a cooldown to prevent spamming the database
// TODOLATER: add a check to ensure the message is not already saved
// TODO: create a function that saves the message embedding to the database
// TODO: check to see if the message is already saved in the database before proceeding

export default (client: Client) => {
  client.on('messageReactionAdd', async (reaction, user) => {
    try {
      // handleSparkleAdd(reaction, user)
      if (reaction.emoji.name !== '✨') return

      const authorized = authorizeUserSparkle(reaction)

      if (!authorized) {
        console.log(`User is not authorized to manage messages`)
        return
      }

      await saveSparkleMessage(reaction, user)

      const replyToAddSparkle = async (reaction, user) => {
        try {
          const configData = loadConfigData(reaction.message.guild.id)

          let reply

          if (dm) {
            // Send a direct message to the user
            if (user) {
              try {
                reply = await user.send(
                  `You added message ${reaction.message.id} to the database!`
                )
              } catch (dmError) {
                console.error('Error sending DM:', dmError)
                // Handle specific DM errors (e.g., user blocked the bot or has DMs turned off)
                return {
                  error:
                    'Unable to send DM. The user might have blocked the bot or have DMs turned off.',
                }
              }
            } else {
              console.error('User not found for DM')
              return { error: 'User not found for DM' }
            }
          } else if (same_channel) {
            // Reply in the same channel
            reply = await reaction.message.reply(
              `You added message ${reaction.message.id} to the database!`
            )
          } else if (
            feedback_channel &&
            feedback_channel.length > 0 &&
            feedback_channel[0] !== 'none'
          ) {
            // Send to a specific feedback channel
            const guild = reaction.message.guild
            if (guild) {
              const targetChannel = await guild.channels.fetch(
                feedback_channel[0]
              )
              if (targetChannel && targetChannel.isText()) {
                reply = await targetChannel.send(
                  `You added message ${reaction.message.id} to the database!`
                )
              } else {
                console.error(
                  'Feedback channel not found or is not a text channel'
                )
                return {
                  error: 'Feedback channel not found or is not a text channel',
                }
              }
            } else {
              console.error('Guild not found')
              return { error: 'Guild not found' }
            }
          } else {
            console.error('Invalid bot feedback configuration')
            return { error: 'Invalid bot feedback configuration' }
          }

          if (emoji) {
            try {
              await reaction.message.react(emoji)
            } catch (reactionError) {
              console.error('Error adding reaction:', reactionError)
              // Handle specific reaction errors
              return { error: 'Failed to add reaction to the message.' }
            }
          }
        } catch (error) {
          console.error('Error replying to message reaction:', error)
          return { error: 'Failed replying to message reaction.' }
        }
      }
      // await replyToAddSparkle(reaction, user, configBotFeedback)
    } catch (error) {
      console.error('Error handling messageReactionAdd event:', error)
    }
  })

  client.on('messageReactionRemove', async (reaction, user) => {
    try {
      if (reaction.emoji.name !== '✨') return

      await deleteSparkleMessage(reaction, user)
    } catch (error) {
      console.error('Error handling messageReactionRemove event:', error)
    }
  })
}
