# Admin Panelga Kirish Qo'llanmasi

## 1. Serverni Ishga Tushirish

Windows uchun:
```bash
cd backend
python manage.py runserver
```

Yoki `start_server.bat` faylini ishga tushiring.

## 2. Admin Panelga Kirish

1. Brauzeringizda oching: **http://127.0.0.1:8000/admin/**

2. Superuser ma'lumotlaringiz bilan kirish:
   - **Username** - superuser nomi
   - **Password** - superuser paroli

## 3. Admin Panelda Nimalarni Boshqarish Mumkin

### Users (Foydalanuvchilar)
- Barcha ro'yxatdan o'tgan foydalanuvchilarni ko'rish
- Foydalanuvchi ma'lumotlarini tahrirlash
- Balance (balans) o'zgartirish
- Level (daraja) o'zgartirish
- Total Recycled Kg (qayta ishlangan kg) o'zgartirish
- Foydalanuvchini o'chirish yoki bloklash

### Transactions (Tranzaksiyalar)
- Barcha tranzaksiyalarni ko'rish
- Tranzaksiya tafsilotlarini ko'rish
- Filtrlash (type, date, provider bo'yicha)
- Qidirish (foydalanuvchi, tavsif bo'yicha)

### Credit Cards (Kredit Kartalar)
- Barcha kartalarni ko'rish
- Karta ma'lumotlarini tahrirlash
- Kartani o'chirish

### Global Statistics (Umumiy Statistika)
- Umumiy statistika ma'lumotlarini ko'rish va tahrirlash:
  - Total Users (Jami foydalanuvchilar)
  - Total Waste Collected (Jami yig'ilgan chiqindilar)
  - Total Payouts (Jami to'lovlar)
  - CO2 Saved (Saqlangan CO2)

## 4. Yangi Superuser Yaratish

Agar superuser parolini unutgan bo'lsangiz yoki yangi superuser yaratmoqchi bo'lsangiz:

```bash
cd backend
python manage.py createsuperuser
```

## 5. Foydali Admin Panel Funksiyalari

- **Filter** - Har bir modelda filtrlash imkoniyati
- **Search** - Qidirish funksiyasi
- **Bulk Actions** - Bir nechta obyektlarni bir vaqtda boshqarish
- **Export** - Ma'lumotlarni eksport qilish (ixtiyoriy)

## 6. Muhim Eslatmalar

- Admin panelga faqat superuser yoki staff foydalanuvchilar kira oladi
- Foydalanuvchini staff qilish uchun admin panelda `is_staff` checkbox'ini belgilang
- Har qanday o'zgarishlar darhol saqlanadi





















