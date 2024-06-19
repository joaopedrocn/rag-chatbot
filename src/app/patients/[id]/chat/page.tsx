import { Chat } from "./components/chat";
import { getPatient } from "./data";
import { notFound } from "next/navigation";

type PageProps = { params: { id: string } };

const ChatPage = async ({ params }: PageProps) => {
  const patient = await getPatient(params.id);

  if (!patient) notFound();

  return <Chat patient={patient} />;
};

export default ChatPage;
