import { cn } from "@/utils/classnames";

type MessageProps = {
  content: string;
  align: "left" | "right";
};

export const Message = ({ content, align }: MessageProps) => {
  return (
    <div
      className={cn(
        "max-w-[70%] whitespace-pre-wrap rounded-3xl px-5 py-2.5",
        align === "left"
          ? "self-start bg-zinc-200 text-zinc-900"
          : "self-end bg-blue-500 text-white",
      )}
    >
      {content}
    </div>
  );
};
