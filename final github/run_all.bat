@echo off
TITLE Garments AI Runner
set ROOT_DIR=%~dp0

echo ==========================================
echo    Garments AI - Multi-Server Starter
echo ==========================================
echo.

:: Start Backend
echo [1/2] Launching Backend (FastAPI)...
start "Garments AI - Backend" cmd /k "cd /d %ROOT_DIR%backend && ..\venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000"

:: Start Frontend
echo [2/2] Launching Frontend (Vite)...
start "Garments AI - Frontend" cmd /k "cd /d %ROOT_DIR%frontend && npm run dev"

echo.
echo ------------------------------------------
echo Servers are launching in separate windows.
echo - Backend API:   http://localhost:8000
echo - API Health:    http://localhost:8000/health
echo - Frontend UI:   http://localhost:5173
echo ------------------------------------------
echo.
echo Press any key to close this launcher...
pause > nul
