import dbClient from '../config/dbConfig.js'
import { eq } from 'drizzle-orm'

// todo: discuss whether this is more work than it's worth in the long run
export async function findRecord(table: any, id: string) {
  try {
    let db = await dbClient
    const found = await db.query[table].findFirst({
      where: eq(table.discordId, id),
    })

    if (!found) {
      return null
    }

    return found
  } catch (error) {
    console.error('Error fetching row:', error)
  }
}
