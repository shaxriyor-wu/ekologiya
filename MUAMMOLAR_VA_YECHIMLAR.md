# "Failed to fetch" Muammosi va Yechimlar

## Muammo

"Failed to fetch" xatosi ko'rsatilganda, bu quyidagi sabablarga ko'ra bo'lishi mumkin:

1. **Backend server ishlamayapti**
2. **CORS muammosi**
3. **Network xatosi**
4. **Authentication muammosi**

## Yechimlar

### 1. Backend Serverni Tekshirish

Backend server ishlayotganini tekshiring:

```bash
# Windows
netstat -ano | findstr :8000

# Linux/Mac
lsof -i :8000
```

Agar server ishlamayotgan bo'lsa:

```bash
cd backend
python manage.py runserver
```

### 2. CORS Sozlamalarini Tekshirish

`backend/ecocash_backend/settings.py` da CORS sozlangani:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",  # Vite default port
    "http://127.0.0.1:5173",
]

CORS_ALLOW_ALL_ORIGINS = DEBUG  # Development uchun
```

### 3. Browser Console'da Tekshirish

F12 bosing va Console'da xatolarni ko'ring:

- Network tab'da so'rovlarni ko'ring
- Xatolik xabarlarini o'qing
- CORS xatolari bo'lsa, backend CORS sozlamalarini tekshiring

### 4. Authentication Muammosi

Agar authentication muammosi bo'lsa:

1. Qaytadan login qiling
2. Browser cookies'ni tozalang
3. Backend serverni qayta ishga tushiring

### 5. API Endpointlarni Tekshirish

Brauzerda ochib ko'ring:

- http://127.0.0.1:8000/api/ - API root
- http://127.0.0.1:8000/admin/ - Admin panel

## Tezkor Yechim

Agar hali ham muammo bo'lsa:

1. **Backend serverni qayta ishga tushiring:**
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Frontend serverni qayta ishga tushiring:**
   ```bash
   npm run dev
   ```

3. **Browser cache'ni tozalang:**
   - Ctrl+Shift+Delete
   - Cache va cookies'ni tozalang

4. **Qaytadan login qiling**

## Debug Qilish

Browser Console'da quyidagilarni tekshiring:

```javascript
// API URL ni tekshirish
console.log('API URL:', import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api');

// Test API request
fetch('http://127.0.0.1:8000/api/', {
  credentials: 'include',
  mode: 'cors'
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

Agar bu ishlamasa, backend server muammosi bor.





















