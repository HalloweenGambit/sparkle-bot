import { Client } from 'discord.js'
import {
  authorizeUserSparkle,
  deleteSparkleMessage,
  saveSparkleMessage,
} from '../../utils/sparkleUtils.js'
import discordClient from '../../config/discordConfig.js'
import { handleAddSparkle } from '../services/handleSparkle.js'
import {
  createPotentialQuestions,
  formatPotentialQuestion,
  savePotentialQuestions,
} from '../services/potentialQuestionService.js'

// TODOLATER: check for user permissions before proceeding
// TODOLATER: decide if we want to delete the message or just remove the reaction
// TODOLATER: add a cooldown to prevent spamming the database
// TODOLATER: add a check to ensure the message is not already saved
// TODO: create a function that saves the message embedding to the database
// TODO: check to see if the message is already saved in the database before proceeding
export default (client: Client) => {
  client.on('messageReactionAdd', async (reaction, user) => {
    try {
      if (reaction.emoji.name !== '✨') return

      const authorized = authorizeUserSparkle(reaction)

      if (!authorized) {
        console.log(`User is not authorized to manage messages`)
        return
      }

      await saveSparkleMessage(reaction, user)
      await handleAddSparkle(reaction, user)

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
      console.error('Error handling messageReactionAdd event:', error)
    }
  })

  client.on('messageReactionRemove', async (reaction, user) => {
    try {
      if (reaction.emoji.name !== '✨') return

      const authorized = authorizeUserSparkle(reaction)

      if (!authorized) {
        console.log(`User is not authorized to manage messages`)
        return
      }

      await deleteSparkleMessage(reaction, user)
      const replyToRemoveSparkle = async (reaction) => {
        try {
          // Iterate over all reactions on the message
          const botReactions = reaction.message.reactions.cache.filter((r) =>
            r.users.cache.has(discordClient.user.id)
          )

          for (const botReaction of botReactions.values()) {
            // Remove the bot's reaction
            await botReaction.users.remove(discordClient.user.id)
            console.log(`Removed bot's ${botReaction.emoji.name} reaction`)
          }
        } catch (error) {
          console.error('Error removing bot reactions:', error)
          return { error: 'Failed to remove bot reactions.' }
        }
      }

      await replyToRemoveSparkle(reaction)
    } catch (error) {
      console.error('Error handling messageReactionRemove event:', error)
    }
  })
}
