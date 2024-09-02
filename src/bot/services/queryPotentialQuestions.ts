import { cosineDistance, desc, eq, gt, sql } from 'drizzle-orm'
import dbClient from '../../config/dbConfig.js'
import { PotentialQuestions } from '../../db/schema.js'

export const queryPotentialQuestions = async (
  embedding: number[],
  serverId
) => {
  const db = await dbClient

  // Assuming `cosineDistance` is a function that generates a SQL expression for the cosine distance
  const similarity = sql<number>`1 - (${cosineDistance(
    PotentialQuestions.embedding,
    embedding
  )})`

  // The similarity score will be dynamically calculated in the SQL query
  const query = db
    .select({
      id: PotentialQuestions.id,
      messageId: PotentialQuestions.messageId,
      serverId: PotentialQuestions.serverId,
      similarity,
    })
    .from(PotentialQuestions)
    .$dynamic() // Enable dynamic mode

  // TODO: make it so the administrator can set the threshold
  const similarQuestions = await query
    .where(eq(PotentialQuestions.serverId, serverId))
    .where(gt(similarity, 0.8))
    .orderBy(desc(similarity)) // Order by similarity in descending order
    .limit(5) // Limit the results to the top 4 most similar messages

  // Log the results for debugging purposes
  similarQuestions.forEach((message) => {
    console.log(
      `Potential Question ID: ${message.id}, Message ID: ${message.messageId}, Similarity Score: ${message.similarity}`
    )
  })

  return similarQuestions
}
