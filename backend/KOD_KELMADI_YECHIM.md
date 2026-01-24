# Kod Kelmadi - Yechim

## 🔍 Muammo

Kod email'ga kelmayapti. Bu quyidagi sabablarga ko'ra bo'lishi mumkin:

1. **`.env` fayl mavjud emas** - Email sozlanmagan
2. **Gmail App Password sozlanmagan** - SMTP ishlamayapti
3. **Email Spam papkasida** - Kod spam papkasiga tushgan bo'lishi mumkin

## ✅ Tez Yechim

### Variant 1: OSON YO'L (Windows)

1. `backend` papkasida `SOZLASH_OSON.bat` faylini ishga tushiring
2. Email va App Password ni kiriting
3. Serverni qayta ishga tushiring

### Variant 2: Qo'L BILAN

1. **Gmail App Password yarating:**
   - https://myaccount.google.com/security
   - 2-Step Verification → App passwords → Mail → "EcoCash" → Generate

2. **`.env` fayl yarating:**
   - `backend` papkasida `.env` faylini yarating
   - Quyidagilarni yozing:

```env
EMAIL_HOST_USER=baxtiyorovshohjaxon@gmail.com
EMAIL_HOST_PASSWORD=abcd efgh ijkl mnop
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
```

3. **Serverni qayta ishga tushiring:**
```bash
cd backend
python manage.py runserver
```

Terminal'da quyidagi xabarni ko'rasiz:
```
✅ SMTP Email yoqildi: baxtiyorovshohjaxon@gmail.com
```

## 🔍 Tekshirish

### 1. Terminal'ni tekshiring
Server ishga tushganda quyidagilardan birini ko'rasiz:

**✅ SMTP yoqilgan:**
```
✅ SMTP Email yoqildi: email@gmail.com
   Host: smtp.gmail.com:587
```

**⚠️ Development mode:**
```
⚠️ Development mode: Email'lar console'ga chiqadi.
```

### 2. Email'ni tekshiring
- **Inbox** papkasida ko'ring
- **Spam** papkasini tekshiring
- Email **5-30 soniya** ichida keladi

### 3. Development Mode'da
Agar `.env` fayl bo'lmasa, kod **websaytda to'g'ridan-to'g'ri ko'rsatiladi** (sariq qutida).

## ⚠️ Muammolar

### "SMTP Authentication failed"
- Gmail App Password to'g'ri ekanligini tekshiring
- 2-Step Verification yoqilganini tekshiring
- Email manzili to'g'ri ekanligini tekshiring

### Email kelmayapti
- `.env` fayl `backend` papkasida ekanligini tekshiring
- Server qayta ishga tushirilganini tekshiring
- Spam papkasini tekshiring
- Terminal'da xatolarni ko'ring

### Kod websaytda ko'rinmayapti
- Browser console'ni oching (F12)
- Network tab'da xatolarni tekshiring
- Backend server ishlayotganini tekshiring

## 📞 Yordam

Agar muammo hal bo'lmasa:
1. Terminal'dagi xatolarni ko'ring
2. Browser console'dagi xatolarni ko'ring
3. `.env` fayl to'g'ri sozlanganini tekshiring

