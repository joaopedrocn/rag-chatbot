import { DocumentCreator } from "./components/document-creator";
import { getDocuments } from "./data";
import { DocumentCard } from "./components/document-card";

export default async function Settings() {
  const documents = await getDocuments();

  return (
    <div className="h-full bg-zinc-50">
      <div className="mx-auto max-w-7xl p-6 lg:p-10">
        <h2 className="text-lg font-medium text-zinc-900">Documents</h2>

        <div className="mt-4 flex flex-col gap-y-4">
          {documents.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>

        <div className="mt-8">
          <DocumentCreator />
        </div>
      </div>
    </div>
  );
}
