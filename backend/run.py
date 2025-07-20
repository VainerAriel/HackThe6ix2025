from app import create_app
from app.services.database_service import db_service
import os

# Create the Flask app instance
app = create_app()

# Initialize database connection when app starts
try:
    db_service.connect()
    print("Database connected successfully")
except Exception as e:
    print(f"Failed to connect to database: {e}")

@app.teardown_appcontext
def close_database(error):
    """Close database connection when app context ends"""
    db_service.disconnect()

if __name__ == "__main__":
    port = int(app.config.get('PORT', 5000))
    debug_mode = app.config.get('DEBUG', True)  # Default to True for safety
    
    print(f"Starting Flask app with debug={debug_mode}, port={port}")
    app.run(debug=debug_mode, port=port)
