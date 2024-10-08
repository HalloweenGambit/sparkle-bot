import { sql } from 'drizzle-orm'
import {
  serial,
  varchar,
  timestamp,
  vector,
  index,
  jsonb,
} from 'drizzle-orm/pg-core'
import { integer, pgTable, boolean, text } from 'drizzle-orm/pg-core'

// Servers Table (Guilds)
export const Servers = pgTable('servers', {
  id: serial('server_id').primaryKey(),
  discordId: varchar('discord_id', { length: 256 }).notNull().unique(),
  guildName: varchar('guild_name', { length: 256 }),
  guildDescription: varchar('guild_description', { length: 256 }),
  guildOwnerId: varchar('guild_owner_id', { length: 256 }),
  verificationLevel: integer('verification_level'),
  guildNsfwLevel: integer('guild_nsfw_level'),
  approxMemberCount: integer('approx_member_count'),
  isActive: boolean('is_active').default(true),
  discordCreatedAt: timestamp('discord_created_at'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Channels Table
export const Channels = pgTable('channels', {
  id: serial('channel_id').primaryKey(),
  discordId: varchar('discord_id', { length: 256 }).notNull(),
  guildId: varchar('guild_id', { length: 256 }).notNull(),
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

// User Configuration Table
export const UserConfiguration = pgTable('guild_configuration', {
  id: serial('id').primaryKey(),
  guildId: varchar('guild_id', { length: 256 }).unique().notNull(),
  indexableMessageChannels: text('indexable_message_channels')
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  indexablePinnedChannels: text('indexable_pinned_channels')
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
})

// Messages Table
export const Messages = pgTable('messages', {
  id: serial('message_id').primaryKey(),
  discordId: varchar('discord_id', { length: 256 }).unique().notNull(),
  channelId: varchar('channel_id', { length: 256 }).notNull(),
  guildId: varchar('guild_id', { length: 256 }).notNull(),
  authorId: varchar('author_id', { length: 256 }).notNull(),
  content: text('content'),
  tokens: text('tokens').array(),
  lemmas: text('lemmas').array(),
  isPinned: boolean('is_pinned').notNull(),
  discordCreatedAt: timestamp('discord_created_at'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Message Embeds Table
export const MessageEmbeds = pgTable('message_embeds', {
  id: serial('message_embed_id').primaryKey(),
  messageId: varchar('message_id', { length: 256 })
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

// Message Attachments Table
export const MessageAttachments = pgTable('attachments', {
  id: serial('message_attachment_id').primaryKey(),
  discordId: varchar('discord_id', { length: 256 }).unique().notNull(),
  messageId: varchar('message_id', { length: 256 })
    .references(() => Messages.discordId)
    .notNull(),
  url: text('url').notNull(),
  proxyUrl: text('proxy_url'),
  filename: varchar('filename', { length: 256 }),
  size: integer('size'),
  contentType: varchar('content_type', { length: 128 }),
  discordCreatedAt: timestamp('discord_created_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// Message Embeddings Table
// !Move some columns to the Messages table
export const MessageEmbeddings = pgTable(
  'message_embeddings',
  {
    id: serial('embedding_id').primaryKey(),
    discordId: varchar('message_id', { length: 256 })
      .references(() => Messages.discordId)
      .notNull(),
    guildId: varchar('server_id', { length: 256 })
      .references(() => Servers.discordId)
      .notNull(),
    embedding: vector('embedding', { dimensions: 512 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    embeddingIndex: index('embeddingIndex').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops')
    ),
  })
)

// Attachment Embeddings Table
export const AttachmentEmbeddings = pgTable('attachment_embeddings', {
  id: serial('attachment_embedding_id').primaryKey(),
  attachmentId: varchar('attachment_id', { length: 256 })
    .references(() => MessageAttachments.discordId)
    .notNull(),
  embedding: vector('embedding', { dimensions: 512 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// Questions Table
export const Questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 256 }).notNull(),
  discordId: varchar('discord_id', { length: 256 }).unique().notNull(),
  originalText: text('original_text').notNull(),
  tokens: text('tokens').array().notNull(),
  lemmas: text('lemmas').array().notNull(),
  discordCreatedAt: timestamp('discord_created_at'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Question Embeddings Table
export const QuestionEmbeddings = pgTable('question_embeddings', {
  id: serial('id').primaryKey(),
  discordId: varchar('discord_id', { length: 256 })
    .references(() => Questions.discordId)
    .notNull(),
  embedding: vector('embedding', { dimensions: 512 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

import { customType } from 'drizzle-orm/pg-core'

// // Define a custom type for your JSONB column
// const customJsonb = <T>(name: string) =>
//   customType<{ data: T; driverData: string }>({
//     dataType() {
//       return 'jsonb'
//     },
//     toDriver(value: T): string {
//       return JSON.stringify(value)
//     },
//     fromDriver(value: string): T {
//       return JSON.parse(value)
//     },
//   })(name)

// Config Table
export const Configs = pgTable('configs', {
  id: serial('id').primaryKey(),
  discordId: varchar('discord_id', { length: 256 })
    .references(() => Servers.discordId)
    .notNull(),
  configData: jsonb('config_data').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const PotentialQuestions = pgTable('potential_questions', {
  id: serial('id').primaryKey(),
  // message that is related to the potential question
  messageId: varchar('message_id', { length: 256 })
    .references(() => Messages.discordId)
    .notNull(),
  serverId: varchar('server_id', { length: 256 })
    .references(() => Servers.discordId)
    .notNull(),
  question: text('question').notNull(),
  tokens: text('tokens').array().notNull(),
  lemmas: text('lemmas').array().notNull(),
  embedding: vector('embedding', { dimensions: 512 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})
