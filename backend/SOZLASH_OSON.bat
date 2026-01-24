@echo off
echo ========================================
echo Email Sozlash - OSON YO'L
echo ========================================
echo.

echo 1. Gmail App Password yaratish:
echo    - https://myaccount.google.com/security ga kiring
echo    - 2-Step Verification ni yoqing
echo    - App passwords ^> Mail ^> "EcoCash" ^> Generate
echo    - 16 raqamli parol olasiz
echo.

set /p EMAIL="2. Email manzilingizni kiriting (masalan: baxtiyorovshohjaxon@gmail.com): "
set /p PASSWORD="3. Gmail App Password ni kiriting (16 raqam): "

echo.
echo .env fayl yaratilmoqda...

(
echo # Email Sozlamalari
echo EMAIL_HOST_USER=%EMAIL%
echo EMAIL_HOST_PASSWORD=%PASSWORD%
echo EMAIL_HOST=smtp.gmail.com
echo EMAIL_PORT=587
echo EMAIL_USE_TLS=True
) > .env

echo.
echo ✅ .env fayl yaratildi!
echo.
echo Endi serverni qayta ishga tushiring:
echo    python manage.py runserver
echo.
pause

