import { useState } from "react";

export default function ChatInput({ onSend }: { onSend: (msg: string) => void }) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div className="flex items-center gap-2 bg-gray-800 p-3 rounded-lg">
      <input
        type="text"
        placeholder="Type your response..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        className="flex-1 bg-transparent text-white outline-none"
      />
      <button onClick={handleSubmit} className="px-4 py-1 bg-yellow-500 text-black rounded-md hover:bg-yellow-400 transition">
        Send
      </button>
    </div>
  );
}
