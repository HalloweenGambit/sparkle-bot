import { Client } from 'discord.js'
import geminiPro from '../../config/geminiPro'
import { handleQuestion } from '../commands/handleQuestion'

export default (client: Client) => {
  client.on('messageCreate', async (message) => {
    console.log(message.content)
    handleQuestion(message)
  })
}
