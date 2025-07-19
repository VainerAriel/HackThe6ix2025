from app import create_app
from app.services.database_service import db_service

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
    app.run(debug=True, port=5000)
