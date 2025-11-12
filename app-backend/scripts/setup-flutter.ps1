# Flutter/Dart development environment setup script
Write-Host "Setting up Flutter development environment..." -ForegroundColor Green

# Check if Flutter is installed
$flutterVersion = flutter --version 2>$null
if (-not $flutterVersion) {
    Write-Host "Flutter not found. Please install Flutter SDK first." -ForegroundColor Red
    Write-Host "Download from: https://flutter.dev/docs/get-started/install" -ForegroundColor Yellow
    exit 1
}

Write-Host "Flutter found: $($flutterVersion[0])" -ForegroundColor Green

# Navigate to mobile app directory
Set-Location mobile-app

# Get dependencies
Write-Host "Getting Flutter dependencies..." -ForegroundColor Yellow
flutter pub get

# Run code generation
Write-Host "Running code generation..." -ForegroundColor Yellow
flutter packages pub run build_runner build --delete-conflicting-outputs

# Check for connected devices
Write-Host "Checking for connected devices..." -ForegroundColor Yellow
flutter devices

Write-Host "Flutter setup complete!" -ForegroundColor Green
Write-Host "To run the app: flutter run" -ForegroundColor Cyan

Set-Location ..
