import { Message } from 'discord.js'
import { preProcessQuestion } from '../services/preProcessMessageContent'
import embedMessageContent from '../services/embedMessageContent'
import { formatQuestion } from '../../utils/messagesUtils'
import { saveQuestion } from '../services/questionService'

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
  // const { discordId, tokens } = formattedQuestion
  // const embeddings = await embedMessageContent(tokens)
  // save embeddings to db

  console.log(content)
  return
}
