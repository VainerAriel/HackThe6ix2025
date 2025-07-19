#!/usr/bin/env python3
"""
Test script to verify database connection and user operations
Run this script to test your MongoDB Atlas connection and user management
"""

import os
import sys
from datetime import datetime

# Add the app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.services.database_service import DatabaseService
from app.models.user import User

def test_database_connection():
    """Test database connection"""
    print("🔍 Testing database connection...")
    
    try:
        db_service = DatabaseService()
        db_service.ensure_connection()
        print("✅ Database connection successful!")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def test_user_operations():
    """Test user creation, retrieval, and update operations"""
    print("\n👤 Testing user operations...")
    
    db_service = DatabaseService()
    
    # Test user data
    test_auth0_id = "test_auth0_id_123"
    test_email = "test@example.com"
    test_name = "Test User"
    test_picture = "https://example.com/picture.jpg"
    
    # Create test user
    print("Creating test user...")
    test_user = User(
        auth0_id=test_auth0_id,
        email=test_email,
        name=test_name,
        picture=test_picture
    )
    
    # Test upsert (create)
    success = db_service.upsert_user(test_user)
    if success:
        print("✅ User created successfully!")
    else:
        print("❌ Failed to create user")
        return False
    
    # Test user existence check
    exists = db_service.user_exists(test_auth0_id)
    if exists:
        print("✅ User existence check passed!")
    else:
        print("❌ User existence check failed")
        return False
    
    # Test get user
    retrieved_user = db_service.get_user_by_auth0_id(test_auth0_id)
    if retrieved_user and retrieved_user.email == test_email:
        print("✅ User retrieval successful!")
    else:
        print("❌ User retrieval failed")
        return False
    
    # Test user status
    status = db_service.get_user_status(test_auth0_id)
    if status.get("exists") and status.get("email") == test_email:
        print("✅ User status check passed!")
    else:
        print("❌ User status check failed")
        return False
    
    # Test update user
    updated_name = "Updated Test User"
    update_success = db_service.update_user(test_auth0_id, {"name": updated_name})
    if update_success:
        print("✅ User update successful!")
    else:
        print("❌ User update failed")
        return False
    
    # Verify update
    updated_user = db_service.get_user_by_auth0_id(test_auth0_id)
    if updated_user and updated_user.name == updated_name:
        print("✅ User update verification passed!")
    else:
        print("❌ User update verification failed")
        return False
    
    # Test upsert (update)
    test_user.name = "Final Test User"
    upsert_success = db_service.upsert_user(test_user)
    if upsert_success:
        print("✅ User upsert (update) successful!")
    else:
        print("❌ User upsert (update) failed")
        return False
    
    print("✅ All user operations passed!")
    return True

def test_cross_device_simulation():
    """Simulate cross-device user access"""
    print("\n🔄 Testing cross-device simulation...")
    
    db_service = DatabaseService()
    test_auth0_id = "cross_device_test_456"
    
    # Simulate user registration on device 1
    print("Simulating user registration on device 1...")
    user_device1 = User(
        auth0_id=test_auth0_id,
        email="user@example.com",
        name="Cross Device User",
        picture="https://example.com/user.jpg"
    )
    
    success1 = db_service.upsert_user(user_device1)
    if not success1:
        print("❌ Failed to create user on device 1")
        return False
    
    # Simulate user login on device 2 (different device)
    print("Simulating user login on device 2...")
    user_device2 = User(
        auth0_id=test_auth0_id,
        email="user@example.com",
        name="Cross Device User Updated",
        picture="https://example.com/user_updated.jpg"
    )
    
    success2 = db_service.upsert_user(user_device2)
    if not success2:
        print("❌ Failed to sync user on device 2")
        return False
    
    # Verify user data is synced
    synced_user = db_service.get_user_by_auth0_id(test_auth0_id)
    if synced_user and synced_user.name == "Cross Device User Updated":
        print("✅ Cross-device user sync successful!")
    else:
        print("❌ Cross-device user sync failed")
        return False
    
    print("✅ Cross-device simulation passed!")
    return True

def main():
    """Main test function"""
    print("🚀 Starting database tests...")
    print("=" * 50)
    
    # Test database connection
    if not test_database_connection():
        print("\n❌ Database connection test failed. Please check your MongoDB Atlas connection.")
        return
    
    # Test user operations
    if not test_user_operations():
        print("\n❌ User operations test failed.")
        return
    
    # Test cross-device simulation
    if not test_cross_device_simulation():
        print("\n❌ Cross-device simulation test failed.")
        return
    
    print("\n" + "=" * 50)
    print("🎉 All tests passed! Your database setup is working correctly.")
    print("\n📋 Summary:")
    print("✅ MongoDB Atlas connection working")
    print("✅ User creation and retrieval working")
    print("✅ User updates and synchronization working")
    print("✅ Cross-device user access working")
    print("\n🔧 Your system is ready for cross-device authentication!")

if __name__ == "__main__":
    main() 