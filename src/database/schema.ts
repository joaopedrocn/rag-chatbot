import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { index, integer, json, pgTable, text, vector } from "drizzle-orm/pg-core";

// Patients

export const patients = pgTable("patients", {
  id: text("id").primaryKey().$defaultFn(createId),
  name: text("name").notNull(),
  gender: text("gender").$type<"male" | "female">().notNull(),
  age: integer("age").notNull(),
  likedFoods: json("liked_foods").$type<string[]>().notNull().default([]),
  dislikedFoods: json("disliked_foods").$type<string[]>().notNull().default([]),
  foodAllergies: json("food_allergies").$type<string[]>().notNull().default([]),
  healthConditions: json("health_conditions").$type<string[]>().notNull().default([]),
  fitnessGoal: text("fitness_goal"),
});

// Documents

export const documents = pgTable("documents", {
  id: text("id").primaryKey().$defaultFn(createId),
  name: text("name").notNull(),
  url: text("url"),
});

export const documentsRelations = relations(documents, ({ many }) => ({
  sections: many(documentSections),
}));

// Document sections

export const documentSections = pgTable(
  "document_sections",
  {
    id: text("id").primaryKey().$defaultFn(createId),
    documentId: text("document_id").references(() => documents.id, { onDelete: "cascade" }).notNull(),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
  },
  (t) => ({
    embeddingIndex: index("embeddingIndex").using("hnsw", t.embedding.op("vector_cosine_ops")),
  }),
);

export const documentSectionsRelations = relations(documentSections, ({ one }) => ({
  document: one(documents, { fields: [documentSections.documentId], references: [documents.id] }),
}));
