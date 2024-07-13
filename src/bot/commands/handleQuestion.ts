import { Message } from 'discord.js'
import embedMessageContent from '../services/embedMessageContent'
import { formatQuestion } from '../../utils/messagesUtils'
import {
  saveQuestion,
  saveQuestionEmbedding,
} from '../services/questionService'
import queryMessageDatabase from '../services/queryMessageDatabase'
import dbClient from '../../config/dbConfig'
import { eq } from 'drizzle-orm'
import { Messages } from '../../db/schema'

export async function handleQuestion(message: Message) {
  const content = message.content

  const containsQuestionMark = (str: string) => {
    const regex = /\?/
    return regex.test(str)
  }

  if (!containsQuestionMark(content)) {
    return
  }

  const formattedQuestion = await formatQuestion(message)
  saveQuestion(formattedQuestion)
  const { discordId, tokens } = formattedQuestion
  const embedding = await embedMessageContent(tokens)
  saveQuestionEmbedding(discordId, embedding)

  try {
    // top 5 possiblt results
    const res = await queryMessageDatabase(embedding)
    // return the first best result
    const firstResult = res[0]
    const messageId = firstResult.messageId

    const db = await dbClient
    const answer = await db.query.Messages.findFirst({
      where: eq(Messages.discordId, messageId),
    })
    message.reply(`I think this might help: ${messageId}
    ${answer?.content}
    `)
  } catch (error) {
    console.error(error)
  }

  // TODO: use an llm to query the top 5 results and evaluate them. return the best.
  // console.log(result)
  return
}
