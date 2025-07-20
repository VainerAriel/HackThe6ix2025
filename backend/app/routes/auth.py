from flask import request, jsonify, g
from ..middleware.auth_middleware import require_auth
from ..services.database_service import db_service
from ..models.user import User
import requests
import os

def init_routes(app):
    # Profile endpoint
    @app.route('/api/auth/profile', methods=['GET'])
    @require_auth
    def get_profile():
        """Get user profile from JWT token and sync with database"""
        user = g.user
        
        # Create or update user in database (upsert operation)
        # This ensures user data is always synced with Auth0
        user_obj = User(
            auth0_id=user.get("sub"),
            name=user.get("name"),
            email=user.get("email"),
            username=user.get("username"),
            picture=user.get("picture")
        )
        
        # Use upsert to create or update user
        success = db_service.upsert_user(user_obj)
        if not success:
            return jsonify({"error": "Failed to sync user data with database"}), 500
        
        # Get the user from database to ensure we have the latest data
        db_user = db_service.get_user_by_auth0_id(user.get("sub"))
        
        return jsonify({
            "user_id": user.get("sub"),
            "name": user.get("name"),
            "email": user.get("email"),
            "username": user.get("username"),
            "picture": user.get("picture"),
            "created_at": db_user.created_at.isoformat() if db_user and hasattr(db_user, 'created_at') else None,
            "updated_at": db_user.updated_at.isoformat() if db_user and hasattr(db_user, 'updated_at') else None
        })

    # Public endpoint
    @app.route('/api/auth/public', methods=['GET'])
    def public_endpoint():
        """Public endpoint that doesn't require authentication"""
        return jsonify({
            "message": "This is a public endpoint",
            "timestamp": "2024-01-01T00:00:00Z"
        })

    # Protected endpoint
    @app.route('/api/auth/protected', methods=['GET'])
    @require_auth
    def protected_endpoint():
        """Protected endpoint that requires JWT authentication"""
        user = g.user
        return jsonify({
            "message": "This is a protected endpoint",
            "user": {
                "sub": user.get("sub"),
                "name": user.get("name"),
                "email": user.get("email"),
                "username": user.get("username")
            },
            "timestamp": "2024-01-01T00:00:00Z"
        })

    # Auth0 config endpoint
    @app.route('/api/auth/config', methods=['GET'])
    def get_auth0_config():
        """Get Auth0 configuration for frontend authentication"""
        domain = os.getenv("AUTH0_DOMAIN")
        client_id = os.getenv("AUTH0_CLIENT_ID")
        audience = os.getenv("AUTH0_API_AUDIENCE")
        
        return jsonify({
            "domain": domain,
            "client_id": client_id,
            "audience": audience,
            "authorization_url": f"https://{domain}/authorize",
            "token_url": f"https://{domain}/oauth/token"
        })

    # User sync endpoint
    @app.route('/api/auth/sync', methods=['POST'])
    @require_auth
    def sync_user():
        """Sync user data with database (useful for cross-device login)"""
        user = g.user
        
        # Create or update user in database
        user_obj = User(
            auth0_id=user.get("sub"),
            name=user.get("name"),
            email=user.get("email"),
            username=user.get("username"),
            picture=user.get("picture")
        )
        
        success = db_service.upsert_user(user_obj)
        if not success:
            return jsonify({"error": "Failed to sync user data"}), 500
        
        # Get the synced user data
        db_user = db_service.get_user_by_auth0_id(user.get("sub"))
        
        return jsonify({
            "user_id": user.get("sub"),
            "name": user.get("name"),
            "email": user.get("email"),
            "username": user.get("username"),
            "picture": user.get("picture"),
            "created_at": db_user.created_at.isoformat() if db_user and hasattr(db_user, 'created_at') else None,
            "updated_at": db_user.updated_at.isoformat() if db_user and hasattr(db_user, 'updated_at') else None,
            "synced": True
        })

    # User status endpoint
    @app.route('/api/auth/status', methods=['GET'])
    @require_auth
    def get_user_status():
        """Get user status in database"""
        user = g.user
        auth0_id = user.get("sub")
        
        status = db_service.get_user_status(auth0_id)
        
        return jsonify({
            "user_id": auth0_id,
            "exists_in_database": status.get("exists", False),
            "name": status.get("name"),
            "email": status.get("email"),
            "username": status.get("username"),
            "created_at": status.get("created_at"),
            "updated_at": status.get("updated_at"),
            "error": status.get("error")
        }) 