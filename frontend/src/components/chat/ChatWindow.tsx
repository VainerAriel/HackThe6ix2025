import { useState } from "react";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import ScenarioCard from "./ScenarioCard";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: "Hey, let's talk about your Q2 performance review." }
  ]);

  const handleSend = (message: string) => {
    setMessages(prev => [...prev, { sender: "user", text: message }]);
    
    // TODO: Send to Gemini backend + get AI reply
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: "ai", text: "Interesting. What specifically do you want to improve?" }
      ]);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <ScenarioCard />
      <div className="bg-gray-800 rounded-lg p-4 max-h-[60vh] overflow-y-auto space-y-2">
        {messages.map((msg, i) => (
          <ChatBubble key={i} sender={msg.sender} text={msg.text} />
        ))}
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
}
