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

// UserServers Table (Join Table)
export const UserServers = pgTable(
  "user_servers",
  {
    userId: serial("user_id")
      .references(() => Users.userId)
      .notNull(),
    serverId: serial("server_id")
      .references(() => Servers.serverId)
      .notNull(),
    addedAt: timestamp("added_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey(table.userId, table.serverId),
  })
);

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

// Server Settings Table
export const ServerSettings = pgTable("server_settings", {
  settingId: serial("setting_id").primaryKey(),
  serverId: serial("server_id")
    .references(() => Servers.serverId)
    .notNull(),
  settingName: varchar("setting_name", { length: 256 }).notNull(),
  settingValue: text("setting_value").notNull(),
});

// Prompts Table
export const Prompts = pgTable("prompts", {
  promptId: serial("prompt_id").primaryKey(),
  serverId: serial("server_id")
    .references(() => Servers.serverId)
    .notNull(),
  promptText: text("prompt_text").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Interactions Table
export const Interactions = pgTable("interactions", {
  interactionId: serial("interaction_id").primaryKey(),
  userId: serial("user_id")
    .references(() => Users.userId)
    .notNull(),
  serverId: serial("server_id")
    .references(() => Servers.serverId)
    .notNull(),
  interactionType: varchar("interaction_type", { length: 256 }).notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Commands Table
export const Commands = pgTable("commands", {
  usageId: serial("usage_id").primaryKey(),
  commandName: varchar("command_name", { length: 256 }).notNull(),
  userId: serial("user_id")
    .references(() => Users.userId)
    .notNull(),
  serverId: serial("server_id")
    .references(() => Servers.serverId)
    .notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Roles Table
export const Roles = pgTable("roles", {
  roleId: serial("role_id").primaryKey(),
  serverId: serial("server_id")
    .references(() => Servers.serverId)
    .notNull(),
  roleName: varchar("role_name", { length: 256 }).notNull(),
  assignedBy: varchar("assigned_by", { length: 256 }).notNull(),
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
});

// Banned Users Table
export const BannedUsers = pgTable("banned_users", {
  banId: serial("ban_id").primaryKey(),
  userId: serial("user_id")
    .references(() => Users.userId)
    .notNull(),
  serverId: serial("server_id")
    .references(() => Servers.serverId)
    .notNull(),
  reason: text("reason").notNull(),
  bannedAt: timestamp("banned_at").defaultNow().notNull(),
});

// Audit Log Table
export const AuditLog = pgTable("audit_log", {
  logId: serial("log_id").primaryKey(),
  action: text("action").notNull(),
  performedBy: serial("performed_by")
    .references(() => Users.userId)
    .notNull(),
  serverId: serial("server_id")
    .references(() => Servers.serverId)
    .notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});
