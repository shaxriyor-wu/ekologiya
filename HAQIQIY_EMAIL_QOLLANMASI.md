# Haqiqiy Email Yuborish - Tez Qo'llanma

## ✅ Nima Qilindi?

Email yuborish tizimi sozlandi. Endi haqiqiy email'ga kod yuboriladi!

## 🚀 Tez Boshlash (3 Qadam)

### 1. Gmail App Password Yaratish

1. Google Account'ingizga kiring: https://myaccount.google.com/security
2. **2-Step Verification** ni yoqing (agar yoqilmagan bo'lsa)
3. **App passwords** ga o'ting
4. **Select app** → "Mail" ni tanlang
5. **Select device** → "Other (Custom name)" → "EcoCash" deb nomlang
6. **Generate** tugmasini bosing
7. 16 raqamli parol olasiz (masalan: `abcd efgh ijkl mnop`)

### 2. .env Fayl Yaratish

`backend` papkasida `.env` faylini yarating:

```env
EMAIL_HOST_USER=baxtiyorovshohjaxon@gmail.com
EMAIL_HOST_PASSWORD=abcd efgh ijkl mnop
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
```

**Muhim:** 
- `EMAIL_HOST_USER` - sizning Gmail email'ingiz
- `EMAIL_HOST_PASSWORD` - Gmail App Password (16 raqam, probellar bilan yoki probelsiz)

### 3. Serverni Qayta Ishga Tushirish

```bash
cd backend
python manage.py runserver
```

Terminal'da quyidagi xabarni ko'rasiz:
```
✅ SMTP Email yoqildi: baxtiyorovshohjaxon@gmail.com
   Host: smtp.gmail.com:587
```

## ✨ Endi Ishlaydi!

1. Websaytga kiring
2. Ism, Familiya, Email, Parol kiriting
3. "Kod Yuborish" tugmasini bosing
4. **Email'ingizga kod keladi!** (5-30 soniya ichida)
5. Kodni kiriting va tasdiqlang

## 📧 Email Qayerda?

- **Inbox** papkasida ko'ring
- Agar ko'rinmasa, **Spam** papkasini tekshiring
- Email **5-30 soniya** ichida keladi

## ⚠️ Muammolar?

### Email kelmayapti
- `.env` fayl to'g'ri sozlanganini tekshiring
- Gmail App Password to'g'ri ekanligini tekshiring
- Spam papkasini tekshiring
- Terminal'da xatolarni ko'ring

### "SMTP Authentication failed"
- App Password to'g'ri kiritilganini tekshiring
- 2-Step Verification yoqilganini tekshiring

### Server xatosi
- `.env` fayl `backend` papkasida ekanligini tekshiring
- Server qayta ishga tushirilganini tekshiring

## 📝 Eslatma

- Development mode'da (`.env` bo'lmasa) email'lar console'ga chiqadi
- Production'da (`.env` mavjud bo'lsa) haqiqiy email'ga yuboriladi
- Kod **10 daqiqada** eskiradi

