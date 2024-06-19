ALTER TABLE "patients" ADD COLUMN "food_preferences" json DEFAULT '[]'::json NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "food_allergies" json DEFAULT '[]'::json NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "health_conditions" json DEFAULT '[]'::json NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "fitness_goal" text;