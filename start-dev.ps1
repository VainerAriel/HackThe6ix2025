# HackThe6ix2025 Development Startup Script
# This script starts both the backend Flask server and frontend React development server

Write-Host "Starting development environment..." -ForegroundColor Green

# Check if we're in the correct directory
if (-not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check prerequisites
if (-not (Test-Command "python")) {
    Write-Host "Error: Python is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "node")) {
    Write-Host "Error: Node.js is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "npm")) {
    Write-Host "Error: npm is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Setup virtual environment
$venvPath = "backend\.venv"
if (-not (Test-Path $venvPath)) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    Set-Location backend
    python -m venv .venv
    Set-Location ..
}

# Install Python dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
Set-Location backend
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
Set-Location ..

# Install Node dependencies
if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "Installing Node dependencies..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
}

Write-Host "Starting backend server..." -ForegroundColor Cyan

# Start backend in a new window
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Write-Host 'Starting Flask backend...' -ForegroundColor Cyan; " +
    "Set-Location '$PWD\backend'; " +
    "if (Test-Path '.\.venv\Scripts\python.exe') { " +
    "    Write-Host 'Using virtual environment Python...' -ForegroundColor Green; " +
    "    .\.venv\Scripts\python.exe -m pip install -r requirements.txt; " +
    "    .\.venv\Scripts\python.exe run.py " +
    "} else { " +
    "    Write-Host 'Virtual environment not found!' -ForegroundColor Red; " +
    "    pause " +
    "}"
) -WindowStyle Normal

Write-Host "Starting frontend server..." -ForegroundColor Cyan

# Start frontend in a new window
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Write-Host 'Starting React frontend...' -ForegroundColor Cyan; " +
    "Set-Location '$PWD\frontend'; " +
    "npm install; " +
    "npm start"
) -WindowStyle Normal

Write-Host ""
Write-Host "Development environment starting..." -ForegroundColor Green
Write-Host "Backend: http://localhost:5000" -ForegroundColor Gray
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Gray 