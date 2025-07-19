from flask import Blueprint, request, jsonify, g
from ..middleware.auth_middleware import require_auth
from ..services.gemini_service import gemini_service
from ..services.database_service import db_service
from ..models.conversation import Conversation, Message

bp = Blueprint('chat', __name__, url_prefix='/api/chat')

@bp.route("/conversations", methods=["GET"])
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

@bp.route("/conversations", methods=["POST"])
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

@bp.route("/conversations/<conversation_id>", methods=["GET"])
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

@bp.route("/conversations/<conversation_id>/messages", methods=["POST"])
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
        return jsonify({
            "error": "Failed to generate response",
            "details": gemini_response["error"]
        }), 500

@bp.route("/conversations/<conversation_id>", methods=["DELETE"])
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

@bp.route("/generate", methods=["POST"])
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
        return jsonify({
            "error": "Failed to generate response",
            "details": response["error"]
        }), 500 