import { Channel, Client, MessageReaction, Role, TextChannel } from 'discord.js'
import {
  authorizeUserSparkle,
  deleteSparkleMessage,
  saveSparkleMessage,
} from '../../utils/sparkleUtils.js'
import { loadConfigData } from '../services/configService.js'
import { ConfigData } from '../../types.js'
import discordClient from '../../config/discordConfig.js'
import { handleAddSparkle } from '../services/handleSparkle.js'
import { GoogleGenerativeAI } from '@google/generative-ai'

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

      const extractJsonArray = (text) => {
        // Use a regular expression to find the JSON array within the string
        const match = text.match(/\[.*?\]/s)
        if (match) {
          return match[0] // Return the first match
        }
        throw new Error('No valid JSON array found in the text')
      }

      const createPotentialQuestions = async (reactionMessage) => {
        try {
          const configData = await loadConfigData(guildId)
          const apiKey = process.env.API_KEY || configData?.api_key

          if (!apiKey) {
            console.error('No API key found')
            return
          }

          console.log('API_KEY:', apiKey)

          const gpt = new GoogleGenerativeAI(apiKey)
          const model = await gpt.getGenerativeModel({
            model: 'gemini-1.5-flash',
          })

          const prePrompt = `Given the following message: "${reactionMessage}", generate 10 potential questions users may ask that could be answered with it. Format the output as a valid JSON array of strings.`
          const res = await model.generateContent(prePrompt)
          let text = await res.response.text()

          // Extract JSON array from the text
          let jsonArrayText
          try {
            jsonArrayText = extractJsonArray(text)
            console.log('Extracted JSON array:', jsonArrayText)
          } catch (extractError) {
            console.error('Error extracting JSON array:', extractError)
            return
          }

          // Parse the JSON array
          let questionsArray
          try {
            questionsArray = JSON.parse(jsonArrayText)
            if (
              !Array.isArray(questionsArray) ||
              questionsArray.some((q) => typeof q !== 'string')
            ) {
              throw new Error('Invalid format: Expected an array of strings')
            }
          } catch (parseError) {
            console.error('Error parsing JSON response:', parseError)
            return
          }

          console.log('Potential questions:', questionsArray)
          return questionsArray
        } catch (error) {
          console.error('Error creating potential questions:', error)
        }
      }
      const potentialQuestions = await createPotentialQuestions(reactionMessage)
      if (!potentialQuestions) {
        console.error('Failed to create potential questions')
        return
      } else {
        console.log('Successfully created potential questions')
      }
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
