@echo off
echo ========================================
echo Samuel ChemLab - Fix Script
echo ========================================
echo.

echo Step 1: Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
echo ✓ Node.js is installed
echo.

echo Step 2: Cleaning old files...
if exist node_modules rmdir /s /q node_modules
if exist .vite rmdir /s /q .vite
if exist dist rmdir /s /q dist
if exist package-lock.json del package-lock.json
echo ✓ Cleaned old files
echo.

echo Step 3: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

echo Step 4: Starting development server...
echo.
echo ========================================
echo Server will start now!
echo Open your browser to: http://localhost:5173
echo Press Ctrl+C to stop the server
echo ========================================
echo.

call npm run dev
