@echo off
echo ========================================
echo Starting WanderWise Application
echo ========================================
echo.

echo Starting Backend Server...
start cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo The browser will open automatically...
echo.
echo Press any key to close this window.
echo (Servers will continue running in separate windows)
echo ========================================
pause >nul
