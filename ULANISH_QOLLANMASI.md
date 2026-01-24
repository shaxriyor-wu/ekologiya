# Frontend va Backend Ulanish Qo'llanmasi

## O'rnatish

### 1. Backend Serverni Ishga Tushirish

```bash
cd backend
python manage.py runserver
```

Backend `http://127.0.0.1:8000` da ishlaydi.

### 2. Frontend Serverni Ishga Tushirish

Yangi terminalda:

```bash
npm run dev
```

Frontend `http://localhost:3000` da ishlaydi.

## API Ulanish

Frontend endi real Django backend bilan ishlaydi:

- **Register/Login** - Django User modeliga saqlanadi
- **Karta qo'shish** - Backend database'ga saqlanadi
- **To'lovlar** - Backend orqali amalga oshiriladi
- **Tranzaksiyalar** - Backend database'dan olinadi
- **Statistika** - Backend'dan real ma'lumotlar

## Admin Panel

Admin panelda barcha ma'lumotlarni ko'rish va boshqarish mumkin:

1. `http://127.0.0.1:8000/admin/` ga kiring
2. Superuser ma'lumotlari bilan kirish
3. Quyidagilarni boshqarish:
   - **Users** - Foydalanuvchilar (balance, level, kartalar)
   - **Transactions** - Barcha tranzaksiyalar
   - **Credit Cards** - Barcha kartalar
   - **Global Statistics** - Umumiy statistika

## Muhim Eslatmalar

1. **Session Authentication** - Django session cookies ishlatiladi
2. **CORS** - Backend CORS sozlangani, frontend backendga ulana oladi
3. **Database** - SQLite database (`backend/db.sqlite3`) ishlatiladi
4. **Real-time Updates** - Frontend o'zgarishlarni darhol ko'rsatadi

## Muammolarni Hal Qilish

### CORS Xatosi
Agar CORS xatosi bo'lsa, `backend/ecocash_backend/settings.py` da:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### API Ulanish Xatosi
- Backend server ishlayotganini tekshiring
- `http://127.0.0.1:8000/api/` ni brauzerda ochib ko'ring
- Browser console'da xatolarni tekshiring

### Session Xatosi
- Cookies ruxsatini tekshiring
- `credentials: 'include'` sozlangani ishonch hosil qiling





















