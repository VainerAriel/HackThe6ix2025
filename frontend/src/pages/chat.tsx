import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#374151] flex flex-col">
      {/* Header with Logo */}
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] bg-clip-text text-transparent">
          PitchPerfect
        </h1>
      </div>

      {/* Chat Content */}
      <div className="flex-1 p-4">
        <ChatWindow />
      </div>
    </div>
  );
}
