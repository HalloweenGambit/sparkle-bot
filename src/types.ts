import { Collection, Snowflake } from 'discord.js'
import { Servers, Channels } from './db/schema'
// types.ts
export type queryServers = typeof Servers.$inferSelect
export type queryChannel = typeof Channels.$inferSelect

// Format guild to a subset of the schema defining 'guild'
export type FormattedGuild = {
  discordId: string
  guildName: string | null
  guildDescription: string | null
  guildOwnerId: string | null
  verificationLevel: number | null
  guildNsfwLevel: number | null
  approxMemberCount: number | null
  discordCreatedAt: Date | null
}

export type FormattedChannel = {
  discordId: string
  guildId: string
  channelName: string
  channelType: number
  messageCount: number | null
  totalMessageCount: number | null
  userLimit: number | null
  userRateLimit: number | null
  nsfw: boolean | null
  permissions: string | null
  flags: number | null
  discordCreatedAt: Date | null
}

export type FormattedPinnedMessage = {
  discordId: string
  channelId: string
  guildId: string
  authorId: string
  content: string
  attachments: Array<{
    url: string
    proxyUrl: string
    filename: string
    size: number
    contentType: string | null
    // createdAt: Date
  }>
  embeds: Embed[]
  pinnedAt: Date
  stickers: Sticker
  discordCreatedAt: Date
}

// Define the Embed type based on Discord embed structure
type Embed = {
  title?: string
  description?: string
  url?: string
  timestamp?: Date
  color?: number
  footer?: {
    text: string
    iconUrl?: string
  }
  image?: {
    url: string
  }
  thumbnail?: {
    url: string
  }
  author?: {
    name: string
    url?: string
    iconUrl?: string
  }
  fields?: Array<{
    name: string
    value: string
    inline?: boolean
  }>
}

// Define the Sticker type based on Discord sticker structure
type Sticker = {
  id: Snowflake
  name: string
  description: string
  formatType: number
}
