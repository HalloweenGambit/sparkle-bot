// tests/initialize.test.ts

import { describe, it, expect, beforeEach, beforeAll } from 'vitest'
import { loadCompleteGuilds, loadGuilds, formatGuilds } from '../utils/utils'
import { syncGuilds } from '../utils/utils'
import DotenvFlow from 'dotenv-flow'
import {
  formatGuildChannels,
  loadGuildChannels,
  syncAllChannels,
  createChannel,
} from '../utils/channel'

DotenvFlow.config()
beforeAll(() => {})
describe.skip('test channels sync', async () => {
  it.skip('load guilds', async () => {
    const allGuilds = await loadCompleteGuilds()
    const formattedGuilds = await formatGuilds(allGuilds)
    await syncGuilds(formattedGuilds)
  })

  it('load', async () => {
    const guilds = await loadCompleteGuilds()
    const testGuild = guilds[0]
    const guildChannels = await loadGuildChannels(testGuild)
    const formattedChannels = await formatGuildChannels(guildChannels)
    await syncAllChannels()
  })

  it('format all channels', async () => {})
  it('checks all guilds against database', async () => {})
  it.todo('format guild', async () => {})
  it.todo('format guild', async () => {})
})
