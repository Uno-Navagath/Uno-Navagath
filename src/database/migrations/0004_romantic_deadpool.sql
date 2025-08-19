ALTER TABLE "games" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "status" SET DEFAULT 'active'::text;--> statement-breakpoint
DROP TYPE "public"."game_status";--> statement-breakpoint
CREATE TYPE "public"."game_status" AS ENUM('active', 'finished');--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "status" SET DEFAULT 'active'::"public"."game_status";--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "status" SET DATA TYPE "public"."game_status" USING "status"::"public"."game_status";