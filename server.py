from flask import Flask, request, jsonify, g
from flask_cors import CORS
import jwt
import requests
import json
from functools import wraps
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("APP_SECRET_KEY", "your-secret-key")

# Enable CORS for React frontend
CORS(app, origins=["http://localhost:3000"])

# Auth0 configuration
AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN", "dev-6l1mmvy5gvfsblef.us.auth0.com")
AUTH0_CLIENT_ID = os.getenv("AUTH0_CLIENT_ID", "iyuPvHVVRTz45HLnjMVE1Z6gwOVdTDLR")
API_AUDIENCE = os.getenv("AUTH0_API_AUDIENCE", "https://dev-6l1mmvy5gvfsblef.us.auth0.com/api/v2/")

# Cache for Auth0 public keys
AUTH0_PUBLIC_KEYS = None

def get_auth0_public_keys():
    """Fetch Auth0 public keys for JWT verification"""
    global AUTH0_PUBLIC_KEYS
    if AUTH0_PUBLIC_KEYS is None:
        try:
            jwks_url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
            response = requests.get(jwks_url)
            response.raise_for_status()
            jwks = response.json()
            AUTH0_PUBLIC_KEYS = {key['kid']: key for key in jwks['keys']}
        except Exception as e:
            print(f"Error fetching Auth0 public keys: {e}")
            AUTH0_PUBLIC_KEYS = {}
    return AUTH0_PUBLIC_KEYS

def verify_jwt_token(token):
    """Verify JWT token from Auth0"""
    try:
        # Decode token header to get key ID
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get('kid')
        
        if not kid:
            return None, "No key ID in token"
        
        # Get public keys
        public_keys = get_auth0_public_keys()
        if kid not in public_keys:
            return None, "Key ID not found"
        
        # Get the public key
        public_key = public_keys[kid]
        
        # Convert JWK to PEM format
        from cryptography.hazmat.primitives.asymmetric import rsa
        from cryptography.hazmat.primitives import serialization
        import base64

        def base64url_decode(input_str):
            # Add padding if necessary
            rem = len(input_str) % 4
            if rem > 0:
                input_str += '=' * (4 - rem)
            return base64.urlsafe_b64decode(input_str)

        # Extract key components
        n = int.from_bytes(base64url_decode(public_key['n']), 'big')
        e = int.from_bytes(base64url_decode(public_key['e']), 'big')

        # Create RSA public key
        rsa_public_key = rsa.RSAPublicNumbers(e, n).public_key()
        
        # Serialize to PEM
        pem = rsa_public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )
        
        # Verify and decode token
        payload = jwt.decode(
            token,
            pem,
            algorithms=['RS256'],
            audience=API_AUDIENCE,
            issuer=f"https://{AUTH0_DOMAIN}/"
        )
        
        return payload, None
        
    except jwt.ExpiredSignatureError:
        return None, "Token has expired"
    except jwt.InvalidTokenError as e:
        return None, f"Invalid token: {str(e)}"
    except Exception as e:
        return None, f"Token verification error: {str(e)}"

def require_auth(f):
    """Decorator to require JWT authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({"error": "No authorization header"}), 401
        
        try:
            # Extract token from "Bearer <token>"
            parts = auth_header.split()
            if parts[0].lower() != 'bearer' or len(parts) != 2:
                return jsonify({"error": "Invalid authorization header format"}), 401
            
            token = parts[1]
            payload, error = verify_jwt_token(token)
            
            if error:
                return jsonify({"error": error}), 401
            
            # Add user info to Flask g object
            g.user = payload
            return f(*args, **kwargs)
            
        except Exception as e:
            return jsonify({"error": f"Authentication error: {str(e)}"}), 401
    
    return decorated

# ----- API ROUTES -----

@app.route("/api/public", methods=["GET"])
def public_endpoint():
    """Public endpoint that doesn't require authentication"""
    return jsonify({
        "message": "This is a public endpoint",
        "timestamp": "2024-01-01T00:00:00Z"
    })

@app.route("/api/protected", methods=["GET"])
@require_auth
def protected_endpoint():
    """Protected endpoint that requires JWT authentication"""
    user = g.user
    return jsonify({
        "message": "This is a protected endpoint",
        "user": {
            "sub": user.get("sub"),
            "email": user.get("email"),
            "name": user.get("name")
        },
        "timestamp": "2024-01-01T00:00:00Z"
    })

@app.route("/api/profile", methods=["GET"])
@require_auth
def get_profile():
    """Get user profile from JWT token"""
    user = g.user
    return jsonify({
        "user_id": user.get("sub"),
        "email": user.get("email"),
        "name": user.get("name"),
        "nickname": user.get("nickname"),
        "picture": user.get("picture"),
        "email_verified": user.get("email_verified", False)
    })

@app.route("/api/data", methods=["POST"])
@require_auth
def post_data():
    """Example protected endpoint that accepts data"""
    user = g.user
    data = request.get_json()
    
    return jsonify({
        "message": "Data received successfully",
        "user_id": user.get("sub"),
        "received_data": data,
        "timestamp": "2024-01-01T00:00:00Z"
    })

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "Flask API",
        "timestamp": "2024-01-01T00:00:00Z"
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)
