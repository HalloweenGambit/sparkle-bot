import { cosineDistance, desc, gt, sql } from 'drizzle-orm'
import dbClient from '../../config/dbConfig.js'
import { MessageEmbeddings } from '../../db/schema.js'

const queryMessageDatabase = async (embedding: number[]) => {
  const db = await dbClient

  // Assuming `cosineDistance` is a function that generates a SQL expression for the cosine distance
  const similarity = sql<number>`1 - (${cosineDistance(
    MessageEmbeddings.embedding,
    embedding
  )})`

  // The similarity score will be dynamically calculated in the SQL query
  const similarMessages = await db
    .select({ messageId: MessageEmbeddings.discordId, similarity })
    .from(MessageEmbeddings)
    // TODO: make it so the administrator can set the threshold
    .where(gt(similarity, 0.8))
    .orderBy(desc(similarity)) // Order by similarity in descending order
    .limit(5) // Limit the results to the top 4 most similar messages

  // Log the results for debugging purposes
  similarMessages.forEach((message) => {
    console.log(
      `Message ID: ${message.messageId}, Similarity Score: ${message.similarity}`
    )
  })

  return similarMessages
}

export default queryMessageDatabase
