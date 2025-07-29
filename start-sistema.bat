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
echo    - Backend (Java JAR rodando em backend/)
echo    - Opening browser automatically
echo.

REM Inicia o backend a partir da pasta backend
start cmd /k "cd /d %~dp0backend && java -jar casamarmorista-0.0.1-SNAPSHOT.jar"

REM Inicia o frontend
start cmd /k "cd /d %~dp0 && npm run dev"

REM Aguarda alguns segundos para o frontend subir
ping 127.0.0.1 -n 6 > nul

REM Abre o navegador
start http://localhost:5173

echo.
echo Press any key to exit...
pause >nul 