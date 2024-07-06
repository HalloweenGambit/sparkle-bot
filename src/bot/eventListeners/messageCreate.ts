import { handleQuestion } from '../commands/text/handleQuestion'
const regex = /^hey doc/i

export default (client) => {
  client.on('messageCreate', async (message) => {
    if (regex.test(message.content)) {
      console.log('I was summoned')
      console.log(message)
      message.reply('hello')
    } else {
      console.log(message.content)
    }

    // console.log(message)
    // handleQuestion(message)
  })
}
