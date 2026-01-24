# Google Client ID Qo'shish - Aniq Qo'llanma

## 🎯 Maqsad: Google OAuth'ni ishlatish

Google OAuth ishlashi uchun Google Client ID kerak. Bu 5-10 daqiqada sozlanadi.

## 📋 Qadam-baqadam Qo'llanma

### 1️⃣ Google Cloud Console'ga kiring
👉 **https://console.cloud.google.com/**

### 2️⃣ Loyiha yarating
1. Yuqoridagi **"Select a project"** tugmasini bosing
2. **"New Project"** ni tanlang
3. **Project name**: `EcoCash` (yoki istalgan nom)
4. **"Create"** tugmasini bosing
5. 10-20 soniya kuting (loyiha yaratilishi uchun)

### 3️⃣ OAuth consent screen sozlang
1. Chap menudan **"APIs & Services"** > **"OAuth consent screen"** ni tanlang
2. **User Type**: **"External"** ni tanlang
3. **"Create"** tugmasini bosing
4. **App name**: `EcoCash`
5. **User support email**: o'z Gmail emailingizni kiriting
6. **Developer contact information**: o'z Gmail emailingizni kiriting
7. **"Save and Continue"** tugmasini bosing
8. **Scopes** sahifasida: **"Save and Continue"** tugmasini bosing (default scopes yetarli)
9. **Test users** sahifasida: **"Save and Continue"** tugmasini bosing (ixtiyoriy)
10. **"Back to Dashboard"** tugmasini bosing

### 4️⃣ OAuth Client ID yarating
1. Chap menudan **"APIs & Services"** > **"Credentials"** ni tanlang
2. Yuqoridagi **"+ CREATE CREDENTIALS"** tugmasini bosing
3. **"OAuth client ID"** ni tanlang
4. **Application type**: **"Web application"** ni tanlang
5. **Name**: `EcoCash Web Client` (yoki istalgan nom)
6. **Authorized JavaScript origins** bo'limida:
   - **"+ ADD URI"** tugmasini bosing
   - `http://localhost:3000` kiriting
   - Yana **"+ ADD URI"** tugmasini bosing
   - `http://127.0.0.1:3000` kiriting
7. **Authorized redirect URIs**: (bo'sh qoldirish mumkin)
8. **"Create"** tugmasini bosing

### 5️⃣ Client ID ni nusxalash
- Yaratilgan OAuth Client ID ko'rsatiladi
- **Client ID** ni nusxalang (masalan: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)
- ⚠️ **Eslatma**: Client ID ni saqlang, keyin qayta ko'rsatilmaydi

### 6️⃣ .env faylga qo'shish
1. Loyiha root papkasida `.env` faylni oching
2. Quyidagi qatorni toping:
   ```
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```
3. `your_google_client_id_here` o'rniga nusxalangan Client ID ni qo'ying
4. Masalan:
   ```
   VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
   ```
5. ⚠️ **Muhim**: Boshida yoki oxirida bo'sh joy bo'lmasligi kerak!
6. Faylni saqlang

### 7️⃣ Frontend serverni qayta ishga tushiring
1. Frontend serverni to'xtating (Ctrl+C)
2. Qayta ishga tushiring:
   ```bash
   npm run dev
   ```

## ✅ Tekshirish

1. Browser'da `http://localhost:3000/#/login` ga kiring
2. **"Gmail bilan kirish"** button'ni bosing
3. Google popup ochilishi kerak
4. Google akkauntni tanlang
5. Parol yaratish formasi ko'rsatilishi kerak

## ❌ Muammolarni Hal Qilish

### "The OAuth client was not found" xatosi
- Client ID to'g'ri nusxalanganligini tekshiring
- `.env` faylda bo'sh joylar bo'lmasligi kerak
- Frontend serverni qayta ishga tushiring

### "redirect_uri_mismatch" xatosi
- Authorized JavaScript origins ga `http://localhost:3000` qo'shilganligini tekshiring
- Port raqami to'g'ri ekanligini tekshiring (3000)

### Popup ochilmayapti
- Browser console'da xatolarni tekshiring (F12)
- Google script yuklanganligini tekshiring
- Internet ulanishini tekshiring

## 📝 Eslatmalar

- Development uchun `http://localhost:3000` ishlatiladi
- Client ID ni hech kimga ko'rsatmang
- `.env` faylni Git'ga commit qilmang
- Agar port o'zgarganda, Google Cloud Console'da ham yangilang















