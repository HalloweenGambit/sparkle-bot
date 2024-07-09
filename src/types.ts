import { Collection, Snowflake } from 'discord.js'
import { Servers, Channels, Messages } from './db/schema'
// types.ts
export type queryServers = typeof Servers.$inferSelect
export type queryChannel = typeof Channels.$inferSelect
export type queryMessage = typeof Messages.$inferSelect

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

export type FormattedMessage = {
  discordId: string
  channelId: string
  guildId: string
  authorId: string
  content: string
  lemmas: string[]
  tokens: string[]
  isPinned: boolean
  // pinnedAt: Date | null
  discordCreatedAt: Date | null
}

export type FormattedMessageEmbedding = {
  discordId: Snowflake
  tokens: string[]
  lemmas: string[]
  embedding: number[]
}

export type FormattedQuestion = {
  userId: Snowflake
  discordId: Snowflake
  originalText: string
  lemmas: string[]
  tokens: string[]
  discordCreatedAt: Date
}

export type FormattedEmbedding = {
  messageId: Snowflake
  embedding: number[]
}

export type FormattedAttachement = {}

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
