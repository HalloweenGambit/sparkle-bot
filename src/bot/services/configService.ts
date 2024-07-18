import defaultConfig from '../defaultCongif.json'
import dbClient from '../../config/dbConfig.js'
import { Configs } from '../../db/schema'
import { OAuth2Guild, Snowflake } from 'discord.js'
import { eq } from 'drizzle-orm'
import { loadGuilds } from '../../utils/guildUtils'
import path from 'path' // Import path module for handling file paths
import fs from 'fs'

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

export const loadAllConfigs = async () => {
  try {
    const db = await dbClient
    const res = await db.query.Configs.findMany()
    return res
  } catch (error) {
    console.error('Error loading configurations:', error)
    return { error: 'Failed to load configurations. Please try again later.' }
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

export const syncAllConfigs = async () => {
  try {
    console.log('Syncing configurations')

    // Load all guilds
    const guilds = await loadGuilds()

    // Prepare cache object
    const cache = {}

    // Array to store config check promises
    const configPromises = []

    // Iterate over each guild
    for (const [id, guild] of guilds) {
      // Push the promise to the array
      configPromises.push(
        (async () => {
          const res = await findConfig(id)
          if (!res || res.error) {
            // Create configuration data for the guild if not found or error
            const newConfigData = await createConfigData(guild)
            await saveConfig(id, newConfigData)
            console.log(`Added new config for guild: ${guild.name}, id: ${id}`)
            cache[id] = newConfigData // Add to cache
          } else if (res.configData) {
            cache[id] = res.configData // Add existing config to cache if configData exists
          }
        })()
      )
    }

    // Wait for all promises to complete
    await Promise.all(configPromises)

    // Determine the path to save the file based on current module file
    const currentModuleFile = import.meta.url
    const currentDir = path.dirname(new URL(currentModuleFile).pathname)
    const parentFolderPath = path.join(currentDir, '../configsCache.json')

    // Write cache to JSON file
    fs.writeFile(parentFolderPath, JSON.stringify(cache), (err) => {
      if (err) {
        console.error('Error writing configsCache.json:', err)
        throw err // Handle error appropriately
      }
      console.log('configsCache.json has been saved')
    })

    // Optionally: Store cache in local storage or another caching mechanism
    // Example: localStorage.setItem('configsCache', JSON.stringify(cache));
  } catch (error) {
    console.error('Error syncing configurations:', error)
    return { error: 'Failed to sync configurations. Please try again later' }
  }
}
