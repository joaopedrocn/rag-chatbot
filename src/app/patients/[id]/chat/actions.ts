"use server";

import { db } from "@/database";
import { patients } from "@/database/schema";
import { updatePatientSchema } from "@/schemas";
import { FormSubmissionResult } from "@/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type UpdatePatientSchema = z.infer<typeof updatePatientSchema>;

export const updatePatient = async (
  input: unknown,
): Promise<FormSubmissionResult<UpdatePatientSchema>> => {
  const result = updatePatientSchema.safeParse(input);

  if (!result.success) {
    const { formErrors, fieldErrors } = result.error.flatten();
    return {
      success: false,
      errors: { root: formErrors, ...fieldErrors },
    };
  }

  const data = result.data;

  try {
    await db
      .update(patients)
      .set({
        ...data,
        likedFoods: data.likedFoods?.split(",").filter(Boolean) ?? [],
        dislikedFoods: data.dislikedFoods?.split(",").filter(Boolean) ?? [],
        foodAllergies: data.foodAllergies?.split(",").filter(Boolean) ?? [],
        healthConditions:
          data.healthConditions?.split(",").filter(Boolean) ?? [],
      })
      .where(eq(patients.id, data.id));
  } catch (error) {
    console.error("Database error:", error);

    return {
      success: false,
      errors: { root: ["Something went wrong, please try again"] },
    };
  }

  revalidatePath(`/patients/${data.id}/chat`);

  return { success: true };
};
