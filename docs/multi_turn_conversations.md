# Multi-turn Conversation Handling and Context Retention

This document explains the implementation of multi-turn conversation handling and context retention in the HackThe6ix2025 application.

## Overview

The application now supports sophisticated multi-turn conversations with intelligent context management, automatic title generation, and efficient token usage optimization.

## Key Features

### 1. Context Window Management
- **Smart Context Selection**: Automatically selects the most relevant messages for AI processing
- **Token Limit Optimization**: Prevents exceeding API token limits while maintaining conversation coherence
- **Configurable Window Size**: Default 20 messages, adjustable per conversation

### 2. Conversation Persistence
- **MongoDB Storage**: All conversations are stored with full message history
- **User Isolation**: Each user's conversations are completely separated
- **Automatic Updates**: Conversation metadata is updated with each message

### 3. Automatic Title Generation
- **Content-Based Titles**: Generates meaningful titles from conversation content
- **Smart Triggering**: Updates titles when conversations have sufficient content
- **User-Friendly**: Makes it easy to identify and manage conversations

### 4. Enhanced AI Integration
- **System Prompts**: Consistent AI behavior with workplace communication coaching
- **Context-Aware Responses**: AI maintains awareness of conversation history
- **Structured Feedback**: Provides detailed, actionable feedback for user responses

## Architecture

### Backend Components

#### 1. Conversation Model (`backend/app/models/conversation.py`)
```python
class Conversation:
    def get_context_window(self, max_messages: int = 20) -> List[Message]
    def generate_title_from_content(self) -> str
    def update_title_if_needed(self)
    def get_message_count(self) -> int
```

**Key Methods:**
- `get_context_window()`: Returns optimized message subset for AI processing
- `generate_title_from_content()`: Creates meaningful titles from user messages
- `update_title_if_needed()`: Automatically updates titles when appropriate

#### 2. Enhanced Gemini Service (`backend/app/services/gemini_service.py`)
```python
class GeminiService:
    def generate_response_with_conversation(self, conversation, new_message, context_window_size)
    def generate_response(self, messages, conversation_id, context_window_size)
```

**Key Features:**
- Context window management
- System prompt integration
- Automatic message handling
- Error handling and recovery

#### 3. Database Service (`backend/app/services/database_service.py`)
```python
class DatabaseService:
    def create_conversation(self, conversation: Conversation) -> str
    def get_conversation(self, conversation_id: str) -> Optional[Conversation]
    def update_conversation(self, conversation_id: str, conversation: Conversation) -> bool
```

**Key Features:**
- Robust error handling
- ObjectId validation
- Efficient CRUD operations

### Frontend Components

#### 1. Chat Context (`frontend/src/context/ChatContext.js`)
```javascript
const ChatContext = createContext();

// State includes context window management
const initialState = {
    conversations: [],
    currentConversation: null,
    messages: [],
    contextWindowSize: 20,
    // ...
};
```

**Key Features:**
- Context window size management
- Automatic title updates
- Real-time conversation state
- Error handling

#### 2. Chat Service (`frontend/src/services/chatService.js`)
```javascript
class ChatService {
    async sendMessage(conversationId, message, contextWindowSize = 20)
    async updateConversationTitle(conversationId)
}
```

## API Endpoints

### Enhanced Chat Endpoints

#### 1. Send Message with Context Management
```http
POST /api/chat/conversations/{conversation_id}/messages
Content-Type: application/json
Authorization: Bearer <token>

{
    "message": "User message content",
    "context_window_size": 20
}
```

**Response:**
```json
{
    "success": true,
    "response": "AI generated response",
    "conversation_id": "conversation_id",
    "model": "gemini-2.0-flash-exp",
    "context_window_size": 20,
    "messages_processed": 15
}
```

#### 2. Update Conversation Title
```http
PUT /api/chat/conversations/{conversation_id}/title
Authorization: Bearer <token>
```

**Response:**
```json
{
    "success": true,
    "message": "Conversation title updated",
    "title": "Generated title from content"
}
```

## Context Window Algorithm

### How It Works

1. **Message Collection**: All messages are stored in chronological order
2. **Window Selection**: When processing, select the most relevant messages:
   - Keep the first message (system context)
   - Add recent messages up to the window limit
3. **Token Optimization**: Ensure the selected messages fit within API limits

### Example Context Window
```
Total Messages: 25
Context Window Size: 10

Selected Messages:
- Message 1 (System context)
- Message 16 (Recent user message)
- Message 17 (Recent assistant response)
- Message 18 (Recent user message)
- Message 19 (Recent assistant response)
- Message 20 (Recent user message)
- Message 21 (Recent assistant response)
- Message 22 (Recent user message)
- Message 23 (Recent assistant response)
- Message 24 (Recent user message)
- Message 25 (Most recent assistant response)
```

## Usage Examples

### 1. Basic Multi-turn Conversation
```javascript
// Frontend usage
const { sendMessage, currentConversation } = useChat();

// Send first message
await sendMessage("Hi, I need help with workplace communication");

// Send follow-up (maintains context)
await sendMessage("My boss is very direct. How should I approach her?");

// Send another follow-up (still maintains context)
await sendMessage("What if she says no to my request?");
```

### 2. Context Window Management
```javascript
// Adjust context window size
const { setContextWindowSize, sendMessage } = useChat();

// Use smaller context for focused conversations
setContextWindowSize(10);
await sendMessage("Let's focus on this specific issue");

// Use larger context for complex discussions
setContextWindowSize(30);
await sendMessage("This is a complex situation with many factors");
```

### 3. Automatic Title Generation
```javascript
// Titles are automatically generated after 4+ messages
const { updateConversationTitle } = useChat();

// Manually trigger title update
await updateConversationTitle(conversationId);
```

## Testing

### Run the Test Suite
```bash
cd backend
python test_multi_turn_conversation.py
```

### Test Coverage
- ✅ Conversation model features
- ✅ Context window management
- ✅ Multi-turn conversation handling
- ✅ Database persistence
- ✅ Title generation
- ✅ Error handling

## Configuration

### Environment Variables
```env
# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# MongoDB
MONGODB_URI=mongodb://localhost:27017/hackthe6ix

# Default context window size
DEFAULT_CONTEXT_WINDOW_SIZE=20
```

### Customization Options
- **Context Window Size**: Adjustable per conversation (5-50 messages)
- **Title Generation**: Customizable title generation logic
- **System Prompts**: Modifiable AI behavior and tone
- **Error Handling**: Configurable retry and fallback strategies

## Performance Considerations

### 1. Token Usage Optimization
- Context window management reduces token consumption
- Smart message selection maintains conversation quality
- Configurable limits prevent API quota exhaustion

### 2. Database Efficiency
- Indexed queries for fast conversation retrieval
- Efficient message storage and retrieval
- Automatic cleanup of old conversations (configurable)

### 3. Frontend Performance
- Real-time state updates
- Optimistic UI updates
- Efficient re-rendering with React Context

## Best Practices

### 1. Context Window Sizing
- **Short conversations**: 10-15 messages
- **Medium conversations**: 20-25 messages
- **Long conversations**: 30-40 messages
- **Complex discussions**: 40-50 messages

### 2. Title Generation
- Trigger after 4+ messages for meaningful titles
- Use first user message as base
- Truncate long titles appropriately

### 3. Error Handling
- Graceful degradation when services are unavailable
- Retry logic for transient failures
- User-friendly error messages

## Troubleshooting

### Common Issues

#### 1. Context Window Too Small
**Symptoms**: AI responses seem disconnected from conversation
**Solution**: Increase context window size

#### 2. Token Limit Exceeded
**Symptoms**: API errors about token limits
**Solution**: Reduce context window size or implement message summarization

#### 3. Title Not Updating
**Symptoms**: Conversations remain titled "New Conversation"
**Solution**: Check if conversation has sufficient messages (4+)

#### 4. Database Connection Issues
**Symptoms**: Conversations not saving or loading
**Solution**: Verify MongoDB connection and credentials

## Future Enhancements

### Planned Features
1. **Message Summarization**: Automatic summarization of old messages
2. **Conversation Threading**: Support for multiple conversation threads
3. **Advanced Context Management**: Semantic context selection
4. **Real-time Collaboration**: Multi-user conversation support
5. **Conversation Analytics**: Usage patterns and insights

### Technical Improvements
1. **Caching Layer**: Redis integration for faster access
2. **Message Compression**: Efficient storage of long conversations
3. **Streaming Responses**: Real-time AI response streaming
4. **Advanced Search**: Full-text search across conversations

## Conclusion

The multi-turn conversation handling system provides a robust foundation for intelligent workplace communication coaching. With context retention, automatic title generation, and efficient resource management, users can have meaningful, continuous conversations that help them improve their professional communication skills.

The implementation is scalable, maintainable, and ready for future enhancements while providing an excellent user experience today. 