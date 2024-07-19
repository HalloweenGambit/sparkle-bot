import { Client } from 'discord.js'
import { handleQuestion } from '../commands/handleQuestion.js'
import { handleHeyDoc } from '../commands/handleHeyDoc.js'
import { getConfigData } from '../../utils/configUtils.js'

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
      const configData = await getConfigData(message.guild.id)
      if (!configData) {
        console.log(`no config data found for this guild`)
        return
      }
      // Get the channel ID
      const channelId = message.channel.id
      // Get the roles of the user
      const userRoles = message?.member?.roles.cache
      userRoles.forEach((roles) => {
        console.log(roles)
      })

      console.log(`channelId:${channelId}, userRoles:${userRoles}`)

      const checkMessageCreatePermissions = async ({
        userRoles,
        channelId,
        configData,
      }) => {
        // Check if the channel ID is in the configData
        const isCorrectChannel =
          configData.channels.question_listener.includes(channelId)
        // Check if the user has any of the required roles
        const hasRequiredRole = userRoles.some((role) =>
          configData.roles.can_ask_questions.includes(role.id)
        )
        console.log(
          `isCorrectChannel:${isCorrectChannel}, hasRequiredRole:${hasRequiredRole}`
        )
        console.log(isCorrectChannel && hasRequiredRole)
        return isCorrectChannel && hasRequiredRole
      }

      const hasPermission = await checkMessageCreatePermissions({
        userRoles,
        channelId,
        configData,
      })

      if (!hasPermission) {
        console.log(
          `user does not have permission to ask questions in this channel`
        )
        return
      }

      console.log(`permission granted to ask questions in this channel`)
      console.log(`handling the following message: ${message.content}`)
      handleQuestion(message)
      handleHeyDoc(message)
    } catch (error) {
      console.error('An error occurred while processing the message:', error)
    }
  })
}
