# PitchPerfect Development Server Starter
# This script starts both frontend and backend development servers

Write-Host "🚀 Starting PitchPerfect Development Servers" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Check if .env files exist
Write-Host "Checking environment configuration..." -ForegroundColor Yellow

if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠️  Warning: backend\.env file not found" -ForegroundColor Yellow
    Write-Host "   Please create backend\.env with your API keys" -ForegroundColor Gray
}

if (-not (Test-Path "frontend\.env.local")) {
    Write-Host "⚠️  Warning: frontend\.env.local file not found" -ForegroundColor Yellow
    Write-Host "   Please create frontend\.env.local with your Auth0 config" -ForegroundColor Gray
}

Write-Host "`n🌐 Starting Backend Server (Flask)..." -ForegroundColor Yellow
Write-Host "   Backend will be available at: http://localhost:5000" -ForegroundColor Gray

# Start backend server in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; python run.py"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

Write-Host "`n⚛️  Starting Frontend Server (Next.js)..." -ForegroundColor Yellow
Write-Host "   Frontend will be available at: http://localhost:3000" -ForegroundColor Gray

# Start frontend server in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev"

Write-Host "`n🎉 Development servers started!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "`n💡 Tips:" -ForegroundColor Yellow
Write-Host "   - Keep both terminal windows open" -ForegroundColor Gray
Write-Host "   - Press Ctrl+C in each window to stop the servers" -ForegroundColor Gray
Write-Host "   - Check the terminal windows for any error messages" -ForegroundColor Gray

Write-Host "`n🚀 Happy coding!" -ForegroundColor Green