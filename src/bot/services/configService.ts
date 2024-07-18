import defaultConfig from '../defaultCongif.json'
import dbClient from '../../config/dbConfig.js'
import { Configs } from '../../db/schema'
import { Collection, Guild, OAuth2Guild, Snowflake } from 'discord.js'
import { eq } from 'drizzle-orm'
import { loadGuilds } from '../../utils/guildUtils'

export const createConfigData = async (guild: OAuth2Guild) => {
  try {
    const newConfigData = defaultConfig
    newConfigData.server_id = guild.id
    newConfigData.server_name = guild.name

    return newConfigData
  } catch (error) {
    console.error('Error creating configuration:', error)
    return { error: 'Failed to create configuration. Please try again later.' }
  }
}

export const saveConfig = async (guildId: Snowflake, newConfigData: any) => {
  try {
    const db = await dbClient
    const config = { discordId: guildId, configData: newConfigData }
    const res = await db.insert(Configs).values(config).returning()
    return res[0]
  } catch (error) {
    console.error('Error creating configuration:', error)
    return { error: 'Failed to create configuration. Please try again later.' }
  }
}

export const loadConfigData = async (guildId: Snowflake) => {
  console.log('Loading configuration for Discord ID:', guildId)
  try {
    const db = await dbClient
    const res = await db.query.Configs.findFirst({
      where: eq(Configs.discordId, guildId),
    })

    if (!res) {
      console.log('No configuration found for Discord ID:', guildId)
      return { error: 'No configuration found for this server.' }
    }

    const configData = res.configData

    return configData
  } catch (error) {
    console.error('Error loading configuration:', error)
    return { error: 'Failed to load configuration. Please try again later.' }
  }
}

export const deleteConfig = async (guildId: Snowflake) => {
  try {
    const db = await dbClient
    const res = await db
      .delete(Configs)
      .where(eq(Configs.discordId, guildId))
      .returning()
    return res
  } catch (error) {
    console.error('Error deleting configuration:', error)
    return { error: 'Failed to delete configuration. Please try again later.' }
  }
}

export const updateConfig = async (guildId: Snowflake, configData: JSON) => {
  try {
    const db = await dbClient
    const res = await db
      .update(Configs)
      .set({ configData })
      .where(eq(Configs.discordId, guildId))
      .returning()
    return res
  } catch (error) {
    console.error('Error updating configuration:', error)
    return { error: 'Failed to update configuration. Please try again later.' }
  }
}

const findConfig = async (guildId: Snowflake) => {
  try {
    const db = await dbClient
    const res = await db.query.Configs.findFirst({
      where: eq(Configs.discordId, guildId),
    })
    return res
  } catch (error) {
    console.error('Error finding configuration:', error)
    return { error: 'Failed to find configuration. Please try again later.' }
  }
}

// export const syncConfig = async (id: Snowflake, guild: OAuth2Guild) => {
//   try {
//     // Load the configuration data for the guild
//   } catch (error) {
//     console.error('Error syncing configuration:', error)
//     return { error: 'Failed to sync configuration. Please try again later.' }
//   }
// }
export const syncAllConfigs = async () => {
  // TODO: finish syncConfig function
  // TODO: sync by also adding the configuration to a cache or local storage,
  // !Currently only adding to the database if it doesn't exist

  try {
    console.log('Syncing configurations')

    // Load all guilds
    const guilds = await loadGuilds()

    // Prepare arrays for batch operations
    const cache: { [key: string]: any } = {}
    const configPromises = []

    // Iterate over each guild
    for (const [id, guild] of guilds) {
      // Push the promise to the array
      configPromises.push(
        (async () => {
          const res = await findConfig(id)
          if (!res) {
            // Create configuration data for the guild
            const newConfigData = await createConfigData(guild)
            await saveConfig(id, newConfigData)
            console.log(`Added new config for guild: ${guild.name}, id: ${id}`)
            cache[id] = newConfigData // Add to cache
          } else {
            cache[id] = res // Add existing config to cache
          }
        })()
      )
    }

    // Wait for all promises to complete
    await Promise.all(configPromises)

    // Optionally: Store cache in local storage or another caching mechanism
    // Example: localStorage.setItem('configsCache', JSON.stringify(cache));
  } catch (error) {
    console.error('Error syncing configurations:', error)
    return { error: 'Failed to sync configurations. Please try again later' }
  }
}
