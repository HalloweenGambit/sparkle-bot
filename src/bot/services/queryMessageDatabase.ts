import { cosineDistance, desc, gt, sql } from 'drizzle-orm'
import dbClient from '../../config/dbConfig.js'
import { MessageEmbeddings } from '../../db/schema.js'

const queryMessageDatabase = async (embedding: number[]) => {
  const db = await dbClient

  const similarity = sql<number>`1 - (${cosineDistance(
    MessageEmbeddings.embedding,
    embedding
  )})`

  console.log(similarity)

  const similarMessages = await db
    .select({ messageId: MessageEmbeddings.discordId, similarity })
    .from(MessageEmbeddings)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(4)

  return similarMessages
}

export default queryMessageDatabase
