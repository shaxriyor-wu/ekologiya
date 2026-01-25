#!/bin/bash

# Backend Server Ishga Tushirish Skripti

echo "🚀 Backend Server Ishga Tushirilmoqda..."
echo ""

# Papkani aniqlash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Python tekshiruvi
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "❌ Python topilmadi. Iltimos, Python o'rnating."
    exit 1
fi

# Python versiyasini aniqlash
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
else
    PYTHON_CMD="python"
fi

echo "📦 Python: $($PYTHON_CMD --version)"
echo ""

# Virtual environment tekshiruvi
if [ -d "venv" ]; then
    echo "✅ Virtual environment topildi"
    source venv/bin/activate
elif [ -d ".venv" ]; then
    echo "✅ Virtual environment topildi (.venv)"
    source .venv/bin/activate
else
    echo "⚠️  Virtual environment topilmadi (ixtiyoriy)"
fi

# Requirements tekshiruvi
if [ -f "requirements.txt" ]; then
    echo "📋 Requirements.txt topildi"
    echo "   Agar packages o'rnatilmagan bo'lsa, quyidagilarni bajaring:"
    echo "   pip install -r requirements.txt"
    echo ""
fi

# Database migrations tekshiruvi
echo "🔍 Database migrations tekshiruvi..."
$PYTHON_CMD manage.py showmigrations --plan | grep "\[ \]" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "⚠️  Qo'shimcha migrations mavjud"
    echo "   Migrations qilish: $PYTHON_CMD manage.py migrate"
    echo ""
fi

# Port tekshiruvi
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port 8000 band!"
    echo "   Boshqa dastur port 8000'ni ishlatmoqda"
    echo "   Process'ni o'chirish: kill -9 \$(lsof -t -i:8000)"
    echo "   Yoki boshqa port'da ishga tushirish: $PYTHON_CMD manage.py runserver 8001"
    echo ""
    read -p "Davom etasizmi? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Server ishga tushirish
echo "🌐 Backend server ishga tushirilmoqda..."
echo "   URL: http://127.0.0.1:8000"
echo "   API: http://127.0.0.1:8000/api/"
echo "   Admin: http://127.0.0.1:8000/admin/"
echo ""
echo "   To'xtatish uchun: Ctrl+C"
echo ""

$PYTHON_CMD manage.py runserver

