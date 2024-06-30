import { relations } from 'drizzle-orm'
import { serial, varchar, timestamp } from 'drizzle-orm/pg-core'
import { integer, pgTable, boolean } from 'drizzle-orm/pg-core'
import { features } from 'process'

// Servers Table (Guilds)
export const Servers = pgTable('servers', {
  id: serial('server_id').primaryKey(),
  discordId: varchar('discord_id', { length: 256 }).notNull().unique(),
  guildName: varchar('server_name', { length: 256 }),
  guildDescription: varchar('server_description', { length: 256 }),
  guildOwnerId: varchar('server_owner_id', { length: 256 }),
  verificationLevel: integer('verification_level'),
  guildNsfwLevel: integer('nsfw_level'),
  approxMemberCount: integer('approximate_member_count'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const Channels = pgTable('channels', {
  id: serial('channel_id').primaryKey(),
  discordId: varchar('discord_id', { length: 20 }).notNull(),
  guildId: varchar('guild_id', { length: 20 }).notNull(),
  channelName: varchar('channel_name', { length: 256 }).notNull(),
  channelType: integer('channel_type').notNull(),
  messageCount: integer('message_count'),
  totalMessageCount: integer('total_message_count'),
  userLimit: integer('user_limit'),
  userRateLimit: integer('user_rate_limit'),
  nsfw: boolean('nsfw'),
  permissions: varchar('permissions', { length: 256 }),
  flags: integer('flags'),
  createdAt: timestamp('created_at').defaultNow(),
})
