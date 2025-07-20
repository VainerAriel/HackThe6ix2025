import jwt
import requests
from functools import wraps
from flask import request, jsonify, g, current_app
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
import base64

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

def verify_jwt_token(token):
    """Verify JWT token from Auth0 (ID token or access token)"""
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
        
        # For ID tokens, the audience is the client ID
        client_id = current_app.config['AUTH0_CLIENT_ID']
        
        payload = jwt.decode(
            token,
            pem,
            algorithms=['RS256'],
            audience=client_id,  # Use client ID for ID tokens
            issuer=f"https://{auth0_domain}/"
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