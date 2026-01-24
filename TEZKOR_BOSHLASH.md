# Tezkor Boshlash Qo'llanmasi

## Windows uchun (Eng Oson)

### 1. Barcha serverni bir vaqtda ishga tushirish:

```bash
start.bat
```

Yoki PowerShell ishlatib:

```bash
.\start_all.ps1
```

Bu sizga:
- ✅ Backend server (Django) - http://127.0.0.1:8000
- ✅ Frontend server (Vite) - http://localhost:3000
- ✅ Admin Panel - http://127.0.0.1:8000/admin/

### 2. Serverni to'xtatish:

```bash
stop.bat
```

## Linux/Mac uchun

```bash
chmod +x start.sh
./start.sh
```

## Qo'lda ishga tushirish

Agar scriptlar ishlamasa:

### Terminal 1 - Backend:
```bash
cd backend
python manage.py runserver
```

### Terminal 2 - Frontend:
```bash
npm run dev
```

## Birinchi marta ishlatish

1. **Dependencies o'rnatish:**
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py createsuperuser
   
   # Frontend (loyiha ildizida)
   npm install
   ```

2. **Serverni ishga tushirish:**
   ```bash
   start.bat  # Windows
   # yoki
   ./start.sh  # Linux/Mac
   ```

## Foydalanish

- **Vebsayt:** http://localhost:3000
- **Admin Panel:** http://127.0.0.1:8000/admin/
- **API:** http://127.0.0.1:8000/api/

## Muammolarni Hal Qilish

### Port band bo'lsa:
- Backend: `backend/ecocash_backend/settings.py` da port o'zgartiring
- Frontend: `vite.config.ts` da port o'zgartiring

### Python topilmaydi:
- Python PATH'ga qo'shilganini tekshiring
- Virtual environment aktiv qiling

### Node.js topilmaydi:
- Node.js o'rnatilganini tekshiring: `node --version`
- npm o'rnatilganini tekshiring: `npm --version`





















