from flask import Blueprint, request, jsonify, g
from ..middleware.auth_middleware import require_auth
from ..services.database_service import db_service

bp = Blueprint('user', __name__, url_prefix='/api/user')

@bp.route("/data", methods=["POST"])
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

@bp.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "Flask API",
        "timestamp": "2024-01-01T00:00:00Z"
    }) 