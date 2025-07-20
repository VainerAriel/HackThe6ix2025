from app import create_app
from app.services.database_service import db_service
from flask import request, jsonify # Import request and jsonify
from flask_cors import CORS # Import CORS
from app.services.gemini_service import GeminiService # Import GeminiService

# Initialize GeminiService globally
gemini_service = GeminiService()

def register_api_endpoints(app):
    """
    Registers the API endpoints for scenario generation and critique.
    """
    CORS(app) # Enable CORS for the app instance

    @app.route('/generate_scenario', methods=['POST'])
    def generate_scenario_api():
        """
        API endpoint to generate a workplace scenario.
        Expects JSON data with 'role', 'boss_personality', 'goal', 'confidence'.
        """
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400

        required_fields = ['role', 'boss_personality', 'goal', 'confidence']
        if not all(field in data for field in required_fields):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400

        # Convert confidence to integer, as the prompt expects it this way
        try:
            data['confidence'] = int(data['confidence'])
        except ValueError:
            return jsonify({'success': False, 'error': 'Confidence must be an integer'}), 400

        result = gemini_service.generate_scenario(data)
        return jsonify(result)

    @app.route('/critique_response', methods=['POST'])
    def critique_response_api():
        """
        API endpoint to critique a user's response.
        Expects JSON data with 'scenario' and 'user_input'.
        """
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400

        required_fields = ['scenario', 'user_input']
        if not all(field in data for field in required_fields):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400

        result = gemini_service.critique_response(data['scenario'], data['user_input'])
        return jsonify(result)

    @app.route('/model_info', methods=['GET'])
    def model_info_api():
        """
        API endpoint to get information about the Gemini model.
        """
        result = gemini_service.get_model_info()
        return jsonify(result)

# Create the Flask app instance
app = create_app()

# Register the API endpoints with the app instance
register_api_endpoints(app)

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
