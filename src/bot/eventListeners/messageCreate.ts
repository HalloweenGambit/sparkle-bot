import { Client } from 'discord.js'
import geminiPro from '../../config/geminiPro.js'
import { handleQuestion } from '../commands/handleQuestion.js'
import { handleHeyDoc } from '../commands/handleHeyDoc.js'

export default (client: Client) => {
  client.on('messageCreate', async (message) => {
    if (message.author.bot) return
    if (!message.inGuild) {
      return
    }
    console.log(`new guild msg: ${message.content}`)
    handleQuestion(message)
    handleHeyDoc(message)
  })
}
