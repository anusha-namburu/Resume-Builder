@echo off
title AI Resume Builder Launcher
echo ============================================================
echo   Starting AI Resume Builder (Backend + Frontend)
echo ============================================================

echo [1/2] Launching Python Flask Backend on http://127.0.0.1:5000 ...
start "Resume Builder - Flask Backend (Port 5000)" cmd /k "cd backend && python run.py"

echo [2/2] Launching Vite React Frontend on http://localhost:5173 ...
start "Resume Builder - Vite Frontend (Port 5173)" cmd /k "cd frontend && npm run dev"

echo ============================================================
echo   Both servers launched!
echo   Keep both terminal windows open while using the app.
echo   Open browser: http://localhost:5173
echo ============================================================
pause
