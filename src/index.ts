import DotenvFlow from 'dotenv-flow'
import { loadEventListeners } from './bot/loaders/eventListenerLoader'
import { loadSlashCommands } from './bot/loaders/slashCommandLoader'
import discordClient from './config/discordConfig'

import { syncAllChannels } from './utils/channelUtils'
import { syncGuilds } from './bot/services/guildService'
import { registerCommands } from './utils/registerCommands'

DotenvFlow.config()

const startBot = async () => {
  try {
    await loadEventListeners(discordClient)
    await loadSlashCommands(discordClient)

    await discordClient.login(process.env.DISCORD_TOKEN) // Log in to Discord

    discordClient.once('ready', async () => {
      if (discordClient.user) {
        console.log(`Logged in as ${discordClient.user.tag}`)
      } else {
        console.log('Discord client user is not available.')
      }
      // await registerCommands(discordClient) // Register commands after login
      // await syncGuilds()
      // await syncAllChannels()
      console.log('you are the CaPiTaN now!')
    })
  } catch (error) {
    console.error('Error starting the bot:', error)
  }
}

await startBot()
