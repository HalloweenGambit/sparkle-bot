import { describe, it, expect, assert } from 'vitest'
import DotenvFlow from 'dotenv-flow'
import discordClient from '../config/discordConfig'
import dbClient from '../config/dbConfig'
import { loadAllChannelMessages, loadMessage } from '../utils/messages'

DotenvFlow.config()

describe('initialize', async () => {
  await dbClient
  await discordClient.login(process.env.DISCORD_TOKEN)
  discordClient.once('ready', () => {
    console.log('test discordClient logged in')
  })
  const guildId = '1008463449594007692'
  const textBasedChannelId = '1248375761900015649'

  it('gets a all channel messages', async () => {
    const messages = await loadAllChannelMessages(guildId, textBasedChannelId)
    // console.log(messages?.last())
    expect(messages?.size).toBeGreaterThan(0)
  })

  it('gets a specific message', async () => {
    const message = await loadMessage(
      '1008463449594007692',
      '1248375761900015649',
      '1258213077137231962'
    )
    console.log(message)
    expect(message?.id).toBe('1258213077137231962')
  })
  it.todo('format message', async () => {
    const message = await loadMessage(
      '1008463449594007692',
      '1248375761900015649',
      '1258213077137231962'
    )
  })
  it.todo('save message')
  it.todo('update message')
  it.todo('delete message')
  it.todo('format embed')
  it.todo('save embed')
  it.todo('delete embed')
  it.todo('')
})
