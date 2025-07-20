from flask import request, jsonify, g
from ..middleware.auth_middleware import require_auth
from ..services.gemini_service import gemini_service
from ..services.database_service import db_service
from ..models.conversation import Conversation, Message

def init_routes(app):
    # Get all conversations
    @app.route('/api/chat/conversations', methods=['GET'])
    @require_auth
    def get_conversations():
        """Get all conversations for the authenticated user"""
        user_id = g.user.get("sub")
        conversations = db_service.get_user_conversations(user_id)
        
        return jsonify({
            "conversations": [
                {
                    "id": str(conv.id) if hasattr(conv, 'id') else None,
                    "title": conv.title,
                    "created_at": conv.created_at.isoformat(),
                    "updated_at": conv.updated_at.isoformat(),
                    "message_count": len(conv.messages)
                }
                for conv in conversations
            ]
        })

    # Create new conversation
    @app.route('/api/chat/conversations', methods=['POST'])
    @require_auth
    def create_conversation():
        """Create a new conversation"""
        user_id = g.user.get("sub")
        data = request.get_json()
        title = data.get("title", "New Conversation")
        
        conversation = Conversation(user_id=user_id, title=title)
        conversation_id = db_service.create_conversation(conversation)
        
        if conversation_id:
            return jsonify({
                "success": True,
                "conversation_id": conversation_id,
                "title": title
            }), 201
        else:
            return jsonify({"error": "Failed to create conversation"}), 500

    # Get specific conversation
    @app.route('/api/chat/conversations/<conversation_id>', methods=['GET'])
    @require_auth
    def get_conversation(conversation_id):
        """Get a specific conversation"""
        user_id = g.user.get("sub")
        conversation = db_service.get_conversation(conversation_id)
        
        if not conversation:
            return jsonify({"error": "Conversation not found"}), 404
        
        if conversation.user_id != user_id:
            return jsonify({"error": "Unauthorized"}), 403
        
        return jsonify({
            "conversation": {
                "id": conversation_id,
                "title": conversation.title,
                "messages": [
                    {
                        "content": msg.content,
                        "role": msg.role,
                        "timestamp": msg.timestamp.isoformat()
                    }
                    for msg in conversation.messages
                ],
                "created_at": conversation.created_at.isoformat(),
                "updated_at": conversation.updated_at.isoformat()
            }
        })

    # Delete conversation
    @app.route('/api/chat/conversations/<conversation_id>', methods=['DELETE'])
    @require_auth
    def delete_conversation(conversation_id):
        """Delete a conversation"""
        user_id = g.user.get("sub")
        conversation = db_service.get_conversation(conversation_id)
        
        if not conversation:
            return jsonify({"error": "Conversation not found"}), 404
        
        if conversation.user_id != user_id:
            return jsonify({"error": "Unauthorized"}), 403
        
        success = db_service.delete_conversation(conversation_id)
        
        if success:
            return jsonify({"success": True, "message": "Conversation deleted"})
        else:
            return jsonify({"error": "Failed to delete conversation"}), 500

    # Send message in conversation
    @app.route('/api/chat/conversations/<conversation_id>/messages', methods=['POST'])
    @require_auth
    def send_message(conversation_id):
        """Send a message in a conversation"""
        user_id = g.user.get("sub")
        data = request.get_json()
        message_content = data.get("message")
        
        if not message_content:
            return jsonify({"error": "Message content is required"}), 400
        
        # Get or create conversation
        conversation = db_service.get_conversation(conversation_id)
        if not conversation:
            # Create new conversation
            conversation = Conversation(user_id=user_id, title="New Conversation")
            conversation_id = db_service.create_conversation(conversation)
            conversation = db_service.get_conversation(conversation_id)
        
        if conversation.user_id != user_id:
            return jsonify({"error": "Unauthorized"}), 403
        
        # Add user message
        conversation.add_message(message_content, "user")
        
        # Prepare messages for Gemini API
        messages = [
            {
                "role": msg.role,
                "content": msg.content
            }
            for msg in conversation.messages
        ]
        
        # Generate response from Gemini
        gemini_response = gemini_service.generate_response(messages, conversation_id)
        
        if gemini_response["success"]:
            # Add assistant response to conversation
            conversation.add_message(gemini_response["response"], "assistant")
            
            # Update conversation in database
            db_service.update_conversation(conversation_id, conversation)
            
            return jsonify({
                "success": True,
                "response": gemini_response["response"],
                "conversation_id": conversation_id,
                "model": gemini_response["model"]
            })
        else:
            return jsonify({"error": f"Failed to generate response: {gemini_response['error']}"}), 500

    # Generate single response
    @app.route('/api/chat/generate', methods=['POST'])
    @require_auth
    def generate_response():
        """Generate a single response without conversation context"""
        data = request.get_json()
        prompt = data.get("prompt")
        
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400
        
        response = gemini_service.generate_single_response(prompt)
        
        if response["success"]:
            return jsonify({
                "success": True,
                "response": response["response"],
                "model": response["model"]
            })
        else:
            return jsonify({"error": f"Failed to generate response: {response['error']}"}), 500

    # NEW: Start roleplay session with comprehensive profile
    @app.route('/api/chat/start_roleplay', methods=['POST'])
    @require_auth
    def start_roleplay():
        """Start a new roleplay session based on comprehensive user profile"""
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400

        # New comprehensive required fields
        required_fields = [
            'scenario_type', 'relationship', 'communication_style', 
            'job_level', 'industry', 'specific_goal', 'challenge_level', 
            'time_constraint', 'stakes', 'personal_style', 'past_experience'
        ]
        
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                'success': False, 
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400

        result = gemini_service.generate_scenario_and_roleplay(data)
        
        if result['success']:
            # Store the roleplay context in the response for continued conversation
            result['profile'] = data  # Include the original profile for later use
            
        return jsonify(result)

    # NEW: Continue roleplay conversation
    @app.route('/api/chat/continue_roleplay', methods=['POST'])
    @require_auth  
    def continue_roleplay():
        """Continue an ongoing roleplay conversation"""
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400

        required_fields = ['roleplay_context', 'conversation_history']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400

        result = gemini_service.continue_roleplay(
            data['roleplay_context'], 
            data['conversation_history']
        )
        return jsonify(result)

    # NEW: End roleplay and get comprehensive critique
    @app.route('/api/chat/end_roleplay', methods=['POST'])
    @require_auth
    def end_roleplay():
        """End roleplay session and provide comprehensive feedback"""
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400

        required_fields = ['profile', 'conversation_history']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400

        result = gemini_service.end_roleplay_and_critique(
            data['profile'], 
            data['conversation_history']
        )
        return jsonify(result)

    # BACKWARD COMPATIBILITY: Keep old generate_scenario endpoint
    @app.route('/api/chat/generate_scenario', methods=['POST'])
    @require_auth
    def generate_scenario():
        """DEPRECATED: Generate a workplace scenario based on user profile (old format)"""
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400

        # Check if this is the old format or new format
        old_format_fields = ['role', 'boss_personality', 'goal', 'confidence']
        if all(field in data for field in old_format_fields):
            # Old format - convert confidence to integer and use old method
            try:
                data['confidence'] = int(data['confidence'])
            except ValueError:
                return jsonify({'success': False, 'error': 'Confidence must be an integer'}), 400
            
            result = gemini_service.generate_scenario(data)
            return jsonify(result)
        else:
            # New format - redirect to new method
            return start_roleplay()

    # BACKWARD COMPATIBILITY: Keep old critique_response endpoint  
    @app.route('/api/chat/critique_response', methods=['POST'])
    @require_auth
    def critique_response():
        """DEPRECATED: Critique a user's response to a scenario (old format)"""
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400

        # Check if this is old format (scenario + user_input) or new format
        if 'scenario' in data and 'user_input' in data:
            # Old format
            result = gemini_service.critique_response(data['scenario'], data['user_input'])
            return jsonify(result)
        else:
            # New format - redirect to end_roleplay
            return end_roleplay()

    # Get model information
    @app.route('/api/chat/model_info', methods=['GET'])
    def model_info():
        """Get information about the Gemini model"""
        result = gemini_service.get_model_info()
        return jsonify(result)