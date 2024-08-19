import { Client } from 'discord.js'
import { handleQuestion } from '../commands/handleQuestion.js'
import { handleHeyDoc } from '../commands/handleHeyDoc.js'
import {
  authorizeUserForQuestion,
  loadConfigData,
} from '../services/configService.js'
import { ConfigData } from '../../types.js'

export default (client: Client) => {
  client.on('messageCreate', async (message) => {
    try {
      if (message.author.bot) return

      if (!message.inGuild()) {
        return
      }
      if (!message.guild?.id) {
        console.log(`No guild ID found for this message`)
        return
      }

      const verified = await authorizeUserForQuestion(message)
      if (!verified) {
        console.log(`User is not authorized to ask questions`)
        return
      }
      handleQuestion(message)
      handleHeyDoc(message)
      // TODO: Check what the bot feedback settings are for this guild
      // TODO: Reply to the user based on the bot feedback settings
    } catch (error) {
      console.error('An error occurred while processing the message:', error)
    }
  })
}
