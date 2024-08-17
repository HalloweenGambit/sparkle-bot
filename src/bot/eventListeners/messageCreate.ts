import { Client } from 'discord.js'
import { handleQuestion } from '../commands/handleQuestion.js'
import { handleHeyDoc } from '../commands/handleHeyDoc.js'
import { loadConfigData } from '../services/configService.js'
import { ConfigData } from '../../types.js'

export default (client: Client) => {
  client.on('messageCreate', async (message) => {
    try {
      if (message.author.bot) return

      if (!message.inGuild()) {
        return
      }
      if (!message?.guild?.id) {
        console.log(`no guild id found for this message`)
        return
      }
      // TODO: load the configuration for this guild
      const guildId = message.guild.id
      const guildConfigData = await loadConfigData(guildId)
      if (!guildConfigData) {
        console.log(`no guild config data found for this guild`)
        return
      }
      // TODO: load member roles
      const user = message.member

      if (!user) {
        console.log(`no user found for this message`)
        return
      }

      const userRoles = user.roles.cache

      if (!userRoles) {
        console.log(`no roles found for this user`)
        return
      }

      const userRoleIds = userRoles.map((role) => role.id)
      const userRoleNames = userRoles.map((role) => role.name)
      const userPermissions = user.permissions.toArray()

      // TODO: check if the user is authorized to ask questions
      const userCanAskQuestions = (
        guildConfigData: ConfigData | { error: string }
      ) => {
        if ('roles' in guildConfigData) {
          return guildConfigData.roles.permissions.can_ask_questions.some(
            (questionRoles) => {
              userRoleIds.includes(questionRoles)
            }
          )
        } else {
          console.log(
            `no guild config data found for this guild or user not authorized to ask questions`
          )
          return false
        }
      }

      const verified = userCanAskQuestions(guildConfigData)
      // User verified - Handle question
      if (verified) {
        console.log(`user verified for asking questions`)
        handleQuestion(message)
        handleHeyDoc(message)
        return
      } else {
        console.log(`user not verified for asking questions`)
        return
      }

      // TODO: check what the bot feedback settings are for this guild
      // TODO: reply to the user based on the bot feedback settings
    } catch (error) {
      console.error('An error occurred while processing the message:', error)
    }
  })
}
