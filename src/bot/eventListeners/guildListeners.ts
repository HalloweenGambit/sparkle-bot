import { Client } from 'discord.js'
import {
  createGuild,
  updateGuild,
  deleteGuild,
} from '../services/guildService.js'
import { createConfig, deleteConfig } from '../services/configService.js'

export default (client: Client) => {
  client.on('guildCreate', async (guild) => {
    await createGuild(guild)
    const configData = await createConfig(guild.id)
  })

  client.on('guildUpdate', async (guild) => {
    updateGuild(guild)
  })

  client.on('guildDelete', async (guild) => {
    await deleteGuild(guild.id)
    await deleteConfig(guild.id)
  })
}
