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

#### User (`/api/user`)
- `POST /api/user/data` - Submit user data (requires authentication)
- `GET /api/user/health` - Health check endpoint

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

## Benefits

1. **Developer Experience**: Easy to understand and test API endpoints
2. **Documentation**: Always up-to-date with code changes
3. **Testing**: Built-in testing interface
4. **Integration**: Can be used to generate client SDKs
5. **Standards**: Follows OpenAPI 3.0 specification

## Dependencies

The Swagger implementation uses:
- `flask-restx>=1.1.0` - Provides Swagger/OpenAPI support for Flask
- Automatic model validation and serialization
- Built-in error handling and response formatting 