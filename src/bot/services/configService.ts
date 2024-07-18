import { Snowflake } from 'discord.js'

export const createAndSaveConfig = async (guildId: Snowflake) => {
  console.log('Creating a new configuration for Discord ID:', guildId)

  return true
}

export const loadConfig = async (guildId: Snowflake) => {
  console.log('Loading configuration for Discord ID:', guildId)

  return true
}

export const deleteConfig = async (guildId: Snowflake) => {}

export const updateConfig = async (guildId: Snowflake) => {}
