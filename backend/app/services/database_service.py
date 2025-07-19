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
        # Auto-connect on initialization
        self.connect()
    
    def connect(self):
        """Connect to MongoDB"""
        try:
            if self.client is None:
                self.client = MongoClient(self.mongo_uri)
                self.db = self.client.get_database()
                self.users_collection = self.db.users
                self.conversations_collection = self.db.conversations
                print("Connected to MongoDB successfully")
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}")
            # Don't raise the exception, just log it
            # This allows the app to start even if MongoDB is not available
    
    def ensure_connection(self):
        """Ensure MongoDB connection is active"""
        try:
            if self.client is None:
                self.connect()
            # Test the connection
            self.client.admin.command('ping')
        except Exception as e:
            print(f"MongoDB connection lost, reconnecting: {e}")
            self.connect()
    
    def disconnect(self):
        """Disconnect from MongoDB"""
        if self.client:
            self.client.close()
            self.client = None
            self.db = None
            self.users_collection = None
            self.conversations_collection = None
    
    # User operations
    def create_user(self, user: User) -> bool:
        """Create a new user"""
        try:
            self.ensure_connection()
            result = self.users_collection.insert_one(user.to_dict())
            return result.inserted_id is not None
        except Exception as e:
            print(f"Error creating user: {e}")
            return False
    
    def get_user_by_auth0_id(self, auth0_id: str) -> Optional[User]:
        """Get user by Auth0 ID"""
        try:
            self.ensure_connection()
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
            self.ensure_connection()
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
            self.ensure_connection()
            conversation_dict = conversation.to_dict()
            # Remove _id if it exists to let MongoDB generate it
            conversation_dict.pop('_id', None)
            
            result = self.conversations_collection.insert_one(conversation_dict)
            if result.inserted_id:
                return str(result.inserted_id)
            return None
        except Exception as e:
            print(f"Error creating conversation: {e}")
            return None
    
    def get_user_conversations(self, user_id: str) -> List[Conversation]:
        """Get all conversations for a user"""
        try:
            self.ensure_connection()
            conversations_data = self.conversations_collection.find(
                {"user_id": user_id}
            ).sort("updated_at", -1)
            
            conversations = []
            for conv_data in conversations_data:
                try:
                    conversation = Conversation.from_dict(conv_data)
                    conversations.append(conversation)
                except Exception as e:
                    print(f"Error parsing conversation {conv_data.get('_id')}: {e}")
                    continue
            
            return conversations
        except Exception as e:
            print(f"Error getting conversations: {e}")
            return []
    
    def get_conversation(self, conversation_id: str) -> Optional[Conversation]:
        """Get a specific conversation"""
        try:
            self.ensure_connection()
            from bson import ObjectId
            
            # Handle invalid ObjectId format
            try:
                object_id = ObjectId(conversation_id)
            except Exception:
                print(f"Invalid conversation ID format: {conversation_id}")
                return None
            
            conversation_data = self.conversations_collection.find_one({"_id": object_id})
            if conversation_data:
                return Conversation.from_dict(conversation_data)
            return None
        except Exception as e:
            print(f"Error getting conversation: {e}")
            return None
    
    def update_conversation(self, conversation_id: str, conversation: Conversation) -> bool:
        """Update a conversation"""
        try:
            self.ensure_connection()
            from bson import ObjectId
            
            # Handle invalid ObjectId format
            try:
                object_id = ObjectId(conversation_id)
            except Exception:
                print(f"Invalid conversation ID format: {conversation_id}")
                return False
            
            # Prepare update data without _id
            update_data = conversation.to_dict()
            update_data.pop('_id', None)
            
            result = self.conversations_collection.update_one(
                {"_id": object_id},
                {"$set": update_data}
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error updating conversation: {e}")
            return False
    
    def delete_conversation(self, conversation_id: str) -> bool:
        """Delete a conversation"""
        try:
            self.ensure_connection()
            from bson import ObjectId
            
            # Handle invalid ObjectId format
            try:
                object_id = ObjectId(conversation_id)
            except Exception:
                print(f"Invalid conversation ID format: {conversation_id}")
                return False
            
            result = self.conversations_collection.delete_one({"_id": object_id})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error deleting conversation: {e}")
            return False

# Global database service instance
db_service = DatabaseService() 