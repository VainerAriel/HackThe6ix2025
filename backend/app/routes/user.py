from flask import request, jsonify, g
from ..middleware.auth_middleware import require_auth
from ..services.database_service import db_service

def init_routes(app):
    # Post data endpoint
    @app.route('/api/user/data', methods=['POST'])
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

    # Get onboarding data
    @app.route('/api/user/onboarding', methods=['GET'])
    @require_auth
    def get_onboarding():
        """Get user onboarding data"""
        user = g.user
        auth0_id = user.get("sub")
        
        # Get user from database
        user_data = db_service.get_user_by_auth0_id(auth0_id)
        
        if user_data:
            return jsonify({
                "boss_type": user_data.boss_type,
                "role": user_data.role,
                "confidence": user_data.confidence,
                "goals": user_data.goals,
                "user_id": auth0_id
            })
        else:
            return jsonify({"error": "User not found"}), 404

    # Update onboarding data
    @app.route('/api/user/onboarding', methods=['POST'])
    @require_auth
    def update_onboarding():
        """Update user onboarding data"""
        user = g.user
        auth0_id = user.get("sub")
        data = request.get_json()
        
        if not data or 'boss_type' not in data:
            return jsonify({"error": "boss_type is required"}), 400
        
        # Get existing user or create new one
        existing_user = db_service.get_user_by_auth0_id(auth0_id)
        
        if existing_user:
            # Update existing user
            updates = {
                'boss_type': data['boss_type']
            }
            
            # Add optional fields if provided
            if 'role' in data:
                updates['role'] = data['role']
            if 'confidence' in data:
                updates['confidence'] = data['confidence']
            if 'goals' in data:
                updates['goals'] = data['goals']
            
            success = db_service.update_user(auth0_id, updates)
        else:
            # Create new user with onboarding data
            from ..models.user import User
            new_user = User(
                auth0_id=auth0_id,
                email=user.get('email', ''),
                name=user.get('name', ''),
                picture=user.get('picture'),
                boss_type=data['boss_type'],
                role=data.get('role'),
                confidence=data.get('confidence'),
                goals=data.get('goals', [])
            )
            success = db_service.upsert_user(new_user)
        
        if success:
            return jsonify({
                "message": "Onboarding data updated successfully",
                "success": True,
                "user_id": auth0_id
            })
        else:
            return jsonify({"error": "Failed to update onboarding data"}), 500

    # Health check endpoint
    @app.route('/api/user/health', methods=['GET'])
    def health_check():
        """Health check endpoint"""
        return jsonify({
            "status": "healthy",
            "service": "Flask API",
            "timestamp": "2024-01-01T00:00:00Z"
        }) 