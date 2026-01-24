# EcoCash Backend - Qo'llanma

Django backend va Admin Panel sozlamalari.

## O'rnatish

### 1. Virtual environment yaratish (ixtiyoriy, lekin tavsiya etiladi)

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

### 2. Kerakli paketlarni o'rnatish

```bash
pip install -r requirements.txt
```

### 3. Migratsiyalarni bajarish

```bash
python manage.py migrate
```

### 4. Superuser (admin) yaratish

```bash
python manage.py createsuperuser
```

Sizdan quyidagilar so'raladi:
- Username (foydalanuvchi nomi)
- Email (ixtiyoriy)
- Password (parol) - 2 marta kiritish kerak

**Muhim:** Bu superuser admin panelga kirish uchun kerak bo'ladi!

### 5. Serverni ishga tushirish

```bash
python manage.py runserver
```

Server `http://localhost:8000` da ishga tushadi.

## Admin Panelga kirish

1. Server ishga tushganidan keyin brauzerda oching:
   ```
   http://localhost:8000/admin/
   ```

2. Yaratgan superuser ma'lumotlaringiz bilan kirish:
   - Username
   - Password

3. Admin panelda quyidagilarni boshqarishingiz mumkin:
   - **Users** - Barcha foydalanuvchilar
   - **Credit Cards** - Karta ma'lumotlari
   - **Transactions** - Tranzaksiyalar
   - **Global Statistics** - Umumiy statistika

## API Endpoints

Backend quyidagi API endpointlarni taqdim etadi:

- `POST /api/users/register/` - Yangi foydalanuvchi ro'yxatdan o'tkazish
- `POST /api/users/login/` - Foydalanuvchi kirish
- `GET /api/users/me/` - Joriy foydalanuvchi ma'lumotlari
- `POST /api/users/logout/` - Chiqish
- `POST /api/users/{id}/update_stats/` - Foydalanuvchi statistikasini yangilash
- `POST /api/users/{id}/add_card/` - Karta qo'shish
- `POST /api/users/{id}/pay_utility/` - Kommunal to'lov
- `GET /api/transactions/` - Tranzaksiyalar ro'yxati
- `GET /api/stats/` - Umumiy statistika

## Tez boshlash (Windows)

`setup.bat` faylini ishga tushiring - u hamma narsani avtomatik sozlaydi:

```bash
setup.bat
```

## Tez boshlash (Linux/Mac)

`setup.sh` faylini ishga tushiring:

```bash
chmod +x setup.sh
./setup.sh
```

## Muammolar

Agar muammo yuzaga kelsa:

1. Migratsiyalarni qayta bajarish:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

2. Superuser yaratishda muammo bo'lsa:
   ```bash
   python manage.py createsuperuser
   ```

3. Database'ni qayta yaratish (ehtiyot bo'ling - barcha ma'lumotlar o'chadi):
   ```bash
   del db.sqlite3  # Windows
   rm db.sqlite3   # Linux/Mac
   python manage.py migrate
   ```





















