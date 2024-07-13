import { describe, it, expect, assert, test } from 'vitest'
import DotenvFlow from 'dotenv-flow'
import discordClient from '../config/discordConfig'
import dbClient from '../config/dbConfig'
import { loadAllChannelMessages, loadMessage } from '../utils/messagesUtils'
import { preProcessQuestion } from '../bot/services/preProcessMessageContent'
import queryMessageDatabase from '../bot/services/queryMessageDatabase'
import embedMessageContent from '../bot/services/embedMessageContent'

DotenvFlow.config()

describe('initialize', async () => {
  await dbClient
  await discordClient.login(process.env.DISCORD_TOKEN)
  discordClient.once('ready', () => {
    console.log('test discordClient logged in')
  })

  it('turn question into tokens', async () => {
    let testQuestion: any =
      'Where can I find discussion questions for our current book?'
    const preProcessedQuestion = await preProcessQuestion(testQuestion)
    const tokens = preProcessedQuestion.tokens
    expect(tokens).toBeTypeOf('object')
  })

  // Q: Where can I find discussion questions for our current book?
  // A: Discussion questions for our current book are posted weekly in the #current-discussion channel. You can also find them pinned at the top of the channel for easy access. Feel free to add your own questions and join the conversation!
  // expect(queryResult).toBeTypeOf('object');
  it('queries the database for similar messages based on the question', async () => {
    let testQuestion =
      'Where can I find discussion questions for our current book?'
    const preProcessedQuestion = await preProcessQuestion(testQuestion)
    const tokens = await preProcessedQuestion.tokens
    const embeddings = await embedMessageContent(tokens)
    console.log(embeddings)
    const queryResult = await queryMessageDatabase(embeddings)
    console.log(queryResult)
  }, 100000) // Set timeout to 10 seconds

  it.todo('')
})
