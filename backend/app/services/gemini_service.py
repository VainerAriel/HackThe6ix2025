import google.generativeai as genai
from typing import List, Dict, Any, Optional
import os
import json
from ..models.conversation import Conversation, Message

from dotenv import load_dotenv; load_dotenv()

class GeminiService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY is required")
        
        # Configure the API
        genai.configure(api_key=self.api_key)
        
        # Create the model instance
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        # System prompt for workplace communication coaching
        self.system_prompt = """You are an expert workplace communication coach. Your role is to help users improve their professional communication skills through realistic workplace scenarios and constructive feedback.

Key responsibilities:
1. Provide clear, actionable advice on workplace communication
2. Help users practice responses to challenging situations
3. Give constructive feedback that builds confidence
4. Maintain a supportive and professional tone
5. Focus on practical, real-world applications

Guidelines:
- Be encouraging but honest in your feedback
- Provide specific examples when helpful
- Consider cultural and organizational context
- Emphasize both what works well and areas for improvement
- Keep responses concise but comprehensive"""
    
    def generate_response(self, messages: List[Dict[str, str]], conversation_id: Optional[str] = None, context_window_size: int = 20) -> Dict[str, Any]:
        """
        Generate a response using Gemini API with enhanced context management
        
        Args:
            messages: List of message dictionaries with 'role' and 'content' keys
            conversation_id: Optional conversation ID for context
            context_window_size: Maximum number of messages to include in context
        
        Returns:
            Dictionary containing the response and metadata
        """
        try:
            # Apply context window to manage token limits
            if len(messages) > context_window_size:
                # Keep system context and recent messages
                context_messages = messages[:1]  # Keep first message (system context)
                context_messages.extend(messages[-(context_window_size-1):])  # Add recent messages
                messages = context_messages
            
            # Convert messages to Gemini format
            gemini_messages = []
            
            # Add system prompt if this is the first message
            if not messages or messages[0]['role'] != 'system':
                gemini_messages.append({
                    'role': 'user',
                    'parts': [self.system_prompt]
                })
                gemini_messages.append({
                    'role': 'model',
                    'parts': ['I understand. I\'m here to help you improve your workplace communication skills. How can I assist you today?']
                })
            
            # Add conversation messages
            for msg in messages:
                if msg['role'] == 'user':
                    gemini_messages.append({
                        'role': 'user',
                        'parts': [msg['content']]
                    })
                elif msg['role'] == 'assistant':
                    gemini_messages.append({
                        'role': 'model',
                        'parts': [msg['content']]
                    })
            
            # Generate response
            response = self.model.generate_content(gemini_messages)
            
            return {
                'success': True,
                'response': response.text,
                'conversation_id': conversation_id,
                'model': 'gemini-2.0-flash-exp',
                'context_window_size': context_window_size,
                'messages_processed': len(messages)
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'conversation_id': conversation_id
            }
    
    def generate_response_with_conversation(self, conversation: Conversation, new_message: str, context_window_size: int = 20) -> Dict[str, Any]:
        """
        Generate a response using a Conversation object with enhanced context management
        
        Args:
            conversation: Conversation object containing message history
            new_message: The new user message to respond to
            context_window_size: Maximum number of messages to include in context
        
        Returns:
            Dictionary containing the response and metadata
        """
        try:
            # Add the new message to conversation
            conversation.add_message(new_message, "user")
            
            # Get context window from conversation
            context_messages = conversation.get_context_window(context_window_size)
            
            # Convert to format expected by generate_response
            messages = [
                {
                    "role": msg.role,
                    "content": msg.content
                }
                for msg in context_messages
            ]
            
            # Generate response
            response = self.generate_response(messages, conversation.conversation_id, context_window_size)
            
            if response["success"]:
                # Add assistant response to conversation
                conversation.add_message(response["response"], "assistant")
                
                # Update conversation title if needed
                conversation.update_title_if_needed()
            
            return response
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'conversation_id': conversation.conversation_id
            }
    
    def generate_single_response(self, prompt: str) -> Dict[str, Any]:
        """
        Generate a single response for a prompt without conversation context
        
        Args:
            prompt: The user's prompt
            
        Returns:
            Dictionary containing the response and metadata
        """
        try:
            # Create a simple conversation with system prompt and user message
            messages = [
                {
                    'role': 'user',
                    'parts': [self.system_prompt]
                },
                {
                    'role': 'model',
                    'parts': ['I understand. I\'m here to help you improve your workplace communication skills.']
                },
                {
                    'role': 'user',
                    'parts': [prompt]
                }
            ]
            
            response = self.model.generate_content(messages)
            
            return {
                'success': True,
                'response': response.text,
                'model': 'gemini-2.0-flash-exp'
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def generate_scenario(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate a workplace scenario based on user profile
        
        Args:
            profile: Dictionary containing user profile information
                - role: User's role
                - boss_personality: Boss personality type
                - goal: User's goal
                - confidence: Confidence level (1-10)
        
        Returns:
            Dictionary containing the generated scenario
        """
        try:
            prompt = f"""
You are a workplace scenario generator. Based on the user's profile, create a realistic but concise workplace situation that they must respond to. Include enough detail to make the situation feel real.

User Profile:
- Role: {profile['role']}
- Boss personality: {profile['boss_personality']}
- Goal: {profile['goal']}
- Confidence level: {profile['confidence']}/10

Output format:
"Your boss [describe briefly, omit boss's name]. You are in a 1-on-1 meeting. You want to [goal]. Respond to this situation."

Keep the scenario concise but realistic, focusing on the specific goal and context provided.
"""
            response = self.model.generate_content(prompt)
            
            return {
                'success': True,
                'scenario': response.text.strip(),
                'model': 'gemini-2.0-flash-exp'
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def critique_response(self, scenario: str, user_input: str) -> Dict[str, Any]:
        """
        Generate feedback on user's response to a scenario, returning a structured JSON object.
        
        Args:
            scenario: The original workplace scenario
            user_input: The user's response to the scenario
            
        Returns:
            Dictionary containing the critique and feedback in a structured JSON format
        """
        try:
            prompt = f"""
You are an expert workplace communication coach. A user has responded to this scenario:

Scenario:
"{scenario}"

User's Response:
"{user_input}"

Your output must be a JSON object with the following keys. Ensure all values are strings, except for score (which should be a number), strengths and suggestions (which should be arrays of two strings each).

Required JSON structure:
{{
  "overall_critique": "Your short overall critique here",
  "score": [Score from 1-10] (as a number, not string),
  "score_rationale": "Brief explanation of the score based on clarity, professionalism, effectiveness in achieving the goal, and completeness.",
  "strengths": ["First strength", "Second strength"],
  "suggestions": ["First suggestion for improvement", "Second suggestion for improvement"],
  "revised_version": "Your revised, more effective version of their response"
}}

Focus on:
- Clarity and professionalism
- Effectiveness in achieving the stated goal
- Tone and approach
- Specificity and actionable elements
"""
            response = self.model.generate_content(prompt)
            json_string = response.text.strip()
            
            # Remove markdown code block if present
            if json_string.startswith("```json") and json_string.endswith("```"):
                json_string = json_string[7:-3].strip()
            elif json_string.startswith("```") and json_string.endswith("```"):
                json_string = json_string[3:-3].strip()
            
            try:
                parsed_json = json.loads(json_string)
                return {
                    'success': True,
                    'critique': parsed_json,
                    'model': 'gemini-2.0-flash-exp'
                }
            except json.JSONDecodeError as e:
                return {
                    'success': False,
                    'error': f'Failed to parse critique response: {e}',
                    'raw_response': response.text
                }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the Gemini model"""
        try:
            return {
                'model': 'gemini-2.0-flash-exp',
                'provider': 'Google',
                'status': 'available',
                'features': [
                    'Multi-turn conversations',
                    'Context window management',
                    'Structured feedback generation',
                    'Workplace scenario generation'
                ]
            }
        except Exception as e:
            return {
                'error': str(e),
                'status': 'error'
            }

# Global Gemini service instance
gemini_service = GeminiService() 