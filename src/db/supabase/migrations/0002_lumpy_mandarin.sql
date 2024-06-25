ALTER TABLE "servers" ALTER COLUMN "server_owner_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "servers" ALTER COLUMN "verification_level" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "servers" ALTER COLUMN "nsfw_level" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "servers" ALTER COLUMN "created_at" DROP NOT NULL;