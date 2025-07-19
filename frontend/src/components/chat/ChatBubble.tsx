interface Props {
  sender: "user" | "ai";
  text: string;
}

export default function ChatBubble({ sender, text }: Props) {
  const isUser = sender === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`px-4 py-2 rounded-xl max-w-[75%] text-sm
        ${isUser ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-100"}`}>
        {text}
      </div>
    </div>
  );
}
