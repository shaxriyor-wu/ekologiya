# Karta Qo'shish Qo'llanmasi

## Qanday Ishlaydi

Karta qo'shishda quyidagi jarayon amalga oshiriladi:

1. **Foydalanuvchi ID olinadi:**
   - Avval localStorage'dan olinadi
   - Agar topilmasa, API `/users/me/` orqali olinadi
   - Agar hali ham topilmasa, berilgan userId ishlatiladi

2. **Karta ma'lumotlari yuboriladi:**
   - Karta raqamining faqat oxirgi 4 raqami saqlanadi (xavfsizlik)
   - Karta egasi nomi
   - Karta muddati (MM/YY)

3. **Backend'da saqlanadi:**
   - Karta foydalanuvchiga bog'lanadi
   - Database'ga saqlanadi
   - Admin panelda ko'rinadi

## Muhim Eslatmalar

⚠️ **Karta raqami to'liq saqlanmaydi!** Faqat oxirgi 4 raqam saqlanadi (xavfsizlik uchun).

✅ **Karta raqami orqali foydalanuvchini topish mumkin emas** - bu xavfsizlik muammosi.

✅ **Har bir foydalanuvchi o'z kartalarini ko'radi** - boshqa foydalanuvchilar kartalarini ko'ra olmaydi.

## Muammolarni Hal Qilish

### "Foydalanuvchi topilmadi" xatosi

Agar bu xatoni ko'rsangiz:

1. **Qaytadan login qiling:**
   - Chiqib kiring
   - Qaytadan kirib kiring

2. **Browser console'ni tekshiring (F12):**
   - Xatolarni ko'ring
   - User ID ni tekshiring

3. **Backend terminalni tekshiring:**
   - Xatolarni ko'ring
   - Debug xabarlarini o'qing

### Karta saqlanmayapti

1. **Backend server ishlayotganini tekshiring:**
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Database'ni tekshiring:**
   - Admin panelda kartalarni ko'ring
   - http://127.0.0.1:8000/admin/

3. **Browser console'da xatolarni ko'ring**

## Debug

Browser console'da quyidagi xabarlarni ko'rasiz:

- `Using user ID from localStorage: [ID]`
- `Using user ID from API: [ID]`
- `Final user ID for add_card: [ID]`

Backend terminalda:

- `Using authenticated user: [ID]`
- `Found user by pk: [ID]`
- `User not found with pk=[ID]`

## Test Qilish

1. Login qiling
2. Dashboard'ga kiring
3. "To'lovlar" tab'ini oching
4. Karta ma'lumotlarini kiriting:
   - Karta egasi: "Ism Familiya"
   - Karta raqami: "1234567890123456" (har qanday raqam)
   - Muddati: "12/25"
5. "Karta Qo'shish" tugmasini bosing
6. Karta qo'shilganini ko'ring

## Admin Panelda Ko'rish

1. http://127.0.0.1:8000/admin/ ga kiring
2. "Credit Cards" bo'limiga kiring
3. Barcha qo'shilgan kartalarni ko'ring
4. Har bir karta qaysi foydalanuvchiga tegishli ekanligini ko'ring





















