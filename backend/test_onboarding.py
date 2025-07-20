#!/usr/bin/env python3
"""
Test script for onboarding functionality
"""

import requests
import json
import os
from datetime import datetime

# Configuration
API_BASE_URL = "http://localhost:5000/api"
TEST_AUTH0_ID = "test_user_123"

def test_onboarding_endpoints():
    """Test the onboarding endpoints"""
    
    print("Testing Onboarding Endpoints")
    print("=" * 50)
    
    # Test data
    onboarding_data = {
        "boss_type": "supportive",
        "role": "Software Engineer",
        "confidence": 7,
        "goals": ["Improve communication", "Get promotion"]
    }
    
    # Test 1: Update onboarding data (POST)
    print("\n1. Testing POST /user/onboarding")
    try:
        # Use dev bypass token for testing
        response = requests.post(
            f"{API_BASE_URL}/user/onboarding",
            json=onboarding_data,
            headers={"Content-Type": "application/json", "Authorization": "Bearer dev-bypass"}
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 2: Get onboarding data (GET)
    print("\n2. Testing GET /user/onboarding")
    try:
        response = requests.get(
            f"{API_BASE_URL}/user/onboarding",
            headers={"Content-Type": "application/json", "Authorization": "Bearer dev-bypass"}
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 3: Health check
    print("\n3. Testing GET /user/health")
    try:
        response = requests.get(f"{API_BASE_URL}/user/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

def test_user_model():
    """Test the User model with onboarding data"""
    
    print("\n\nTesting User Model")
    print("=" * 50)
    
    try:
        from app.models.user import User
        
        # Create user with onboarding data
        user = User(
            auth0_id=TEST_AUTH0_ID,
            email="test@example.com",
            name="Test User",
            boss_type="demanding",
            role="Product Manager",
            confidence=8,
            goals=["Lead team", "Ship product"]
        )
        
        print(f"Created user: {user.name}")
        print(f"Boss type: {user.boss_type}")
        print(f"Role: {user.role}")
        print(f"Confidence: {user.confidence}")
        print(f"Goals: {user.goals}")
        
        # Test to_dict
        user_dict = user.to_dict()
        print(f"\nUser dict: {json.dumps(user_dict, default=str, indent=2)}")
        
        # Test from_dict
        user_from_dict = User.from_dict(user_dict)
        print(f"\nRecreated user boss_type: {user_from_dict.boss_type}")
        
        print("✅ User model test passed!")
        
    except Exception as e:
        print(f"❌ User model test failed: {e}")

if __name__ == "__main__":
    print("Starting Onboarding Tests")
    print(f"API Base URL: {API_BASE_URL}")
    print(f"Timestamp: {datetime.now()}")
    
    test_user_model()
    test_onboarding_endpoints()
    
    print("\n\nTest completed!") 