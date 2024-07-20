import { Client } from 'discord.js'
import {
  deleteSparkleMessage,
  replyToAddSparkle,
  replyToDeleteSparkle,
  saveSparkleMessage,
} from '../../utils/sparkleUtils.js'
import configCache from '../configsCache.json'
import {
  getConfigData,
  verifyMessageReactionRole,
} from '../../utils/configUtils.js'

// TODOLATER: check for user permissions before proceeding
// TODOLATER: decide if we want to delete the message or just remove the reaction
// TODOLATER: add a cooldown to prevent spamming the database
// TODOLATER: add a check to ensure the message is not already saved
// TODO: create a function that saves the message embedding to the database
// TODO: check to see if the message is already saved in the database before proceeding

export default (client: Client) => {
  client.on('messageReactionAdd', async (reaction, user) => {
    try {
      if (reaction.emoji.name !== '✨') return
      const guildId = reaction.message?.guildId
      if (!guildId) return

      const configData = await getConfigData(guildId)
      const configRoles = configData?.roles.can_manage_messages
      const configBotFeedback = configData?.bot_feedback

      if (!(await verifyMessageReactionRole(reaction, user, configRoles)))
        return
      await replyToAddSparkle(reaction, user, configBotFeedback)
      await saveSparkleMessage(reaction, user)
    } catch (error) {
      console.error('Error handling messageReactionAdd event:', error)
    }
  })

  client.on('messageReactionRemove', async (reaction, user) => {
    try {
      if (reaction.emoji.name !== '✨') return
      const guildId = reaction.message?.guildId
      if (!guildId) return

      const configData = await getConfigData(guildId)
      const configRoles = configData?.roles.can_manage_messages
      const configBotFeedback = configData?.bot_feedback

      if (!(await verifyMessageReactionRole(reaction, user, configRoles)))
        return
      await deleteSparkleMessage(reaction, user)
      await replyToDeleteSparkle(reaction, user, configBotFeedback)
    } catch (error) {
      console.error('Error handling messageReactionRemove event:', error)
    }
  })
}
