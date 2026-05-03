# Vercel Deploy Rehberi

## 1️⃣ Environment Variables Ayarla

Vercel Dashboard → Project Settings → Environment Variables

```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx
```

Değeri [Anthropic Console](https://console.anthropic.com/account/keys)'dan alabilirsin.

---

## 2️⃣ Proje Yapısı

```
languaai/
├── api/
│   ├── enrich-word.js          ✨ YENİ
│   └── generate-question.js    ✨ YENİ
├── src/
│   └── App.jsx                 ✅ GÜNCELLENMIŞ
├── vercel.json                 (isteğe bağlı)
└── package.json
```

---

## 3️⃣ Deploy Et

```bash
# Vercel CLI yükle
npm i -g vercel

# Deploy başlat
vercel
```

---

## 4️⃣ Hatalar ve Çözümleri

### ❌ Error: API key not configured
**Çözüm:** Vercel Dashboard'ta `ANTHROPIC_API_KEY` environment variable'ını ekle

### ❌ Error: Cannot find module 'fetch'
**Çözüm:** Node.js 18+ kullanıyor musun? Vercel çoğu zaman otomatik seçer, ama `vercel.json`'a ekle:
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "env": {
    "NODE_VERSION": "18.17.0"
  }
}
```

### ❌ 405 Method Not Allowed
**Çözüm:** API endpoint'e POST ile istek gönderdiğini kontrol et

---

## 5️⃣ Kontrol Et

Deploy sonrası:
1. Flashcard başlat → AI detayları yükleme işlemi çalışsın mı?
2. Quiz çöz → AI soruları hazırlanacak mı?
3. Vercel Logs'ta hata var mı? (Deployment → Runtime Logs)

---

## 📝 Önemli Değişiklikler

| Sorun | Çözüm |
|-------|-------|
| **API Key Frontend'te** | Backend API routes'a taşındı ✅ |
| **window.storage API yok** | `localStorage` kullanılıyor ✅ |
| **useRef import ama kullanılmıyor** | İmport kaldırıldı ✅ |

---

## 🔐 Güvenlik Checklist

- ✅ API Key environment variable'da (frontend'te exposed değil)
- ✅ Backend routes tüm API çağrılarını işliyor
- ✅ localStorage browser'a kaydediyor (kullanıcı cihazında)
- ✅ Error handling var (users feedback alıyor)
