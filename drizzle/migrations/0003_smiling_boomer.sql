ALTER TABLE "guide_sections" RENAME TO "document_sections";--> statement-breakpoint
ALTER TABLE "guides" RENAME TO "documents";--> statement-breakpoint
ALTER TABLE "document_sections" RENAME COLUMN "guide_id" TO "document_id";--> statement-breakpoint
ALTER TABLE "documents" RENAME COLUMN "title" TO "name";--> statement-breakpoint
ALTER TABLE "document_sections" DROP CONSTRAINT "guide_sections_guide_id_guides_id_fk";
--> statement-breakpoint
ALTER TABLE "document_sections" ADD COLUMN "content" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "document_sections" ADD CONSTRAINT "document_sections_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN IF EXISTS "description";