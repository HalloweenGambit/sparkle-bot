import { GoogleGenerativeAI } from '@google/generative-ai'
import { loadConfigData } from './configService'
import { preProcessQuestion } from './preProcessMessageContent'
import embedMessageContent from './embedMessageContent'
import { PotentialQuestions } from '../../db/schema'
import dbClient from '../../config/dbConfig'
import { Snowflake } from 'discord.js'

const extractJsonArray = (text: string): string => {
  const match = text.match(/\[.*?\]/s)
  if (match) {
    return match[0]
  }
  throw new Error('No valid JSON array found in the text')
}

export const createPotentialQuestions = async (
  // TODO: remove any type
  reactionMessage: any,
  guildId: Snowflake
) => {
  try {
    const configData = await loadConfigData(guildId)
    const apiKey = configData?.api_key

    if (!apiKey) {
      console.error('No API key found')
      return
    }

    const gpt = new GoogleGenerativeAI(apiKey)
    const model = await gpt.getGenerativeModel({
      model: 'gemini-1.5-flash',
    })

    const prePrompt = `Given the following message: "${reactionMessage}", generate 10 potential questions users may ask that could be answered with it. Format the output as a valid JSON array of strings.`
    const res = await model.generateContent(prePrompt)
    const text = await res.response.text()

    let jsonArrayText
    try {
      jsonArrayText = extractJsonArray(text)
      console.log('Extracted JSON array:', jsonArrayText)
    } catch (extractError) {
      console.error('Error extracting JSON array:', extractError)
      return
    }

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

export const formatPotentialQuestion = async (
  question: string,
  messageId: string,
  serverId: string
) => {
  const { lemmas, tokens } = await preProcessQuestion(question)
  const embedding = await embedMessageContent(tokens)
  return {
    messageId,
    serverId,
    question,
    lemmas,
    tokens,
    embedding,
  }
}

export const savePotentialQuestions = async (formattedQuestions: any[]) => {
  try {
    const db = await dbClient
    await db.insert(PotentialQuestions).values(formattedQuestions).returning()
  } catch (error) {
    console.error('Error saving potential questions:', error)
  }
}
