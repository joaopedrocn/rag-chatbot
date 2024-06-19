"use server";

import { db } from "@/database";
import { documentSections, documents } from "@/database/schema";
import { createDocumentSchema } from "@/schemas";
import { ActionResult } from "@/types";
import { openai } from "@ai-sdk/openai";
import { embedMany } from "ai";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createDocument = async (input: unknown): Promise<ActionResult> => {
  const result = createDocumentSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: { message: "Invalid input" },
    };
  }

  const data = result.data;

  try {
    const sections = data.content.split(/-{3,}/).map((s) => s.trim());

    const { embeddings } = await embedMany({
      model: openai.embedding("text-embedding-3-large", { dimensions: 1536 }),
      values: sections,
    });

    const sectionsWithEmbeddings = sections.map((textChunk, i) => ({
      content: textChunk,
      embedding: embeddings[i],
    }));

    await db.transaction(async (tx) => {
      const [document] = await tx
        .insert(documents)
        .values({ name: data.name, url: data.url })
        .returning({ id: documents.id });

      await tx.insert(documentSections).values(
        sectionsWithEmbeddings.map(({ content, embedding }) => ({
          documentId: document.id,
          content,
          embedding,
        })),
      );
    });
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: { message: "Something went wrong, try again" },
    };
  }

  revalidatePath("/settings");

  return { success: true };
};

export const deleteDocument = async (
  documentId: string,
): Promise<ActionResult> => {
  try {
    await db.delete(documents).where(eq(documents.id, documentId));
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: { message: "Something went wrong, try again" },
    };
  }

  revalidatePath("/settings");

  return { success: true };
};
