import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import defaultConfig from '../defaultCongif.json'
import dbClient from '../../config/dbConfig.js'
import { Configs } from '../../db/schema'
import { Guild, OAuth2Guild, PermissionsBitField, Snowflake } from 'discord.js'
import { eq } from 'drizzle-orm'
import {
  loadCompleteGuilds,
  loadGuild,
} from '../../utils/guildUtils'
import { URL } from 'url'
import configsCache from '../configsCache.json' assert { type: 'json' }
import { Config } from 'drizzle-kit'

// Promisify fs.writeFile
const writeFileAsync = promisify(fs.writeFile)

export const createConfig = async (guildId: Snowflake) => {
  const configData = defaultConfigData(guildId)
  try {
    if (!guildId) {
      console.error('No guild ID provided.')
      return { error: 'No guild ID provided.' }
    }
    const db = await dbClient
    const res = await db
      .insert(Configs)
      .values({ discordId: guildId, configData })
      .returning()
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

const defaultConfigData = async (guildId: Snowflake) => {
  const guild = await loadGuild(guildId)
  const roles = await guild.roles.fetch()


  const allRoles = roles.map((role) => ({
    role_id: role.id,
    role_name: role.name,
    admin: role.flags.has(PermissionsBitField.Flags.ADMINISTRATOR)
  }))

  // Check for a role with ADMINISTRATOR permission

  const defaultRole = adminRole || allRoles[0] // Fallback to the first role if no admin role found

  return {
    server_id: guild.id,
    server_name: guild.name,
    roles: {
      all_roles: allRoles,
      permissions: {
        can_manage_messages: [defaultRole],
        can_ask_questions: [defaultRole], // You can set this to a different default if needed
      },
    },
    channels: {
      message_management: , // Set to general by default
      question_listener: [{ channel_id: '', channel_name: 'Questions' }], // Set to questions by default
    },
    bot_feedback: {
      dm: false,
      same_channel: true,
      feedback_channel: null,
      emoji: '✅',
    },
  }
}

export const createConfigData = async (guild: Guild) => {
  try {
    const serverName = guild.name
    const serverId = guild.id
    const roles = guild.roles.fetch()
  } catch (error) {
    console.error('Error saving configuration data:', error)
    return {
      error: `Failed to save configuration data for guild: ${guild.id}. Please try again later.`,
    }
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

const readCacheFile = async () => {
  try {
    const data = fs.readFileSync(cacheFilePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading cache file:', error)
    return {} // Return an empty object if there's an error
  }
}

const writeCacheFile = async (cacheData) => {
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
    const guilds = await loadCompleteGuilds()

    // Load the cache data once
    const cacheData = await readCacheFile()

    // Array to store config check promises
    const configPromises = []

    // Iterate over each guild
    for (const guild of guilds) {
      // Check if config for that guild exists in the database
      const config = await findConfigData(guild.id)

      if (!config) {
        console.log(`No config found for guild ID: ${guildId}`)
        const configData = await createConfig(guild)
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
export const findRoles = async (guildId: Snowflake) => {
  try {
    const configData = await loadGuild(guildId)
    const roles = await configData.roles.fetch()
    return roles
  } catch (error) {
    console.error('Error finding roles:', error)
    return { error: 'Failed to find roles. Please try again later.' }
  }
}
