import { Client } from 'discord.js'
import { createGuild, updateGuild, deleteGuild } from '../../utils/utils'

export default (client: Client) => {
  client.on('guildCreate', async (guild) => {
    createGuild(guild)
  })

  client.on('guildUpdate', async (guild) => {
    updateGuild(guild)
  })

  client.on('guildDelete', async (guild) => {
    deleteGuild(guild.id)
  })
}
