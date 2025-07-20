#!/bin/bash

# PitchPerfect Setup Script for Unix/Linux/macOS
# This script installs all dependencies for both frontend and backend

echo "🚀 PitchPerfect Setup Script"
echo "================================"

# Check if Node.js is installed
echo "Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js found: $NODE_VERSION"
else
    echo "❌ Node.js not found. Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

# Check if Python is installed
echo "Checking Python installation..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "✅ Python found: $PYTHON_VERSION"
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_VERSION=$(python --version)
    echo "✅ Python found: $PYTHON_VERSION"
    PYTHON_CMD="python"
else
    echo "❌ Python not found. Please install Python 3.8+ from https://python.org/"
    exit 1
fi

# Check if pip is installed
echo "Checking pip installation..."
if command -v pip3 &> /dev/null; then
    PIP_VERSION=$(pip3 --version)
    echo "✅ pip found: $PIP_VERSION"
    PIP_CMD="pip3"
elif command -v pip &> /dev/null; then
    PIP_VERSION=$(pip --version)
    echo "✅ pip found: $PIP_VERSION"
    PIP_CMD="pip"
else
    echo "❌ pip not found. Please install pip"
    exit 1
fi

echo ""
echo "📦 Installing Frontend Dependencies..."
cd frontend
if npm install; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo ""
echo "🐍 Installing Backend Dependencies..."
cd ../backend
if $PIP_CMD install -r requirements.txt; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Return to root directory
cd ..

echo ""
echo "📝 Environment Setup Instructions:"
echo "================================="
echo "1. Create backend/.env file with your API keys:"
echo "   AUTH0_DOMAIN=your-domain.auth0.com"
echo "   AUTH0_CLIENT_ID=your-client-id"
echo "   AUTH0_CLIENT_SECRET=your-client-secret"
echo "   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pitchperfect"
echo "   GEMINI_API_KEY=your-gemini-api-key"
echo "   FLASK_SECRET_KEY=your-secret-key"
echo "   FLASK_ENV=development"

echo ""
echo "2. Create frontend/.env.local file with your Auth0 config:"
echo "   NEXT_PUBLIC_AUTH0_SECRET=your-auth0-secret"
echo "   NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com"
echo "   NEXT_PUBLIC_AUTH0_BASE_URL=http://localhost:3000"
echo "   NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id"
echo "   NEXT_PUBLIC_AUTH0_CLIENT_SECRET=your-client-secret"
echo "   NEXT_PUBLIC_API_URL=http://localhost:5000/api"

echo ""
echo "🎉 Setup Complete!"
echo "Run 'npm run dev' to start the development servers" 