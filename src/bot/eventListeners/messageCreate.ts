import { Client } from 'discord.js'
import geminiPro from '../../config/geminiPro'

export default (client: Client) => {
  client.on('messageCreate', async (message) => {
    // console.log(message)
    // handleQuestion(message)
  })
}
