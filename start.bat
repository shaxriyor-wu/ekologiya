@echo off
echo ====================================
echo EcoCash - Backend va Frontend Ishga Tushirish
echo ====================================
echo.

:: Backend serverni yangi terminalda ishga tushirish
echo Backend serverni ishga tushirish...
start "EcoCash Backend" cmd /k "cd backend && python manage.py runserver"

:: 3 soniya kutish
timeout /t 3 /nobreak >nul

:: Frontend serverni yangi terminalda ishga tushirish
echo Frontend serverni ishga tushirish...
start "EcoCash Frontend" cmd /k "npm run dev"

echo.
echo ====================================
echo Servernar ishga tushirildi!
echo ====================================
echo.
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:3000
echo Admin Panel: http://127.0.0.1:8000/admin/
echo.
echo Serverni to'xtatish uchun terminal oynalarini yoping.
echo.
pause





















