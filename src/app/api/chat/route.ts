import { Patient } from "@/app/patients/[id]/chat/data";
import { db } from "@/database";
import { documentSections, patients } from "@/database/schema";
import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, embed, streamText, tool } from "ai";
import { cosineDistance, desc, eq, gt, sql } from "drizzle-orm";
import { z } from "zod";

export const maxDuration = 30;

const generateEmbedding = async (input: string) => {
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-large", { dimensions: 1536 }),
    value: input,
  });
  return embedding;
};

const getSimilarDocumentSections = async (embedding: number[]) => {
  const similarity = sql<number>`1 - (${cosineDistance(documentSections.embedding, embedding)})`;

  const similarDocumentSections = await db
    .select({ content: documentSections.content, similarity })
    .from(documentSections)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(4);

  return similarDocumentSections;
};

export const POST = async (req: Request) => {
  try {
    const data = await req.json();

    const messages = convertToCoreMessages(data.messages);
    const patient = data.patient as Patient;

    const lastMessage = messages[messages.length - 1];

    let context: string | undefined = undefined;

    if (lastMessage.role === "user") {
      const embedding = await generateEmbedding(lastMessage.content as string);

      const similarDocumentSections =
        await getSimilarDocumentSections(embedding);

      context = similarDocumentSections.map((s) => s.content).join("\n\n");
    }

    const instructions = [
      "You are a nutrition assistant chatbot. Use the following patient information to provide personalized nutrition advice. Do not provide medical advice or diagnose conditions. If the patient asks for advice related to a health condition, refer them to a healthcare professional. Do not answer questions not related to nutrition.",
      `The patient is a ${patient.age} years old ${patient.gender}. Their name is ${patient.name}.`,
      patient.fitnessGoal
        ? `Their primary fitness goal is to ${patient.fitnessGoal}.`
        : "",
      patient.healthConditions.length > 0
        ? `They have the following health conditions: ${patient.healthConditions.join(", ")}.`
        : "",
      patient.likedFoods.length > 0
        ? `They like the following foods: ${patient.likedFoods.join(", ")}.`
        : "",
      patient.dislikedFoods.length > 0
        ? `They dislike the following foods: ${patient.dislikedFoods.join(", ")}.`
        : "",
      patient.foodAllergies.length > 0
        ? `They are allergic to the following foods: ${patient.foodAllergies.join(", ")}.`
        : "",
      context
        ? `The following information may be helpful in providing the best advice:\n\n${context}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    const result = await streamText({
      model: openai("gpt-4o"),
      system: instructions,
      messages,
      temperature: 0,
      tools: {
        bookAppointment: tool({
          description: `Book an appointment for the patient. If the patient doesn't provide a date and time, ask for it instead of making assumptions. Today is ${new Date().toDateString()}.`,
          parameters: z.object({
            date: z
              .string()
              .describe("The date of the appointment in the YYYY-MM-DD format"),
            time: z
              .string()
              .describe(
                "The time of the appointment in the HH:MM 24-hour format",
              ),
          }),
          execute: async ({ date, time }) => {
            await new Promise((resolve) => setTimeout(resolve, 3000));
            return { date, time };
          },
        }),
      },
    });

    return result.toAIStreamResponse();
  } catch (error) {
    return new Response(null, { status: 500 });
  }
};
