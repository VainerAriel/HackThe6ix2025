import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask configuration
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY")
    DEBUG = os.getenv("FLASK_ENV") == "development"
    PORT = os.getenv("FLASK_PORT")
    
    # Auth0 configuration
    AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
    AUTH0_CLIENT_ID = os.getenv("AUTH0_CLIENT_ID")
    AUTH0_CLIENT_SECRET = os.getenv("AUTH0_CLIENT_SECRET")
    
    # MongoDB configuration
    MONGODB_URI = os.getenv("MONGODB_URI")
    
    # Gemini API configuration
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") 