// Giriş / kayıt: Supabase Auth.
//
// Uygulama kullanıcı adıyla çalışıyor, Supabase Auth ise e-posta istiyor. Kullanıcı adı arka
// planda "<kullaniciadi>@linguaai.app" biçiminde bir e-postaya çevrilir. Bu adreslere hiç e-posta
// gönderilmez (Supabase panelinde "Confirm email" kapalı olmalı, bkz. supabase/README.md).
// Alan adını değiştirmek gerekirse yalnızca AUTH_EMAIL_DOMAIN değişir; ama mevcut hesaplar eski
// adresle kayıtlı olduğu için değiştirmek onları giriş yapılamaz hale getirir.

export const AUTH_EMAIL_DOMAIN = "linguaai.app";
export const USERNAME_MIN = 3;
export const USERNAME_MAX = 30;
export const PASSWORD_MIN = 6; // Supabase Auth varsayılan alt sınırı

export const normalizeUsername = (u) => String(u || "").trim().toLowerCase();

export const usernameToEmail = (u) => normalizeUsername(u) + "@" + AUTH_EMAIL_DOMAIN;

// E-posta yerel kısmı olarak geçerli, sade bir küme: a-z, 0-9, nokta, alt çizgi, tire
const USERNAME_RE = /^[a-z0-9]([a-z0-9._-]*[a-z0-9])?$/;

// Hata varsa Türkçe mesaj, yoksa null döner
export function validateUsername(raw) {
  const u = normalizeUsername(raw);
  if (u.length < USERNAME_MIN) return "Kullanici adi en az " + USERNAME_MIN + " karakter.";
  if (u.length > USERNAME_MAX) return "Kullanici adi en fazla " + USERNAME_MAX + " karakter.";
  if (!USERNAME_RE.test(u) || /[._-]{2}/.test(u)) {
    return "Kullanici adi sadece kucuk harf (a-z), rakam, nokta, alt cizgi ve tire icerebilir.";
  }
  return null;
}

export function validatePassword(pw) {
  if (!pw || pw.length < PASSWORD_MIN) return "Sifre en az " + PASSWORD_MIN + " karakter.";
  if (pw.length > 72) return "Sifre en fazla 72 karakter."; // bcrypt sınırı
  return null;
}

// Supabase Auth hata mesajlarını kullanıcıya gösterilecek Türkçe metne çevirir.
// Giriş hatası, kullanıcı adının var olup olmadığını sızdırmasın diye tek mesajdır.
export function authErrorMessage(error, mode) {
  const msg = String((error && error.message) || "").toLowerCase();
  const status = error && error.status;
  if (mode === "login") {
    if (msg.includes("email not confirmed")) {
      return "Hesap onay bekliyor. Supabase'de 'Confirm email' ayarini kapatman gerekiyor.";
    }
    if (status === 429 || msg.includes("rate limit") || msg.includes("too many")) {
      return "Cok fazla deneme yapildi. Biraz bekleyip tekrar dene.";
    }
    if (msg.includes("invalid login") || msg.includes("invalid credentials") || status === 400) {
      return "Kullanici adi veya sifre yanlis.";
    }
    return "Giris basarisiz. Baglantini kontrol edip tekrar dene.";
  }
  if (msg.includes("already registered") || msg.includes("already been registered") || msg.includes("user_already_exists")) {
    return "Bu kullanici adi alinmis.";
  }
  if (msg.includes("password") && (msg.includes("weak") || msg.includes("least") || msg.includes("short"))) {
    return "Sifre cok zayif. Daha uzun veya daha karisik bir sifre sec.";
  }
  if (status === 429 || msg.includes("rate limit") || msg.includes("too many")) {
    return "Cok fazla deneme yapildi. Biraz bekleyip tekrar dene.";
  }
  if (msg.includes("signups not allowed") || msg.includes("signup is disabled")) {
    return "Yeni kayit su an kapali.";
  }
  return "Kayit basarisiz. Baglantini kontrol edip tekrar dene.";
}

// Oturumdaki kullanıcıdan uygulamanın kullandığı { id, username } nesnesini üretir
export function toAppUser(authUser) {
  if (!authUser) return null;
  const meta = authUser.user_metadata || {};
  const fromEmail = String(authUser.email || "").split("@")[0];
  return { id: authUser.id, username: meta.username || fromEmail };
}

export async function signIn(supabase, username, password) {
  const err = validateUsername(username);
  if (err) return { user: null, error: err };
  const { data, error } = await supabase.auth.signInWithPassword({
    email: usernameToEmail(username),
    password,
  });
  if (error || !data || !data.user) return { user: null, error: authErrorMessage(error, "login") };
  return { user: toAppUser(data.user), error: null };
}

export async function signUp(supabase, username, password) {
  const uerr = validateUsername(username);
  if (uerr) return { user: null, error: uerr };
  const perr = validatePassword(password);
  if (perr) return { user: null, error: perr };
  const { data, error } = await supabase.auth.signUp({
    email: usernameToEmail(username),
    password,
    options: { data: { username: normalizeUsername(username) } },
  });
  if (error) return { user: null, error: authErrorMessage(error, "register") };
  // "Confirm email" açıksa oturum açılmaz; bunu sessizce geçmek yerine açıkça söyle.
  if (!data || !data.session || !data.user) {
    return {
      user: null,
      error: "Kayit olusturuldu ama oturum acilamadi. Supabase'de 'Confirm email' ayarini kapatman gerekiyor.",
    };
  }
  // E-posta numaralandırma korumasıyla var olan bir hesap için sahte kullanıcı dönebilir
  if (Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    return { user: null, error: "Bu kullanici adi alinmis." };
  }
  return { user: toAppUser(data.user), error: null };
}
