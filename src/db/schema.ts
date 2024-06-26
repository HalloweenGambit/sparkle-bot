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
  id: serial("server_id").primaryKey(),
  discordId: varchar("discord_id", { length: 256 }).notNull().unique(),
  guildName: varchar("server_name", { length: 256 }),
  guildDescription: varchar("server_description", { length: 256 }),
  guildOwnerId: varchar("server_owner_id", { length: 256 }),
  verificationLevel: integer("verification_level"),
  guildNsfwLevel: integer("nsfw_level"),
  approxMemberCount: integer("approximate_member_count"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Channels Table
export const Channels = pgTable("channels", {
  id: serial("channel_id").primaryKey(),
  discordId: serial("server_id")
    .references(() => Servers.id)
    .notNull(),
  channelName: varchar("channel_name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
