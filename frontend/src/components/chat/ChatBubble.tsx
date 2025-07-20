interface Props {
  sender: "user" | "ai";
  text: string;
}

export default function ChatBubble({ sender, text }: Props) {
  const isUser = sender === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`px-4 py-2 rounded-xl max-w-[75%] text-sm
        ${isUser ? "bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white" : "bg-[#f3f4f6] text-[#374151]"}`}>
        {text}
      </div>
    </div>
  );
}
