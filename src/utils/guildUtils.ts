import { Guild, Collection, OAuth2Guild } from 'discord.js'
import discordClient from '../config/discordConfig.js'
import dbClient from '../config/dbConfig.js'
import { Servers } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import { FormattedGuild, queryServers } from '../types.js'

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
export const getChangedFields = (
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
