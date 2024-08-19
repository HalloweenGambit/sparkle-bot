import {
  deleteMessageEmbedding,
  formatMessageEmbedding,
  loadMessage,
  saveMessageEmbedding,
} from './messagesUtils'
import { deleteMessage, saveMessage } from '../bot/services/messageService'
import discordClient from '../config/discordConfig'
import { MessageReaction, ReactionUserManager, Role } from 'discord.js'
import { loadConfigData } from '../bot/services/configService'

// !correct types
export const replyToAddSparkle = async (reaction, user, botFeedbackConfig) => {
  try {
    const { emoji, dm, same_channel, feedback_channel } = botFeedbackConfig

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
        const targetChannel = await guild.channels.fetch(feedback_channel[0])
        if (targetChannel && targetChannel.isText()) {
          reply = await targetChannel.send(
            `You added message ${reaction.message.id} to the database!`
          )
        } else {
          console.error('Feedback channel not found or is not a text channel')
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

export const replyToDeleteSparkle = async (
  reaction,
  user,
  botFeedbackConfig
) => {
  try {
    const { emoji, dm, same_channel, feedback_channel } = botFeedbackConfig

    let reply

    if (dm) {
      // Send a direct message to the user
      if (user) {
        try {
          reply = await user.send(
            `You removed message ${reaction.message.id} from the database!`
          )
        } catch (dmError) {
          console.error('Error sending DM:', dmError)
          // Handle specific DM errors
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
        `You removed message ${reaction.message.id} from the database!`
      )
    } else if (
      feedback_channel &&
      feedback_channel.length > 0 &&
      feedback_channel[0] !== 'none'
    ) {
      // Send to a specific feedback channel
      const guild = reaction.message.guild
      if (guild) {
        const targetChannel = await guild.channels.fetch(feedback_channel[0])
        if (targetChannel && targetChannel.isText()) {
          reply = await targetChannel.send(
            `You removed message ${reaction.message.id} from the database!`
          )
        } else {
          console.error('Feedback channel not found or is not a text channel')
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
      // Remove the emoji reaction added by the bot
      await reaction.message.reactions.cache.get(emoji)?.remove()
    }
  } catch (error) {
    console.error('Error replying to message reaction:', error)
    return { error: 'Failed replying to message reaction.' }
  }
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

    const embeddingRes = await deleteMessageEmbedding(reaction.message.id)
    const msgRes = await deleteMessage(reaction.message.id)

    if (!msgRes || !embeddingRes) {
      console.log(`Embedding or Message not found in database, cannot delete`)
      return
    }
    console.log(
      `User ${user.globalName} removed ${reaction.message.id} from the database!`
    )
  } catch (error) {
    console.error('Error handling messageReactionRemove event:', error)
  }
}

export const authorizeUserSparkle = async (reaction) => {
  try {
    console.log(`Authorizing user for sparkle management`)

    const guildId = reaction.message?.guildId

    if (!guildId) return

    const configData = await loadConfigData(guildId)

    if ('error' in configData) return

    const messageManagementRoles =
      configData?.roles.permissions.can_manage_messages

    const userRoles = reaction.message.member.roles.cache.map(
      (role: Role) => role.id
    )

    console.log(`User roles: ${userRoles}`)
    console.log(`Message management roles: ${messageManagementRoles}`)

    const authorized = messageManagementRoles.some((role) =>
      userRoles.includes(role)
    )

    console.log(`User is authorized for message management: ${authorized}`)
    return authorized
  } catch (error) {
    console.error('Error authorizing user for sparkle management:', error)
    return false
  }
}
