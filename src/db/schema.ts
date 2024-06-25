import { relations } from "drizzle-orm";
import {
  serial,
  varchar,
  timestamp,
  primaryKey,
  pgSchema,
  integer,
  pgTable,
} from "drizzle-orm/pg-core";
import { features } from "process";

// Servers Table (Guilds)
export const Servers = pgTable("servers", {
  serverId: serial("server_id").primaryKey(),
  discordId: varchar("discord_id", { length: 256 }).notNull().unique(),
  serverName: varchar("server_name", { length: 256 }).notNull(),
  serverDescription: varchar("server_description", { length: 256 }),
  serverOwnerId: varchar("server_owner_id", { length: 256 }),
  verificationLevel: integer("verification_level"),
  serverNsfwLevel: integer("nsfw_level"),
  approxMemberCount: integer("approximate_member_count"),
  createdAt: timestamp("created_at").defaultNow(),
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
