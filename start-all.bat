@echo off
title МедИнфо - Start All
echo ============================================
echo   МедИнфо - Starting Project
echo ============================================
echo.

:: Kill any existing node processes on these ports
echo Stopping any existing servers...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

:: Start Backend
echo [1/2] Starting Backend (port 5000)...
cd /d "%~dp0server"
start "MedInfo-Backend" cmd /c "npm run dev"
echo.

:: Wait for backend to start
timeout /t 3 /nobreak >nul

:: Start Frontend
echo [2/2] Starting Frontend (port 3000)...
cd /d "%~dp0client"
start "MedInfo-Frontend" cmd /c "npm start"
echo.

echo ============================================
echo   Project is starting...
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo ============================================
echo.
echo   IMPORTANT: Make sure PostgreSQL is running!
echo   Database: medinfo
echo   Run database\schema.sql and database\seed.sql
echo.
pause
