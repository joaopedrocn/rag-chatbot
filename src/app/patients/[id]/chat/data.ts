import { db } from "@/database";
import { patients } from "@/database/schema";
import { eq } from "drizzle-orm";

export const getPatient = (patientId: string) => {
  return db.query.patients.findFirst({
    where: eq(patients.id, patientId),
  });
};

export type Patient = NonNullable<Awaited<ReturnType<typeof getPatient>>>;
