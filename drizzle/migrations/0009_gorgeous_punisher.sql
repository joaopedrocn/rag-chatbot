ALTER TABLE "patients" RENAME COLUMN "food_preferences" TO "liked_foods";--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "disliked_foods" json DEFAULT '[]'::json NOT NULL;