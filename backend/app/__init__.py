from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_restx import Api
from .config import Config
import os

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Enable CORS
    CORS(app, origins=["http://localhost:3000"])
    
    # Initialize Swagger API
    api = Api(
        app,
        version='1.0',
        title='HackThe6ix API',
        description='A comprehensive API for the HackThe6ix application with chat and authentication features',
        doc='/api/docs',
        authorizations={
            'apikey': {
                'type': 'apiKey',
                'in': 'header',
                'name': 'Authorization',
                'description': "Type 'Bearer ' followed by your JWT token"
            }
        },
        security='apikey'
    )
    
    # Create namespaces for different API sections with proper URL prefixes
    auth_ns = api.namespace('api/auth', description='Authentication operations')
    chat_ns = api.namespace('api/chat', description='Chat and conversation operations')
    user_ns = api.namespace('api/user', description='User management operations')
    
    # Register blueprints with namespaces
    from .routes import auth, chat, user
    auth.init_routes(auth_ns)
    chat.init_routes(chat_ns)
    user.init_routes(user_ns)
    
    # Serve Auth0 login page
    @app.route('/auth0-login')
    def auth0_login():
        # Get the directory where this file is located
        current_dir = os.path.dirname(os.path.abspath(__file__))
        # Go up one level to the backend directory
        backend_dir = os.path.dirname(current_dir)
        return send_from_directory(backend_dir, 'auth0_login.html')
    
    return app 