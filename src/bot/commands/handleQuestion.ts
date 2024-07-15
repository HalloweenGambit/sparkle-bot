import { Message } from 'discord.js'
import embedMessageContent from '../services/embedMessageContent.js'
import { formatQuestion } from '../../utils/messagesUtils.js'
import {
  saveQuestion,
  saveQuestionEmbedding,
} from '../services/questionService.js'
import queryMessageDatabase from '../services/queryMessageDatabase.js'
import dbClient from '../../config/dbConfig.js'
import { eq } from 'drizzle-orm'
import { Messages } from '../../db/schema.js'

export async function handleQuestion(message: Message) {
  if (message.author.bot) {
    return
  }
  const content = message.content

  const containsQuestionMark = (str: string) => {
    const regex = /\?/
    return regex.test(str)
  }

  if (!containsQuestionMark(content)) {
    return
  }

  try {
    console.log(`start handling question: ${content}`)
    console.log(`started formatting question`)
    const formattedQuestion = await formatQuestion(message)
    console.log(`finished formatting question`)

    console.log(`saving question`)
    saveQuestion(formattedQuestion)
    console.log(`finished saving question`)

    const { discordId, tokens } = formattedQuestion
    console.log(`embedding message content`)
    const embedding = await embedMessageContent(tokens)
    console.log(`finished embedding message content`)

    console.log(`saving question embedding`)
    saveQuestionEmbedding(discordId, embedding)
    console.log(`finished saving question embedding`)

    // top 5 possiblt results
    const res = await queryMessageDatabase(embedding)
    // return the first best result
    const firstResult = res[0]
    const messageId = firstResult.messageId

    const db = await dbClient
    console.log(`searching for message with id: ${messageId}`)
    const answer = await db.query.Messages.findFirst({
      where: eq(Messages.discordId, messageId),
    })
    console.log(`found message with id: ${messageId}`)

    if (!answer) {
      return
    }

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
