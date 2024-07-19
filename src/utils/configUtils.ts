import { Message, Snowflake } from 'discord.js'
import configCache from '../bot/configsCache.json'
import { ConfigCache } from '../types'
import dbClient from '../config/dbConfig'
import { eq } from 'drizzle-orm'
import { Configs } from '../db/schema'

// Cast the imported JSON to the ConfigCache type
const typedConfigCache = configCache as ConfigCache

export const getConfigInCache = async (guildId: Snowflake) => {
  try {
    const configData = typedConfigCache[guildId]
    if (!configData) {
      console.log(`No cache found for guild ID: ${guildId}`)
      return null
    }
    return configData
  } catch (error) {
    console.error(error)
  }
}

export const getConfigInDb = async (guildId: Snowflake) => {
  try {
    const db = await dbClient
    const res = await db.query.Configs.findFirst({
      where: eq(Configs.discordId, guildId),
    })
    if (!res) {
      console.log(`No config found for guild ID: ${guildId}`)
      return null
    }
    return res.configData
  } catch (error) {
    console.error(error)
  }
}

export const getConfigData = async (guildId: Snowflake) => {
  let config
  let cacheConfig = await getConfigInCache(guildId)

  if (cacheConfig === null) {
    console.log(`no config found for guild id: ${guildId} in cache`)
    const dbConfig = await getConfigInCache(guildId)
    config = (dbConfig as any).configData
    return
  } else {
    config = cacheConfig
  }

  if (!config) {
    console.log(`no config found for guild id: ${guildId} in db`)
    return
  }

  return config
}
