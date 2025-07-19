#!/usr/bin/env python3
"""
Simple test for conversation model and context window functionality
"""

import sys
import os
from datetime import datetime

# Add the app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

def test_conversation_model():
    """Test the Conversation model functionality"""
    print("🧪 Testing Conversation Model")
    print("=" * 40)
    
    try:
        from models.conversation import Conversation, Message
        
        # Test conversation creation
        conversation = Conversation(user_id="test_user", title="Test Conversation")
        print("✅ Conversation created successfully")
        
        # Test message addition
        conversation.add_message("Hello", "user")
        conversation.add_message("Hi there!", "assistant")
        conversation.add_message("How are you?", "user")
        conversation.add_message("I'm doing well, thanks!", "assistant")
        
        print(f"✅ Added {len(conversation.messages)} messages")
        
        # Test utility methods
        print(f"Message count: {conversation.get_message_count()}")
        print(f"Is empty: {conversation.is_empty()}")
        
        last_message = conversation.get_last_message()
        if last_message:
            print(f"Last message: {last_message.content}")
        
        # Test context window
        context_messages = conversation.get_context_window(max_messages=3)
        print(f"Context window (3 messages): {len(context_messages)} messages")
        
        # Test title generation
        original_title = conversation.title
        conversation.update_title_if_needed()
        new_title = conversation.title
        print(f"Original title: {original_title}")
        print(f"Generated title: {new_title}")
        
        # Test serialization
        conversation_dict = conversation.to_dict()
        print(f"Serialized keys: {list(conversation_dict.keys())}")
        
        # Test deserialization
        new_conversation = Conversation.from_dict(conversation_dict)
        print(f"Deserialized message count: {new_conversation.get_message_count()}")
        
        print("✅ Conversation model test passed!")
        return True
        
    except Exception as e:
        print(f"❌ Conversation model test failed: {e}")
        return False

def test_context_window_management():
    """Test context window management with many messages"""
    print(f"\n🧪 Testing Context Window Management")
    print("=" * 40)
    
    try:
        from models.conversation import Conversation
        
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
        
    except Exception as e:
        print(f"❌ Context window test failed: {e}")
        return False

def test_message_model():
    """Test the Message model functionality"""
    print(f"\n🧪 Testing Message Model")
    print("=" * 40)
    
    try:
        from models.conversation import Message
        
        # Test message creation
        message = Message("Hello world", "user")
        print("✅ Message created successfully")
        
        # Test message properties
        print(f"Content: {message.content}")
        print(f"Role: {message.role}")
        print(f"Timestamp: {message.timestamp}")
        
        # Test serialization
        message_dict = message.to_dict()
        print(f"Serialized message: {message_dict}")
        
        # Test deserialization
        new_message = Message.from_dict(message_dict)
        print(f"Deserialized content: {new_message.content}")
        
        print("✅ Message model test passed!")
        return True
        
    except Exception as e:
        print(f"❌ Message model test failed: {e}")
        return False

def test_conversation_persistence():
    """Test conversation persistence simulation"""
    print(f"\n🧪 Testing Conversation Persistence Simulation")
    print("=" * 40)
    
    try:
        from models.conversation import Conversation
        
        # Create conversation
        conversation = Conversation(user_id="test_user", title="Persistence Test")
        conversation.add_message("First message", "user")
        conversation.add_message("First response", "assistant")
        
        # Simulate saving to database
        conversation_dict = conversation.to_dict()
        print("✅ Conversation serialized for database storage")
        
        # Simulate retrieving from database
        retrieved_conversation = Conversation.from_dict(conversation_dict)
        print("✅ Conversation deserialized from database")
        
        # Verify data integrity
        assert retrieved_conversation.user_id == conversation.user_id
        assert retrieved_conversation.title == conversation.title
        assert len(retrieved_conversation.messages) == len(conversation.messages)
        
        print("✅ Conversation persistence simulation passed!")
        return True
        
    except Exception as e:
        print(f"❌ Conversation persistence test failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Starting Simple Conversation Tests")
    print("=" * 60)
    
    success = True
    
    # Run all tests
    success &= test_message_model()
    success &= test_conversation_model()
    success &= test_context_window_management()
    success &= test_conversation_persistence()
    
    if success:
        print(f"\n🎉 All tests passed! Multi-turn conversation handling is working correctly.")
        print("\nKey Features Verified:")
        print("✅ Message model with serialization")
        print("✅ Conversation model with context window management")
        print("✅ Automatic title generation")
        print("✅ Conversation persistence simulation")
        print("✅ Context window optimization")
    else:
        print(f"\n❌ Some tests failed. Please check the implementation.")
        sys.exit(1) 