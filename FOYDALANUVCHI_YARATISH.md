# Foydalanuvchi Yaratish Qo'llanmasi

## Tezkor Yechim

### Windows uchun:

```bash
create_user.bat
```

Yoki backend papkasida:

```bash
cd backend
create_user.bat
```

### Linux/Mac uchun:

```bash
cd backend
chmod +x create_user.sh
./create_user.sh
```

### Python orqali:

```bash
cd backend
python create_test_user.py
```

### Django Management Command:

```bash
cd backend
python manage.py createuser
```

## Yaratilgan Test Foydalanuvchi

**Default foydalanuvchi:**
- **Email:** `shohjaxon@test.com`
- **Parol:** `123456`
- **Username:** `shohjaxon`
- **Ism:** Shohjaxon Baxtiyorov
- **Balance:** 1000 UZS
- **Level:** 1

## Boshqa Foydalanuvchi Yaratish

### Python skript orqali:

`backend/create_test_user.py` faylini tahrirlang va ma'lumotlarni o'zgartiring.

### Django command orqali:

```bash
cd backend
python manage.py createuser --username testuser --email test@test.com --password 123456 --name "Test User"
```

## Login Qilish

1. Vebsaytga kiring: http://localhost:3000
2. "Login" tugmasini bosing
3. Quyidagi ma'lumotlarni kiriting:
   - **Email:** `shohjaxon@test.com`
   - **Parol:** `123456`
4. "Kirish" tugmasini bosing

## Admin Panelda Ko'rish

1. Admin panelga kiring: http://127.0.0.1:8000/admin/
2. "Users" bo'limiga kiring
3. Yaratilgan foydalanuvchilarni ko'ring

## Foydalanuvchi Ma'lumotlarini O'zgartirish

Admin panelda:
1. Users → Foydalanuvchini tanlang
2. Ma'lumotlarni o'zgartiring
3. Saqlang

Yoki Django shell orqali:

```bash
cd backend
python manage.py shell
```

```python
from api.models import User
user = User.objects.get(email='shohjaxon@test.com')
user.balance = 5000
user.save()
```

## Muammolarni Hal Qilish

### "Foydalanuvchi allaqachon mavjud" xabari

Bu normal - foydalanuvchi allaqachon yaratilgan. Login qilish uchun:
- Email: `shohjaxon@test.com`
- Parol: `123456`

### Parolni o'zgartirish

Admin panelda yoki Django shell orqali:

```python
from api.models import User
user = User.objects.get(email='shohjaxon@test.com')
user.set_password('yangi_parol')
user.save()
```




















