import { Snowflake } from 'discord.js'
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
  let config = await getConfigInCache(guildId)

  if (config === null) {
    console.log(`no config found for guild id: ${guildId} in cache`)
    config = (await getConfigInDb(guildId)) as any
    return
  }

  if (!config) {
    console.log(`no config found for guild id: ${guildId} `)
    return
  }

  return config
}

export const verifyMessageReactionRole = async (
  reaction,
  user,
  configRoles
) => {
  try {
    // Fetch the guild member
    const member = await reaction.message.guild?.members.fetch(user.id)

    if (!member) {
      console.log('Member not found.')
      return
    }

    // Retrieve roles and log them

    const discordRoles = member.roles.cache.map((role) => role.name)
    console.log(`configRoles: ${configRoles}`)
    console.log(`discordRoles: ${discordRoles}`)

    const hasMatch = configRoles.some((item) => discordRoles.includes(item))

    console.log(`User ${user.username} has roles: ${discordRoles.join(', ')}`)
    console.log(`User ${user.username} has valid role: ${hasMatch}`)

    return hasMatch
  } catch (error) {
    console.error('Error verifying message reaction privileges:', error)
    return { error: 'Failed verifying message reaction privileges.' }
    // Handle the error appropriately, e.g., notify the user, retry, etc.
  }
}

export const messageReactionReply = async (reaction, botFeedbackConfig) => {
  try {
    const { message, emoji, dm, same_channel, feedback_channel } =
      botFeedbackConfig

    let reply

    if (dm) {
      // Send a direct message to the user
      const user = reaction.message.author
      if (user) {
        reply = await user.send(message)
      } else {
        console.error('User not found for DM')
        return { error: 'User not found for DM' }
      }
    } else if (same_channel) {
      // Reply in the same channel
      reply = await reaction.message.reply(message)
    } else if (
      feedback_channel &&
      feedback_channel.length > 0 &&
      feedback_channel[0] !== 'none'
    ) {
      // Send to a specific feedback channel
      const guild = reaction.message.guild
      if (guild) {
        const targetChannel = await guild.channels.fetch(feedback_channel[0])
        if (targetChannel && targetChannel.isText()) {
          reply = await targetChannel.send(message)
        } else {
          console.error('Feedback channel not found or is not a text channel')
          return {
            error: 'Feedback channel not found or is not a text channel',
          }
        }
      } else {
        console.error('Guild not found')
        return { error: 'Guild not found' }
      }
    } else {
      console.error('Invalid bot feedback configuration')
      return { error: 'Invalid bot feedback configuration' }
    }

    if (reply) {
      await reply.react(emoji)
    }
  } catch (error) {
    console.error('Error replying to message reaction:', error)
    return { error: 'Failed replying to message reaction.' }
  }
}
