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
    
    def generate_scenario_and_roleplay(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate a workplace scenario and start roleplay based on comprehensive user profile
        
        Args:
            profile: Dictionary containing comprehensive user profile information
                - scenario_type: Type of conversation to practice
                - relationship: Who they're talking to
                - communication_style: How the person communicates
                - job_level: User's role level
                - industry: Industry context
                - specific_goal: What they want to achieve
                - challenge_level: Expected difficulty
                - time_constraint: Timeline pressure
                - stakes: What happens if it goes poorly
                - personal_style: User's natural communication style
                - past_experience: User's past experience with similar conversations
        
        Returns:
            Dictionary containing the scenario setup and initial roleplay response
        """
        try:
            # Create descriptive mappings for better prompts
            scenario_descriptions = {
                'salary_negotiation': 'Practice salary discussions and career advancement conversations',
                'difficult_feedback': 'Learn to deliver constructive criticism professionally',
                'boundary_setting': 'Practice saying no professionally and managing workload',
                'conflict_resolution': 'Navigate disagreements and tensions with coworkers',
                'idea_pitching': 'Present proposals and get buy-in from stakeholders',
                'performance_discussion': 'Address performance issues constructively',
                'resource_request': 'Make compelling cases for what your team needs'
            }
            
            relationship_descriptions = {
                'direct_manager': 'Your direct manager/boss',
                'senior_leadership': 'Senior leadership (VP, C-suite)',
                'peer_colleague': 'Peer/colleague at your level',
                'team_member': 'Someone on your team',
                'cross_functional': 'Someone from another department',
                'client_external': 'External client or stakeholder'
            }
            
            communication_style_descriptions = {
                'supportive_collaborative': 'Listens well, asks questions, generally encouraging',
                'direct_no_nonsense': 'Gets straight to the point, values efficiency over rapport',
                'skeptical_analytical': 'Questions everything, wants data and proof points',
                'busy_impatient': 'Always rushing, interrupts, hard to get their attention',
                'defensive_territorial': 'Protective of their domain, resistant to change',
                'unpredictable_moody': 'Hard to read, reactions vary depending on their mood'
            }
            
            prompt = f"""You are an AI roleplay partner for workplace conversation practice. Your job is to roleplay as a specific character and provide an immersive, realistic workplace conversation experience.

ROLEPLAY CHARACTER SETUP:
- Relationship to user: {relationship_descriptions.get(profile.get('relationship', ''), profile.get('relationship', ''))}
- Communication style: {profile.get('communication_style', '')} - {communication_style_descriptions.get(profile.get('communication_style', ''), '')}
- Industry context: {profile.get('industry', '')}
- Conversation difficulty: {profile.get('challenge_level', '')}
- Timeline pressure: {profile.get('time_constraint', '')}

USER CONTEXT:
- Role level: {profile.get('job_level', '')}
- Scenario type: {profile.get('scenario_type', '')} - {scenario_descriptions.get(profile.get('scenario_type', ''), '')}
- Specific goal: {profile.get('specific_goal', '')}
- Stakes level: {profile.get('stakes', '')}
- User's natural style: {profile.get('personal_style', '')}
- Past experience: {profile.get('past_experience', '')}

INSTRUCTIONS:
1. Create a realistic workplace scenario setting (time, place, brief context)
2. Stay completely in character - be authentic to your communication style
3. Provide appropriate resistance/support based on the challenge level:
   - Low challenge: Generally receptive, minor concerns only
   - Medium challenge: Some pushback, need convincing, ask clarifying questions
   - High challenge: Significant resistance, skeptical, may interrupt or dismiss initially
4. Do NOT break character to give coaching advice during the roleplay
5. Respond as this person would naturally respond in this workplace situation
6. Keep responses concise and realistic (2-4 sentences typically)

Start by briefly setting the scene (1 sentence) and then make your opening statement as this character. Begin the roleplay now."""

            response = self.model.generate_content(prompt)
            
            return {
                'success': True,
                'scenario_and_response': response.text.strip(),
                'roleplay_prompt': prompt,  # Store for continued conversation
                'model': 'gemini-2.5-flash'
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def continue_roleplay(self, roleplay_context: str, conversation_history: List[Dict[str, str]]) -> Dict[str, Any]:
        """
        Continue the roleplay conversation
        
        Args:
            roleplay_context: The original roleplay setup prompt
            conversation_history: List of previous messages in the roleplay
        
        Returns:
            Dictionary containing the continued roleplay response
        """
        try:
            # Build the full conversation context
            full_prompt = roleplay_context + "\n\nCONVERSATION SO FAR:\n"
            
            for msg in conversation_history:
                if msg['role'] == 'user':
                    full_prompt += f"USER: {msg['content']}\n"
                elif msg['role'] == 'assistant':
                    full_prompt += f"CHARACTER: {msg['content']}\n"
            
            full_prompt += "\nContinue the roleplay as this character. Stay in character and respond naturally to the user's latest message. Keep your response concise and realistic."
            
            response = self.model.generate_content(full_prompt)
            
            return {
                'success': True,
                'response': response.text.strip(),
                'model': 'gemini-2.5-flash'
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def end_roleplay_and_critique(self, profile: Dict[str, Any], conversation_history: List[Dict[str, str]]) -> Dict[str, Any]:
        """
        End the roleplay and provide comprehensive feedback
        
        Args:
            profile: The original user profile
            conversation_history: Complete conversation history from the roleplay
        
        Returns:
            Dictionary containing detailed feedback and coaching
        """
        try:
            # Build conversation transcript
            transcript = ""
            for msg in conversation_history:
                if msg['role'] == 'user':
                    transcript += f"USER: {msg['content']}\n"
                elif msg['role'] == 'assistant' and not msg['content'].startswith('You are an AI roleplay'):
                    transcript += f"CHARACTER: {msg['content']}\n"
            
            prompt = f"""You are an expert workplace communication coach. A user just completed a roleplay practice session for: {profile.get('scenario_type', '')} - {profile.get('specific_goal', '')}.

USER CONTEXT:
- Role level: {profile.get('job_level', '')}
- Communication goal: {profile.get('specific_goal', '')}
- Challenge level: {profile.get('challenge_level', '')}
- Stakes: {profile.get('stakes', '')}
- User's natural style: {profile.get('personal_style', '')}
- Past experience: {profile.get('past_experience', '')}

ROLEPLAY TRANSCRIPT:
{transcript}

Provide comprehensive coaching feedback with the following sections. Use clear formatting but avoid special characters like hashtags or asterisks:

1. Overall Performance Summary:
[2-3 sentence summary of how the conversation went overall]

2. Score and Rationale:
Score: [X]/10
[Detailed explanation of the score considering: clarity of communication, professionalism, effectiveness in achieving their goal, handling of pushback, and overall confidence]

3. What You Did Well:
- [Specific strength 1 with example from transcript]
- [Specific strength 2 with example from transcript]
- [Specific strength 3 with example from transcript]

4. Areas for Improvement:
- [Specific area 1 with concrete suggestion]
- [Specific area 2 with concrete suggestion]
- [Specific area 3 with concrete suggestion]

5. Recommended Next Steps:
[2-3 specific actionable recommendations for continued improvement]

6. Key Phrases to Practice:
[3-4 specific phrases or approaches they could use in similar future conversations]

Focus on being constructive, specific, and actionable in your feedback."""

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
    
    # Keep the old method for backward compatibility
    def generate_scenario(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        DEPRECATED: Use generate_scenario_and_roleplay instead
        Generate a workplace scenario based on user profile (old format)
        """
        return self.generate_scenario_and_roleplay(profile)
    
    # Keep the old method for backward compatibility  
    def critique_response(self, scenario: str, user_input: str) -> Dict[str, Any]:
        """
        DEPRECATED: Use end_roleplay_and_critique instead
        Generate feedback on user's response to a scenario (old format)
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