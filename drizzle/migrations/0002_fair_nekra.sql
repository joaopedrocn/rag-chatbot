CREATE TABLE IF NOT EXISTS "guide_sections" (
	"id" text PRIMARY KEY NOT NULL,
	"guide_id" text NOT NULL,
	"embedding" vector(1536) NOT NULL
);
--> statement-breakpoint
DROP INDEX IF EXISTS "embeddingIndex";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "guide_sections" ADD CONSTRAINT "guide_sections_guide_id_guides_id_fk" FOREIGN KEY ("guide_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "embeddingIndex" ON "guide_sections" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
ALTER TABLE "guides" DROP COLUMN IF EXISTS "embedding";