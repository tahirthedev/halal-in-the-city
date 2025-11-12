# Run tests for all services
Write-Host "Running tests..." -ForegroundColor Green

$success = $true

# Backend tests
Write-Host "Running backend tests..." -ForegroundColor Yellow
Set-Location backend
npm test
if ($LASTEXITCODE -ne 0) { $success = $false }
Set-Location ..

# Admin dashboard tests
Write-Host "Running admin dashboard tests..." -ForegroundColor Yellow
Set-Location admin-dashboard
npm test -- --watchAll=false
if ($LASTEXITCODE -ne 0) { $success = $false }
Set-Location ..

# Mobile app tests
Write-Host "Running mobile app tests..." -ForegroundColor Yellow
Set-Location mobile-app
flutter test
if ($LASTEXITCODE -ne 0) { $success = $false }
Set-Location ..

if ($success) {
    Write-Host "All tests passed!" -ForegroundColor Green
} else {
    Write-Host "Some tests failed!" -ForegroundColor Red
    exit 1
}
