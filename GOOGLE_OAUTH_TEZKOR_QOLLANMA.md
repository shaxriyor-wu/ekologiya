# Google OAuth Tezkor Qo'llanma

## ⚡ 5 daqiqada Google OAuth sozlash

### 1-qadam: Google Cloud Console'ga kiring
👉 https://console.cloud.google.com/

### 2-qadam: Loyiha yarating
- Yuqoridagi "Select a project" tugmasini bosing
- "New Project" ni tanlang
- Nom: "EcoCash"
- "Create" tugmasini bosing

### 3-qadam: OAuth consent screen (1 daqiqa)
- Chap menudan **"APIs & Services"** > **"OAuth consent screen"** ni tanlang
- **User Type**: "External" ni tanlang
- **"Create"** tugmasini bosing
- **App name**: "EcoCash"
- **User support email**: o'z emailingizni kiriting
- **Developer contact information**: o'z emailingizni kiriting
- **"Save and Continue"** tugmasini bosing (3 marta)
- **"Back to Dashboard"** tugmasini bosing

### 4-qadam: OAuth Client ID yarating (2 daqiqa)
- Chap menudan **"APIs & Services"** > **"Credentials"** ni tanlang
- Yuqoridagi **"+ CREATE CREDENTIALS"** tugmasini bosing
- **"OAuth client ID"** ni tanlang
- **Application type**: "Web application" ni tanlang
- **Name**: "EcoCash Web Client"
- **Authorized JavaScript origins**: 
  - `http://localhost:3000` qo'shing (frontend port 3000 da ishlayapti)
  - `http://127.0.0.1:3000` qo'shing
- **Authorized redirect URIs**: (bo'sh qoldirish mumkin)
- **"Create"** tugmasini bosing

### 5-qadam: Client ID ni nusxalash
- Yaratilgan OAuth Client ID ko'rsatiladi
- **Client ID** ni nusxalang (masalan: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)

### 6-qadam: .env faylga qo'shish (30 soniya)
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

1. "Gmail bilan kirish" button'ni bosing
2. Google popup ochilishi kerak
3. Google akkauntni tanlang
4. Parol yaratish formasi ko'rsatilishi kerak

## ❌ Muammolarni hal qilish

### "The OAuth client was not found" xatosi
- Client ID to'g'ri nusxalanganligini tekshiring
- `.env` faylda bo'sh joylar bo'lmasligi kerak
- Frontend serverni qayta ishga tushiring

### "redirect_uri_mismatch" xatosi
- Authorized JavaScript origins ga `http://localhost:3000` qo'shilganligini tekshiring
- Port raqami to'g'ri ekanligini tekshiring (3000 yoki 5173)

### Popup ochilmayapti
- Browser console'da xatolarni tekshiring (F12)
- Google script yuklanganligini tekshiring
- Internet ulanishini tekshiring

## 📝 Eslatmalar

- Development uchun `http://localhost:3000` ishlatiladi
- Client ID ni hech kimga ko'rsatmang
- `.env` faylni Git'ga commit qilmang















