# Email Sozlash - Haqiqiy Email Yuborish

## Gmail SMTP Sozlash

### 1. Gmail App Password Yaratish

1. Google Account'ingizga kiring: https://myaccount.google.com/
2. **Security** bo'limiga o'ting
3. **2-Step Verification** ni yoqing (agar yoqilmagan bo'lsa)
4. **App passwords** ga o'ting
5. **Select app** → "Mail" ni tanlang
6. **Select device** → "Other (Custom name)" ni tanlang va "EcoCash" deb nomlang
7. **Generate** tugmasini bosing
8. 16 raqamli parol olasiz (masalan: `abcd efgh ijkl mnop`)

### 2. Environment Variables Sozlash

#### Windows (PowerShell):
```powershell
$env:EMAIL_HOST_USER="sizning-email@gmail.com"
$env:EMAIL_HOST_PASSWORD="abcd efgh ijkl mnop"
```

#### Windows (Command Prompt):
```cmd
set EMAIL_HOST_USER=sizning-email@gmail.com
set EMAIL_HOST_PASSWORD=abcd efgh ijkl mnop
```

#### Linux/Mac:
```bash
export EMAIL_HOST_USER="sizning-email@gmail.com"
export EMAIL_HOST_PASSWORD="abcd efgh ijkl mnop"
```

### 3. .env Fayl Yaratish (Tavsiya etiladi)

`backend/.env` faylini yarating:

```env
EMAIL_HOST_USER=sizning-email@gmail.com
EMAIL_HOST_PASSWORD=abcd efgh ijkl mnop
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
```

Keyin `settings.py`'da `.env` faylini o'qish uchun `python-dotenv` paketini o'rnating:

```bash
pip install python-dotenv
```

Va `settings.py` boshiga qo'shing:

```python
from dotenv import load_dotenv
load_dotenv()
```

### 4. Boshqa Email Provayderlar

#### Outlook/Hotmail:
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
```

#### Yahoo:
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
```

#### Custom SMTP:
```env
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
```

## Tez Boshlash

1. Gmail App Password yarating (yuqoridagi qadamlar)
2. Terminal'da environment variable'larni sozlang
3. Backend serverni qayta ishga tushiring:

```bash
cd backend
python manage.py runserver
```

4. Endi email'lar haqiqiy email'ga yuboriladi!

## Tekshirish

1. Email yuborish funksiyasini ishga tushiring
2. Email'ingizni tekshiring (Inbox yoki Spam papkasida)
3. Kod 5-30 soniya ichida kelishi kerak

## Muammolarni Hal Qilish

### Email kelmayapti
- Spam papkasini tekshiring
- App Password to'g'ri kiritilganini tekshiring
- 2-Step Verification yoqilganini tekshiring
- Terminal'da xatolarni ko'ring

### Authentication Error
- App Password to'g'ri ekanligini tekshiring
- Email manzili to'g'ri ekanligini tekshiring

### Connection Error
- Internet ulanishini tekshiring
- Firewall SMTP portlarini bloklamaganini tekshiring

