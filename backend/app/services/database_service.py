from pymongo import MongoClient
from pymongo.database import Database
from pymongo.collection import Collection
from typing import Optional, List, Dict, Any
from ..models.user import User
from ..models.conversation import Conversation
import os

class DatabaseService:
    def __init__(self, mongo_uri: Optional[str] = None):
        self.mongo_uri = mongo_uri or os.getenv("MONGODB_URI", "mongodb://localhost:27017/hackthe6ix")
        self.client: Optional[MongoClient] = None
        self.db: Optional[Database] = None
        self.users_collection: Optional[Collection] = None
        self.conversations_collection: Optional[Collection] = None
    
    def connect(self):
        """Connect to MongoDB"""
        try:
            self.client = MongoClient(self.mongo_uri)
            self.db = self.client.get_database()
            self.users_collection = self.db.users
            self.conversations_collection = self.db.conversations
            print("Connected to MongoDB successfully")
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}")
            raise
    
    def disconnect(self):
        """Disconnect from MongoDB"""
        if self.client:
            self.client.close()
    
    # User operations
    def create_user(self, user: User) -> bool:
        """Create a new user"""
        try:
            result = self.users_collection.insert_one(user.to_dict())
            return result.inserted_id is not None
        except Exception as e:
            print(f"Error creating user: {e}")
            return False
    
    def get_user_by_auth0_id(self, auth0_id: str) -> Optional[User]:
        """Get user by Auth0 ID"""
        try:
            user_data = self.users_collection.find_one({"auth0_id": auth0_id})
            if user_data:
                return User.from_dict(user_data)
            return None
        except Exception as e:
            print(f"Error getting user: {e}")
            return None
    
    def update_user(self, auth0_id: str, updates: Dict[str, Any]) -> bool:
        """Update user information"""
        try:
            updates["updated_at"] = User.updated_at
            result = self.users_collection.update_one(
                {"auth0_id": auth0_id},
                {"$set": updates}
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error updating user: {e}")
            return False
    
    # Conversation operations
    def create_conversation(self, conversation: Conversation) -> str:
        """Create a new conversation"""
        try:
            result = self.conversations_collection.insert_one(conversation.to_dict())
            return str(result.inserted_id)
        except Exception as e:
            print(f"Error creating conversation: {e}")
            return None
    
    def get_user_conversations(self, user_id: str) -> List[Conversation]:
        """Get all conversations for a user"""
        try:
            conversations_data = self.conversations_collection.find(
                {"user_id": user_id}
            ).sort("updated_at", -1)
            
            return [Conversation.from_dict(conv) for conv in conversations_data]
        except Exception as e:
            print(f"Error getting conversations: {e}")
            return []
    
    def get_conversation(self, conversation_id: str) -> Optional[Conversation]:
        """Get a specific conversation"""
        try:
            from bson import ObjectId
            conversation_data = self.conversations_collection.find_one(
                {"_id": ObjectId(conversation_id)}
            )
            if conversation_data:
                return Conversation.from_dict(conversation_data)
            return None
        except Exception as e:
            print(f"Error getting conversation: {e}")
            return None
    
    def update_conversation(self, conversation_id: str, conversation: Conversation) -> bool:
        """Update a conversation"""
        try:
            from bson import ObjectId
            result = self.conversations_collection.update_one(
                {"_id": ObjectId(conversation_id)},
                {"$set": conversation.to_dict()}
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error updating conversation: {e}")
            return False
    
    def delete_conversation(self, conversation_id: str) -> bool:
        """Delete a conversation"""
        try:
            from bson import ObjectId
            result = self.conversations_collection.delete_one(
                {"_id": ObjectId(conversation_id)}
            )
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error deleting conversation: {e}")
            return False

# Global database service instance
db_service = DatabaseService() 