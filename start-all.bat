@echo off
title Halal in the City - Development Environment Startup
color 0A

echo ========================================
echo   HALAL IN THE CITY - DEV STARTUP
echo ========================================
echo.

echo [1/4] Stopping any existing services...
docker-compose down 2>nul
taskkill /F /IM node.exe 2>nul

echo.
echo [2/4] Starting Docker services (Backend, Database, Redis)...
docker-compose up -d postgres redis backend

echo.
echo [3/4] Waiting for services to be ready...
timeout /t 10 /nobreak >nul

echo.
echo [4/4] Starting React Admin Dashboard...
cd admin-dashboard

echo Installing dependencies if needed...
call npm install

echo Starting React dev server...
start "Halal Admin Dashboard" cmd /k "echo Starting React Admin Dashboard... && npm run dev"

echo.
echo ========================================
echo   ALL SERVICES STARTED SUCCESSFULLY!
echo ========================================
echo.
echo Services available at:
echo   - Backend API: http://localhost:3000
echo   - Admin Dashboard: http://localhost:3001
echo   - Database: localhost:5432
echo   - Redis: localhost:6379
echo.
echo Press any key to open the admin dashboard...
pause >nul

start http://localhost:3001

echo.
echo Development environment is running!
echo Close this window to keep services running.
echo.
pause
