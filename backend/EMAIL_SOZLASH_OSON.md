# Email Sozlash - OSON YO'L

## ✅ 3 Qadamda Sozlash

### 1️⃣ Gmail App Password Yaratish

1. Google Account'ingizga kiring: https://myaccount.google.com/security
2. **2-Step Verification** ni yoqing (agar yoqilmagan bo'lsa)
3. Pastga scroll qiling va **App passwords** ni toping
4. **Select app** → "Mail" ni tanlang
5. **Select device** → "Other (Custom name)" → "EcoCash" deb yozing
6. **Generate** tugmasini bosing
7. **16 raqamli parol** olasiz (masalan: `abcd efgh ijkl mnop`)

### 2️⃣ .env Fayl Yaratish

`backend` papkasida `.env` faylini yarating:

**Windows'da:**
1. `backend` papkasiga kiring
2. Yangi text fayl yarating
3. Nomini `.env` qiling (`.txt` ni olib tashlang)
4. Quyidagilarni yozing:

```
EMAIL_HOST_USER=sizning-email@gmail.com
EMAIL_HOST_PASSWORD=abcd efgh ijkl mnop
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
```

**Muhim:**
- `EMAIL_HOST_USER` - sizning Gmail email'ingiz (masalan: `baxtiyorovshohjaxon@gmail.com`)
- `EMAIL_HOST_PASSWORD` - Gmail App Password (16 raqam, probellar bilan yoki probelsiz)

### 3️⃣ Serverni Qayta Ishga Tushirish

```bash
cd backend
python manage.py runserver
```

Terminal'da quyidagi xabarni ko'rasiz:
```
✅ SMTP Email yoqildi: sizning-email@gmail.com
   Host: smtp.gmail.com:587
```

## 🎉 TAYYOR!

Endi websaytda email'ingizni kiriting va kod **haqiqiy email'ingizga** yuboriladi!

## 📧 Email Qayerda?

- **Inbox** papkasida ko'ring
- Agar ko'rinmasa, **Spam** papkasini tekshiring
- Email **5-30 soniya** ichida keladi

## ⚠️ Muammo Bo'lsa?

### Email kelmayapti
- `.env` fayl `backend` papkasida ekanligini tekshiring
- Gmail App Password to'g'ri kiritilganini tekshiring
- Spam papkasini tekshiring
- Server qayta ishga tushirilganini tekshiring

### "SMTP Authentication failed"
- App Password to'g'ri ekanligini tekshiring
- 2-Step Verification yoqilganini tekshiring
- Email manzili to'g'ri ekanligini tekshiring

