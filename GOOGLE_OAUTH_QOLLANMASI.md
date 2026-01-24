# Google OAuth Sozlash Qo'llanmasi

## Google Client ID Olish

1. **Google Cloud Console'ga kiring**
   - https://console.cloud.google.com/ ga kiring
   - Google akkaunt bilan kirish

2. **Yangi loyiha yarating yoki mavjud loyihani tanlang**
   - Yuqoridagi "Select a project" tugmasini bosing
   - "New Project" ni tanlang
   - Loyiha nomini kiriting (masalan: "EcoCash")
   - "Create" tugmasini bosing

3. **OAuth consent screen sozlang**
   - Chap menudan "APIs & Services" > "OAuth consent screen" ni tanlang
   - User Type: "External" ni tanlang
   - "Create" tugmasini bosing
   - App name: "EcoCash" (yoki istalgan nom)
   - User support email: o'z emailingizni kiriting
   - Developer contact information: o'z emailingizni kiriting
   - "Save and Continue" tugmasini bosing
   - Scopes: "Save and Continue" tugmasini bosing (default scopes yetarli)
   - Test users: (ixtiyoriy) - "Save and Continue" tugmasini bosing
   - "Back to Dashboard" tugmasini bosing

4. **OAuth Client ID yarating**
   - Chap menudan "APIs & Services" > "Credentials" ni tanlang
   - Yuqoridagi "+ CREATE CREDENTIALS" tugmasini bosing
   - "OAuth client ID" ni tanlang
   - Application type: "Web application" ni tanlang
   - Name: "EcoCash Web Client" (yoki istalgan nom)
   - Authorized JavaScript origins:
     - `http://localhost:5173` (development uchun)
     - `http://127.0.0.1:5173` (development uchun)
   - Authorized redirect URIs: (bo'sh qoldirish mumkin)
   - "Create" tugmasini bosing

5. **Client ID ni nusxalash**
   - Yaratilgan OAuth Client ID ko'rsatiladi
   - "Client ID" ni nusxalang (masalan: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)

6. **`.env` faylga qo'shish**
   - Loyiha root papkasida `.env` faylni oching
   - `VITE_GOOGLE_CLIENT_ID=your_google_client_id_here` qatorini toping
   - `your_google_client_id_here` o'rniga nusxalangan Client ID ni qo'ying
   - Masalan: `VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com`
   - Faylni saqlang

7. **Frontend serverni qayta ishga tushiring**
   - Frontend serverni to'xtating (Ctrl+C)
   - Qayta ishga tushiring: `npm run dev`
   - Endi Google OAuth ishlaydi!

## Muammolarni Hal Qilish

### "Missing required parameter client_id" xatosi
- `.env` fayl mavjudligini tekshiring
- `VITE_GOOGLE_CLIENT_ID` to'g'ri sozlanganligini tekshiring
- Frontend serverni qayta ishga tushiring

### "redirect_uri_mismatch" xatosi
- Google Cloud Console'da "Authorized JavaScript origins" ga `http://localhost:5173` qo'shilganligini tekshiring
- Port raqami to'g'ri ekanligini tekshiring

### Google popup ochilmayapti
- Browser console'da xatolarni tekshiring
- Google script yuklanganligini tekshiring
- Internet ulanishini tekshiring

## Eslatmalar

- Development uchun `http://localhost:5173` ishlatiladi
- Production uchun haqiqiy domain qo'shishingiz kerak
- Client ID ni hech kimga ko'rsatmang (xavfsizlik uchun)
- `.env` faylni `.gitignore` ga qo'shing (agar Git ishlatilsa)















