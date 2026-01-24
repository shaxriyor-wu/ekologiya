# 🚀 EcoCash - Railway Deploy Qo'llanmasi

Bu qo'llanma EcoCash loyihasini Railway platformasiga deploy qilishni bosqichma-bosqich tushuntiradi.

## 📋 Tarkib

1. [Railway Account Yaratish](#1-railway-account-yaratish)
2. [Loyihani GitHub'ga Yuklash](#2-loyihani-githubga-yuklash)
3. [Backend Deploy](#3-backend-deploy)
4. [PostgreSQL Database Ulash](#4-postgresql-database-ulash)
5. [Frontend Deploy](#5-frontend-deploy)
6. [Environment Variables](#6-environment-variables)
7. [Custom Domain](#7-custom-domain)
8. [Xatoliklarni Tuzatish](#8-xatoliklarni-tuzatish)

---

## 1. Railway Account Yaratish

1. [Railway.app](https://railway.app/) saytiga o'ting
2. **"Login"** bosing va GitHub orqali kiring
3. Free tier bilan boshlashingiz mumkin ($5/oy kredit beriladi)

---

## 2. Loyihani GitHub'ga Yuklash

```bash
# Yangi repository yarating va yuklang
git init
git add .
git commit -m "Initial commit - EcoCash ready for Railway"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ecocash.git
git push -u origin main
```

**Muhim:** `.gitignore` faylida quyidagilar bo'lishi kerak:
```
node_modules/
.env
__pycache__/
*.pyc
db.sqlite3
staticfiles/
dist/
```

---

## 3. Backend Deploy

### 3.1 Yangi Project Yaratish

1. Railway Dashboard'da **"New Project"** bosing
2. **"Deploy from GitHub repo"** tanlang
3. Repository'ni tanlang
4. **"Add Service"** bosing

### 3.2 Backend Service Sozlash

1. Service yaratilgandan keyin **Settings** ga o'ting
2. **Root Directory** ni `backend` qilib o'zgartiring
3. **Build Command**: (avtomatik aniqlanadi)
4. **Start Command**: 
   ```
   python manage.py migrate --noinput && python manage.py collectstatic --noinput && gunicorn ecocash_backend.wsgi --bind 0.0.0.0:$PORT
   ```

### 3.3 Backend Environment Variables

**Variables** bo'limiga o'ting va quyidagilarni qo'shing:

| Variable | Qiymat | Tavsif |
|----------|--------|--------|
| `SECRET_KEY` | `yangi-secret-key` | [djecrety.ir](https://djecrety.ir/) dan oling |
| `DEBUG` | `False` | Production uchun False |
| `ALLOWED_HOSTS` | `*` | Yoki domain nomingiz |
| `FRONTEND_URL` | `https://ecocash-frontend.up.railway.app` | Frontend URL |
| `RAILWAY_FRONTEND_URL` | `https://ecocash-frontend.up.railway.app` | Frontend URL |

---

## 4. PostgreSQL Database Ulash

### 4.1 Database Qo'shish

1. Backend service'ni ochiq holda **"New"** bosing
2. **"Database"** → **"Add PostgreSQL"** tanlang
3. PostgreSQL service yaratiladi

### 4.2 Database'ni Ulash

1. PostgreSQL service'ni bosing
2. **"Variables"** bo'limiga o'ting
3. `DATABASE_URL` ni ko'chirib oling
4. Backend service'ning **Variables** bo'limiga qo'shing:
   - `DATABASE_URL` = ko'chirilgan qiymat

**Yoki** Railway Reference Variables ishlatish:
1. Backend Variables bo'limida
2. **"Add Reference"** bosing
3. PostgreSQL service'dan `DATABASE_URL` ni ulang

---

## 5. Frontend Deploy

### 5.1 Yangi Service Qo'shish

1. Loyiha Dashboard'da **"New Service"** bosing
2. Xuddi shu GitHub repo'ni tanlang
3. **Settings** ga o'ting

### 5.2 Frontend Service Sozlash

1. **Root Directory**: `.` (root, backend emas)
2. **Build Command**: `npm ci && npm run build`
3. **Start Command**: `npm run preview -- --port $PORT --host 0.0.0.0`

### 5.3 Frontend Environment Variables

| Variable | Qiymat | Tavsif |
|----------|--------|--------|
| `VITE_API_URL` | `https://ecocash-backend.up.railway.app/api` | Backend API URL |
| `VITE_GEMINI_API_KEY` | `sizning-api-key` | (Ixtiyoriy) AI uchun |
| `VITE_GOOGLE_CLIENT_ID` | `client-id.apps.googleusercontent.com` | (Ixtiyoriy) Google OAuth |

---

## 6. Environment Variables - To'liq Ro'yxat

### Backend Variables

```env
# MAJBURIY
SECRET_KEY=your-super-secret-django-key-here
DEBUG=False
ALLOWED_HOSTS=*
DATABASE_URL=${{Postgres.DATABASE_URL}}  # Reference variable

# CORS/FRONTEND
FRONTEND_URL=https://your-frontend.up.railway.app
RAILWAY_FRONTEND_URL=https://your-frontend.up.railway.app

# EMAIL (Ixtiyoriy - Gmail uchun)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# SECURITY
SECURE_SSL_REDIRECT=True
```

### Frontend Variables

```env
# MAJBURIY
VITE_API_URL=https://your-backend.up.railway.app/api

# IXTIYORIY
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_OPENAI_API_KEY=your-openai-key
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

---

## 7. Custom Domain

### 7.1 Railway Domain

Har bir service avtomatik ravishda `*.up.railway.app` subdomain oladi.

### 7.2 Custom Domain Qo'shish

1. Service **Settings** → **Domains** bo'limiga o'ting
2. **"Generate Domain"** yoki **"Custom Domain"** bosing
3. Custom domain uchun DNS sozlamalari:
   - **Type**: CNAME
   - **Name**: @ yoki subdomain
   - **Value**: Railway bergan qiymat

---

## 8. Xatoliklarni Tuzatish

### ❌ "ModuleNotFoundError: No module named 'X'"

**Sabab:** requirements.txt da paket yo'q

**Yechim:**
```bash
cd backend
pip freeze > requirements.txt
git add . && git commit -m "fix: update requirements" && git push
```

### ❌ "CORS error" yoki "Blocked by CORS policy"

**Sabab:** Frontend URL backend'da ro'yxatdan o'tmagan

**Yechim:** Backend Variables'da qo'shing:
```
FRONTEND_URL=https://your-frontend.up.railway.app
CORS_ALLOW_ALL_ORIGINS=True  # Vaqtincha test uchun
```

### ❌ "Database connection failed"

**Sabab:** DATABASE_URL noto'g'ri

**Yechim:**
1. PostgreSQL service'ni tekshiring
2. DATABASE_URL reference variable to'g'ri ulanganini tekshiring
3. Backend'ni redeploy qiling

### ❌ "Static files not loading"

**Sabab:** WhiteNoise sozlanmagan

**Yechim:** `settings.py` da tekshiring:
```python
MIDDLEWARE = [
    ...
    'whitenoise.middleware.WhiteNoiseMiddleware',  # SecurityMiddleware'dan keyin
    ...
]
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

### ❌ "Build failed"

**Yechim:**
1. Railway Logs'ni tekshiring
2. Lokal test qiling:
   ```bash
   # Backend
   cd backend && pip install -r requirements.txt && python manage.py check
   
   # Frontend
   npm ci && npm run build
   ```

---

## 🎉 Muvaffaqiyatli Deploy!

Agar hamma narsa to'g'ri sozlangan bo'lsa:

1. **Backend**: `https://ecocash-backend-xxx.up.railway.app`
2. **Frontend**: `https://ecocash-frontend-xxx.up.railway.app`

### Test qilish:

```bash
# Backend API test
curl https://your-backend.up.railway.app/api/

# Frontend ochish
open https://your-frontend.up.railway.app
```

---

## 📞 Yordam

Muammo bo'lsa:
- Railway Discord: https://discord.gg/railway
- Railway Docs: https://docs.railway.app

---

## 🔄 Avtomatik Deploy

GitHub'ga har push qilganingizda Railway avtomatik deploy qiladi!

```bash
git add .
git commit -m "feat: new feature"
git push origin main
# Railway avtomatik redeploy qiladi ✨
```

