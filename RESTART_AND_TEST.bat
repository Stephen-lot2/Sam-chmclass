@echo off
echo ========================================
echo   Restarting Dev Server with Backend
echo ========================================
echo.

echo Step 1: Checking .env file...
type .env
echo.

echo Step 2: Clearing Vite cache...
if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
    echo Cache cleared!
) else (
    echo No cache to clear
)
echo.

echo Step 3: Starting dev server...
echo.
echo ========================================
echo   Server starting...
echo   Check console for Supabase status!
echo ========================================
echo.

npm run dev
