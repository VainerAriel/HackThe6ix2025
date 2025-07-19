#!/usr/bin/env python3
"""
Script to create Auth0 users using the Management API
"""
import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

def get_management_token():
    """Get Auth0 Management API token"""
    domain = os.getenv("AUTH0_DOMAIN", "dev-6l1mmvy5gvfsblef.us.auth0.com")
    client_id = os.getenv("AUTH0_MANAGEMENT_CLIENT_ID")
    client_secret = os.getenv("AUTH0_MANAGEMENT_CLIENT_SECRET")
    
    if not client_id or not client_secret:
        print("❌ AUTH0_MANAGEMENT_CLIENT_ID and AUTH0_MANAGEMENT_CLIENT_SECRET must be set in .env file")
        print("\nTo get these:")
        print("1. Go to Auth0 Dashboard → Applications")
        print("2. Create a new 'Machine to Machine' application")
        print("3. Authorize it for 'Auth0 Management API'")
        print("4. Copy the Client ID and Client Secret")
        return None
    
    token_url = f"https://{domain}/oauth/token"
    payload = {
        'client_id': client_id,
        'client_secret': client_secret,
        'audience': f'https://{domain}/api/v2/',
        'grant_type': 'client_credentials'
    }
    
    try:
        response = requests.post(token_url, json=payload)
        if response.status_code == 200:
            return response.json().get('access_token')
        else:
            print(f"❌ Failed to get management token: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error getting management token: {e}")
        return None

def create_user(email, password, name=None, connection="Username-Password-Authentication"):
    """Create a new Auth0 user"""
    domain = os.getenv("AUTH0_DOMAIN", "dev-6l1mmvy5gvfsblef.us.auth0.com")
    management_token = get_management_token()
    
    if not management_token:
        return None
    
    user_data = {
        'email': email,
        'password': password,
        'connection': connection,
        'email_verified': True,  # Skip email verification
        'verify_email': False
    }
    
    if name:
        user_data['name'] = name
    
    headers = {
        'Authorization': f'Bearer {management_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.post(
            f'https://{domain}/api/v2/users',
            headers=headers,
            json=user_data
        )
        
        if response.status_code == 201:
            user = response.json()
            print("✅ User created successfully!")
            print(f"User ID: {user.get('user_id')}")
            print(f"Email: {user.get('email')}")
            print(f"Name: {user.get('name')}")
            return user
        else:
            print(f"❌ Failed to create user: {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error creating user: {e}")
        return None

def list_users():
    """List all Auth0 users"""
    domain = os.getenv("AUTH0_DOMAIN", "dev-6l1mmvy5gvfsblef.us.auth0.com")
    management_token = get_management_token()
    
    if not management_token:
        return None
    
    headers = {
        'Authorization': f'Bearer {management_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get(
            f'https://{domain}/api/v2/users',
            headers=headers
        )
        
        if response.status_code == 200:
            users = response.json()
            print(f"📋 Found {len(users)} users:")
            for user in users:
                print(f"  - {user.get('email')} (ID: {user.get('user_id')})")
            return users
        else:
            print(f"❌ Failed to list users: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"❌ Error listing users: {e}")
        return None

def main():
    print("👤 Auth0 User Management")
    print("=" * 40)
    
    while True:
        print("\nOptions:")
        print("1. Create a new user")
        print("2. List all users")
        print("3. Exit")
        
        choice = input("\nEnter your choice (1-3): ").strip()
        
        if choice == "1":
            print("\n📝 Create New User")
            print("-" * 20)
            
            email = input("Email: ").strip()
            password = input("Password: ").strip()
            name = input("Name (optional): ").strip()
            
            if not email or not password:
                print("❌ Email and password are required")
                continue
            
            create_user(email, password, name if name else None)
            
        elif choice == "2":
            print("\n📋 Listing Users")
            print("-" * 20)
            list_users()
            
        elif choice == "3":
            print("👋 Goodbye!")
            break
            
        else:
            print("❌ Invalid choice. Please enter 1, 2, or 3.")

if __name__ == "__main__":
    main() 