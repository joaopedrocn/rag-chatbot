import { z } from "zod";

export const createDocumentSchema = z.object({
  name: z.string().min(1),
  url: z.string().url().nullable(),
  content: z.string().min(1),
});

export const updatePatientSchema = z.object({
  id: z.string().trim(),
  name: z.string().trim().min(1),
  age: z.number().int().nonnegative(),
  gender: z.enum(["male", "female"]),
  fitnessGoal: z.string().trim().nullable(),
  dislikedFoods: z.string().trim().nullable(),
  likedFoods: z.string().trim().nullable(),
  foodAllergies: z.string().trim().nullable(),
  healthConditions: z.string().trim().nullable(),
});
