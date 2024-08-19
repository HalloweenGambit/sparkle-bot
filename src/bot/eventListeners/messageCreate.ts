import { Client } from 'discord.js'
import { handleQuestion } from '../commands/handleQuestion.js'
import { handleHeyDoc } from '../commands/handleHeyDoc.js'

export default (client: Client) => {
  client.on('messageCreate', async (message) => {
    try {
      // returns the answer to the question asked in chat
      handleQuestion(message)
      handleHeyDoc(message)
    } catch (error) {
      console.error('An error occurred while processing the message:', error)
    }
  })
}
