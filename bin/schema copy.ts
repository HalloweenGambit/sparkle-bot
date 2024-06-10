import { relations } from "drizzle-orm";
import {
  serial,
  varchar,
  text,
  timestamp,
  pgTable,
  primaryKey,
} from "drizzle-orm/pg-core";

// Users Table
export const Users = pgTable("users", {
  userId: serial("user_id").primaryKey(),
  discordId: varchar("discord_id", { length: 256 }).notNull().unique(),
  username: varchar("username", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  token: text("token").notNull(), // Store the OAuth2 token
});

// Servers Table (Guilds)
export const Servers = pgTable("servers", {
  serverId: serial("server_id").primaryKey(),
  discordId: varchar("discord_id", { length: 256 }).notNull().unique(), // Discord Guild ID
  serverName: varchar("server_name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Channels Table
export const Channels = pgTable("channels", {
  channelId: serial("channel_id").primaryKey(),
  serverId: serial("server_id")
    .references(() => Servers.serverId)
    .notNull(),
  channelName: varchar("channel_name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Questions Table
export const Questions = pgTable("questions", {
  questionId: serial("question_id").primaryKey(),
  serverId: serial("server_id")
    .references(() => Servers.serverId)
    .notNull(),
  channelId: serial("channel_id")
    .references(() => Channels.channelId)
    .notNull(),
  userId: serial("user_id")
    .references(() => Users.userId)
    .notNull(),
  questionText: text("question_text").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// QA Table (for storing question and answer pairs)
export const QA = pgTable("qa", {
  qaId: serial("qa_id").primaryKey(),
  questionText: text("question_text").notNull(),
  answerText: text("answer_text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relationships
export const UserRelations = relations(Users, ({ many }) => ({
  questions: many(Questions),
}));

export const ServerRelations = relations(Servers, ({ many }) => ({
  channels: many(Channels),
  questions: many(Questions),
}));

export const ChannelRelations = relations(Channels, ({ one, many }) => ({
  server: one(Servers, {
    fields: [Channels.serverId],
    references: [Servers.serverId],
  }),
  questions: many(Questions),
}));

export const QuestionRelations = relations(Questions, ({ one }) => ({
  user: one(Users, { fields: [Questions.userId], references: [Users.userId] }),
  server: one(Servers, {
    fields: [Questions.serverId],
    references: [Servers.serverId],
  }),
  channel: one(Channels, {
    fields: [Questions.channelId],
    references: [Channels.channelId],
  }),
}));
