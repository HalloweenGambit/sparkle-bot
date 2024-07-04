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
	"created_at" timestamp DEFAULT now()
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
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "servers_discord_id_unique" UNIQUE("discord_id")
);
