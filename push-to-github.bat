@echo off
REM Script to push Reaper Market project to GitHub
REM Run this after creating the GitHub repository

echo 🚀 Pushing Reaper Market to GitHub...

REM Get repository URL from user
set /p REPO_URL="Enter your GitHub repository URL (e.g., https://github.com/username/reaper-market-vue.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] Repository URL is required!
    pause
    exit /b 1
)

echo [INFO] Adding remote origin...
git remote add origin %REPO_URL%

if %errorlevel% neq 0 (
    echo [WARNING] Remote already exists, updating...
    git remote set-url origin %REPO_URL%
)

echo [INFO] Renaming branch to main...
git branch -M main

echo [INFO] Pushing to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo [SUCCESS] 🎉 Code successfully pushed to GitHub!
    echo [INFO] You can now deploy to Netlify from GitHub
    echo [INFO] Repository URL: %REPO_URL%
) else (
    echo [ERROR] Failed to push to GitHub
    echo [INFO] Make sure you have access to the repository
    echo [INFO] You may need to use a Personal Access Token for authentication
)

echo.
echo [INFO] Next steps:
echo 1. Go to https://netlify.com
echo 2. Click "New site from Git"
echo 3. Select your GitHub repository
echo 4. Configure build settings and deploy
echo.
pause
