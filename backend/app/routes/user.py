from flask import request, jsonify, g
from flask_restx import Namespace, Resource, fields
from ..middleware.auth_middleware import require_auth
from ..services.database_service import db_service

def init_routes(api_ns):
    # Define models for Swagger documentation
    post_data_model = api_ns.model('PostData', {
        'data': fields.Raw(description='Data to be processed')
    })
    
    post_data_response_model = api_ns.model('PostDataResponse', {
        'message': fields.String(description='Response message'),
        'user_id': fields.String(description='User ID'),
        'received_data': fields.Raw(description='Received data'),
        'timestamp': fields.String(description='Response timestamp')
    })
    
    onboarding_data_model = api_ns.model('OnboardingData', {
        'boss_type': fields.String(description='Boss type from onboarding', required=True),
        'role': fields.String(description='User role from onboarding'),
        'confidence': fields.Integer(description='Confidence level from onboarding'),
        'goals': fields.List(fields.String, description='User goals from onboarding')
    })
    
    onboarding_response_model = api_ns.model('OnboardingResponse', {
        'message': fields.String(description='Response message'),
        'success': fields.Boolean(description='Update success status'),
        'user_id': fields.String(description='User ID')
    })
    
    health_response_model = api_ns.model('HealthResponse', {
        'status': fields.String(description='Service status'),
        'service': fields.String(description='Service name'),
        'timestamp': fields.String(description='Response timestamp')
    })
    
    error_model = api_ns.model('Error', {
        'error': fields.String(description='Error message')
    })

    @api_ns.route('/data')
    class UserData(Resource):
        @api_ns.doc('post_data', security='apikey')
        @api_ns.expect(post_data_model)
        @api_ns.response(200, 'Success', post_data_response_model)
        @api_ns.response(401, 'Unauthorized', error_model)
        @require_auth
        def post(self):
            """Example protected endpoint that accepts data"""
            user = g.user
            data = request.get_json()
            
            return {
                "message": "Data received successfully",
                "user_id": user.get("sub"),
                "received_data": data,
                "timestamp": "2024-01-01T00:00:00Z"
            }

    @api_ns.route('/onboarding')
    class OnboardingData(Resource):
        @api_ns.doc('get_onboarding', security='apikey')
        @api_ns.response(200, 'Success')
        @api_ns.response(401, 'Unauthorized', error_model)
        @require_auth
        def get(self):
            """Get user onboarding data"""
            user = g.user
            auth0_id = user.get("sub")
            
            # Get user from database
            user_data = db_service.get_user_by_auth0_id(auth0_id)
            
            if user_data:
                return {
                    "boss_type": user_data.boss_type,
                    "role": user_data.role,
                    "confidence": user_data.confidence,
                    "goals": user_data.goals,
                    "user_id": auth0_id
                }
            else:
                return {"error": "User not found"}, 404

        @api_ns.doc('update_onboarding', security='apikey')
        @api_ns.expect(onboarding_data_model)
        @api_ns.response(200, 'Success', onboarding_response_model)
        @api_ns.response(401, 'Unauthorized', error_model)
        @api_ns.response(400, 'Bad Request', error_model)
        @require_auth
        def post(self):
            """Update user onboarding data"""
            user = g.user
            auth0_id = user.get("sub")
            data = request.get_json()
            
            if not data or 'boss_type' not in data:
                return {"error": "boss_type is required"}, 400
            
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
                return {
                    "message": "Onboarding data updated successfully",
                    "success": True,
                    "user_id": auth0_id
                }
            else:
                return {"error": "Failed to update onboarding data"}, 500

    @api_ns.route('/health')
    class HealthCheck(Resource):
        @api_ns.doc('health_check')
        @api_ns.response(200, 'Success', health_response_model)
        def get(self):
            """Health check endpoint"""
            return {
                "status": "healthy",
                "service": "Flask API",
                "timestamp": "2024-01-01T00:00:00Z"
            } 