# Supabase kurulumu ve güvenlik geçişi

Bu klasör, giriş sisteminin kendi yazdığımız şifre özetinden **Supabase Auth**'a geçişi için gereken
SQL dosyalarını içerir. Dosyaları Supabase paneli → **SQL Editor** içinde çalıştırırsın.

## Neden?

Eski sistemde şifreler tek tur SHA-256 ile ve herkesin görebileceği sabit bir tuzla özetleniyordu,
giriş tarayıcıdan doğrudan `users` tablosu sorgulanarak yapılıyordu ve oturum `localStorage`'daki
düz bir `id` kaydıydı. Tablolarda satır düzeyi güvenlik (RLS) yoksa, herkes (anon anahtarı zaten
herkese açıktır, bu normal) tüm şifre özetlerini okuyabilir ya da kayıt `id`'sini değiştirip başka
birinin hesabına geçebilirdi. Yeni sistemde:

- Şifreleri Supabase Auth tutar (bcrypt), oturum imzalı bir belirteçtir.
- `user_progress` tablosunda herkes yalnızca **kendi** satırını görür ve yazar (RLS).
- Eski `users`/`progress` tabloları kilitlenir.

## Sıra önemli

| # | Ne | Ne zaman |
|---|---|---|
| 1 | `001_user_progress.sql` çalıştır | Yeni kod yayınlanmadan **önce** (eklemelidir, eski sürümü bozmaz) |
| 2 | Auth ayarlarını yap (aşağıda) | Yeni kod yayınlanmadan önce |
| 3 | Pull request'i birleştir, Vercel yayınlasın | |
| 4 | Eski kullanıcıların her biri **aynı kullanıcı adıyla** yeniden **Kayıt Ol** yapar | Yayından sonra, çalışmaya başlamadan |
| 5 | `002_migrate_legacy_progress.sql` çalıştır, sonucu doğrula | Herkes kayıt olduktan sonra |
| 6 | Uygulamada çıkış yapıp tekrar gir, ilerlemenin geldiğini gör | |
| 7 | `003_lock_legacy_tables.sql` çalıştır | Ancak 6 sorunsuzsa |

3. adımdan 5. adıma kadar eski şifrenle giriş yapılamaz (şifreler taşınamaz, bkz. aşağıdaki not);
bu yüzden 4. ve 5. adımı peş peşe yapman iyi olur.

## Auth ayarları (adım 2)

Supabase paneli → **Authentication** bölümünde, Email sağlayıcısının ayarlarında:

- **Email sağlayıcısı (Enable Email provider): AÇIK.** Bu, aşağıdaki "Confirm email" ayarından ayrıdır.
  Sağlayıcı kapalıysa ne kayıt ne giriş çalışır (Supabase `email_provider_disabled` döner).
- **Confirm email: KAPALI.** Kullanıcı adları `kullaniciadi@linguaai.app` biçiminde uydurma
  e-postalara çevrilir (`src/auth.js`), bu adreslere e-posta gidemez. Açık kalırsa kayıt olunur ama
  giriş yapılamaz; uygulama bunu "Confirm email ayarını kapatman gerekiyor" diye bildirir.
- **Minimum password length: 6** (varsayılan). Uygulama da en az 6 ister.
- Menü adları Supabase'in sürümüne göre değişebilir; ayarın yerini bulamazsan arama kutusuna
  "confirm email" yaz.

**Confirm email'i kapatmak, daha önce oluşmuş onaysız hesapları onaylamaz.** Ayarı kapatmadan önce
kayıt olunduysa, o hesaplar için giriş "Hesap onay bekliyor" der. SQL Editor'de şunu bir kez çalıştır:

```sql
update auth.users
set email_confirmed_at = now()
where email like '%@linguaai.app' and email_confirmed_at is null;
```

Kayıt sırasında beklenmedik bir hata olursa uygulama mesajın sonunda Supabase'in hata kodunu gösterir
(örn. `(email_address_invalid)`); bu kod nedeni bulmaya yarar.

Bir sonuç: e-posta olmadığı için **"şifremi unuttum" çalışmaz**. Şifreni unutursan Authentication →
Users listesinden o kullanıcı için yeni şifre belirleyebilirsin.

## Eski hesapları taşıma (adım 4 ve 5)

Eski şifre özetleri Supabase Auth'a aktarılamaz, bu yüzden herkes bir kez yeniden kayıt olur.

- Eski kullanıcı adın küçük harf, rakam, nokta, alt çizgi ve tireden oluşmuyorsa (boşluk, büyük harf
  dışı özel karakter, Türkçe karakter gibi) yeni kural onu kabul etmez. Başka bir adla kayıt ol ve
  `002` dosyasındaki `overrides` satırını doldur: `('eski ad', 'yeni-ad')`. Büyük/küçük harf farkı
  sorun değildir.
- `002`, hedef hesapta zaten ilerleme varsa (yeniden kayıttan sonra çalıştıysan) üzerine yazmaz.
- Çalıştırdıktan sonra kontrol et:

```sql
-- Taşınan ilerlemeler (kaç kelime anahtarı ve quiz sayısı)
select a.email,
       (select count(*) from jsonb_object_keys(up.learned)) as anahtar_sayisi,
       up.quiz_correct, up.quiz_total
from public.user_progress up
join auth.users a on a.id = up.user_id
order by a.email;

-- Henüz yeni hesabı olmayan eski kullanıcılar ("overrides" kullandıysan onlar burada da görünür)
select u.username
from public.users u
left join auth.users a on lower(a.email) = lower(u.username) || '@linguaai.app'
where a.id is null;
```

## Kilidi doğrulama (adım 7'den sonra)

```sql
select tablename, rowsecurity from pg_tables where schemaname = 'public';
-- users, progress, user_progress: hepsi true olmalı

select tablename, policyname, cmd, roles from pg_policies where schemaname = 'public';
-- yalnızca user_progress için 3 satır (select / insert / update, rol: authenticated)
```

Eski tabloları birkaç hafta bekletip sorun çıkmazsa `003` dosyasının sonundaki `drop table` satırlarıyla
tamamen silebilirsin.

## Şifre değiştirme ve unutulan şifre

- **Şifresini hatırlayan kullanıcı:** Uygulamada **İlerleme** ekranının altındaki **Hesap** bölümünden
  "Şifre Değiştir". Önce mevcut şifre doğrulanır, sonra yenisi kaydedilir.
- **Şifresini unutan kullanıcı:** Hesaplar uydurma e-postalarla açıldığı için e-postayla sıfırlama yoktur.
  Yönetici (sen) SQL Editor'de geçici bir şifre verir, kullanıcı bununla girip kendi şifresini
  İlerleme ekranından değiştirir:

```sql
update auth.users
set encrypted_password = crypt('GeciciSifre123', gen_salt('bf')),
    updated_at = now()
where email = 'kullaniciadi@linguaai.app';
```

  `crypt` bulunamadı hatası gelirse `extensions.crypt` ve `extensions.gen_salt` yaz. Geçici şifre en az
  6 karakter olmalı.

## Genel kurallar

- `REACT_APP_SUPABASE_ANON_KEY` herkese açıktır (tarayıcıya gömülür), bu normal; güvenliği RLS sağlar.
- **`service_role` anahtarını** asla koda, repoya ya da `REACT_APP_` ile başlayan bir değişkene koyma.
- Yeni bir tablo eklersen önce RLS'i aç ve politikasını yaz, sonra uygulamadan kullan.
