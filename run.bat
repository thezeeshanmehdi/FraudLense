@echo off
title FraudLens Launcher
color 0B
cls

echo ==========================================================
echo               FraudLens - Blockchain Security              
echo ==========================================================
echo.
echo [1/3] Checking environment and dependencies...

:: Check if Node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/ to run FraudLens.
    echo.
    pause
    exit /b 1
)

:: Check Backend node_modules
if not exist "backend\node_modules\" (
    echo [INFO] Backend node_modules not found. Installing backend dependencies...
    cd backend
    call npm install
    cd ..
) else (
    echo [OK] Backend dependencies are already installed.
)

:: Check Frontend node_modules
if not exist "frontend\node_modules\" (
    echo [INFO] Frontend node_modules not found. Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
) else (
    echo [OK] Frontend dependencies are already installed.
)

echo.
echo [2/3] Launching FraudLens Services...
echo.

:: Start Backend
echo Starting Backend API Server (Port 5000)...
start "FraudLens Backend API" cmd /k "cd backend && title FraudLens Backend API && npm run dev"

:: Start Frontend
echo Starting Frontend Client (Port 5173)...
start "FraudLens Frontend Client" cmd /k "cd frontend && title FraudLens Frontend Client && npm run dev"

echo.
echo [3/3] Opening default web browser...
:: Wait a couple seconds for Vite server to start up
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo ==========================================================
echo FraudLens has been launched successfully!
echo.
echo - Backend Console and Frontend Console are running in
echo   separate window processes.
echo - Your default browser has been opened to http://localhost:5173.
echo.
echo Close the backend/frontend windows to stop the servers.
echo ==========================================================
echo.
pause
