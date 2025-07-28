@echo off
title Xanghay - Starting Application...
color 0A

echo.
echo ========================================
echo    🚀 XANGHAY - STARTING APPLICATION
echo ========================================
echo.

echo 📦 Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
) else (
    echo Dependencies already installed.
)

echo.
echo 🔧 Starting application...
echo    - Frontend (Vite dev server)
echo    - Backend (Java JAR)
echo    - Opening browser automatically
echo.

npm run start-app

echo.
echo Press any key to exit...
pause >nul 