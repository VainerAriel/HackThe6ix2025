# PitchPerfect Setup Script
# This script installs all dependencies for both frontend and backend

Write-Host "🚀 PitchPerfect Setup Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 16+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if Python is installed
Write-Host "Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python 3.8+ from https://python.org/" -ForegroundColor Red
    exit 1
}

# Check if pip is installed
Write-Host "Checking pip installation..." -ForegroundColor Yellow
try {
    $pipVersion = pip --version
    Write-Host "✅ pip found: $pipVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ pip not found. Please install pip" -ForegroundColor Red
    exit 1
}

Write-Host "`n📦 Installing Frontend Dependencies..." -ForegroundColor Yellow
Set-Location "frontend"
try {
    npm install
    Write-Host "✅ Frontend dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "`n🐍 Installing Backend Dependencies..." -ForegroundColor Yellow
Set-Location "../backend"
try {
    pip install -r requirements.txt
    Write-Host "✅ Backend dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

# Return to root directory
Set-Location ".."

Write-Host "`n📝 Environment Setup Instructions:" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "1. Create backend/.env file with your API keys:" -ForegroundColor White
Write-Host "   AUTH0_DOMAIN=your-domain.auth0.com" -ForegroundColor Gray
Write-Host "   AUTH0_CLIENT_ID=your-client-id" -ForegroundColor Gray
Write-Host "   AUTH0_CLIENT_SECRET=your-client-secret" -ForegroundColor Gray
Write-Host "   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pitchperfect" -ForegroundColor Gray
Write-Host "   GEMINI_API_KEY=your-gemini-api-key" -ForegroundColor Gray
Write-Host "   FLASK_SECRET_KEY=your-secret-key" -ForegroundColor Gray
Write-Host "   FLASK_ENV=development" -ForegroundColor Gray

Write-Host "`n2. Create frontend/.env.local file with your Auth0 config:" -ForegroundColor White
Write-Host "   NEXT_PUBLIC_AUTH0_SECRET=your-auth0-secret" -ForegroundColor Gray
Write-Host "   NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com" -ForegroundColor Gray
Write-Host "   NEXT_PUBLIC_AUTH0_BASE_URL=http://localhost:3000" -ForegroundColor Gray
Write-Host "   NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id" -ForegroundColor Gray
Write-Host "   NEXT_PUBLIC_AUTH0_CLIENT_SECRET=your-client-secret" -ForegroundColor Gray
Write-Host "   NEXT_PUBLIC_API_URL=http://localhost:5000/api" -ForegroundColor Gray

Write-Host "`n🎉 Setup Complete!" -ForegroundColor Green
Write-Host "Run .\scripts\start-dev.ps1 to start the development servers" -ForegroundColor Cyan