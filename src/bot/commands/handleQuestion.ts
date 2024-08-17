import { Message } from 'discord.js'
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
