import { Client } from 'discord.js'
import geminiPro from '../../config/geminiPro'
const regex = /^hey doc/i

export default (client: Client) => {
  client.on('messageCreate', async (message) => {
    const heyDoc = async (message: string) => {
      if (regex.test(message)) {
        console.log('I was summoned')
        const docRes = await geminiPro(message)
        if (!docRes) {
          return
        }
        for (const res of docRes) {
          await message.reply(res)
        }
      } else {
        console.log(message)
      }
    }

    // console.log(message)
    // handleQuestion(message)
  })
}
