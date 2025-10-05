@echo off
REM Reaper Market Netlify Deployment Script for Windows
REM This script automates the deployment process to Netlify

echo 🚀 Starting Reaper Market deployment to Netlify...

REM Check if Netlify CLI is installed
netlify --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Netlify CLI is not installed. Installing now...
    npm install -g netlify-cli
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install Netlify CLI. Please install it manually: npm install -g netlify-cli
        pause
        exit /b 1
    )
)

echo [INFO] Netlify CLI is available

REM Check if user is logged in to Netlify
netlify status >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Not logged in to Netlify. Please login first:
    netlify login
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to login to Netlify
        pause
        exit /b 1
    )
)

echo [INFO] Logged in to Netlify

REM Install dependencies
echo [INFO] Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

REM Build the project
echo [INFO] Building project...
npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)

echo [SUCCESS] Build completed successfully

REM Deploy to Netlify
echo [INFO] Deploying to Netlify...

REM Check if this is a new site or existing site
if exist ".netlify\state.json" (
    echo [INFO] Deploying to existing site...
    netlify deploy --prod --dir=dist
) else (
    echo [INFO] Creating new site and deploying...
    netlify deploy --prod --dir=dist --open
)

if %errorlevel% equ 0 (
    echo [SUCCESS] Deployment completed successfully! 🎉
    echo [INFO] Your site is now live on Netlify!
    echo [INFO] You can also run 'netlify open' to open your site
) else (
    echo [ERROR] Deployment failed
    pause
    exit /b 1
)

echo [INFO] Deployment script completed!
pause

