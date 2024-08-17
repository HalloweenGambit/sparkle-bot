import { Client } from 'discord.js'
import { handleQuestion } from '../commands/handleQuestion.js'
import { handleHeyDoc } from '../commands/handleHeyDoc.js'

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
      // TODO: look for the configuration for this guild

      // TODO: check if the user is authorized to ask questions
      handleQuestion(message)
      handleHeyDoc(message)
      // TODO:
    } catch (error) {
      console.error('An error occurred while processing the message:', error)
    }
  })
}
