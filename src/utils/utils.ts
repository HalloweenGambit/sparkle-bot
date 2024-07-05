import { Guild, Collection, OAuth2Guild } from 'discord.js'
import discordClient from '../config/discordConfig'
import dbClient from '../config/dbConfig'
import { Servers } from '../db/schema'
import { eq } from 'drizzle-orm'
import { FormattedGuild, queryServers } from '../types'

// Load all guilds from discordApi
export const loadGuilds = async (): Promise<
  Collection<string, OAuth2Guild>
> => {
  try {
    return discordClient.guilds.fetch()
  } catch (error) {
    console.error('Error fetching all Discord servers:', error)
    throw error
  }
}

// Load a specific guild by ID from discordApi
export const loadGuild = async (id: string): Promise<Guild> => {
  try {
    const guildDetails = await discordClient.guilds.fetch(id)
    return guildDetails
  } catch (error) {
    console.error(`Error fetching Discord server with ID ${id}:`, error)
    throw error
  }
}

export const loadCompleteGuilds = async (): Promise<Guild[]> => {
  try {
    const guilds = await loadGuilds()
    const detailedGuildsPromises = await guilds.map((guild) =>
      loadGuild(guild.id)
    )
    const detailedGuilds = await Promise.all(detailedGuildsPromises)
    return detailedGuilds
  } catch (error) {
    console.error('Error loading complete guilds:', error)
    return [] // Handle error gracefully, return empty array or rethrow
  }
}

// Format guild details
export const formatGuild = (guild: Guild): FormattedGuild => {
  return {
    discordId: guild.id as string,
    guildName: guild.name ?? null,
    guildDescription: guild.description ?? null,
    guildOwnerId: guild.ownerId ?? null,
    verificationLevel: guild.verificationLevel ?? null,
    guildNsfwLevel: guild.nsfwLevel ?? null,
    approxMemberCount: guild.memberCount ?? null,
    discordCreatedAt: guild.createdAt ?? null,
  }
}

export const formatGuilds = (guilds: Guild[]): FormattedGuild[] => {
  const formattedGuilds = guilds.map((guild) => {
    return formatGuild(guild)
  })
  return formattedGuilds
}

// Find the guild
export const findGuild = async (
  discordId: string
): Promise<queryServers | null> => {
  try {
    let db = await dbClient
    const storedGuild = await db.query.Servers.findFirst({
      where: eq(Servers.discordId, discordId),
    })
    if (!storedGuild) {
      console.log(`No Stored guild with ${discordId} was found`)
      // should i return an empty object if not found? how to handle
      return null
    }
    return await storedGuild
  } catch (error) {
    console.error('Error finding guild:', error)
    throw { error: 'Failed finding guild. Please try again later.' }
  }
}

// ! change references to newData, oldData
// compare to see if guild and stored guild is the same
export const compareGuilds = (
  newData: Guild,
  oldData: queryServers
): boolean => {
  const newGuild = formatGuild(newData)
  const keys = Object.keys(newGuild) as (keyof FormattedGuild)[]

  // Iterate through each key
  for (let key of keys) {
    // Compare values of the same key
    // ! dates arent both being registered the same otherwise: no idea why
    if (newGuild[key]?.toString() !== oldData[key]?.toString()) {
      return false // If any value differs, return false
    }
  }

  // Ensure both objects have the same number of keys
  return true
}

// ! to review
// Function to compare two objects and return a list of keys with different values
const getChangedFields = (
  newData: Guild,
  oldData: queryServers
): Partial<FormattedGuild> => {
  const newGuild = formatGuild(newData)
  const changedFields = Object.entries(newGuild).reduce(
    (changedFields, [key, value]) => {
      if (value !== oldData[key as keyof FormattedGuild]) {
        return { ...changedFields, [key]: value }
      }
      return changedFields
    },
    {}
  )

  return changedFields
}

// Create new guild
type InsertServer = typeof Servers.$inferInsert
type CreateGuildResponse = InsertServer | { error: string }

export const createGuild = async (
  guild: Guild
): Promise<CreateGuildResponse> => {
  try {
    const formattedGuild = formatGuild(guild)
    const db = await dbClient

    // Insert the new guild into the database
    const res = await db.insert(Servers).values(formattedGuild).returning()

    // If no result, return an error
    if (!res || res.length === 0) {
      console.error('Insert operation did not return any results')
      return { error: 'Failed to create guild. No result returned.' }
    }

    return res[0] // Assuming res is an array and we need to return the first inserted guild
  } catch (error) {
    console.error('Error creating guild:', error)
    return { error: 'Failed to create guild. Please try again later.' }
  }
}

// TODO: return the changed key:property and correct type
export const updateGuild = async (guild: Guild): Promise<void> => {
  try {
    const newGuild = await formatGuild(guild)
    const foundGuild = await findGuild(guild.id)

    if (!foundGuild) {
      return
    }

    let db = await dbClient
    // Get the fields that have changed
    const changedFields = getChangedFields(guild, foundGuild)

    // Perform the update in the database
    await db
      .update(Servers)
      .set(changedFields)
      .where(eq(Servers.discordId, foundGuild.discordId))

    console.log(`Updated guild: ${foundGuild.id}, ${foundGuild.guildName}`)
  } catch (error) {
    console.error(`Error updating guild ${guild.id}:`, error)
  }
}

export const deleteGuild = async (guildId: string) => {
  try {
    const foundGuild = await findGuild(guildId)

    if (!foundGuild) {
      return
    }

    let db = await dbClient

    await db
      .update(Servers)
      .set({ isActive: false })
      .where(eq(Servers.discordId, guildId))

    console.log(
      `guild: ${foundGuild.id}, ${foundGuild.guildName} has been marked as inactive :(`
    )
  } catch (error) {
    console.error(`Error deleting guild ${guildId}:`, error)
  }
}

//! make sure to be able to differentiate between an error and null
export const syncGuilds = async (): Promise<void> => {
  console.log('Started syncing guilds')
  const guilds = await loadGuilds()
  const completeGuilds = await loadCompleteGuilds()
  const newData = await formatGuilds(completeGuilds)

  const newGuilds: Promise<CreateGuildResponse>[] = []
  const modifiedGuilds: Promise<void>[] = []
  const unchangedGuilds: Guild[] = []

  try {
    // Process each guild in newData
    for (const guild of completeGuilds) {
      const found = await findGuild(guild.id)

      if (!found) {
        // Guild not found in database, create new guild
        newGuilds.push(createGuild(guild))
      } else if (!compareGuilds(guild, found)) {
        // Guild found but data differs, update guild
        modifiedGuilds.push(updateGuild(guild))
      } else {
        // Guild found and data matches, consider it unchanged
        unchangedGuilds.push(guild)
        // console.log(`Unchanged guild: ${guild.discordId}`)
      }
    }

    // Wait for all new guilds and updates to complete
    await Promise.all([...newGuilds, ...modifiedGuilds])

    console.log(
      `new guilds: ${newGuilds.length}, modified guilds: ${modifiedGuilds.length}, unchanged guilds: ${unchangedGuilds.length}`
    )
  } catch (error) {
    console.error('Error syncing guilds:', error)
    throw error
  }
}
