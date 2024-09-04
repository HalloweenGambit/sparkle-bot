import { Message } from 'discord.js'
import { saveQuestion, saveQuestionEmbedding } from './questionService.js'
import embedMessageContent from './embedMessageContent.js'
import queryMessageDatabase from './queryMessageDatabase.js'
import dbClient from '../../config/dbConfig.js'
import { Messages } from '../../db/schema.js'
import { eq } from 'drizzle-orm'
import { queryPotentialQuestions } from './queryPotentialQuestions.js'
import { formatQuestion } from '../../utils/messagesUtils.js'
// RAG query pipeline
export const queryPipeline = async (message: Message) => {
  console.log(
    `Querying database for answer to the following question: ${message.content}`
  )

  // Start timer for the entire pipeline
  const startTime = Date.now()

  // TODO: extract question portion

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

  if (!message.guild || !message.guild.id) {
    console.log(`Message does not belong to a guild`)
    return
  }

  // Query the potential questions database for similar questions
  stageStartTime = Date.now()
  let linkedQuestions = await queryPotentialQuestions(
    embedding,
    message.guild.id
  )

  console.log(
    `Querying potential questions database took ${
      Date.now() - stageStartTime
    } ms`
  )

  let answer

  if (linkedQuestions.length > 0) {
    // If similar questions are found, get the first one
    const firstQuestion = linkedQuestions[0]
    const questionMessageId = firstQuestion.messageId

    // Query the message database for the answer
    stageStartTime = Date.now()
    const db = await dbClient
    answer = await db.query.Messages.findFirst({
      where: eq(Messages.discordId, questionMessageId),
    })
    console.log(
      `Searching message in database took ${Date.now() - stageStartTime} ms`
    )
  }

  if (!answer) {
    // If no similar question is found or no answer was retrieved, query the Messages database directly
    console.log(
      `No results found in potential questions. Querying Messages database...`
    )

    stageStartTime = Date.now()
    const res = await queryMessageDatabase(embedding, message.guild.id)
    console.log(
      `Querying Messages database took ${Date.now() - stageStartTime} ms`
    )

    if (res.length > 0) {
      const firstResult = res[0]
      const messageId = firstResult.messageId

      // Start timer for searching the message in the database
      stageStartTime = Date.now()
      const db = await dbClient
      answer = await db.query.Messages.findFirst({
        where: eq(Messages.discordId, messageId),
      })
      console.log(
        `Searching message in database took ${Date.now() - stageStartTime} ms`
      )
    }
  }

  if (!answer) {
    console.log(`No results found`)
  }

  console.log(`Total pipeline time: ${Date.now() - startTime} ms`)
  return answer
}
