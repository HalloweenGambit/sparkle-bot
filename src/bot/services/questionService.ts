import { Snowflake } from 'discord.js'
import dbClient from '../../config/dbConfig'
import { MessageEmbeddings, Questions } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { FormattedQuestion } from '../../types'

export const saveQuestion = async (question: FormattedQuestion) => {
  const db = await dbClient
  await db.insert(Questions).values(question)
}
export const updateQuestion = async () => {}
export const deleteQuestion = async () => {}

// TODO: Implement an update and delete function
export const saveQuestionEmbedding = async (
  discordId: Snowflake,
  embedding: number[]
) => {
  if (!embedding) {
    return
  }
  try {
    const db = await dbClient
    await db.insert(MessageEmbeddings).values({
      discordId,
      embedding,
    })
    console.log(`Saved embedding for message ${messageId}`)
  } catch (error) {
    console.log(`Error saving message embedding: ${error}`)
    throw { error: 'Failed saving embedding. Please try again later.' }
  }
}

export const updateQuestionEmbedding = async (
  messageId: Snowflake,
  embedding: number[]
) => {
  if (!embedding) {
    return
  }
  try {
    const db = await dbClient
    const res = await db
      .update(MessageEmbeddings)
      .set({ embedding: embedding })
      .where(eq(MessageEmbeddings.messageId, messageId))
    console.log(`Updated embedding for message ${messageId}`)
    return res
  } catch (error) {
    console.error(`Error updating message embedding: ${error}`)
    throw { error: 'Failed updating embedding. Please try again later.' }
  }
}

export const deleteQuestionEmbedding = async (messageId: Snowflake) => {
  try {
    const db = await dbClient
    await db
      .delete(MessageEmbeddings)
      .where(eq(MessageEmbeddings.messageId, messageId))
    console.log(`Deleted embedding for message ${messageId}`)
  } catch (error) {
    console.error(`Error deleting message embedding: ${error}`)
    throw { error: 'Failed deleting embedding. Please try again later.' }
  }
}
