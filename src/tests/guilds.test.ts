// tests/initialize.test.ts

import { describe, it, expect, beforeEach, beforeAll } from 'vitest'
import {
  loadCompleteGuilds,
  loadGuilds,
  formatGuilds,
} from '../utils/guildUtils'
import { syncGuilds } from '../utils/guildUtils'
import DotenvFlow from 'dotenv-flow'

DotenvFlow.config()
//! enforce type checking with new variables
beforeAll(() => {})
describe.skip('Guild Crud application tests', async () => {
  it('load guilds', async () => {
    const guilds = await loadGuilds()
    expect(guilds.size).toBeGreaterThan(1)
    // const formattedNewGuild = formatGuild(newGuild);
    // createGuild(formattedNewGuild);
  })

  it('load guilds with full data', async () => {
    const completeGuilds = await loadCompleteGuilds()
    expect(completeGuilds[0].id).toBeTypeOf('string')
  })

  it('format all guilds', async () => {
    const completeGuilds = await loadCompleteGuilds()
    const formattedGuilds = await formatGuilds(completeGuilds)
    // my custom unique identifier using discords snowflake id system
    expect(formattedGuilds[0].discordId).toBeTruthy()
  })

  it.only('checks all guilds against database', async () => {
    // newFormattedGuilds oldGuild
    const completeGuilds = await loadCompleteGuilds()
    const newGuilds = await formatGuilds(completeGuilds)
    const synced = await syncGuilds(newGuilds)
    expect(synced).toBeTruthy()
  })

  it.todo('format guild', async () => {})
  it.todo('format guild', async () => {})
})
