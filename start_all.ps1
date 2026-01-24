# EcoCash - Backend va Frontend Ishga Tushirish (PowerShell)

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "EcoCash - Backend va Frontend Ishga Tushirish" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Backend serverni yangi terminalda ishga tushirish
Write-Host "Backend serverni ishga tushirish..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; python manage.py runserver"

# 3 soniya kutish
Start-Sleep -Seconds 3

# Frontend serverni yangi terminalda ishga tushirish
Write-Host "Frontend serverni ishga tushirish..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run dev"

Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host "Servernar ishga tushirildi!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend: http://127.0.0.1:8000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Admin Panel: http://127.0.0.1:8000/admin/" -ForegroundColor Cyan
Write-Host ""
Write-Host "Serverni to'xtatish uchun terminal oynalarini yoping." -ForegroundColor Yellow
Write-Host ""
Write-Host "Davom etish uchun Enter bosing..." -ForegroundColor Gray
Read-Host





















