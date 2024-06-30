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
}
