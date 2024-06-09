// database schema
// servers > has all the different servers that are using the bot, their configuration files
// users > people that ask questions
// question qeue
// Q&A repository

import { relations } from "drizzle-orm";
import { serial, text, timestamp, integer, pgTable } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  discordName: text("discord_name").notNull(),
  email: text("email").notNull(),
});
