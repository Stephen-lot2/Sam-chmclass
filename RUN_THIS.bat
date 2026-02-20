@echo off
title Samuel ChemLab - Quick Start
color 0A

echo.
echo ========================================
echo    SAMUEL CHEMLAB - QUICK START
echo ========================================
echo.
echo This will:
echo  1. Clean old files
echo  2. Install dependencies
echo  3. Start the development server
echo.
echo Press any key to continue...
pause > nul

echo.
echo [1/4] Checking Node.js...
node --version > nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ERROR: Node.js is NOT installed!
    echo.
    echo Please install Node.js from:
    echo https://nodejs.org
    echo.
    echo Download the LTS version and install it.
    echo Then run this script again.
    echo.
    pause
    exit /b 1
)
echo ✓ Node.js is installed
node --version

echo.
echo [2/4] Cleaning old files...
if exist node_modules (
    echo Removing node_modules...
    rmdir /s /q node_modules
)
if exist .vite (
    echo Removing .vite cache...
    rmdir /s /q .vite
)
if exist dist (
    echo Removing dist...
    rmdir /s /q dist
)
if exist package-lock.json (
    echo Removing package-lock.json...
    del package-lock.json
)
echo ✓ Cleaned successfully

echo.
echo [3/4] Installing dependencies...
echo This may take 1-2 minutes...
echo.
call npm install
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ERROR: Failed to install dependencies!
    echo.
    echo Try running this command manually:
    echo npm install
    echo.
    pause
    exit /b 1
)
echo.
echo ✓ Dependencies installed successfully

echo.
echo [4/4] Starting development server...
echo.
echo ========================================
echo  SERVER STARTING...
echo ========================================
echo.
echo The server will start in a moment.
echo.
echo Once you see "Local: http://localhost:5173/"
echo Open your browser and go to:
echo.
echo    http://localhost:5173
echo.
echo You should see a PURPLE page with a counter.
echo If you see that, React is working!
echo.
echo To STOP the server: Press Ctrl+C
echo.
echo ========================================
echo.

call npm run dev
