CREATE TABLE IF NOT EXISTS "channels" (
	"channel_id" serial PRIMARY KEY NOT NULL,
	"server_id" serial NOT NULL,
	"channel_name" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "servers" (
	"server_id" serial PRIMARY KEY NOT NULL,
	"discord_id" varchar(256) NOT NULL,
	"server_name" varchar(256),
	"server_owner_id" varchar(256) NOT NULL,
	"verification_level" integer NOT NULL,
	"nsfw_level" integer NOT NULL,
	"approximate_member_count" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "servers_discord_id_unique" UNIQUE("discord_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "channels" ADD CONSTRAINT "channels_server_id_servers_server_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("server_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
