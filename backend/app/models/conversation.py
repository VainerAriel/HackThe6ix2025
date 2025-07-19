from datetime import datetime
from typing import List, Dict, Any, Optional

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
    def __init__(self, user_id: str, title: str = "New Conversation"):
        self.user_id = user_id
        self.title = title
        self.messages: List[Message] = []
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
    
    def add_message(self, content: str, role: str):
        message = Message(content, role)
        self.messages.append(message)
        self.updated_at = datetime.utcnow()
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'user_id': self.user_id,
            'title': self.title,
            'messages': [msg.to_dict() for msg in self.messages],
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Conversation':
        conv = cls(
            user_id=data['user_id'],
            title=data.get('title', 'New Conversation')
        )
        conv.messages = [Message.from_dict(msg) for msg in data.get('messages', [])]
        conv.created_at = data.get('created_at', datetime.utcnow())
        conv.updated_at = data.get('updated_at', datetime.utcnow())
        return conv 