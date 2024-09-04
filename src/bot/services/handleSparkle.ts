// check if its the additon or removal of a sparkle reaction
// check the discord configuration
// check the user permissions

import { Channel, MessageReaction, TextChannel } from 'discord.js'
import { ConfigData } from '../../types.js'
import { loadConfigData } from './configService.js'

// check if the message is already saved
export const handleAddSparkle = async (reaction, user) => {
  console.log(`replying to message reaction`)
  try {
    const configData = (await loadConfigData(
      reaction.message.guild.id
    )) as ConfigData
    const dm = configData.bot_feedback.dm
    const sameChannel = configData.bot_feedback.same_channel
    const feedbackChannel = configData.bot_feedback.feedback_channel
    const emoji = configData.bot_feedback.emoji

    console.log(
      `bot_feedback: dm: ${dm}, sameChannel: ${sameChannel}, feedbackChannel: ${feedbackChannel}, emoji: ${emoji}`
    )

    const dmReply = async (user, configData) => {
      try {
        await user.send(
          `You added message ${reaction.message.id} to the database!`
        )
      } catch (dmError) {
        console.error('Error sending DM:', dmError)
        return {
          error:
            'Unable to send DM. The user might have blocked the bot or have DMs turned off.',
        }
      }
    }

    const sameChannelReply = async (reaction, configData) => {
      try {
        await reaction.message.reply(
          `You added message ${reaction.message.id} to the database!`
        )
      } catch (replyError) {
        console.error('Error replying to message:', replyError)
        return {
          error: 'Failed to reply to the message.',
        }
      }
    }

    const targetChannelReply = async (
      reaction: MessageReaction,
      configData: ConfigData
    ) => {
      try {
        const feedbackChannel = reaction.message.guild?.channels.cache.find(
          (channel: Channel) =>
            channel.id === configData.bot_feedback.feedback_channel
        ) as TextChannel

        if (!feedbackChannel) {
          console.error('Feedback channel not found')
          return { error: 'Feedback channel not found' }
        }

        await feedbackChannel.send(
          `User ${user.tag} added message ${reaction.message.id} to the database!`
        )
      } catch (feedbackError) {
        console.error('Error sending feedback message:', feedbackError)
        return { error: 'Failed to send feedback message.' }
      }
    }

    const emojiReply = async (reaction, configData) => {
      try {
        await reaction.message.react(configData.bot_feedback.emoji || '✨')
      } catch (reactionError) {
        console.error('Error adding reaction:', reactionError)
        return { error: 'Failed to add reaction to the message.' }
      }
    }

    // Execute the replies based on config settings
    if (configData.bot_feedback.dm) {
      await dmReply(user, configData)
    }

    if (configData.bot_feedback.same_channel) {
      await sameChannelReply(reaction, configData)
    }

    // TODO: check if the feedback channel is valid then reply to it
    if (configData.bot_feedback.feedback_channel) {
      await targetChannelReply(reaction, configData)
    }

    if (configData.bot_feedback.emoji) {
      await emojiReply(reaction, configData)
    }
  } catch (error) {
    console.error('Error replying to message reaction:', error)
    return { error: 'Failed replying to message reaction.' }
  }
}
