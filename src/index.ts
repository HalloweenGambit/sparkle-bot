import DotenvFlow from 'dotenv-flow'
import { loadEventListeners } from './bot/loaders/eventListenerLoader.js'
import { loadSlashCommands } from './bot/loaders/slashCommandLoader.js'
import discordClient from './config/discordConfig.js'

import { syncAllChannels } from './utils/channelUtils.js'
import { syncGuilds } from './bot/services/guildService.js'
import { registerCommands } from './utils/registerCommands.js'
import { syncAllConfigs } from './bot/services/configService.js'

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
      // TODO: create and register commands
      // await registerCommands(discordClient) // Register commands after login
      // await syncGuilds()
      // await syncAllChannels()
      await syncAllConfigs()
      console.log('you are the CaPiTaN now!')
    })
  } catch (error) {
    console.error('Error starting the bot:', error)
  }
}

await startBot()
