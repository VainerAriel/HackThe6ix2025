from flask import request, jsonify, g
from flask_restx import Namespace, Resource, fields
from ..middleware.auth_middleware import require_auth
from ..services.gemini_service import gemini_service
from ..services.database_service import db_service
from ..models.conversation import Conversation, Message

def init_routes(api_ns):
    # Define models for Swagger documentation
    conversation_model = api_ns.model('Conversation', {
        'id': fields.String(description='Conversation ID'),
        'title': fields.String(description='Conversation title'),
        'created_at': fields.String(description='Creation timestamp'),
        'updated_at': fields.String(description='Last update timestamp'),
        'message_count': fields.Integer(description='Number of messages in conversation')
    })
    
    message_model = api_ns.model('Message', {
        'content': fields.String(description='Message content'),
        'role': fields.String(description='Message role (user/assistant)'),
        'timestamp': fields.String(description='Message timestamp')
    })
    
    conversation_detail_model = api_ns.model('ConversationDetail', {
        'id': fields.String(description='Conversation ID'),
        'title': fields.String(description='Conversation title'),
        'messages': fields.List(fields.Nested(message_model), description='List of messages'),
        'created_at': fields.String(description='Creation timestamp'),
        'updated_at': fields.String(description='Last update timestamp')
    })
    
    conversations_response_model = api_ns.model('ConversationsResponse', {
        'conversations': fields.List(fields.Nested(conversation_model), description='List of conversations')
    })
    
    create_conversation_model = api_ns.model('CreateConversation', {
        'title': fields.String(description='Conversation title', default='New Conversation')
    })
    
    create_conversation_response_model = api_ns.model('CreateConversationResponse', {
        'success': fields.Boolean(description='Operation success status'),
        'conversation_id': fields.String(description='Created conversation ID'),
        'title': fields.String(description='Conversation title')
    })
    
    send_message_model = api_ns.model('SendMessage', {
        'message': fields.String(required=True, description='Message content'),
        'context_window_size': fields.Integer(description='Maximum messages to include in context', default=20)
    })
    
    send_message_response_model = api_ns.model('SendMessageResponse', {
        'success': fields.Boolean(description='Operation success status'),
        'response': fields.String(description='AI generated response'),
        'conversation_id': fields.String(description='Conversation ID'),
        'model': fields.String(description='AI model used'),
        'context_window_size': fields.Integer(description='Context window size used'),
        'messages_processed': fields.Integer(description='Number of messages processed')
    })
    
    generate_response_model = api_ns.model('GenerateResponse', {
        'prompt': fields.String(required=True, description='Prompt for AI generation')
    })
    
    generate_response_response_model = api_ns.model('GenerateResponseResponse', {
        'success': fields.Boolean(description='Operation success status'),
        'response': fields.String(description='AI generated response'),
        'model': fields.String(description='AI model used')
    })
    
    error_model = api_ns.model('Error', {
        'error': fields.String(description='Error message')
    })
    
    success_model = api_ns.model('Success', {
        'success': fields.Boolean(description='Operation success status'),
        'message': fields.String(description='Success message')
    })

    @api_ns.route('/conversations')
    class Conversations(Resource):
        @api_ns.doc('get_conversations', security='apikey')
        @api_ns.response(200, 'Success', conversations_response_model)
        @api_ns.response(401, 'Unauthorized', error_model)
        @require_auth
        def get(self):
            """Get all conversations for the authenticated user"""
            user_id = g.user.get("sub")
            conversations = db_service.get_user_conversations(user_id)
            
            return {
                "conversations": [
                    {
                        "id": conv.conversation_id,
                        "title": conv.title,
                        "created_at": conv.created_at.isoformat(),
                        "updated_at": conv.updated_at.isoformat(),
                        "message_count": conv.get_message_count()
                    }
                    for conv in conversations
                ]
            }

        @api_ns.doc('create_conversation', security='apikey')
        @api_ns.expect(create_conversation_model)
        @api_ns.response(201, 'Created', create_conversation_response_model)
        @api_ns.response(401, 'Unauthorized', error_model)
        @api_ns.response(500, 'Server Error', error_model)
        @require_auth
        def post(self):
            """Create a new conversation"""
            user_id = g.user.get("sub")
            data = request.get_json()
            title = data.get("title", "New Conversation")
            
            conversation = Conversation(user_id=user_id, title=title)
            conversation_id = db_service.create_conversation(conversation)
            
            if conversation_id:
                return {
                    "success": True,
                    "conversation_id": conversation_id,
                    "title": title
                }, 201
            else:
                api_ns.abort(500, "Failed to create conversation")

    @api_ns.route('/conversations/<conversation_id>')
    @api_ns.param('conversation_id', 'The conversation identifier')
    class ConversationDetail(Resource):
        @api_ns.doc('get_conversation', security='apikey')
        @api_ns.response(200, 'Success', conversation_detail_model)
        @api_ns.response(401, 'Unauthorized', error_model)
        @api_ns.response(403, 'Forbidden', error_model)
        @api_ns.response(404, 'Not Found', error_model)
        @require_auth
        def get(self, conversation_id):
            """Get a specific conversation"""
            user_id = g.user.get("sub")
            conversation = db_service.get_conversation(conversation_id)
            
            if not conversation:
                api_ns.abort(404, "Conversation not found")
            
            if conversation.user_id != user_id:
                api_ns.abort(403, "Unauthorized")
            
            return {
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
            }

        @api_ns.doc('delete_conversation', security='apikey')
        @api_ns.response(200, 'Success', success_model)
        @api_ns.response(401, 'Unauthorized', error_model)
        @api_ns.response(403, 'Forbidden', error_model)
        @api_ns.response(404, 'Not Found', error_model)
        @api_ns.response(500, 'Server Error', error_model)
        @require_auth
        def delete(self, conversation_id):
            """Delete a conversation"""
            user_id = g.user.get("sub")
            conversation = db_service.get_conversation(conversation_id)
            
            if not conversation:
                api_ns.abort(404, "Conversation not found")
            
            if conversation.user_id != user_id:
                api_ns.abort(403, "Unauthorized")
            
            success = db_service.delete_conversation(conversation_id)
            
            if success:
                return {"success": True, "message": "Conversation deleted"}
            else:
                api_ns.abort(500, "Failed to delete conversation")

    @api_ns.route('/conversations/<conversation_id>/messages')
    @api_ns.param('conversation_id', 'The conversation identifier')
    class ConversationMessages(Resource):
        @api_ns.doc('send_message', security='apikey')
        @api_ns.expect(send_message_model)
        @api_ns.response(200, 'Success', send_message_response_model)
        @api_ns.response(400, 'Bad Request', error_model)
        @api_ns.response(401, 'Unauthorized', error_model)
        @api_ns.response(403, 'Forbidden', error_model)
        @api_ns.response(500, 'Server Error', error_model)
        @require_auth
        def post(self, conversation_id):
            """Send a message in a conversation with enhanced context management"""
            user_id = g.user.get("sub")
            data = request.get_json()
            message_content = data.get("message")
            context_window_size = data.get("context_window_size", 20)
            
            if not message_content:
                api_ns.abort(400, "Message content is required")
            
            # Get or create conversation
            conversation = db_service.get_conversation(conversation_id)
            if not conversation:
                # Create new conversation
                conversation = Conversation(user_id=user_id, title="New Conversation")
                conversation_id = db_service.create_conversation(conversation)
                conversation = db_service.get_conversation(conversation_id)
            
            if conversation.user_id != user_id:
                api_ns.abort(403, "Unauthorized")
            
            # Use enhanced conversation handling with context management
            gemini_response = gemini_service.generate_response_with_conversation(
                conversation, 
                message_content, 
                context_window_size
            )
            
            if gemini_response["success"]:
                # Update conversation in database (messages already added by the service)
                db_service.update_conversation(conversation_id, conversation)
                
                return {
                    "success": True,
                    "response": gemini_response["response"],
                    "conversation_id": conversation_id,
                    "model": gemini_response["model"],
                    "context_window_size": gemini_response.get("context_window_size", context_window_size),
                    "messages_processed": gemini_response.get("messages_processed", len(conversation.messages))
                }
            else:
                api_ns.abort(500, f"Failed to generate response: {gemini_response['error']}")

    @api_ns.route('/generate')
    class GenerateResponse(Resource):
        @api_ns.doc('generate_response', security='apikey')
        @api_ns.expect(generate_response_model)
        @api_ns.response(200, 'Success', generate_response_response_model)
        @api_ns.response(400, 'Bad Request', error_model)
        @api_ns.response(401, 'Unauthorized', error_model)
        @api_ns.response(500, 'Server Error', error_model)
        @require_auth
        def post(self):
            """Generate a single response without conversation context"""
            data = request.get_json()
            prompt = data.get("prompt")
            
            if not prompt:
                api_ns.abort(400, "Prompt is required")
            
            response = gemini_service.generate_single_response(prompt)
            
            if response["success"]:
                return {
                    "success": True,
                    "response": response["response"],
                    "model": response["model"]
                }
            else:
                api_ns.abort(500, f"Failed to generate response: {response['error']}")

    @api_ns.route('/conversations/<conversation_id>/title')
    @api_ns.param('conversation_id', 'The conversation identifier')
    class ConversationTitle(Resource):
        @api_ns.doc('update_conversation_title', security='apikey')
        @api_ns.response(200, 'Success', success_model)
        @api_ns.response(401, 'Unauthorized', error_model)
        @api_ns.response(403, 'Forbidden', error_model)
        @api_ns.response(404, 'Not Found', error_model)
        @api_ns.response(500, 'Server Error', error_model)
        @require_auth
        def put(self, conversation_id):
            """Update conversation title based on content"""
            user_id = g.user.get("sub")
            conversation = db_service.get_conversation(conversation_id)
            
            if not conversation:
                api_ns.abort(404, "Conversation not found")
            
            if conversation.user_id != user_id:
                api_ns.abort(403, "Unauthorized")
            
            # Generate title from conversation content
            new_title = conversation.generate_title_from_content()
            conversation.title = new_title
            
            # Update in database
            success = db_service.update_conversation(conversation_id, conversation)
            
            if success:
                return {
                    "success": True, 
                    "message": "Conversation title updated",
                    "title": new_title
                }
            else:
                api_ns.abort(500, "Failed to update conversation title") 