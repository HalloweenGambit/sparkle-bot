import {
  deleteMessageEmbedding,
  formatMessageEmbedding,
  loadMessage,
  saveMessageEmbedding,
} from './messagesUtils'
import { deleteMessage, saveMessage } from '../bot/services/messageService'
import { Role } from 'discord.js'
import { loadConfigData } from '../bot/services/configService'

// !correct types

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
      `User ${user.globalName} reacted to message ${reaction.message.id} with a sparkle!`
    )

    const guildId = reaction.message.guild.id
    const channelId = reaction.message.channel.id
    const messageId = reaction.message.id

    const loadMessageStartTime = Date.now()
    // TODO: check if message is already saved
    const message = await loadMessage(guildId, channelId, messageId)
    console.log(`Loading message took ${Date.now() - loadMessageStartTime} ms`)

    if (!message) {
      return
    }

    const saveMessageStartTime = Date.now()
    await saveMessage(guildId, channelId, messageId)
    console.log(`Saving message took ${Date.now() - saveMessageStartTime} ms`)

    const formatEmbeddingStartTime = Date.now()
    console.log(`Formatting embedding`)
    const formattedEmbedding = await formatMessageEmbedding(message)
    console.log(
      `Formatting embedding took ${Date.now() - formatEmbeddingStartTime} ms`
    )

    const saveEmbeddingStartTime = Date.now()
    saveMessageEmbedding(formattedEmbedding)
    console.log(
      `Saving embedding took ${Date.now() - saveEmbeddingStartTime} ms`
    )

    console.log(
      `User ${user.globalName} added message ${messageId} and embedding to the database!`
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

    const deleteEmbeddingStartTime = Date.now()
    const embeddingRes = await deleteMessageEmbedding(reaction.message.id)
    console.log(
      `Deleting embedding took ${Date.now() - deleteEmbeddingStartTime} ms`
    )

    const deleteMessageStartTime = Date.now()
    const msgRes = await deleteMessage(reaction.message.id)
    console.log(
      `Deleting message took ${Date.now() - deleteMessageStartTime} ms`
    )

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
