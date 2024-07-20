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

      handleQuestion(message)
      handleHeyDoc(message)
    } catch (error) {
      console.error('An error occurred while processing the message:', error)
    }
  })
}
