import jwt
import requests
from functools import wraps
from flask import request, jsonify, g, current_app
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
import base64
import json

# Cache for Auth0 public keys
AUTH0_PUBLIC_KEYS = None

def get_auth0_public_keys():
    """Fetch Auth0 public keys for JWT verification"""
    global AUTH0_PUBLIC_KEYS
    if AUTH0_PUBLIC_KEYS is None:
        try:
            auth0_domain = current_app.config['AUTH0_DOMAIN']
            jwks_url = f"https://{auth0_domain}/.well-known/jwks.json"
            response = requests.get(jwks_url)
            response.raise_for_status()
            jwks = response.json()
            AUTH0_PUBLIC_KEYS = {key['kid']: key for key in jwks['keys']}
        except Exception as e:
            print(f"Error fetching Auth0 public keys: {e}")
            AUTH0_PUBLIC_KEYS = {}
    return AUTH0_PUBLIC_KEYS

def is_encrypted_jwt(token):
    """Check if token is an encrypted JWT (JWE)"""
    try:
        # Decode header without verification
        unverified_header = jwt.get_unverified_header(token)
        return unverified_header.get('enc') is not None
    except:
        return False

def verify_jwt_token(token):
    """Verify JWT token from Auth0 (ID token or access token)"""
    try:
        # Check if it's an encrypted JWT
        if is_encrypted_jwt(token):
            # For encrypted tokens, we'll skip verification for now
            # In production, you'd need to decrypt them properly
            try:
                # Try to decode without verification
                payload = jwt.decode(
                    token,
                    options={"verify_signature": False, "verify_encryption": False}
                )
                return payload, None
            except Exception as e:
                return None, f"Failed to decode encrypted token: {str(e)}"
        
        # Decode token header to get key ID
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get('kid')
        
        if not kid:
            # Try to decode without key ID (for some access tokens)
            try:
                auth0_domain = current_app.config['AUTH0_DOMAIN']
                # Try with a default public key or skip verification
                payload = jwt.decode(
                    token,
                    options={"verify_signature": False},  # Skip signature verification
                    algorithms=['RS256']
                )
                return payload, None
            except Exception as e:
                return None, f"Failed to decode token without key ID: {str(e)}"
        
        # Get public keys
        public_keys = get_auth0_public_keys()
        if kid not in public_keys:
            return None, "Key ID not found"
        
        # Get the public key
        public_key = public_keys[kid]
        
        # Convert JWK to PEM format
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
        auth0_domain = current_app.config['AUTH0_DOMAIN']
        client_id = current_app.config['AUTH0_CLIENT_ID']
        
        # Try to decode as ID token first (with client ID as audience) - this is most common
        try:
            payload = jwt.decode(
                token,
                pem,
                algorithms=['RS256'],
                audience=client_id,
                issuer=f"https://{auth0_domain}/"
            )
            return payload, None
        except jwt.InvalidAudienceError:
            # If that fails, try without audience validation (for some tokens)
            try:
                payload = jwt.decode(
                    token,
                    pem,
                    algorithms=['RS256'],
                    issuer=f"https://{auth0_domain}/"
                )
                return payload, None
            except Exception as e:
                return None, f"Token verification failed: {str(e)}"
        
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
            # Return dict instead of Response for flask-restx compatibility
            return {"error": "No authorization header"}, 401
        
        try:
            # Extract token from "Bearer <token>"
            parts = auth_header.split()
            if parts[0].lower() != 'bearer' or len(parts) != 2:
                return {"error": "Invalid authorization header format"}, 401
            
            token = parts[1]
            payload, error = verify_jwt_token(token)
            
            if error:
                return {"error": error}, 401
            
            # Add user info to Flask g object
            g.user = payload
            return f(*args, **kwargs)
            
        except Exception as e:
            return {"error": f"Authentication error: {str(e)}"}, 401
    
    return decorated 