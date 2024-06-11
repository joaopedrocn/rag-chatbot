import { createId } from "@paralleldrive/cuid2";
import { index, pgTable, text, vector } from "drizzle-orm/pg-core";

export const guides = pgTable(
  "guides",
  {
    id: text("id").primaryKey().$defaultFn(createId),
    title: text("title").notNull(),
    description: text("description").notNull(),
    url: text("url").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }),
  },
  (table) => ({
    embeddingIndex: index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  }),
);
