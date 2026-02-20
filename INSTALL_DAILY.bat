@echo off
echo Installing Daily.co package...
echo.

npm uninstall @daily-co/daily-react
npm install @daily-co/daily-js@^0.60.0

echo.
echo Installation complete!
echo Please restart your dev server (npm run dev)
pause
