import { Message } from 'discord.js'
import { formatQuestion } from '../../utils/messagesUtils'
import { saveQuestion, saveQuestionEmbedding } from './questionService'
import embedMessageContent from './embedMessageContent'
import queryMessageDatabase from './queryMessageDatabase'
import dbClient from '../../config/dbConfig'
import { Messages } from '../../db/schema'
import { eq } from 'drizzle-orm'

// RAG query pipeline
export const queryPipeline = async (message: Message) => {
  console.log(
    `Querying database for answer to the following question: ${message.content}`
  )

  // Start timer for the entire pipeline
  const startTime = Date.now()

  // Start timer for formatting the question
  let stageStartTime = Date.now()
  const formattedQuestion = await formatQuestion(message)
  console.log(`Formatting question took ${Date.now() - stageStartTime} ms`)

  // Start timer for saving the question
  stageStartTime = Date.now()
  await saveQuestion(formattedQuestion)
  console.log(`Saving question took ${Date.now() - stageStartTime} ms`)

  const { discordId, tokens } = formattedQuestion

  // Start timer for embedding the message content
  stageStartTime = Date.now()
  const embedding = await embedMessageContent(tokens)
  console.log(
    `Embedding message content took ${Date.now() - stageStartTime} ms`
  )

  // Start timer for saving the question embedding
  stageStartTime = Date.now()
  await saveQuestionEmbedding(discordId, embedding)
  console.log(
    `Saving question embedding took ${Date.now() - stageStartTime} ms`
  )

  // TODO: query the potential questions database for similar questions
  const potentialQuestions = await queryPotentialQuestions(embedding)
  // TODO: return the top 5 most similar questions
  // TODO: use llm to see if the answer attatched to the question is correct

  // Start timer for querying the message database
  stageStartTime = Date.now()
  const res = await queryMessageDatabase(embedding)
  console.log(
    `Querying message database took ${Date.now() - stageStartTime} ms`
  )

  if (res.length === 0) {
    console.log(`No results found`)
    console.log(`Total pipeline time: ${Date.now() - startTime} ms`)
    return
  }

  const firstResult = res[0]
  const messageId = firstResult.messageId

  const db = await dbClient

  // Start timer for searching the message in the database
  stageStartTime = Date.now()
  const answer = await db.query.Messages.findFirst({
    where: eq(Messages.discordId, messageId),
  })
  console.log(
    `Searching message in database took ${Date.now() - stageStartTime} ms`
  )

  if (!answer) {
    console.log(`Total pipeline time: ${Date.now() - startTime} ms`)
    return
  }

  console.log(`Total pipeline time: ${Date.now() - startTime} ms`)
  return answer
}
