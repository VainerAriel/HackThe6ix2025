import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "your-secret-key")
    
    # Auth0 configuration
    AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN", "dev-6l1mmvy5gvfsblef.us.auth0.com")
    AUTH0_CLIENT_ID = os.getenv("AUTH0_CLIENT_ID", "iyuPvHVVRTz45HLnjMVE1Z6gwOVdTDLR")
    AUTH0_CLIENT_SECRET = os.getenv("AUTH0_CLIENT_SECRET")
    AUTH0_API_AUDIENCE = os.getenv("AUTH0_API_AUDIENCE", "https://dev-6l1mmvy5gvfsblef.us.auth0.com/api/v2/")
    
    # MongoDB configuration
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/hackthe6ix")
    
    # Gemini API configuration
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    
    # Flask configuration
    DEBUG = os.getenv("FLASK_ENV") == "development" 