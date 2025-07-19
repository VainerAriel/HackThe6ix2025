#!/usr/bin/env python3
"""
Helper script to get JWT tokens from Auth0 for testing
"""
import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

def get_auth0_config():
    """Get Auth0 configuration from backend"""
    try:
        response = requests.get('http://localhost:5000/api/auth/config')
        if response.status_code == 200:
            return response.json()
        else:
            print("❌ Could not get Auth0 config from backend")
            return None
    except requests.exceptions.ConnectionError:
        print("❌ Backend server not running. Start it with: python run.py")
        return None

def get_token_with_password(username, password):
    """Get JWT token using username/password (Resource Owner Password Grant)"""
    config = get_auth0_config()
    if not config:
        return None
    
    token_url = config['token_url']
    client_id = config['client_id']
    audience = config['audience']
    
    payload = {
        'grant_type': 'password',
        'username': username,
        'password': password,
        'audience': audience,
        'client_id': client_id,
        'scope': 'openid profile email'
    }
    
    try:
        response = requests.post(token_url, json=payload)
        if response.status_code == 200:
            token_data = response.json()
            return token_data.get('access_token')
        else:
            print(f"❌ Failed to get token: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error getting token: {e}")
        return None

def test_token(token):
    """Test the JWT token with the backend"""
    if not token:
        return False
    
    headers = {'Authorization': f'Bearer {token}'}
    
    try:
        # Test with profile endpoint
        response = requests.get('http://localhost:5000/api/auth/profile', headers=headers)
        if response.status_code == 200:
            user_data = response.json()
            print("✅ Token is valid!")
            print(f"User: {user_data.get('name')} ({user_data.get('email')})")
            return True
        else:
            print(f"❌ Token validation failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Backend server not running")
        return False

def main():
    print("🔐 Auth0 JWT Token Helper")
    print("=" * 40)
    
    # Get Auth0 config
    config = get_auth0_config()
    if not config:
        return
    
    print(f"📋 Auth0 Domain: {config['domain']}")
    print(f"📋 Client ID: {config['client_id']}")
    print(f"📋 Audience: {config['audience']}")
    print()
    
    # Get credentials from user
    print("Enter your Auth0 credentials:")
    username = input("Email: ").strip()
    password = input("Password: ").strip()
    
    if not username or not password:
        print("❌ Username and password are required")
        return
    
    print("\n🔄 Getting JWT token...")
    token = get_token_with_password(username, password)
    
    if token:
        print("✅ JWT Token obtained successfully!")
        print(f"Token: {token[:50]}...")
        print()
        
        # Test the token
        print("🧪 Testing token with backend...")
        if test_token(token):
            print("\n🎉 Success! You can now use this token in your API requests.")
            print("\nExample usage:")
            print(f"curl -H 'Authorization: Bearer {token[:50]}...' http://localhost:5000/api/auth/profile")
            print("\nOr use it in Swagger UI at: http://localhost:5000/api/docs")
        else:
            print("❌ Token validation failed")
    else:
        print("❌ Failed to get JWT token")
        print("\nPossible issues:")
        print("1. Check your username and password")
        print("2. Make sure your Auth0 application is configured correctly")
        print("3. Verify the audience and client_id settings")

if __name__ == "__main__":
    main() 