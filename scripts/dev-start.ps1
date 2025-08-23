# Start development environment
Write-Host "Starting Halal in the City development environment..." -ForegroundColor Green

# Check if Docker is running
$dockerRunning = docker info 2>$null
if (-not $dockerRunning) {
    Write-Host "Error: Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Start services
Write-Host "Starting Docker services..." -ForegroundColor Yellow
docker-compose up -d

# Wait for services to be healthy
Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check if backend needs setup
if (-not (Test-Path "backend/node_modules")) {
    Write-Host "Setting up backend..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    npm run migrate
    npm run seed
    Set-Location ..
}

# Check if admin dashboard needs setup
if (-not (Test-Path "admin-dashboard/node_modules")) {
    Write-Host "Setting up admin dashboard..." -ForegroundColor Yellow
    Set-Location admin-dashboard
    npm install
    Set-Location ..
}

Write-Host "Development environment is ready!" -ForegroundColor Green
Write-Host "Backend API: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Admin Dashboard: http://localhost:3001" -ForegroundColor Cyan
Write-Host "PostgreSQL: localhost:5432" -ForegroundColor Cyan
Write-Host "Redis: localhost:6379" -ForegroundColor Cyan
