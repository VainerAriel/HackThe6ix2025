// Utility function to format API responses
const formatResponse = (text: string) => {
  if (!text) return '';
  
  // Split by common section markers
  const sections = text.split(/(?=\d+\.|Overall Critique:|Score|Two Strengths:|Two Suggestions for Improvement:|Revised, More Effective Version:)/);
  
  return sections.map((section, index) => {
    const trimmedSection = section.trim();
    if (!trimmedSection) return null;
    
    // Check if this is a numbered section or heading
    const isHeading = /^\d+\.|Overall Critique:|Score|Two Strengths:|Two Suggestions for Improvement:|Revised, More Effective Version:/.test(trimmedSection);
    
    if (isHeading) {
      // Extract the heading and content
      const lines = trimmedSection.split('\n');
      const heading = lines[0];
      const content = lines.slice(1).join('\n').trim();
      
      return (
        <div key={index} className="mb-4">
          <h3 className="font-bold text-[#8b5cf6] text-lg mb-2">{heading}</h3>
          {content && (
            <div className="text-[#374151] whitespace-pre-line">
              {formatContent(content)}
            </div>
          )}
        </div>
      );
    } else {
      // Regular content
      return (
        <div key={index} className="text-[#374151] whitespace-pre-line mb-2">
          {formatContent(trimmedSection)}
        </div>
      );
    }
  }).filter(Boolean);
};

// Helper function to format content with bullet points and emphasis
const formatContent = (content: string) => {
  if (!content) return '';
  
  // Split by bullet points or numbered lists
  const lines = content.split('\n');
  
  return lines.map((line, index) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return <br key={index} />;
    
    // Check for bullet points
    if (trimmedLine.startsWith('- ')) {
      return (
        <div key={index} className="ml-4 mb-1">
          <span className="text-[#8b5cf6]">•</span> {trimmedLine.substring(2)}
        </div>
      );
    }
    
    // Check for numbered lists
    if (/^\d+\./.test(trimmedLine)) {
      return (
        <div key={index} className="ml-4 mb-1">
          <span className="font-semibold text-[#8b5cf6]">{trimmedLine}</span>
        </div>
      );
    }
    
    // Check for score pattern (e.g., "8/10 - explanation")
    if (/^\d+\/10/.test(trimmedLine)) {
      const parts = trimmedLine.split(' - ');
      if (parts.length === 2) {
        return (
          <div key={index} className="mb-2">
            <span className="font-bold text-[#8b5cf6] text-lg">{parts[0]}</span>
            <span className="text-[#374151]"> - {parts[1]}</span>
          </div>
        );
      }
    }
    
    // Regular text
    return <div key={index} className="mb-1">{trimmedLine}</div>;
  });
};

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
        {isUser ? text : formatResponse(text)}
      </div>
    </div>
  );
}
