import { Snowflake } from 'discord.js'

export const saveConfig = async (discordId: Snowflake) => {
  console.log('Creating a new configuration for Discord ID:', discordId)

  return true
}

export const loadConfig = async (discordId: Snowflake) => {
  console.log('Loading configuration for Discord ID:', discordId)

  return true
}

export const deleteConfig = async (discordId: Snowflake) => {}

export const updateConfig = async (discordId: Snowflake) => {}
