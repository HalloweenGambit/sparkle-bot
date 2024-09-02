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
  guildId: Snowflake
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

export type ServerConfig = {
  server_id: string
  server_name: string
  roles: {
    all_roles: {
      role_id: string
      role_name: string
      role_permissions: string
      isAdmin: boolean
    }[]
    permissions: {
      can_manage_messages: string[]
      can_ask_questions: string[]
    }
  }
  channels: {
    message_management: string[]
    question_listener: string[]
  }
  bot_feedback: {
    dm: boolean
    same_channel: boolean
    feedback_channel: string | null
    emoji: string
  }
}

export type ConfigCache = {
  [key: Snowflake]: ServerConfig
}

// Define the ConfigData interface as provided
export type ConfigData = {
  server_id: Snowflake
  server_name: string
  roles: {
    all_roles: Array<{
      role_id: Snowflake
      role_name: string
      role_permissions: string
      isAdmin: boolean
    }>
    permissions: {
      can_manage_messages: Array<string>
      can_ask_questions: Array<string>
    }
  }
  channels: {
    message_management: Array<string>
    question_listener: Array<string>
  }
  bot_feedback: {
    dm: boolean
    same_channel: boolean
    feedback_channel: Snowflake | null
    emoji: string
  }
  // gemini api key
  api_key: string
}
