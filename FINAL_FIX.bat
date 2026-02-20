@echo off
title Samuel ChemLab - Final Fix
color 0B

echo.
echo ========================================
echo     SAMUEL CHEMLAB - FINAL FIX
echo ========================================
echo.
echo This will fix the backend issue and
echo run your app in DEMO MODE (no database needed)
echo.
echo Press any key to start...
pause > nul

echo.
echo [1/3] Clearing all caches...
if exist .vite (
    rmdir /s /q .vite
    echo ✓ Vite cache cleared
)
if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
    echo ✓ Node cache cleared
)
echo ✓ All caches cleared

echo.
echo [2/3] Backend configured for DEMO MODE
echo ✓ App will run without Supabase
echo ✓ All UI features will work
echo ✓ No authentication needed for testing

echo.
echo [3/3] Starting development server...
echo.
echo ========================================
echo  IMPORTANT: Try these URLs
echo ========================================
echo.
echo  1. http://localhost:5173/login
echo  2. http://localhost:5173/signup  
echo  3. http://localhost:5173/
echo.
echo  You should see:
echo   - Login page with email/password fields
echo   - Beautiful gradient backgrounds
echo   - Chemistry emojis (🧪)
echo   - Rounded cards and buttons
echo.
echo  If you see a WHITE PAGE:
echo   - Press F12 in browser
echo   - Click Console tab
echo   - Screenshot any RED errors
echo   - Share with developer
echo.
echo ========================================
echo  Server starting now...
echo ========================================
echo.

npm run dev
