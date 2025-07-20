from flask import Flask
from flask_cors import CORS
from .config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Enable CORS
    CORS(app, origins=["http://localhost:3000"])
    
    # Register blueprints
    from .routes import auth, chat, user
    auth.init_routes(app)
    chat.init_routes(app)
    user.init_routes(app)
    
    return app 