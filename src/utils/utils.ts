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

// Create new guild
type InsertServer = typeof Servers.$inferInsert
type CreateGuildResponse = InsertServer | { error: string }

export const createGuild = async (
  formattedGuild: FormattedGuild
): Promise<CreateGuildResponse> => {
  try {
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

// ! change references to newData, oldData
// compare to see if guild and stored guild is the same
export const compareGuilds = (
  newData: FormattedGuild,
  oldData: queryServers
): boolean => {
  const keys = Object.keys(newData) as (keyof FormattedGuild)[]

  // Iterate through each key
  for (let key of keys) {
    // Compare values of the same key
    if (newData[key] !== oldData[key]) {
      return false // If any value differs, return false
    }
  }

  // Ensure both objects have the same number of keys
  return keys.length === Object.keys(newData).length
}

// ! to review
// Function to compare two objects and return a list of keys with different values
const getChangedFields = (
  newData: FormattedGuild,
  oldData: queryServers
): Partial<FormattedGuild> => {
  const changedFields = Object.entries(newData).reduce(
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

// Function to update guild in the database
// * By only accepting formatted guilds I guarantee both have the same properties
// * Expand later on to allow it to return the changedFields
// * updating different fields
// TODO: return the changed key:property and correct type
export const updateGuild = async (
  guild: FormattedGuild,
  storedGuild: queryServers
): Promise<void> => {
  try {
    let db = await dbClient
    // Get the fields that have changed
    const changedFields = getChangedFields(guild, storedGuild)

    // Perform the update in the database
    await db
      .update(Servers)
      .set(changedFields)
      .where(eq(Servers.discordId, storedGuild.discordId))

    console.log(`Updated guild: ${storedGuild.id}, ${storedGuild.guildName}`)
  } catch (error) {
    console.error(`Error updating guild ${storedGuild.discordId}:`, error)
  }
}

// ! use
// const compareObjects = <T>(newData: T, oldData: T): boolean => {
//   const keys = Object.keys(newData) as (keyof T)[]
//   for (const key of keys) {
//     if (newData[key] !== oldData[key]) {
//       return false
//     }
//   }
//   return keys.length === Object.keys(oldData).length
// }

// Use this function for both guilds and channels

// syncGuilds can sync one guild if in an array
//! make sure to be able to differentiate between an error and null

export const syncGuilds = async (): Promise<void> => {
  console.log('Started syncing guilds')
  const completeGuilds = await loadCompleteGuilds()
  const newData = await formatGuilds(completeGuilds)

  const newGuilds: Promise<CreateGuildResponse>[] = []
  const modifiedGuilds: Promise<void>[] = []
  const unchangedGuilds: FormattedGuild[] = []

  try {
    // Process each guild in newData
    for (const guild of newData) {
      const found = await findGuild(guild.discordId)

      if (!found) {
        // Guild not found in database, create new guild
        newGuilds.push(createGuild(guild))
      } else if (!compareGuilds(guild, found)) {
        // Guild found but data differs, update guild
        modifiedGuilds.push(updateGuild(guild, found))
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

// TODO: define handleMemberCount
//  Update the memberCount table
// decide the data structure for storing changes in member memberCount
// investigate if there are any more
export const handleMemberCountChange = () => {}
