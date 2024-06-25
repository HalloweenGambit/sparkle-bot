ALTER TABLE "servers" ALTER COLUMN "server_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "servers" ADD COLUMN "server_description" varchar(256);