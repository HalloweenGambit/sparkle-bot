import { Message } from 'discord.js'
import { queryPipeline } from '../services/ragService.js'
import { authorizeUserForQuestion } from '../services/configService.js'

export async function handleQuestion(message: Message) {
  console.log(`handling question: ${message.id}`)

  try {
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

    if (!message.inGuild()) {
      return
    }
    if (!message.guild?.id) {
      console.log(`No guild ID found for this message`)
      return
    }

    const verified = await authorizeUserForQuestion(message)
    if (!verified) {
      console.log(`User is not authorized to ask questions`)
      return
    }

    const answer = await queryPipeline(message)
    if (!answer) return
    if (!answer.content) return

    console.log(`Replying to question: ${message.id}`)
    //? currently replying in the same channel and no other option
    message.reply(answer?.content)
    return answer
  } catch (error) {
    console.error(error)
  }
}
