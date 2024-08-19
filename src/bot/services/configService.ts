import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import dbClient from '../../config/dbConfig.js'
import { Configs } from '../../db/schema'
import { Message, Snowflake } from 'discord.js'
import { eq } from 'drizzle-orm'
import { loadCompleteGuilds, loadGuild } from '../../utils/guildUtils'
import { URL } from 'url'
import { ConfigData } from '../../types.js'
import { boolean } from 'drizzle-orm/mysql-core/index.js'

// Promisify fs.writeFile
const writeFileAsync = promisify(fs.writeFile)
// Resolve the directory of the current module
const currentModuleURL = new URL(import.meta.url)
const currentDir = path.dirname(currentModuleURL.pathname)
const cacheFilePath = path.join(currentDir, '../configsCache.json')

const loadCacheFile = async () => {
  try {
    const data = fs.readFileSync(cacheFilePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading cache file:', error)
    return {} // Return an empty object if there's an error
  }
}

const writeCacheFile = async (cacheData: ConfigData) => {
  try {
    fs.writeFileSync(cacheFilePath, JSON.stringify(cacheData, null, 2), 'utf8')
    console.log('Cache file updated successfully.')
  } catch (error) {
    console.error('Error writing cache file:', error)
  }
}

const createConfigData = async (guildId: Snowflake) => {
  try {
    const guild = await loadGuild(guildId)
    const roles = await guild.roles.fetch()
    const administratorPermission = BigInt(0x00000008) // ADMINISTRATOR permission bitfield

    const all_roles = roles.map((role) => ({
      role_id: role.id,
      role_name: role.name,
      role_permissions: role.permissions.bitfield.toString(), // Convert BigInt to string
      isAdmin:
        (BigInt(role.permissions.bitfield) & administratorPermission) ===
        administratorPermission,
    }))

    roles.forEach((role) => {
      console.log(`role id: ${role.id}
        role name: ${role.name}
        role permissions: ${role.permissions.bitfield}
        is admin: ${
          (BigInt(role.permissions.bitfield) & administratorPermission) ===
          administratorPermission
        }`)
    })

    const admins = all_roles.filter((role) => role.isAdmin === true)
    const can_manage_messages = admins.map((role) => role.role_id)

    const can_ask_questions = all_roles.map((role) => role.role_id)

    const all_channels = await guild.channels.fetch()

    // TODO: allow other channel types to be used
    const all_text_channels = all_channels.filter((channel) => {
      console.log(`channel type: ${channel?.type}`)
      return channel?.type === 0
    })
    const all_text_channel_ids = all_text_channels.map((channel) => channel.id)

    return {
      server_id: guild.id,
      server_name: guild.name,
      roles: {
        all_roles,
        permissions: {
          can_manage_messages,
          can_ask_questions,
        },
      },
      channels: {
        message_management: all_text_channel_ids,
        question_listener: all_text_channel_ids,
      },
      bot_feedback: {
        dm: false,
        same_channel: false,
        feedback_channel: null,
        emoji: '✅',
      },
    }
  } catch (error) {
    console.error('Error saving configuration data:', error)
    return {
      error: `Failed to save configuration data for guild: ${guildId}. Please try again later.`,
    }
  }
}

export const createConfig = async (guildId: Snowflake) => {
  try {
    console.log(`Creating configuration for Discord ID: ${guildId}`)
    const configData = await createConfigData(guildId)

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

// ?might need to make a separate function for findConfig
export const findConfig = async (guildId: Snowflake) => {
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

export const updateConfigData = async (
  guildId: Snowflake,
  configData: ConfigData
) => {
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

// TODO: check for changes in configData and update the cache accordingly
// TODO: descide on what to do with the cacheData
export const syncCache = async (discordId: Snowflake) => {
  try {
    const cacheData = await loadCacheFile()
    const res = await loadConfigData(discordId)

    if ('error' in res) {
      console.error(`Error loading configuration for guild ID: ${discordId}`)
      return res
    }

    // TODO: check for whats changing in the configData and update the cache accordingly
    if (cacheData[discordId]) {
      cacheData[discordId] = res
      console.log(`Config updated in cache for guild ID: ${discordId}`)
    } else {
      cacheData[discordId] = res
      console.log(`New config added to cache for guild ID: ${discordId}`)
    }

    writeCacheFile(cacheData)
    return cacheData[discordId]
  } catch (error) {
    console.error('Error syncing configuration:', error)
    console.error(error)

    return { error: 'Failed to sync configuration. Please try again later.' }
  }
}

export const syncAllConfigs = async () => {
  try {
    console.log('Syncing configurations')

    // Load all guilds
    const guilds = await loadCompleteGuilds()

    // Array to store config check promises
    const configPromises = []

    // Iterate over each guild
    for (const guild of guilds) {
      // Check if config for that guild exists in the database
      const config = await findConfig(guild.id)

      if (!config) {
        console.log(`No config found for guild ID: ${guild.id}`)
        await createConfig(guild.id)
      }

      console.log(`currently not refreshing available roles in config files`)
      // await refreshAvailableRoles(guild.id)

      // Push syncConfig promise to configPromises
      configPromises.push(syncCache(guild.id))
    }

    // Wait for all promises to complete
    await Promise.all(configPromises)

    console.log('All configurations synced successfully.')
  } catch (error) {
    console.error('Error syncing configurations:', error)
    return { error: 'Failed to sync configurations. Please try again later.' }
  }
}

export type ConfigDataResult = ConfigData | { error: string }

// Updated loadConfigData function with correct return type
export const loadConfigData = async (
  guildId: Snowflake
): Promise<ConfigDataResult> => {
  console.log('Loading configuration for Discord ID:', guildId)
  try {
    const db = await dbClient
    const res = await db.query.Configs.findFirst({
      where: eq(Configs.discordId, guildId),
    })

    // Convert role_permissions back to BigInt
    if (!res) {
      console.log(`No config found for guild ID: ${guildId}`)
      return { error: 'No configuration found for this guild.' }
    }

    // !This is a temporary to fix getting unknown from db
    // !Could not setup custom jsonb type
    return res.configData as ConfigData
  } catch (error) {
    console.error('Error loading configuration:', error)
    return { error: 'Failed to load configuration. Please try again later.' }
  }
}

const loadRoles = async (guildId: Snowflake) => {
  const guild = await loadGuild(guildId)
  const roles = await guild.roles.fetch()
  return roles
}

// export const refreshAvailableRoles = async (guildId: Snowflake) => {
//   try {
//     // Load roles from the guild
//     const roles = await loadRoles(guildId)

//     // Ensure roles is a collection or expected object
//     if (!roles) {
//       console.error(
//         `No roles found or error retrieving roles for guild ID: ${guildId}`
//       )
//       return { error: 'Failed to load roles for this guild.' }
//     }

//     // Convert roles collection to an array
//     const rolesArray = Array.from(roles.values())

//     // Load configuration data for the guild
//     const configData = await loadConfigData(guildId)

//     // Debugging output to understand the structure of configData
//     console.log('Loaded configData:', configData)

//     if (!configData || 'error' in configData) {
//       console.error(
//         `No configuration data found or error loading configuration for guild ID: ${guildId}`
//       )
//       return { error: 'Failed to load configuration data for this guild.' }
//     }

//     // Create updated configuration with new roles
//     const updatedConfigData: ConfigData = {
//       ...configData,
//       roles: {
//         ...configData.roles,
//         all_roles: rolesArray.map((role) => ({
//           role_id: role.id,
//           role_name: role.name,
//           role_permissions: role.permissions.bitfield.toString(),
//           isAdmin:
//             (BigInt(role.permissions.bitfield) & BigInt(0x00000008)) ===
//             BigInt(0x00000008),
//         })),
//       },
//     }

//     // Save the updated configuration data
//     await updateConfigData(guildId, updatedConfigData)
//     return updatedConfigData
//   } catch (error) {
//     console.error('Error syncing roles:', error)
//     return { error: 'Failed to sync roles. Please try again later.' }
//   }
// }

export const authorizeUserForQuestion = async (message: Message) => {
  console.log(`Authorizing user for asking questions`)
  if (!message.guild) {
    console.log(`No guild found for this message`)
    return
  }

  const guildId = message.guild.id
  const guildConfigData = await loadConfigData(guildId)
  const user = message.member

  if (!user) {
    console.log(`No user found for this message`)
    return { error: 'No user found for this message' }
  }

  const userRoles = user.roles.cache

  if (!userRoles.size) {
    console.log(`No roles found for this user`)
    return { error: 'No roles found for this user' }
  }

  const userRoleIds = Array.from(userRoles.values()).map((role) => role.id)

  if ('error' in guildConfigData) {
    console.log(`No roles found for asking questions`)
    return { error: 'No roles found for asking questions' }
  }

  const askQuestionRoleIds = guildConfigData.roles.permissions.can_ask_questions
  const verified = askQuestionRoleIds.some((role) => userRoleIds.includes(role))

  console.log(`userRoleIds: ${userRoleIds}`)
  console.log(`askQuestionRoleIds: ${askQuestionRoleIds}`)

  console.log(`User is authorized to ask questions: ${verified}`)
  return verified
}
