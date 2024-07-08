import { sql } from 'drizzle-orm'
import { serial, varchar, timestamp, vector } from 'drizzle-orm/pg-core'
import { integer, pgTable, boolean, text } from 'drizzle-orm/pg-core'

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
  isActive: boolean('is_active').default(true),
  discordCreatedAt: timestamp('discord_created_at'),
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
  isActive: boolean('is_active').default(true),
  discordCreatedAt: timestamp('discord_created_at'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const UserConfiguration = pgTable('guild_configuration', {
  id: serial('id').primaryKey(),
  guildId: varchar('guild_id', { length: 20 }).unique().notNull(),
  indexableMessageChannels: text('indexable_message_channels')
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  indexablePinnedChannels: text('indexable_pinned_channels')
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
})

// Recorded Messages Table - currently will include pinned & sparkled msgs
// Knowledge Repository
export const Messages = pgTable('messages', {
  id: serial('message_id').primaryKey(),
  discordId: varchar('discord_id', { length: 20 }).unique().notNull(),
  channelId: varchar('channel_id', { length: 20 }).notNull(),
  guildId: varchar('guild_id', { length: 20 }).notNull(),
  authorId: varchar('author_id', { length: 256 }).notNull(),
  content: text('content'),
  isPinned: boolean('is_pinned').notNull(),
  discordCreatedAt: timestamp('discord_created_at'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Message Embeds Table (Discord Message Embeds)
export const MessageEmbeds = pgTable('message_embeds', {
  id: serial('message_embed_id').primaryKey(),
  messageId: varchar('message_id', { length: 20 })
    .references(() => Messages.discordId)
    .notNull(),
  title: text('title'),
  description: text('description'),
  url: text('url'),
  timestamp: timestamp('timestamp'),
  color: integer('color'),
  footerText: text('footer_text'),
  footerIconUrl: text('footer_icon_url'),
  imageUrl: text('image_url'),
  thumbnailUrl: text('thumbnail_url'),
  authorName: text('author_name'),
  authorUrl: text('author_url'),
  authorIconUrl: text('author_icon_url'),
  discordCreatedAt: timestamp('discord_created_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
})

// Attachments Table
export const MessageAttachments = pgTable('attachments', {
  id: serial('message_attachment_id').primaryKey(),
  discordId: varchar('discord_id', { length: 20 })
    .notNull()
    .references(() => Messages.discordId),
  url: text('url').notNull(),
  proxyUrl: text('proxy_url'),
  filename: varchar('filename', { length: 256 }),
  size: integer('size'),
  contentType: varchar('content_type', { length: 128 }),
  discordCreatedAt: timestamp('discord_created_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// Embeddings Table for Messages (for Semantic Search or Analysis)
export const MessageEmbeddings = pgTable('message_embeddings', {
  id: serial('embedding_id').primaryKey(),
  messageId: varchar('message_id', { length: 20 })
    .references(() => Messages.discordId)
    .notNull(),
  embedding: vector('embedding', { dimensions: 512 }).notNull(), // Assuming 512 dimensions for embeddings
  tokens: text('tokens').array().notNull(),
  lemmas: text('lemmas').array().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// Attachment Embeddings Table
export const AttachmentEmbeddings = pgTable('attachment_embeddings', {
  id: serial('attachment_embedding_id').primaryKey(),
  attachmentId: varchar('attachment_id', { length: 20 })
    .references(() => MessageAttachments.discordId)
    .notNull(),
  embedding: vector('embedding', { dimensions: 512 }).notNull(), // Assuming 512 dimensions for embeddings
  createdAt: timestamp('created_at').defaultNow(),
})

// Questions Table
export const Questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  messageId: varchar('message_id', { length: 20 })
    .references(() => Messages.discordId)
    .notNull(),

  tokens: text('tokens').array().notNull(),
  lemmas: text('lemmas').array().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// Questions embeddings
export const QuestionEmbedding = pgTable('question_embedding', {
  embedding: vector('embedding', { dimensions: 512 }).notNull(), // Assuming 512 dimensions for embeddings
})
