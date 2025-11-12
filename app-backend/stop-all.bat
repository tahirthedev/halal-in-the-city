@echo off
title Halal in the City - Stop All Services
color 0C

echo ========================================
echo   HALAL IN THE CITY - STOP SERVICES
echo ========================================
echo.

echo [1/3] Stopping Docker services...
docker-compose down

echo.
echo [2/3] Stopping Node.js processes...
taskkill /F /IM node.exe 2>nul

echo.
echo [3/3] Cleaning up...
docker system prune -f --volumes 2>nul

echo.
echo ========================================
echo   ALL SERVICES STOPPED SUCCESSFULLY!
echo ========================================
echo.
pause
