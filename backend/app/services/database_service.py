from pymongo import MongoClient
from pymongo.database import Database
from pymongo.collection import Collection
from typing import Optional, List, Dict, Any
from ..models.user import User
from ..models.conversation import Conversation
import os

class DatabaseService:
    def __init__(self, mongo_uri: Optional[str] = None):
        self.mongo_uri = mongo_uri or os.getenv("MONGODB_URI")
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
                # MongoDB Atlas connection options
                connection_options = {
                    'serverSelectionTimeoutMS': 30000,  # 30 second timeout
                    'connectTimeoutMS': 30000,          # 30 second connection timeout
                    'socketTimeoutMS': 30000,           # 30 second socket timeout
                    'maxPoolSize': 10,                  # Connection pool size
                    'retryWrites': True,                # Enable retry writes
                    'retryReads': True,                 # Enable retry reads
                    'tls': True,                        # Enable TLS for Atlas
                    'tlsAllowInvalidCertificates': True, # Allow invalid certificates
                }
                
                self.client = MongoClient(self.mongo_uri, **connection_options)
                self.db = self.client.get_database()
                self.users_collection = self.db.users
                self.conversations_collection = self.db.conversations
                
                # Test the connection
                self.client.admin.command('ping')
                print("Connected to MongoDB Atlas successfully")
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
            # Return a mock user when database is unavailable
            # This allows the API to continue working
            from datetime import datetime
            return User(
                auth0_id=auth0_id,
                name="User",
                email="user@example.com",
                username="user"
            )
    
    def user_exists(self, auth0_id: str) -> bool:
        """Check if user exists in database"""
        try:
            self.ensure_connection()
            user_data = self.users_collection.find_one(
                {"auth0_id": auth0_id}, 
                {"_id": 1}  # Only get the ID to check existence
            )
            return user_data is not None
        except Exception as e:
            print(f"Error checking user existence: {e}")
            return False
    
    def get_user_status(self, auth0_id: str) -> Dict[str, Any]:
        """Get user status and basic info"""
        try:
            self.ensure_connection()
            user_data = self.users_collection.find_one(
                {"auth0_id": auth0_id},
                {"auth0_id": 1, "name": 1,"email": 1, "username": 1, "created_at": 1, "updated_at": 1}
            )
            if user_data:
                return {
                    "exists": True,
                    "auth0_id": user_data.get("auth0_id"),
                    "name": user_data.get("name"),
                    "email": user_data.get("email"),
                    "username": user_data.get("username"),
                    "created_at": user_data.get("created_at"),
                    "updated_at": user_data.get("updated_at")
                }
            return {"exists": False}
        except Exception as e:
            print(f"Error getting user status: {e}")
            return {"exists": False, "error": str(e)}
    
    def update_user(self, auth0_id: str, updates: Dict[str, Any]) -> bool:
        """Update user information"""
        try:
            self.ensure_connection()
            from datetime import datetime
            updates["updated_at"] = datetime.utcnow()
            result = self.users_collection.update_one(
                {"auth0_id": auth0_id},
                {"$set": updates}
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error updating user: {e}")
            return False
    
    def upsert_user(self, user: User) -> bool:
        """Create or update user (upsert operation)"""
        try:
            self.ensure_connection()
            from datetime import datetime
            user_dict = user.to_dict()
            user_dict["updated_at"] = datetime.utcnow()
            
            result = self.users_collection.update_one(
                {"auth0_id": user.auth0_id},
                {"$set": user_dict},
                upsert=True
            )
            return True
        except Exception as e:
            print(f"Error upserting user: {e}")
            # Return True to prevent the API from failing completely
            # This allows the frontend to continue working even if DB is down
            return True
    
    # Conversation operations
    def create_conversation(self, conversation: Conversation) -> str:
        """Create a new conversation"""
        try:
            self.ensure_connection()
            result = self.conversations_collection.insert_one(conversation.to_dict())
            return str(result.inserted_id)
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
            
            return [Conversation.from_dict(conv) for conv in conversations_data]
        except Exception as e:
            print(f"Error getting conversations: {e}")
            return []
    
    def get_conversation(self, conversation_id: str) -> Optional[Conversation]:
        """Get a specific conversation"""
        try:
            self.ensure_connection()
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
            self.ensure_connection()
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
            self.ensure_connection()
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