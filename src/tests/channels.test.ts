// tests/initialize.test.ts

import { describe, it, expect, beforeEach, beforeAll } from 'vitest'
import { loadGuild, loadGuilds } from '../utils/utils'
import DotenvFlow from 'dotenv-flow'
import { loadGuildChannels } from '../utils/channel'

DotenvFlow.config()

describe.skip('Channel Crud application tests', async () => {
  it('load channels', async () => {
    const allGuilds = await loadGuilds()
    const first = await allGuilds.first()
    const id = `${first?.id}`

    const guild = await loadGuild(id)
    const newchannels = await loadGuildChannels(guild)
    const textChannels = await newchannels.filter((channel) => {
      return channel?.type == 0
    })
    // console.log(newchannels);
    console.log(textChannels)
  })

  it('load guilds with full data', async () => {})

  it('format all guilds', async () => {})

  it('checks all guilds against database', async () => {})

  it.todo('format guild', async () => {})
  it.todo('format guild', async () => {})
})
