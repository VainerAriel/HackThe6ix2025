from flask import Blueprint, request, jsonify, g
from ..middleware.auth_middleware import require_auth
from ..services.database_service import db_service
from ..models.user import User

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route("/profile", methods=["GET"])
@require_auth
def get_profile():
    """Get user profile from JWT token"""
    user = g.user
    
    # Check if user exists in database, create if not
    db_user = db_service.get_user_by_auth0_id(user.get("sub"))
    if not db_user:
        # Create new user in database
        new_user = User(
            auth0_id=user.get("sub"),
            email=user.get("email"),
            name=user.get("name"),
            picture=user.get("picture")
        )
        db_service.create_user(new_user)
        db_user = new_user
    
    return jsonify({
        "user_id": user.get("sub"),
        "email": user.get("email"),
        "name": user.get("name"),
        "nickname": user.get("nickname"),
        "picture": user.get("picture"),
        "email_verified": user.get("email_verified", False),
        "created_at": db_user.created_at.isoformat() if hasattr(db_user, 'created_at') else None
    })

@bp.route("/public", methods=["GET"])
def public_endpoint():
    """Public endpoint that doesn't require authentication"""
    return jsonify({
        "message": "This is a public endpoint",
        "timestamp": "2024-01-01T00:00:00Z"
    })

@bp.route("/protected", methods=["GET"])
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