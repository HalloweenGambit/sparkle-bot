CREATE TABLE IF NOT EXISTS "attachments" (
	"attachment_id" serial PRIMARY KEY NOT NULL,
	"discord_id" varchar(20) NOT NULL,
	"url" text NOT NULL,
	"proxy_url" text,
	"filename" varchar(256),
	"size" integer,
	"content_type" varchar(128),
	"discord_created_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "channels" (
	"channel_id" serial PRIMARY KEY NOT NULL,
	"discord_id" varchar(20) NOT NULL,
	"guild_id" varchar(20) NOT NULL,
	"channel_name" varchar(256) NOT NULL,
	"channel_type" integer NOT NULL,
	"message_count" integer,
	"total_message_count" integer,
	"user_limit" integer,
	"user_rate_limit" integer,
	"nsfw" boolean,
	"permissions" varchar(256),
	"flags" integer,
	"is_active" boolean DEFAULT true,
	"discord_created_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "embeds" (
	"embed_id" serial PRIMARY KEY NOT NULL,
	"discord_id" varchar(20) NOT NULL,
	"title" text,
	"description" text,
	"url" text,
	"timestamp" timestamp,
	"color" integer,
	"footer_text" text,
	"footer_icon_url" text,
	"image_url" text,
	"thumbnail_url" text,
	"author_name" text,
	"author_url" text,
	"author_icon_url" text,
	"discord_created_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"message_id" serial PRIMARY KEY NOT NULL,
	"discord_id" varchar(20) NOT NULL,
	"channel_id" varchar(20) NOT NULL,
	"guild_id" varchar(20) NOT NULL,
	"author_id" varchar(256) NOT NULL,
	"content" text,
	"is_pinned" boolean NOT NULL,
	"discord_created_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "messages_discord_id_unique" UNIQUE("discord_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "servers" (
	"server_id" serial PRIMARY KEY NOT NULL,
	"discord_id" varchar(256) NOT NULL,
	"server_name" varchar(256),
	"server_description" varchar(256),
	"server_owner_id" varchar(256),
	"verification_level" integer,
	"nsfw_level" integer,
	"approximate_member_count" integer,
	"is_active" boolean DEFAULT true,
	"discord_created_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "servers_discord_id_unique" UNIQUE("discord_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "guild_configuration" (
	"id" serial PRIMARY KEY NOT NULL,
	"guild_id" varchar(20) NOT NULL,
	"indexable_message_channels" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"indexable_pinned_channels" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	CONSTRAINT "guild_configuration_guild_id_unique" UNIQUE("guild_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attachments" ADD CONSTRAINT "attachments_discord_id_messages_discord_id_fk" FOREIGN KEY ("discord_id") REFERENCES "public"."messages"("discord_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "embeds" ADD CONSTRAINT "embeds_discord_id_messages_discord_id_fk" FOREIGN KEY ("discord_id") REFERENCES "public"."messages"("discord_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
