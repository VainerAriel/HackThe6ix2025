# Swagger API Documentation

This backend now includes comprehensive Swagger/OpenAPI documentation for all API endpoints.

## Accessing the Documentation

Once the Flask server is running, you can access the Swagger documentation at:

**http://localhost:5000/api/docs**

## Features

### Interactive API Documentation
- **Visual Interface**: Browse all available endpoints with a clean, interactive interface
- **Request/Response Models**: See the exact structure of request and response data
- **Authentication**: Built-in support for JWT token authentication
- **Try It Out**: Test endpoints directly from the documentation interface

### API Endpoints Covered

#### Authentication (`/api/auth`)
- `GET /api/auth/profile` - Get user profile (requires authentication)
- `GET /api/auth/public` - Public endpoint (no authentication required)
- `GET /api/auth/protected` - Protected endpoint (requires authentication)

#### Chat (`/api/chat`)
- `GET /api/chat/conversations` - Get all conversations
- `POST /api/chat/conversations` - Create a new conversation
- `GET /api/chat/conversations/{id}` - Get specific conversation
- `DELETE /api/chat/conversations/{id}` - Delete a conversation
- `POST /api/chat/conversations/{id}/messages` - Send a message
- `POST /api/chat/generate` - Generate AI response
- `PUT /api/chat/conversations/{id}/title` - Update conversation title

#### User (`/api/user`)
- `POST /api/user/data` - Submit user data (requires authentication)
- `GET /api/user/health` - Health check endpoint

## Gemini AI API Integration

The backend integrates with Google's Gemini AI API to provide intelligent workplace communication coaching. All Gemini API calls are handled through the `GeminiService` class.

### Gemini API Features

#### 1. **Multi-turn Conversations**
- **Endpoint**: `POST /api/chat/conversations/{id}/messages`
- **Model**: `gemini-2.0-flash-exp`
- **Features**:
  - Context window management (default: 20 messages)
  - System prompt integration for workplace coaching
  - Automatic conversation title generation
  - Enhanced error handling and recovery

**Request Example**:
```json
{
  "message": "My boss is very direct and sometimes harsh. How should I approach asking for a raise?",
  "context_window_size": 20
}
```

**Response Example**:
```json
{
  "success": true,
  "response": "When approaching a direct boss for a raise, preparation and confidence are key...",
  "conversation_id": "conversation_123",
  "model": "gemini-2.0-flash-exp",
  "context_window_size": 20,
  "messages_processed": 15
}
```

#### 2. **Single Response Generation**
- **Endpoint**: `POST /api/chat/generate`
- **Purpose**: Generate AI responses without conversation context
- **Use Case**: One-off questions or scenario responses

**Request Example**:
```json
{
  "prompt": "How should I handle a difficult coworker who constantly interrupts me in meetings?"
}
```

**Response Example**:
```json
{
  "success": true,
  "response": "Here are some strategies to handle interruptions professionally...",
  "model": "gemini-2.0-flash-exp"
}
```

#### 3. **Workplace Scenario Generation**
- **Service Method**: `generate_scenario(profile)`
- **Purpose**: Create realistic workplace scenarios based on user profile
- **Input**: User profile with role, boss personality, goals, and confidence level

**Profile Structure**:
```json
{
  "role": "Software Engineer",
  "boss_personality": "Direct and results-oriented",
  "goal": "Request flexible work hours",
  "confidence": 7
}
```

**Response Example**:
```json
{
  "success": true,
  "scenario": "Your boss is a direct, results-oriented manager. You are in a 1-on-1 meeting. You want to request flexible work hours. Respond to this situation.",
  "model": "gemini-2.0-flash-exp"
}
```

#### 4. **Response Critique and Feedback**
- **Service Method**: `critique_response(scenario, user_input)`
- **Purpose**: Provide structured feedback on user responses to scenarios
- **Output**: JSON-structured critique with scores, strengths, and suggestions

**Request Example**:
```json
{
  "scenario": "Your boss asks you to work overtime on a project...",
  "user_input": "I'd be happy to help with the overtime work..."
}
```

**Response Example**:
```json
{
  "success": true,
  "critique": {
    "overall_critique": "Good start but could be more specific about boundaries",
    "score": 7,
    "score_rationale": "Shows willingness but lacks specific terms and conditions",
    "strengths": [
      "Demonstrates team spirit and flexibility",
      "Maintains professional tone"
    ],
    "suggestions": [
      "Specify your availability and limitations",
      "Ask for clear expectations and timeline"
    ],
    "revised_version": "I'd be happy to help with the overtime work. Could you clarify the timeline and specific deliverables? I'm available evenings this week but have prior commitments on weekends."
  },
  "model": "gemini-2.0-flash-exp"
}
```

#### 5. **Model Information**
- **Service Method**: `get_model_info()`
- **Purpose**: Get information about the Gemini model and its capabilities

**Response Example**:
```json
{
  "model": "gemini-2.0-flash-exp",
  "provider": "Google",
  "status": "available",
  "features": [
    "Multi-turn conversations",
    "Context window management",
    "Structured feedback generation",
    "Workplace scenario generation"
  ]
}
```

### Gemini API Configuration

#### Environment Variables
```env
GEMINI_API_KEY=your-gemini-api-key
```

#### System Prompt
The Gemini service uses a specialized system prompt for workplace communication coaching:

```
You are an expert workplace communication coach. Your role is to help users improve their professional communication skills through realistic workplace scenarios and constructive feedback.

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
- Keep responses concise but comprehensive
```

### Context Window Management

The Gemini service implements intelligent context window management to handle long conversations:

- **Default Window Size**: 20 messages
- **Algorithm**: Keeps system context + recent messages
- **Token Optimization**: Ensures API limits are respected
- **Automatic Truncation**: Removes older messages when limit exceeded

### Error Handling

All Gemini API calls include comprehensive error handling:

- **API Key Validation**: Checks for valid Gemini API key
- **Rate Limiting**: Handles API quota limits gracefully
- **JSON Parsing**: Robust parsing of structured responses
- **Network Errors**: Timeout and connection error handling
- **Model Errors**: Handles model-specific errors and fallbacks

## Authentication

To use authenticated endpoints in the Swagger interface:

1. Click the "Authorize" button at the top of the page
2. Enter your JWT token in the format: `Bearer YOUR_TOKEN_HERE`
3. Click "Authorize"
4. You can now test protected endpoints

## Development

### Adding New Endpoints

When adding new endpoints, follow this pattern:

```python
@api_ns.route('/your-endpoint')
class YourEndpoint(Resource):
    @api_ns.doc('endpoint_description', security='apikey')
    @api_ns.expect(your_request_model)
    @api_ns.response(200, 'Success', your_response_model)
    @api_ns.response(401, 'Unauthorized', error_model)
    def get(self):
        """Your endpoint description"""
        # Your implementation here
        return {"message": "success"}
```

### Defining Models

```python
# Request model
your_request_model = api_ns.model('YourRequest', {
    'field_name': fields.String(required=True, description='Field description')
})

# Response model
your_response_model = api_ns.model('YourResponse', {
    'success': fields.Boolean(description='Operation success status'),
    'data': fields.Raw(description='Response data')
})
```

### Adding Gemini API Endpoints

To expose additional Gemini service methods as API endpoints:

```python
@api_ns.route('/scenarios/generate')
class GenerateScenario(Resource):
    @api_ns.doc('generate_scenario', security='apikey')
    @api_ns.expect(scenario_request_model)
    @api_ns.response(200, 'Success', scenario_response_model)
    @require_auth
    def post(self):
        """Generate a workplace scenario based on user profile"""
        data = request.get_json()
        profile = data.get("profile")
        
        response = gemini_service.generate_scenario(profile)
        return response
```

## Benefits

1. **Developer Experience**: Easy to understand and test API endpoints
2. **Documentation**: Always up-to-date with code changes
3. **Testing**: Built-in testing interface
4. **Integration**: Can be used to generate client SDKs
5. **Standards**: Follows OpenAPI 3.0 specification
6. **AI Integration**: Comprehensive Gemini API documentation and examples

## Dependencies

The Swagger implementation uses:
- `flask-restx>=1.1.0` - Provides Swagger/OpenAPI support for Flask
- `google-generativeai` - Google's official Gemini API client
- Automatic model validation and serialization
- Built-in error handling and response formatting 