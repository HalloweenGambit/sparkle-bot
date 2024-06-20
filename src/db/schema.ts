import { relations } from "drizzle-orm";
import {
  serial,
  varchar,
  text,
  timestamp,
  pgTable,
  primaryKey,
  pgSchema,
} from "drizzle-orm/pg-core";

export const mySchema = pgSchema("my_schema");

// Servers Table (Guilds)
export const Servers = mySchema.table("servers", {
  serverId: serial("server_id").primaryKey(),
  discordId: varchar("discord_id", { length: 256 }).notNull().unique(), // Discord Guild ID
  serverName: varchar("server_name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Channels Table
export const Channels = mySchema.table("channels", {
  channelId: serial("channel_id").primaryKey(),
  serverId: serial("server_id")
    .references(() => Servers.serverId)
    .notNull(),
  channelName: varchar("channel_name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Questions Table
export const Questions = mySchema.table("questions", {
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
