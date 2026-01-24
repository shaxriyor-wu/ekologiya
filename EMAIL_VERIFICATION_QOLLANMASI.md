# Email Tasdiqlash Tizimi - Qo'llanma

## ✅ Qo'shilgan Funksiyalar

### 1. Email Tasdiqlash Jarayoni
- ✅ Ism, Familiya, Email, Parol kiritiladi
- ✅ "Kod Yuborish" tugmasi bosiladi
- ✅ Email'ga 6 raqamli kod yuboriladi
- ✅ Kod kiritiladi va tasdiqlanadi
- ✅ Hisob yaratiladi va avtomatik kiriladi

### 2. Backend Endpoint'lar

#### `POST /api/users/send_verification_code/`
Email'ga 6 raqamli kod yuboradi.

**Request:**
```json
{
  "first_name": "Shohjaxon",
  "last_name": "Baxtiyorov",
  "email": "baxtiyorovshohjaxon@gmail.com"
}
```

**Response:**
```json
{
  "message": "Tasdiqlash kodi email'ga yuborildi",
  "email": "baxtiyorovshohjaxon@gmail.com"
}
```

#### `POST /api/users/verify_code/`
Kodni tekshiradi va foydalanuvchini yaratadi.

**Request:**
```json
{
  "first_name": "Shohjaxon",
  "last_name": "Baxtiyorov",
  "email": "baxtiyorovshohjaxon@gmail.com",
  "password": "Maxfiy Kod",
  "code": "123456"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "baxtiyorovshohjaxon",
  "email": "baxtiyorovshohjaxon@gmail.com",
  "first_name": "Shohjaxon",
  "last_name": "Baxtiyorov",
  ...
}
```

### 3. EmailVerification Modeli

- `email` - Email manzili
- `code` - 6 raqamli kod
- `created_at` - Yaratilgan vaqt
- `expires_at` - Muddati (10 daqiqa)
- `is_verified` - Tasdiqlangan yoki yo'q

### 4. Xavfsizlik

- ✅ Kod 10 daqiqada eskiradi
- ✅ Bir email uchun faqat bitta faol kod
- ✅ Email allaqachon mavjud bo'lsa, xato qaytaradi
- ✅ Username avtomatik yaratiladi (email prefix + raqam agar kerak bo'lsa)

## 🔧 Sozlash

### Email Backend

**Development (Console):**
```python
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
```
Email'lar console'ga chiqadi.

**Production (SMTP):**
```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-password'
```

## 📋 Migratsiya

Migratsiya yaratildi. Bajarish:

```bash
cd backend
python manage.py migrate
```

## 🚀 Ishlatish

1. **Foydalanuvchi ma'lumotlarini kiritadi:**
   - Ism
   - Familiya
   - Email
   - Parol

2. **"Kod Yuborish" tugmasini bosadi:**
   - Email'ga 6 raqamli kod yuboriladi
   - Development mode'da kod console'da ham ko'rinadi

3. **Kodni kiritadi:**
   - 6 raqamli kod kiritiladi
   - "Tasdiqlash" tugmasi bosiladi

4. **Hisob yaratiladi:**
   - Kod to'g'ri bo'lsa, hisob yaratiladi
   - Avtomatik login qilinadi
   - Dashboard'ga o'tiladi

## ⚠️ Eslatmalar

- Kod 10 daqiqada eskiradi
- Bir email uchun bir vaqtning o'zida faqat bitta faol kod
- Email allaqachon ro'yxatdan o'tgan bo'lsa, yangi kod yuborilmaydi
- Development mode'da email console'ga chiqadi (terminal'da ko'rasiz)

## 🐛 Muammolarni Hal Qilish

### Email yuborilmayapti
- Backend server ishlayotganini tekshiring
- Console'da email ko'rinishini tekshiring (development mode)
- Production'da SMTP sozlamalarini tekshiring

### Kod eskirgan
- Yangi kod so'rang (10 daqiqadan oshib ketgan bo'lsa)

### Email allaqachon mavjud
- Boshqa email ishlating yoki login qiling

