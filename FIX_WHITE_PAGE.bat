@echo off
echo.
echo ========================================
echo   Fixing White Page Issue
echo ========================================
echo.
echo This will:
echo  1. Clear Vite cache
echo  2. Restart the server
echo.
pause

echo.
echo [1/2] Clearing cache...
if exist .vite (
    rmdir /s /q .vite
    echo ✓ Cache cleared
) else (
    echo ✓ No cache to clear
)

echo.
echo [2/2] Starting server...
echo.
echo ========================================
echo  Once you see "Local: http://localhost:5173/"
echo  Try these URLs in your browser:
echo.
echo  1. http://localhost:5173/login
echo  2. http://localhost:5173/signup
echo  3. http://localhost:5173/
echo.
echo  If you still see white page:
echo  - Press F12 in browser
echo  - Click Console tab
echo  - Screenshot any RED errors
echo  - Share with developer
echo ========================================
echo.

npm run dev
