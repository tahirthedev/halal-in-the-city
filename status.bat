@echo off
title Halal in the City - Service Status
color 0B

echo ========================================
echo   HALAL IN THE CITY - SERVICE STATUS
echo ========================================
echo.

echo Docker Containers:
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo.
echo Active Node.js Processes:
tasklist /FI "IMAGENAME eq node.exe" /FO TABLE 2>nul

echo.
echo Port Usage:
echo Backend (3000):
netstat -ano | findstr :3000 2>nul
echo Admin Dashboard (3001):
netstat -ano | findstr :3001 2>nul
echo Database (5432):
netstat -ano | findstr :5432 2>nul
echo Redis (6379):
netstat -ano | findstr :6379 2>nul

echo.
echo ========================================
echo   STATUS CHECK COMPLETE
echo ========================================
echo.
pause
