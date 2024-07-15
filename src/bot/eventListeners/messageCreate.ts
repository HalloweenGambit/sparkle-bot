import { Client } from 'discord.js'
import geminiPro from '../../config/geminiPro.js'
import { handleQuestion } from '../commands/handleQuestion.js'
import { handleHeyDoc } from '../commands/handleHeyDoc.js'

export default (client: Client) => {
  client.on('messageCreate', async (message) => {
    console.log(message.content)
    handleQuestion(message)
    handleHeyDoc(message)
  })
}
