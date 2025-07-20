from flask import request, jsonify, g
from flask_restx import Namespace, Resource, fields
from ..middleware.auth_middleware import require_auth
from ..services.database_service import db_service
from ..models.user import User
import requests
import os

# Define models for Swagger documentation
def init_routes(api_ns):
    # Define response models
    user_model = api_ns.model('User', {
        'user_id': fields.String(description='User ID from Auth0'),
        'email': fields.String(description='User email'),
        'name': fields.String(description='User full name'),
        'nickname': fields.String(description='User nickname'),
        'picture': fields.String(description='User profile picture URL'),
        'email_verified': fields.Boolean(description='Whether email is verified'),
        'created_at': fields.String(description='User creation timestamp')
    })
    
    public_response_model = api_ns.model('PublicResponse', {
        'message': fields.String(description='Response message'),
        'timestamp': fields.String(description='Response timestamp')
    })
    
    protected_response_model = api_ns.model('ProtectedResponse', {
        'message': fields.String(description='Response message'),
        'user': fields.Nested(api_ns.model('UserInfo', {
            'sub': fields.String(description='User subject ID'),
            'email': fields.String(description='User email'),
            'name': fields.String(description='User name')
        })),
        'timestamp': fields.String(description='Response timestamp')
    })
    
    auth0_config_model = api_ns.model('Auth0Config', {
        'domain': fields.String(description='Auth0 domain'),
        'client_id': fields.String(description='Auth0 client ID'),
        'audience': fields.String(description='Auth0 API audience'),
        'authorization_url': fields.String(description='Auth0 authorization URL'),
        'token_url': fields.String(description='Auth0 token URL')
    })
    
    error_model = api_ns.model('Error', {
        'error': fields.String(description='Error message')
    })

    @api_ns.route('/profile')
    class Profile(Resource):
        @api_ns.doc('get_user_profile', security='apikey')
        @api_ns.response(200, 'Success', user_model)
        @api_ns.response(401, 'Unauthorized', error_model)
        @require_auth
        def get(self):
            """Get user profile from JWT token and sync with database"""
            user = g.user
            
            # Create or update user in database (upsert operation)
            # This ensures user data is always synced with Auth0
            user_obj = User(
                auth0_id=user.get("sub"),
                email=user.get("email"),
                name=user.get("name"),
                picture=user.get("picture")
            )
            
            # Use upsert to create or update user
            success = db_service.upsert_user(user_obj)
            if not success:
                api_ns.abort(500, "Failed to sync user data with database")
            
            # Get the user from database to ensure we have the latest data
            db_user = db_service.get_user_by_auth0_id(user.get("sub"))
            
            return {
                "user_id": user.get("sub"),
                "email": user.get("email"),
                "name": user.get("name"),
                "nickname": user.get("nickname"),
                "picture": user.get("picture"),
                "email_verified": user.get("email_verified", False),
                "created_at": db_user.created_at.isoformat() if db_user and hasattr(db_user, 'created_at') else None,
                "updated_at": db_user.updated_at.isoformat() if db_user and hasattr(db_user, 'updated_at') else None
            }

    @api_ns.route('/public')
    class PublicEndpoint(Resource):
        @api_ns.doc('public_endpoint')
        @api_ns.response(200, 'Success', public_response_model)
        def get(self):
            """Public endpoint that doesn't require authentication"""
            return {
                "message": "This is a public endpoint",
                "timestamp": "2024-01-01T00:00:00Z"
            }

    @api_ns.route('/protected')
    class ProtectedEndpoint(Resource):
        @api_ns.doc('protected_endpoint', security='apikey')
        @api_ns.response(200, 'Success', protected_response_model)
        @api_ns.response(401, 'Unauthorized', error_model)
        @require_auth
        def get(self):
            """Protected endpoint that requires JWT authentication"""
            user = g.user
            return {
                "message": "This is a protected endpoint",
                "user": {
                    "sub": user.get("sub"),
                    "email": user.get("email"),
                    "name": user.get("name")
                },
                "timestamp": "2024-01-01T00:00:00Z"
            }

    @api_ns.route('/config')
    class Auth0Config(Resource):
        @api_ns.doc('get_auth0_config')
        @api_ns.response(200, 'Success', auth0_config_model)
        def get(self):
            """Get Auth0 configuration for frontend authentication"""
            domain = os.getenv("AUTH0_DOMAIN", "dev-6l1mmvy5gvfsblef.us.auth0.com")
            client_id = os.getenv("AUTH0_CLIENT_ID", "iyuPvHVVRTz45HLnjMVE1Z6gwOVdTDLR")
            audience = os.getenv("AUTH0_API_AUDIENCE", "https://dev-6l1mmvy5gvfsblef.us.auth0.com/api/v2/")
            
            return {
                "domain": domain,
                "client_id": client_id,
                "audience": audience,
                "authorization_url": f"https://{domain}/authorize",
                "token_url": f"https://{domain}/oauth/token"
            }

    @api_ns.route('/sync')
    class UserSync(Resource):
        @api_ns.doc('sync_user', security='apikey')
        @api_ns.response(200, 'Success', user_model)
        @api_ns.response(401, 'Unauthorized', error_model)
        @api_ns.response(500, 'Server Error', error_model)
        @require_auth
        def post(self):
            """Sync user data with database (useful for cross-device login)"""
            user = g.user
            
            # Create or update user in database
            user_obj = User(
                auth0_id=user.get("sub"),
                email=user.get("email"),
                name=user.get("name"),
                picture=user.get("picture")
            )
            
            success = db_service.upsert_user(user_obj)
            if not success:
                api_ns.abort(500, "Failed to sync user data")
            
            # Get the synced user data
            db_user = db_service.get_user_by_auth0_id(user.get("sub"))
            
            return {
                "user_id": user.get("sub"),
                "email": user.get("email"),
                "name": user.get("name"),
                "nickname": user.get("nickname"),
                "picture": user.get("picture"),
                "email_verified": user.get("email_verified", False),
                "created_at": db_user.created_at.isoformat() if db_user and hasattr(db_user, 'created_at') else None,
                "updated_at": db_user.updated_at.isoformat() if db_user and hasattr(db_user, 'updated_at') else None,
                "synced": True
            }

    @api_ns.route('/status')
    class UserStatus(Resource):
        @api_ns.doc('get_user_status', security='apikey')
        @api_ns.response(200, 'Success')
        @api_ns.response(401, 'Unauthorized', error_model)
        @require_auth
        def get(self):
            """Get user status in database"""
            user = g.user
            auth0_id = user.get("sub")
            
            status = db_service.get_user_status(auth0_id)
            
            return {
                "user_id": auth0_id,
                "exists_in_database": status.get("exists", False),
                "email": status.get("email"),
                "name": status.get("name"),
                "created_at": status.get("created_at"),
                "updated_at": status.get("updated_at"),
                "error": status.get("error")
            } 