import { db } from "@/database";

export const getDocuments = () => {
  return db.query.documents.findMany({
    with: { sections: { columns: { id: true, content: true } } },
  });
};

export type Document = Awaited<ReturnType<typeof getDocuments>>[number];
