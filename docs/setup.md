# Setup Guide

This guide will help you set up the HackThe6ix project with MongoDB Atlas, Auth0, Gemini API, Flask, and React.

## Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB Atlas account
- Auth0 account
- Google Cloud account (for Gemini API)

## Backend Setup

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Auth0 Configuration
AUTH0_DOMAIN=dev-6l1mmvy5gvfsblef.us.auth0.com
AUTH0_CLIENT_ID=iyuPvHVVRTz45HLnjMVE1Z6gwOVdTDLR
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_API_AUDIENCE=https://dev-6l1mmvy5gvfsblef.us.auth0.com/api/v2/

# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/hackthe6ix?retryWrites=true&w=majority

# Gemini API Configuration
GEMINI_API_KEY=your-gemini-api-key

# Flask Configuration
FLASK_SECRET_KEY=your-secret-key-here
FLASK_ENV=development
```

### 3. MongoDB Atlas Setup

**Note: You'll be using the shared MongoDB Atlas cluster. Ask the team lead for the connection string.**

1. **Get Connection String from Team Lead**
   - Ask your team lead for the MongoDB Atlas connection string
   - It should look like: `mongodb+srv://username:password@cluster.mongodb.net/hackthe6ix?retryWrites=true&w=majority`

2. **Add to Environment File**
   - Add the connection string to your `backend/.env` file as `MONGODB_URI`

**Alternative: If you need to set up your own Atlas cluster:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project and cluster
4. Set up database access and network access
5. Get your connection string and update `MONGODB_URI` in `.env`

### 4. Auth0 Setup

1. **Create Auth0 Account**
   - Go to [Auth0](https://auth0.com)
   - Sign up for a free account
   - Create a new tenant

2. **Create Application**
   - Go to "Applications" in the left sidebar
   - Click "Create Application"
   - Name it "HackThe6ix Frontend"
   - Choose "Single Page Application"
   - Click "Create"

3. **Configure Application Settings**
   - In your application settings, configure:
     - **Allowed Callback URLs**: `http://localhost:3000`
     - **Allowed Logout URLs**: `http://localhost:3000`
     - **Allowed Web Origins**: `http://localhost:3000`

4. **Create API**
   - Go to "APIs" in the left sidebar
   - Click "Create API"
   - Name: "HackThe6ix API"
   - Identifier: `https://dev-6l1mmvy5gvfsblef.us.auth0.com/api/v2/`
   - Signing Algorithm: RS256
   - Click "Create"

5. **Get Credentials**
   - Copy your Domain, Client ID, and Client Secret from the application settings
   - Update your `.env` file with these values

### 5. Gemini API Setup

**Note: You'll be using the shared Gemini API key. Ask the team lead for the API key.**

1. **Get API Key from Team Lead**
   - Ask your team lead for the Gemini API key
   - Add it to your `backend/.env` file as `GEMINI_API_KEY`

**Alternative: If you need to set up your own Gemini API key:**
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click on "Get API key" in the top right
4. Click "Create API key"
5. Copy the generated API key and add to `backend/.env`

### 6. Run Backend

```bash
cd backend
python run.py
```

The backend will run on `http://localhost:5000`

## Frontend Setup

### 1. Install Node Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Variables

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_AUTH0_DOMAIN=dev-6l1mmvy5gvfsblef.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=iyuPvHVVRTz45HLnjMVE1Z6gwOVdTDLR
REACT_APP_AUTH0_AUDIENCE=https://dev-6l1mmvy5gvfsblef.us.auth0.com/api/v2/
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Run Frontend

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
HackThe6ix2025/
├── backend/                 # Flask backend
│   ├── app/
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth middleware
│   │   └── utils/          # Helper functions
│   ├── tests/              # Backend tests
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── context/        # React context
│   │   └── hooks/          # Custom hooks
│   └── package.json        # Node dependencies
├── docs/                   # Documentation
└── scripts/                # Build/deployment scripts
```

## API Endpoints

### Authentication
- `GET /api/auth/public` - Public endpoint
- `GET /api/auth/protected` - Protected endpoint
- `GET /api/auth/profile` - Get user profile

### Chat
- `GET /api/chat/conversations` - Get user conversations
- `POST /api/chat/conversations` - Create new conversation
- `GET /api/chat/conversations/{id}` - Get specific conversation
- `POST /api/chat/conversations/{id}/messages` - Send message
- `DELETE /api/chat/conversations/{id}` - Delete conversation
- `POST /api/chat/generate` - Generate single response

### User
- `POST /api/user/data` - Post user data
- `GET /api/user/health` - Health check

## Quick Start (For Team Members)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd HackThe6ix2025
```

### 2. Environment Setup
- Copy the provided Auth0 credentials (already configured)
- Get the MongoDB Atlas connection string from your team lead
- Get the Gemini API key from your team lead
- Create `.env` files in both `backend/` and `frontend/` directories

### 3. Run the Application (Recommended)

**Option A: Using PowerShell Script (Recommended)**
```powershell
# Right-click on start-dev.ps1 and select "Run with PowerShell"
# OR run from PowerShell:
.\start-dev.ps1
```

**Option B: Manual Setup**
```bash
# Install all dependencies (both backend and frontend)
npm run install:all

# Start both backend and frontend simultaneously
npm run dev
```

Both methods will start:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## Development

### Using the PowerShell Script

The `start-dev.ps1` script automates the entire development setup:

**What it does:**
- ✅ Checks prerequisites (Python, Node.js, npm)
- ✅ Creates Python virtual environment if needed
- ✅ Installs Python dependencies in virtual environment
- ✅ Installs Node.js dependencies if needed
- ✅ Starts Flask backend server (http://localhost:5000)
- ✅ Starts React frontend server (http://localhost:3000)
- ✅ Opens both servers in separate PowerShell windows

**How to use:**
1. Right-click on `start-dev.ps1` → "Run with PowerShell"
2. OR open PowerShell in project root and run: `.\start-dev.ps1`

**What you'll see:**
- Main window shows setup progress
- Backend window shows Flask server output
- Frontend window shows React development server output

**To stop servers:**
- Close the PowerShell windows
- OR press `Ctrl+C` in each server window

### Backend Development
- The Flask app uses a modular structure with blueprints
- Models are defined in `backend/app/models/`
- Services handle business logic in `backend/app/services/`
- Middleware handles authentication in `backend/app/middleware/`

### Frontend Development
- React components are organized by feature
- Context is used for state management
- Services handle API communication
- Custom hooks provide reusable logic

## Troubleshooting

### Common Issues

1. **PowerShell Script Issues**
   - **Execution Policy Error**: Run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` in PowerShell as Administrator
   - **Virtual Environment Not Found**: The script will create one automatically, just run it again
   - **Python/Node Not Found**: Install Python 3.8+ and Node.js 16+ and ensure they're in PATH
   - **Script Won't Run**: Right-click `start-dev.ps1` → "Run with PowerShell"

2. **MongoDB Atlas Connection Error**
   - Verify your MongoDB Atlas connection string format
   - Check if your IP address is whitelisted in Network Access (ask team lead)
   - Ensure your database user has the correct permissions
   - Test connection string in MongoDB Compass
   - Ask team lead to verify cluster status and access

3. **Auth0 Authentication Error**
   - Verify Auth0 credentials in `.env` files
   - Check callback URLs in Auth0 dashboard: `http://localhost:3000`
   - Ensure API audience matches: `https://dev-6l1mmvy5gvfsblef.us.auth0.com/api/v2/`
   - Check browser console for Auth0 errors

4. **Gemini API Error**
   - Verify API key in `backend/.env` file
   - Check API quota and limits in Google AI Studio
   - Ensure proper API permissions
   - Test API key with a simple curl request
   - Ask team lead to verify API key and quota status

5. **CORS Error**
   - Backend CORS is configured for `http://localhost:3000`
   - Check if frontend is running on correct port
   - Ensure both backend and frontend are running

6. **Environment Variables Not Loading**
   - Restart your development servers after creating `.env` files
   - Ensure `.env` files are in the correct directories
   - Check for typos in variable names

### Logs

- Backend logs are printed to console
- Check browser console for frontend errors
- MongoDB logs can be found in MongoDB logs directory 