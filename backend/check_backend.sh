#!/bin/bash

# Backend Server Tekshiruv Skripti

echo "🔍 Backend Server Tekshiruvi..."
echo ""

# 1. Python va Django tekshiruvi
echo "1. Python versiyasi:"
python3 --version || python --version
echo ""

# 2. Django tekshiruvi
echo "2. Django tekshiruvi:"
cd "$(dirname "$0")"
python3 manage.py check 2>&1 | head -10
echo ""

# 3. Port tekshiruvi
echo "3. Port 8000 tekshiruvi:"
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ Port 8000 band (backend server ishlayapti)"
    lsof -Pi :8000 -sTCP:LISTEN
else
    echo "❌ Port 8000 bo'sh (backend server ishlamayapti)"
    echo "   Backend serverni ishga tushiring: python manage.py runserver"
fi
echo ""

# 4. Backend API tekshiruvi
echo "4. Backend API tekshiruvi:"
if curl -s http://127.0.0.1:8000/api/ > /dev/null 2>&1; then
    echo "✅ Backend API javob beradi"
    curl -s http://127.0.0.1:8000/api/ | head -5
else
    echo "❌ Backend API javob bermayapti"
    echo "   Backend serverni ishga tushiring: python manage.py runserver"
fi
echo ""

# 5. Database tekshiruvi
echo "5. Database tekshiruvi:"
if [ -f "db.sqlite3" ]; then
    echo "✅ Database fayl mavjud: db.sqlite3"
    ls -lh db.sqlite3
else
    echo "⚠️  Database fayl topilmadi"
    echo "   Migrations qilish kerak: python manage.py migrate"
fi
echo ""

echo "✅ Tekshiruv yakunlandi!"

