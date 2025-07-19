#!/usr/bin/env python3
"""
Test script to verify JWT token works with the fixed auth middleware
"""
import requests

def test_jwt_token():
    """Test the JWT token with the profile endpoint"""
    
    # Your JWT token from the request
    token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFkWG5hS1ZfVzJQRlpuUk5ienprRyJ9.eyJpc3MiOiJodHRwczovL2Rldi02bDFtbXZ5NWd2ZnNibGVmLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2ODdiMTNiZWY4ZjExMWRhNzY3YzJkNTkiLCJhdWQiOlsiaHR0cHM6Ly9kZXYtNmwxbW12eTVndmZzYmxlZi51cy5hdXRoMC5jb20vYXBpL3YyLyIsImh0dHBzOi8vZGV2LTZsMW1tdnk1Z3Zmc2JsZWYudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTc1Mjk0NjkyMywiZXhwIjoxNzUyOTU0MTIzLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXpwIjoiaXl1UHZIVlZSVHo0NUhMbmpNVkUxWjZnd09WZFRETFIifQ.dX--2a_jdVsqEL6mfJEaPz91ZMeFX_hB7hwb7_3372jlFjxQGR0klU2LarhDSRLtumC-7ux7iuaeNB9d0bKZzWlR_jCe_rGLqq5hT_vSSS-wm-8BwmBoMjwb5j9PMTGW31hCel-E_DFjfKu8ilNvQyrQimvI5KBeVPIWk2pjPUYKxfXa9bfg_xFg3aH2DLFqPIAWWjCj-UgctH2RGgFLGQZ-GFxnxZchALqadfkhcQ2SVno4iAV7gk41HamSJwxBEdEEiY0_Nyp-zTl0n1f5EPdwDb1_g3nUf4OxiiPVasynlXiBnb0MGR7-0SI0u8cRKXzDyD_pMd-Lb5N2x0Ke4A"
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    try:
        print("🧪 Testing JWT token with profile endpoint...")
        response = requests.get('http://localhost:5000/api/auth/profile', headers=headers)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Success! User profile retrieved:")
            print(f"   User ID: {data.get('user_id')}")
            print(f"   Email: {data.get('email')}")
            print(f"   Name: {data.get('name')}")
            print(f"   Email Verified: {data.get('email_verified')}")
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Make sure it's running on http://localhost:5000")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_jwt_token() 