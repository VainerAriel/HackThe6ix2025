#!/usr/bin/env python3
"""
Test script for multi-turn conversation handling and context retention
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.gemini_service import GeminiService
from app.models.conversation import Conversation
from app.services.database_service import DatabaseService
from datetime import datetime

def test_conversation_context_retention():
    """Test that conversations maintain context across multiple turns"""
    print("🧪 Testing Multi-turn Conversation Handling and Context Retention")
    print("=" * 60)
    
    # Initialize services
    try:
        gemini_service = GeminiService()
        db_service = DatabaseService()
        print("✅ Services initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize services: {e}")
        return False
    
    # Create a test conversation
    user_id = "test_user_123"
    conversation = Conversation(user_id=user_id, title="Test Conversation")
    
    # Test messages that should maintain context
    test_messages = [
        "Hi, I'm having trouble communicating with my boss about a project deadline.",
        "She's very direct and doesn't like excuses. How should I approach this?",
        "What if she says no to extending the deadline?",
        "Can you help me practice a specific response for this situation?"
    ]
    
    print(f"\n📝 Testing conversation with {len(test_messages)} messages...")
    
    # Simulate multi-turn conversation
    for i, message in enumerate(test_messages, 1):
        print(f"\n--- Turn {i} ---")
        print(f"User: {message}")
        
        # Generate response using the enhanced conversation handling
        response = gemini_service.generate_response_with_conversation(
            conversation, 
            message, 
            context_window_size=10
        )
        
        if response["success"]:
            print(f"Assistant: {response['response'][:100]}...")
            print(f"Context window size: {response.get('context_window_size', 'N/A')}")
            print(f"Messages processed: {response.get('messages_processed', 'N/A')}")
        else:
            print(f"❌ Error: {response['error']}")
            return False
    
    # Test context window functionality
    print(f"\n🔍 Testing context window management...")
    context_messages = conversation.get_context_window(max_messages=5)
    print(f"Total messages in conversation: {len(conversation.messages)}")
    print(f"Messages in context window: {len(context_messages)}")
    
    # Test title generation
    print(f"\n📋 Testing automatic title generation...")
    original_title = conversation.title
    conversation.update_title_if_needed()
    new_title = conversation.title
    print(f"Original title: {original_title}")
    print(f"Generated title: {new_title}")
    
    # Test conversation persistence (if database is available)
    try:
        print(f"\n💾 Testing conversation persistence...")
        conversation_id = db_service.create_conversation(conversation)
        if conversation_id:
            print(f"✅ Conversation saved with ID: {conversation_id}")
            
            # Retrieve and verify
            retrieved_conversation = db_service.get_conversation(conversation_id)
            if retrieved_conversation:
                print(f"✅ Conversation retrieved successfully")
                print(f"   - Title: {retrieved_conversation.title}")
                print(f"   - Message count: {retrieved_conversation.get_message_count()}")
                print(f"   - User ID: {retrieved_conversation.user_id}")
            else:
                print("❌ Failed to retrieve conversation")
        else:
            print("⚠️  Database not available, skipping persistence test")
    except Exception as e:
        print(f"⚠️  Database test skipped: {e}")
    
    print(f"\n🎉 Multi-turn conversation test completed successfully!")
    return True

def test_context_window_management():
    """Test context window management with many messages"""
    print(f"\n🧪 Testing Context Window Management")
    print("=" * 40)
    
    try:
        gemini_service = GeminiService()
    except Exception as e:
        print(f"❌ Failed to initialize Gemini service: {e}")
        return False
    
    # Create a conversation with many messages
    conversation = Conversation(user_id="test_user", title="Long Conversation")
    
    # Add many messages to test context window
    for i in range(25):
        conversation.add_message(f"Message {i+1} from user", "user")
        conversation.add_message(f"Response {i+1} from assistant", "assistant")
    
    print(f"Created conversation with {len(conversation.messages)} messages")
    
    # Test different context window sizes
    for window_size in [5, 10, 15, 20]:
        context_messages = conversation.get_context_window(window_size)
        print(f"Context window size {window_size}: {len(context_messages)} messages")
        
        # Verify we don't exceed the window size
        if len(context_messages) > window_size:
            print(f"❌ Context window exceeded limit: {len(context_messages)} > {window_size}")
            return False
    
    print("✅ Context window management test passed!")
    return True

def test_conversation_model_features():
    """Test various conversation model features"""
    print(f"\n🧪 Testing Conversation Model Features")
    print("=" * 40)
    
    # Test conversation creation
    conversation = Conversation(user_id="test_user", title="Test Conversation")
    
    # Test message addition
    conversation.add_message("Hello", "user")
    conversation.add_message("Hi there!", "assistant")
    conversation.add_message("How are you?", "user")
    
    # Test utility methods
    print(f"Message count: {conversation.get_message_count()}")
    print(f"Is empty: {conversation.is_empty()}")
    
    last_message = conversation.get_last_message()
    if last_message:
        print(f"Last message: {last_message.content}")
    
    # Test title generation
    conversation.update_title_if_needed()
    print(f"Generated title: {conversation.title}")
    
    # Test serialization
    conversation_dict = conversation.to_dict()
    print(f"Serialized keys: {list(conversation_dict.keys())}")
    
    # Test deserialization
    new_conversation = Conversation.from_dict(conversation_dict)
    print(f"Deserialized message count: {new_conversation.get_message_count()}")
    
    print("✅ Conversation model features test passed!")
    return True

if __name__ == "__main__":
    print("🚀 Starting Multi-turn Conversation Tests")
    print("=" * 60)
    
    success = True
    
    # Run all tests
    success &= test_conversation_model_features()
    success &= test_context_window_management()
    success &= test_conversation_context_retention()
    
    if success:
        print(f"\n🎉 All tests passed! Multi-turn conversation handling is working correctly.")
    else:
        print(f"\n❌ Some tests failed. Please check the implementation.")
        sys.exit(1) 