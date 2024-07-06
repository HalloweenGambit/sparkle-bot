import { Client } from 'discord.js'
import geminiPro from '../../config/geminiPro'
const regex = /^hey doc/i

export default (client: Client) => {
  client.on('messageCreate', async (message) => {
    if (regex.test(message.content)) {
      console.log('I was summoned')
      const docRes = await geminiPro(message.content)
      if (!docRes) {
        return
      }
      for (const res of docRes) {
        await message.reply(res)
      }
    } else {
      console.log(message.content)
    }

    // console.log(message)
    // handleQuestion(message)
  })
}
