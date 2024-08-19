import { Client } from 'discord.js'
import { handleQuestion } from '../commands/handleQuestion.js'
import { handleHeyDoc } from '../commands/handleHeyDoc.js'

export default (client: Client) => {
  client.on('messageCreate', async (message) => {
    try {
      // console.log(answer)
      handleQuestion(message)
      handleHeyDoc(message)

      // TODO: Check what the bot feedback settings are for this guild
      // TODO: Reply to the user based on the bot feedback settings
    } catch (error) {
      console.error('An error occurred while processing the message:', error)
    }
  })
}
