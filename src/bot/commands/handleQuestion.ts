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
import { queryPipeline } from '../services/ragService.js'

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

  console.log(`handling question: ${message.id}`)

  try {
    const answer = await queryPipeline(message)
    return answer
  } catch (error) {
    console.error(error)
  }

  return
}
