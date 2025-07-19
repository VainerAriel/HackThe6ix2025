from datetime import datetime
from typing import List, Dict, Any, Optional

# Try to import bson, but handle gracefully if not available
try:
    from bson import ObjectId
    BSON_AVAILABLE = True
except ImportError:
    BSON_AVAILABLE = False
    ObjectId = None

class Message:
    def __init__(self, content: str, role: str, timestamp: Optional[datetime] = None):
        self.content = content
        self.role = role  # 'user' or 'assistant'
        self.timestamp = timestamp or datetime.utcnow()
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'content': self.content,
            'role': self.role,
            'timestamp': self.timestamp
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Message':
        return cls(
            content=data['content'],
            role=data['role'],
            timestamp=data.get('timestamp', datetime.utcnow())
        )

class Conversation:
    def __init__(self, user_id: str, title: str = "New Conversation", conversation_id: Optional[str] = None):
        self.user_id = user_id
        self.title = title
        self.messages: List[Message] = []
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        self.conversation_id = conversation_id
    
    def add_message(self, content: str, role: str):
        """Add a message to the conversation and update timestamp"""
        message = Message(content, role)
        self.messages.append(message)
        self.updated_at = datetime.utcnow()
        return message
    
    def get_context_window(self, max_messages: int = 20) -> List[Message]:
        """
        Get a context window of recent messages for AI processing.
        This helps manage token limits and keeps conversations focused.
        
        Args:
            max_messages: Maximum number of messages to include in context
            
        Returns:
            List of recent messages within the context window
        """
        if len(self.messages) <= max_messages:
            return self.messages
        
        # Keep the first message (usually system/context) and recent messages
        context_messages = []
        if self.messages:
            context_messages.append(self.messages[0])  # Keep first message for context
        
        # Add recent messages
        recent_messages = self.messages[-(max_messages-1):] if len(context_messages) > 0 else self.messages[-max_messages:]
        context_messages.extend(recent_messages)
        
        return context_messages
    
    def generate_title_from_content(self) -> str:
        """
        Generate a conversation title based on the first few user messages.
        This helps users identify conversations later.
        """
        if not self.messages:
            return "New Conversation"
        
        # Get the first few user messages to generate a title
        user_messages = [msg.content for msg in self.messages if msg.role == 'user'][:3]
        if not user_messages:
            return "New Conversation"
        
        # Create a simple title from the first user message
        first_message = user_messages[0]
        if len(first_message) <= 50:
            return first_message
        else:
            return first_message[:47] + "..."
    
    def update_title_if_needed(self):
        """Update the conversation title if it's still the default"""
        if self.title == "New Conversation" and len(self.messages) >= 2:
            self.title = self.generate_title_from_content()
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert conversation to dictionary for database storage"""
        data = {
            'user_id': self.user_id,
            'title': self.title,
            'messages': [msg.to_dict() for msg in self.messages],
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
        
        # Include conversation_id if it exists and bson is available
        if self.conversation_id and BSON_AVAILABLE:
            data['_id'] = ObjectId(self.conversation_id)
        elif self.conversation_id:
            data['_id'] = self.conversation_id
        
        return data
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Conversation':
        """Create conversation from dictionary (from database)"""
        conversation_id = None
        if data.get('_id'):
            if BSON_AVAILABLE and isinstance(data['_id'], ObjectId):
                conversation_id = str(data['_id'])
            else:
                conversation_id = str(data['_id'])
        
        conv = cls(
            user_id=data['user_id'],
            title=data.get('title', 'New Conversation'),
            conversation_id=conversation_id
        )
        
        conv.messages = [Message.from_dict(msg) for msg in data.get('messages', [])]
        conv.created_at = data.get('created_at', datetime.utcnow())
        conv.updated_at = data.get('updated_at', datetime.utcnow())
        
        return conv
    
    def get_message_count(self) -> int:
        """Get the total number of messages in the conversation"""
        return len(self.messages)
    
    def get_last_message(self) -> Optional[Message]:
        """Get the last message in the conversation"""
        return self.messages[-1] if self.messages else None
    
    def is_empty(self) -> bool:
        """Check if the conversation has no messages"""
        return len(self.messages) == 0 