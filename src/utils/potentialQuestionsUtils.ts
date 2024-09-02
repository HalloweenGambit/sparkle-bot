import {
  createPotentialQuestions,
  formatPotentialQuestion,
  savePotentialQuestions,
} from '../bot/services/potentialQuestionService'

export const managePotentialQuestions = async (reaction) => {
  try {
    const reactionMessage = reaction.message
    const guildId = reactionMessage.guild?.id
    const serverId = guildId
    const messageId = reactionMessage.id

    const potentialQuestions = await createPotentialQuestions(
      reactionMessage,
      guildId
    )
    if (!potentialQuestions) {
      console.error('Failed to create potential questions')
      return
    }

    const formattedQuestions = await Promise.all(
      potentialQuestions.map((question) =>
        formatPotentialQuestion(question, messageId, serverId)
      )
    )

    await savePotentialQuestions(formattedQuestions)
    console.log('Successfully created & saved potential questions')
  } catch (error) {
    console.error('Error managing potential questions:', error)
  }
}
