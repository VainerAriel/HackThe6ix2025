import { useState } from "react";

export default function ChatInput({ onSend }: { onSend: (msg: string) => void }) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-[#e5e7eb] shadow-lg">
      <input
        type="text"
        placeholder="Type your response..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        className="flex-1 bg-transparent text-[#374151] outline-none placeholder-[#9ca3af]"
      />
      <button onClick={handleSubmit} className="px-4 py-1 bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white rounded-md hover:from-[#7c3aed] hover:to-[#9333ea] transition-all duration-200">
        Send
      </button>
    </div>
  );
}
