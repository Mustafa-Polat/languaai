# 📖 LinguaAI — Kurulum & Deploy Rehberi

## Proje Yapısı
```
linguaai-pwa/
├── public/
│   ├── index.html        ← PWA meta tagları
│   ├── manifest.json     ← PWA ayarları
│   ├── service-worker.js ← Offline desteği
│   ├── icon-192.png      ← Uygulama ikonu
│   └── icon-512.png      ← Büyük ikon
├── src/
│   ├── index.js          ← React giriş noktası
│   └── App.jsx           ← Ana uygulama (Oxford 3000 dahil)
├── package.json
└── vercel.json
```

---

## 🚀 Adım 1 — GitHub'a Yükle

1. [github.com](https://github.com) → sağ üstten **"New repository"**
2. Repository adı: `linguaai` → **Create repository**
3. Bilgisayarında terminal aç, bu klasörün içine gir:

```bash
cd linguaai-pwa
git init
git add .
git commit -m "LinguaAI ilk sürüm"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADIN/linguaai.git
git push -u origin main
```

> `KULLANICI_ADIN` yerine kendi GitHub kullanıcı adını yaz.

---

## 🌐 Adım 2 — Vercel'e Deploy Et

1. [vercel.com](https://vercel.com) → **Sign Up** (GitHub ile giriş)
2. **"New Project"** → GitHub repo'nu seç (`linguaai`)
3. Framework: **Create React App** seçilecek, otomatik
4. **Deploy** butonuna bas
5. Birkaç dakika sonra sana bir link verecek:  
   `https://linguaai-xxxx.vercel.app`

**Hepsi bu kadar!** 🎉

---

## 📱 Adım 3 — Telefona Yükle

### iPhone (Safari):
1. Vercel linkini Safari'de aç
2. Alt ortadaki **Paylaş** butonuna bas (kutu + ok ikonu)
3. **"Ana Ekrana Ekle"** → **Ekle**
4. Ana ekranda LinguaAI ikonu görünür 🎓

### Android (Chrome):
1. Vercel linkini Chrome'da aç
2. Sağ üstteki **⋮ menü** → **"Ana ekrana ekle"**
3. **Ekle** → uygulama gibi açılır

---

## 🔄 Güncelleme

Uygulamayı güncellemek istediğinde:

```bash
# App.jsx'i düzenledikten sonra:
git add .
git commit -m "Güncelleme"
git push
```

Vercel otomatik olarak yeniden deploy eder. Telefon bir sonraki açılışta güncellenir.

---

## ⚙️ Özellikler

- ✅ **Offline kelime kartları** — internet olmadan çalışır
- ✅ **AI quiz** — internet gerektirir (Anthropic API)
- ✅ **2725 Oxford kelimesi** — A1, A2, B1, B2
- ✅ **İlerleme kaydı** — telefonda kalıcı
- ✅ **Arkadaşlarla paylaş** — sadece linki gönder

---

## 🛠️ Lokal Geliştirme

```bash
npm install
npm start
# → http://localhost:3000
```
