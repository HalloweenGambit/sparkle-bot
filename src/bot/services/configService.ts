import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import defaultConfig from '../defaultCongif.json'
import dbClient from '../../config/dbConfig.js'
import { Configs } from '../../db/schema'
import { OAuth2Guild, Snowflake } from 'discord.js'
import { eq } from 'drizzle-orm'
import { loadGuilds } from '../../utils/guildUtils'
import { URL } from 'url'
import configsCache from '../configsCache.json' assert { type: 'json' }

// Promisify fs.writeFile
const writeFileAsync = promisify(fs.writeFile)

export const createConfigData = async (guild: OAuth2Guild) => {
  try {
    const newConfigData = { ...defaultConfig } // Clone defaultConfig
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
    console.error('Error saving configuration:', error)
    return { error: 'Failed to save configuration. Please try again later.' }
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

    return res.configData
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

// ?might need to make a separate function for findConfig
const findConfigData = async (guildId: Snowflake) => {
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

// Resolve the directory of the current module
const currentModuleURL = new URL(import.meta.url)
const currentDir = path.dirname(currentModuleURL.pathname)
const cacheFilePath = path.join(currentDir, '../configsCache.json')

async function readCacheFile() {
  try {
    const data = fs.readFileSync(cacheFilePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading cache file:', error)
    return {} // Return an empty object if there's an error
  }
}

async function writeCacheFile(cacheData) {
  try {
    fs.writeFileSync(cacheFilePath, JSON.stringify(cacheData, null, 2), 'utf8')
    console.log('Cache file updated successfully.')
  } catch (error) {
    console.error('Error writing cache file:', error)
  }
}

export const syncConfig = async (discordId, cacheData) => {
  try {
    const res = await loadConfigData(discordId)

    if (cacheData[discordId]) {
      cacheData[discordId] = res
      console.log(`Config updated in cache for guild ID: ${discordId}`)
    } else {
      cacheData[discordId] = res
      console.log(`New config added to cache for guild ID: ${discordId}`)
    }

    return cacheData[discordId]
  } catch (error) {
    console.error('Error syncing configuration:', error)
    return { error: 'Failed to sync configuration. Please try again later.' }
  }
}

export const syncAllConfigs = async () => {
  try {
    console.log('Syncing configurations')

    // Load all guilds
    const guilds = await loadGuilds()

    // Load the cache data once
    const cacheData = await readCacheFile()

    // Array to store config check promises
    const configPromises = []

    // Iterate over each guild
    for (const [guildId, guild] of guilds) {
      // Check if config for that guild exists in the database
      const config = await findConfigData(guildId)

      if (!config) {
        console.log(`No config found for guild ID: ${guildId}`)
        const configData = await createConfigData(guild)
        await saveConfig(guildId, configData)
      }

      // Push syncConfig promise to configPromises
      configPromises.push(syncConfig(guildId, cacheData))
    }

    // Wait for all promises to complete
    await Promise.all(configPromises)

    // Write the updated cache data back to the file
    await writeCacheFile(cacheData)

    console.log('All configurations synced successfully.')
  } catch (error) {
    console.error('Error syncing configurations:', error)
    return { error: 'Failed to sync configurations. Please try again later.' }
  }
}

// TODO: check for changes in configData and update the cache accordingly
