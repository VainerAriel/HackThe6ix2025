# Auth0 React + Flask API Integration

This project demonstrates a complete authentication flow using Auth0 with a React frontend and Flask backend API.

## Features

- **React Frontend**: Uses Auth0 React SDK for authentication
- **Flask Backend**: JWT token verification with Auth0 public keys
- **Protected API Routes**: Secure endpoints that require valid JWT tokens
- **CORS Support**: Cross-origin requests between frontend and backend
- **Token-based Authentication**: Bearer token authentication for API calls

## Project Structure

```
HackThe6ix2025/
├── auth0-app/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ApiService.js  # API client with auth
│   │   │   ├── ApiDemo.js     # Demo component
│   │   │   ├── LoginButton.js
│   │   │   ├── LogoutButton.js
│   │   │   └── Profile.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server.py                  # Flask backend
├── requirements.txt           # Python dependencies
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

**Backend (Flask):**
```bash
pip install -r requirements.txt
```

**Frontend (React):**
```bash
cd auth0-app
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory with your Auth0 configuration:

```env
# Flask App Configuration
APP_SECRET_KEY=your-secret-key-here

# Auth0 Configuration
AUTH0_DOMAIN=dev-6l1mmvy5gvfsblef.us.auth0.com
AUTH0_CLIENT_ID=iyuPvHVVRTz45HLnjMVE1Z6gwOVdTDLR
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_API_AUDIENCE=https://dev-6l1mmvy5gvfsblef.us.auth0.com/api/v2/
```

### 3. Auth0 Configuration

1. Go to your Auth0 Dashboard
2. Create a new API or use an existing one
3. Set the API Audience to: `https://dev-6l1mmvy5gvfsblef.us.auth0.com/api/v2/`
4. Configure your React application settings:
   - Allowed Callback URLs: `http://localhost:3000`
   - Allowed Logout URLs: `http://localhost:3000`
   - Allowed Web Origins: `http://localhost:3000`

### 4. Run the Application

**Start the Flask Backend:**
```bash
python server.py
```
The backend will run on `http://localhost:5000`

**Start the React Frontend:**
```bash
cd auth0-app
npm start
```
The frontend will run on `http://localhost:3000`

## API Endpoints

### Public Endpoints (No Authentication Required)

- `GET /api/health` - Health check
- `GET /api/public` - Public data

### Protected Endpoints (Require JWT Authentication)

- `GET /api/protected` - Protected data with user info
- `GET /api/profile` - User profile from JWT token
- `POST /api/data` - Post data with authentication

## How It Works

### 1. Authentication Flow

1. User clicks "Login" in React app
2. Auth0 handles authentication and returns JWT token
3. React stores the token and uses it for API calls
4. Flask verifies JWT tokens using Auth0's public keys

### 2. JWT Verification

The Flask backend:
- Fetches Auth0's public keys from `/.well-known/jwks.json`
- Verifies JWT signatures using RSA256
- Validates token audience, issuer, and expiration
- Extracts user information from the token

### 3. API Calls

React components use the `useApi` hook to:
- Automatically include JWT tokens in Authorization headers
- Handle authentication errors
- Make authenticated requests to Flask endpoints

## Security Features

- **JWT Verification**: All protected routes verify JWT tokens
- **Public Key Validation**: Uses Auth0's public keys for signature verification
- **Token Expiration**: Automatically handles expired tokens
- **CORS Protection**: Configured for specific origins
- **Error Handling**: Comprehensive error handling for authentication failures

## Testing the Integration

1. Open `http://localhost:3000` in your browser
2. Click "Login" to authenticate with Auth0
3. Use the API Demo section to test different endpoints:
   - Health Check (public)
   - Public Data (public)
   - Protected Data (requires auth)
   - User Profile (requires auth)
   - Post Data (requires auth)

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure Flask CORS is configured for `http://localhost:3000`
2. **JWT Verification Failures**: Check Auth0 domain and API audience configuration
3. **Token Expiration**: The React SDK automatically handles token refresh
4. **Network Errors**: Ensure both frontend and backend are running

### Debug Mode

The Flask server runs in debug mode by default. Check the console for detailed error messages.

## Dependencies

### Backend
- Flask
- PyJWT
- cryptography
- flask-cors
- requests
- python-dotenv

### Frontend
- React
- @auth0/auth0-react
- axios

## Next Steps

- Add more protected API endpoints
- Implement role-based access control
- Add database integration
- Deploy to production with proper environment variables 