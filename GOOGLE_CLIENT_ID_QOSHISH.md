# Google Client ID Qo'shish - Qadam-baqadam Qo'llanma

## ⚠️ MUAMMO: "The OAuth client was not found"

Bu xato `.env` faylda haqiqiy Google Client ID bo'lmaganda chiqadi.

## ✅ YECHIM: Google Client ID Olish va Qo'shish

### 1-qadam: Google Cloud Console'ga kiring
- https://console.cloud.google.com/ ga kiring
- Google akkaunt bilan kirish

### 2-qadam: Loyiha yarating
- Yuqoridagi "Select a project" tugmasini bosing
- "New Project" ni tanlang
- Loyiha nomi: "EcoCash" (yoki istalgan nom)
- "Create" tugmasini bosing

### 3-qadam: OAuth consent screen sozlang
- Chap menudan **"APIs & Services"** > **"OAuth consent screen"** ni tanlang
- **User Type**: "External" ni tanlang
- **"Create"** tugmasini bosing
- **App name**: "EcoCash"
- **User support email**: o'z emailingizni kiriting
- **Developer contact information**: o'z emailingizni kiriting
- **"Save and Continue"** tugmasini bosing (3 marta)
- **"Back to Dashboard"** tugmasini bosing

### 4-qadam: OAuth Client ID yarating
- Chap menudan **"APIs & Services"** > **"Credentials"** ni tanlang
- Yuqoridagi **"+ CREATE CREDENTIALS"** tugmasini bosing
- **"OAuth client ID"** ni tanlang
- **Application type**: "Web application" ni tanlang
- **Name**: "EcoCash Web Client"
- **Authorized JavaScript origins**: 
  - `http://localhost:5173` qo'shing
  - `http://127.0.0.1:5173` qo'shing
- **Authorized redirect URIs**: (bo'sh qoldirish mumkin)
- **"Create"** tugmasini bosing

### 5-qadam: Client ID ni nusxalash
- Yaratilgan OAuth Client ID ko'rsatiladi
- **Client ID** ni nusxalang
- Masalan: `123456789-abcdefghijklmnop.apps.googleusercontent.com`

### 6-qadam: .env faylga qo'shish
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
5. Faylni saqlang

### 7-qadam: Frontend serverni qayta ishga tushiring
- Frontend serverni to'xtating (Ctrl+C)
- Qayta ishga tushiring:
   ```bash
   npm run dev
   ```

## ✅ Tekshirish

1. `.env` faylda `VITE_GOOGLE_CLIENT_ID` haqiqiy Client ID ekanligini tekshiring
2. Frontend serverni qayta ishga tushiring
3. "Gmail bilan kirish" button'ni bosing
4. Endi Google popup ochilishi kerak!

## ❌ Agar hali ham xato bo'lsa:

1. **Client ID to'g'ri nusxalanganligini tekshiring** - boshida yoki oxirida bo'sh joy bo'lmasligi kerak
2. **Authorized JavaScript origins** ga `http://localhost:5173` qo'shilganligini tekshiring
3. **Frontend serverni qayta ishga tushiring**
4. **Browser cache'ni tozalang** (Ctrl+Shift+Delete)

## 📝 Eslatma

- Client ID ni hech kimga ko'rsatmang
- `.env` faylni Git'ga commit qilmang
- Development uchun `http://localhost:5173` ishlatiladi















