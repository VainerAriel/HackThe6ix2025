import google.generativeai as genai
from typing import List, Dict, Any, Optional
import os

class GeminiService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY is required")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-pro')
    
    def generate_response(self, messages: List[Dict[str, str]], conversation_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate a response using Gemini API
        
        Args:
            messages: List of message dictionaries with 'role' and 'content' keys
            conversation_id: Optional conversation ID for context
        
        Returns:
            Dictionary containing the response and metadata
        """
        try:
            # Convert messages to Gemini format
            gemini_messages = []
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
                'model': 'gemini-pro'
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'conversation_id': conversation_id
            }
    
    def generate_single_response(self, prompt: str) -> Dict[str, Any]:
        """
        Generate a single response for a prompt
        
        Args:
            prompt: The user's prompt
            
        Returns:
            Dictionary containing the response and metadata
        """
        try:
            response = self.model.generate_content(prompt)
            
            return {
                'success': True,
                'response': response.text,
                'model': 'gemini-pro'
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
                'model': 'gemini-pro',
                'provider': 'Google',
                'status': 'available'
            }
        except Exception as e:
            return {
                'error': str(e),
                'status': 'error'
            }

# Global Gemini service instance
gemini_service = GeminiService() 