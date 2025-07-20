import google.generativeai as genai
from typing import List, Dict, Any, Optional
import os

from dotenv import load_dotenv; load_dotenv()

class GeminiService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY is required")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel(model_name='gemini-2.5-flash')
    
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
                'model': 'gemini-2.5-flash'
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
                'model': 'gemini-2.5-flash'
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
                - confidence: Confidence level (1-5)
        
        Returns:
            Dictionary containing the generated scenario
        """
        try:
            prompt = f"""
You are a workplace scenario generator. Based on the user's profile, create a realistic but brief and concise workplace situation that they must respond to. Include enough detail to make the situation feel real.

User Profile:
- Role: {profile['role']}
- Boss personality: {profile['boss_personality']}
- Goal: {profile['goal']}
- Confidence level: {profile['confidence']}/5

Output format:
"Your boss [describe briefly, omit boss's name]. You are in a 1-on-1 meeting. You want to [goal]. Respond to this situation."
"""
            response = self.model.generate_content(prompt)
            
            return {
                'success': True,
                'scenario': response.text.strip(),
                'model': 'gemini-2.5-flash'
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def critique_response(self, scenario: str, user_input: str) -> Dict[str, Any]:
        """
        Generate feedback on user's response to a scenario
        
        Args:
            scenario: The original workplace scenario
            user_input: The user's response to the scenario
        
        Returns:
            Dictionary containing the critique and feedback
        """
        try:
            prompt = f"""
You are an expert workplace communication coach. A user has responded to this scenario:

Scenario:
"{scenario}"

User's Response:
"{user_input}"

Provide the following sections in your feedback. Do not use any special formatting characters like hashtags, asterisks, or brackets. Ensure each section appears only once and there is no repetition of content.

1. Overall Critique:
[Your short overall critique here]

2. Score (1-10) and Rationale:
[Score]/10 - [Brief explanation of the score based on clarity, professionalism, effectiveness in achieving the goal, and completeness.]

3. Two Strengths:
   - [Strength 1]
   - [Strength 2]

4. Two Suggestions for Improvement:
   - [Suggestion 1]
   - [Suggestion 2]


Format your output clearly, using simple line breaks for separation between sections and bullet points.
"""
            response = self.model.generate_content(prompt)
            
            return {
                'success': True,
                'critique': response.text.strip(),
                'model': 'gemini-2.5-flash'
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
                'model': 'gemini-2.5-flash',
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