import { Message } from 'discord.js'
import { preProcessQuestion } from '../services/preProcessMessageContent'
import embedMessageContent from '../services/embedMessageContent'

export async function handleQuestion(message: Message) {
  const content = message.content
  const guildId = message.guildId
  const channelId = message.channelId
  const createdAt = message.createdAt

  const containsQuestionMark = (str: string) => {
    const regex = /\?/
    return regex.test(str)
  }

  if (!containsQuestionMark(content)) {
    return
  }

  const formattedQuestion = formatQuestion(content, guildId, channelId)
  const { originalText, lemmas, tokens } = await preProcessQuestion(content)
  const embeddings = await embedMessageContent(tokens)
  // Process the question
  // save processed question to db
  // create embeddings
  // save embeddings to db

  console.log(content)
  return
}
