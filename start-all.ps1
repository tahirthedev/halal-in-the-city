# Halal in the City - Automated Startup Script
# Run this script to start all services

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Halal in the City - Startup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker Desktop is running
Write-Host "[1/5] Checking Docker Desktop..." -ForegroundColor Yellow
$dockerRunning = docker info 2>&1 | Select-String "Server Version"
if (-not $dockerRunning) {
    Write-Host "ERROR: Docker Desktop is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and run this script again." -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✓ Docker is running" -ForegroundColor Green
Write-Host ""

# Start PostgreSQL
Write-Host "[2/5] Starting PostgreSQL database..." -ForegroundColor Yellow
Set-Location "f:\downloads\halal-in-the-city (1)\app-backend"
docker-compose up -d postgres 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ PostgreSQL started successfully" -ForegroundColor Green
    Write-Host "  Waiting 15 seconds for database initialization..." -ForegroundColor Gray
    Start-Sleep -Seconds 15
}
else {
    Write-Host "✗ Failed to start PostgreSQL" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Check if backend dependencies are installed
Write-Host "[3/5] Checking backend dependencies..." -ForegroundColor Yellow
Set-Location "f:\downloads\halal-in-the-city (1)\app-backend\backend"
if (-not (Test-Path "node_modules")) {
    Write-Host "  Installing backend dependencies..." -ForegroundColor Gray
    npm install 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}
Write-Host "✓ Backend dependencies ready" -ForegroundColor Green
Write-Host ""

# Start Backend API
Write-Host "[4/5] Starting Backend API..." -ForegroundColor Yellow
Write-Host "  Backend will run on http://localhost:3000" -ForegroundColor Gray
Write-Host "  Opening new terminal for backend..." -ForegroundColor Gray
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'f:\downloads\halal-in-the-city (1)\app-backend\backend'; Write-Host 'Starting Backend API...' -ForegroundColor Cyan; npm start"
Start-Sleep -Seconds 5
Write-Host "✓ Backend API starting..." -ForegroundColor Green
Write-Host ""

# Summary
Write-Host "[5/5] Startup Summary" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ PostgreSQL:    Running (port 5432)" -ForegroundColor Green
Write-Host "✓ Backend API:   http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Wait for backend to fully start (check terminal)" -ForegroundColor White
Write-Host "2. Start Admin Dashboard:" -ForegroundColor White
Write-Host "   cd 'f:\downloads\halal-in-the-city (1)\admin-dashboard'" -ForegroundColor Gray
Write-Host "   npm install  (first time only)" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start Merchant Dashboard:" -ForegroundColor White
Write-Host "   cd 'f:\downloads\halal-in-the-city (1)\merchant-dashboard'" -ForegroundColor Gray
Write-Host "   npm install  (first time only)" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "Test Credentials:" -ForegroundColor Cyan
Write-Host "  Admin:    admin@halalinthecity.com / admin123" -ForegroundColor White
Write-Host "  Merchant: owner@restaurant.com / restaurant123" -ForegroundColor White
Write-Host "  User:     user@example.com / user123" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit this window"
