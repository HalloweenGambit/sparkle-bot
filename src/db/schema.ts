import { relations } from "drizzle-orm";
import {
  serial,
  varchar,
  text,
  timestamp,
  pgTable,
  primaryKey,
  pgSchema,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const mySchema = pgSchema("my_schema");

// Servers Table (Guilds)
export const Servers = mySchema.table("servers", {
  serverId: serial("server_id").primaryKey(),
  discordId: varchar("discord_id", { length: 256 }).notNull().unique(),
  // guild name (2-100 characters, excluding trailing and leading whitespace)
  serverName: varchar("server_name", { length: 256 }).notNull(),
  serverDescription: varchar("server_name", { length: 256 }),
  serverOwnerId: varchar("server_owner_id", { length: 256 }).notNull(),
  verificationLevel: integer("verification_level").notNull(),
  serverNsfwLevel: integer("nsfw_level").notNull(),
  approxMemberCount: integer("approximate_member_count"),
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
