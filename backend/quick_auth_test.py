#!/usr/bin/env python3
"""
Quick Auth0 test with different client configuration
"""
import requests

def test_direct_auth():
    """Test direct Auth0 access"""
    print("🔍 Quick Auth0 Test")
    print("=" * 30)
    
    # Test with a public Auth0 endpoint
    try:
        response = requests.get("https://dev-6l1mmvy5gvfsblef.us.auth0.com/.well-known/jwks.json")
        if response.status_code == 200:
            print("✅ Auth0 is accessible")
            print("   The issue is likely with your application configuration")
        else:
            print(f"❌ Auth0 returned: {response.status_code}")
    except Exception as e:
        print(f"❌ Cannot access Auth0: {e}")
    
    print("\n🔧 Next Steps:")
    print("1. Go to Auth0 Dashboard → Applications")
    print("2. Check your application settings")
    print("3. Make sure 'Single Page Application' is selected")
    print("4. Add callback URLs: http://localhost:5000/auth0-login")
    print("5. Or create a new application")

if __name__ == "__main__":
    test_direct_auth() 