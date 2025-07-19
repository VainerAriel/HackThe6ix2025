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