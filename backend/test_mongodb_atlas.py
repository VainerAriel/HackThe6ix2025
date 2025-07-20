#!/usr/bin/env python3
"""
Test script to verify MongoDB Atlas connection
"""
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

def test_mongodb_connection():
    """Test MongoDB Atlas connection"""
    load_dotenv()
    
    mongo_uri = os.getenv("MONGODB_URI")
    if not mongo_uri:
        print("❌ MONGODB_URI not found in environment variables")
        return False
    
    print(f"🔗 Testing MongoDB Atlas connection...")
    print(f"URI: {mongo_uri[:50]}...")  # Show first 50 chars for security
    
    try:
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
        
        # Create client
        client = MongoClient(mongo_uri, **connection_options)
        
        # Test connection
        print("🔄 Testing connection...")
        client.admin.command('ping')
        print("✅ MongoDB Atlas connection successful!")
        
        # Test database access
        db = client.get_database()
        print(f"📊 Database: {db.name}")
        
        # Test collections
        users_collection = db.users
        conversations_collection = db.conversations
        
        print(f"👥 Users collection: {users_collection.name}")
        print(f"💬 Conversations collection: {conversations_collection.name}")
        
        # Test a simple operation
        user_count = users_collection.count_documents({})
        print(f"📈 Current users in database: {user_count}")
        
        client.close()
        return True
        
    except ConnectionFailure as e:
        print(f"❌ Connection failed: {e}")
        return False
    except ServerSelectionTimeoutError as e:
        print(f"❌ Server selection timeout: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def test_alternative_connection_strings():
    """Test alternative connection string formats"""
    load_dotenv()
    
    base_uri = os.getenv("MONGODB_URI")
    if not base_uri:
        print("❌ MONGODB_URI not found")
        return
    
    # Remove any existing parameters
    if "?" in base_uri:
        base_uri = base_uri.split("?")[0]
    
    # Test different connection string formats
    test_uris = [
        f"{base_uri}?retryWrites=true&w=majority",
        f"{base_uri}?retryWrites=true&w=majority&tls=true",
        f"{base_uri}?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true",
        f"{base_uri}?retryWrites=true&w=majority&ssl=true",
        f"{base_uri}?retryWrites=true&w=majority&ssl=true&ssl_cert_reqs=CERT_NONE",
        # Try without any SSL/TLS parameters
        f"{base_uri}?retryWrites=true&w=majority",
    ]
    
    print("\n🔧 Testing alternative connection strings...")
    
    for i, uri in enumerate(test_uris, 1):
        print(f"\nTest {i}: {uri[:50]}...")
        try:
            client = MongoClient(uri, serverSelectionTimeoutMS=10000)
            client.admin.command('ping')
            print(f"✅ Test {i} SUCCESS!")
            client.close()
            return uri
        except Exception as e:
            print(f"❌ Test {i} failed: {str(e)[:100]}...")
    
    return None

if __name__ == "__main__":
    print("🧪 MongoDB Atlas Connection Test")
    print("=" * 50)
    
    # Test current connection
    if test_mongodb_connection():
        print("\n🎉 MongoDB Atlas connection is working!")
    else:
        print("\n🔧 Trying alternative connection strings...")
        working_uri = test_alternative_connection_strings()
        
        if working_uri:
            print(f"\n✅ Found working connection string!")
            print(f"Update your .env file with: MONGODB_URI={working_uri}")
        else:
            print("\n❌ All connection attempts failed")
            print("\nPossible solutions:")
            print("1. Check your MongoDB Atlas network access settings")
            print("2. Verify your username and password")
            print("3. Make sure your IP is whitelisted in Atlas")
            print("4. Check if the cluster is running") 