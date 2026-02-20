@echo off
echo.
echo ========================================
echo   Testing WITHOUT Backend (Demo Mode)
echo ========================================
echo.
echo This will run the app in DEMO MODE
echo No Supabase needed!
echo.
echo The app will work with:
echo  ✓ All UI components
echo  ✓ Navigation
echo  ✓ Responsive design
echo  ✓ All pages visible
echo.
echo WITHOUT:
echo  ✗ Real authentication
echo  ✗ Database storage
echo  ✗ User accounts
echo.
pause

echo.
echo Clearing cache...
if exist .vite rmdir /s /q .vite
echo ✓ Cache cleared
echo.

echo Starting server in DEMO MODE...
echo.
echo ========================================
echo  Once started, try these URLs:
echo.
echo  http://localhost:5173/login
echo  http://localhost:5173/signup
echo  http://localhost:5173/
echo.
echo  You should see the full UI!
echo ========================================
echo.

npm run dev
