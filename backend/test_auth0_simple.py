#!/usr/bin/env python3
"""
Simple Auth0 configuration test
"""
import requests
import os
from dotenv import load_dotenv

load_dotenv()

def test_auth0_config():
    """Test basic Auth0 configuration"""
    domain = os.getenv("AUTH0_DOMAIN", "dev-6l1mmvy5gvfsblef.us.auth0.com")
    client_id = os.getenv("AUTH0_CLIENT_ID", "iyuPvHVVRTz45HLnjMVE1Z6gwOVdTDLR")
    
    print("🔍 Testing Auth0 Configuration")
    print("=" * 40)
    print(f"Domain: {domain}")
    print(f"Client ID: {client_id}")
    print()
    
    # Test 1: Check if Auth0 domain is accessible
    print("1. Testing Auth0 domain accessibility...")
    try:
        response = requests.get(f"https://{domain}/.well-known/openid_configuration")
        if response.status_code == 200:
            print("✅ Auth0 domain is accessible")
            config = response.json()
            print(f"   Authorization endpoint: {config.get('authorization_endpoint')}")
        else:
            print(f"❌ Auth0 domain returned status: {response.status_code}")
    except Exception as e:
        print(f"❌ Cannot access Auth0 domain: {e}")
        return False
    
    # Test 2: Check JWKS endpoint
    print("\n2. Testing JWKS endpoint...")
    try:
        response = requests.get(f"https://{domain}/.well-known/jwks.json")
        if response.status_code == 200:
            print("✅ JWKS endpoint is accessible")
            jwks = response.json()
            print(f"   Found {len(jwks.get('keys', []))} public keys")
        else:
            print(f"❌ JWKS endpoint returned status: {response.status_code}")
    except Exception as e:
        print(f"❌ Cannot access JWKS endpoint: {e}")
    
    # Test 3: Test authorization URL
    print("\n3. Testing authorization URL...")
    auth_url = f"https://{domain}/authorize?response_type=token&client_id={client_id}&redirect_uri=http://localhost:5000/callback&scope=openid%20profile%20email"
    print(f"Authorization URL: {auth_url}")
    
    try:
        response = requests.get(auth_url, allow_redirects=False)
        print(f"   Response status: {response.status_code}")
        if response.status_code in [200, 302]:
            print("✅ Authorization endpoint is working")
        else:
            print(f"❌ Authorization endpoint returned: {response.status_code}")
    except Exception as e:
        print(f"❌ Cannot test authorization endpoint: {e}")
    
    print("\n📋 Recommendations:")
    print("1. If all tests pass, try the web interface again")
    print("2. If tests fail, check your Auth0 tenant status")
    print("3. Consider creating a new Auth0 application if issues persist")
    
    return True

def create_simple_auth_url():
    """Create a simple authorization URL for testing"""
    domain = os.getenv("AUTH0_DOMAIN", "dev-6l1mmvy5gvfsblef.us.auth0.com")
    client_id = os.getenv("AUTH0_CLIENT_ID", "iyuPvHVVRTz45HLnjMVE1Z6gwOVdTDLR")
    
    auth_url = f"https://{domain}/authorize?response_type=token&client_id={client_id}&redirect_uri=http://localhost:5000/callback&scope=openid%20profile%20email"
    
    print("\n🔗 Simple Authorization URL:")
    print(auth_url)
    print("\n📝 Instructions:")
    print("1. Copy this URL and paste it in your browser")
    print("2. Sign in with your Auth0 user")
    print("3. Copy the access_token from the URL fragment")

if __name__ == "__main__":
    test_auth0_config()
    create_simple_auth_url() 