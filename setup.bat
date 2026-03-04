@echo off
echo ========================================
echo WanderWise - Automated Setup Script
echo ========================================
echo.

echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js found!
echo.

echo [2/5] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)
echo Backend dependencies installed!
cd ..
echo.

echo [3/5] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b 1
)
echo Frontend dependencies installed!
cd ..
echo.

echo [4/5] Checking environment configuration...
if not exist "backend\.env" (
    echo WARNING: backend\.env file not found!
    echo Please copy .env.template to backend\.env and configure it.
    echo.
    echo Creating .env from template...
    copy .env.template backend\.env
    echo.
    echo IMPORTANT: Edit backend\.env and add your API keys!
    echo.
)
echo.

echo [5/5] Setup complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo.
echo 1. Edit backend\.env and add your API keys:
echo    - UNSPLASH_ACCESS_KEY
echo    - GOOGLE_PLACES_API_KEY
echo    - OPENROUTE_API_KEY
echo.
echo 2. Make sure MongoDB is running
echo.
echo 3. Start the backend:
echo    cd backend
echo    npm start
echo.
echo 4. Start the frontend (in new terminal):
echo    cd frontend
echo    npm start
echo.
echo 5. Open browser: http://localhost:3000
echo.
echo ========================================
echo For detailed instructions, see:
echo - QUICKSTART.md
echo - README.md
echo ========================================
echo.
pause
