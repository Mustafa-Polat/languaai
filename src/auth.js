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

// Hatadan kısa bir tanı kodu çıkarır (örn. "email_address_invalid", "422"); gösterilen mesajın sonuna
// eklenir ki beklenmeyen bir hata olduğunda gerçek neden görülebilsin.
export function errorCode(error) {
  if (!error) return "";
  return String(error.code || error.status || error.name || "").slice(0, 60);
}

const withCode = (text, error) => {
  const c = errorCode(error);
  return c ? text + " (" + c + ")" : text;
};

// "Confirm email" ile karıştırılan ayrı bir ayar: Email sağlayıcısının kendisi kapalıysa ne kayıt ne giriş çalışır
const PROVIDER_OFF =
  "Supabase'de e-posta girisi kapali. Authentication > Sign In / Providers > Email saglayicisini ac (yalnizca 'Confirm email' kapali olmali).";

// Supabase Auth hata mesajlarını kullanıcıya gösterilecek Türkçe metne çevirir.
// Giriş hatası, kullanıcı adının var olup olmadığını sızdırmasın diye tek mesajdır.
export function authErrorMessage(error, mode) {
  const msg = String((error && error.message) || "").toLowerCase();
  const code = String((error && error.code) || "").toLowerCase();
  const status = error && error.status;
  const rateLimited = status === 429 || code.includes("rate_limit") || msg.includes("rate limit") || msg.includes("too many");
  // E-posta gönderimiyle ilgili hatalar: hepsi "Confirm email" açıkken ortaya çıkar
  const emailSending =
    code === "email_address_not_authorized" || code === "unexpected_failure" ||
    msg.includes("error sending") || msg.includes("not authorized") || msg.includes("sending confirmation");

  if (mode === "login") {
    if (code === "email_not_confirmed" || msg.includes("email not confirmed")) {
      return "Hesap onay bekliyor. Supabase'de 'Confirm email' ayarini kapatip mevcut hesaplari onaylaman gerekiyor.";
    }
    if (code === "email_provider_disabled") return PROVIDER_OFF;
    if (rateLimited) return "Cok fazla deneme yapildi. Biraz bekleyip tekrar dene.";
    if (code === "invalid_credentials" || msg.includes("invalid login") || msg.includes("invalid credentials") || status === 400) {
      return "Kullanici adi veya sifre yanlis.";
    }
    return withCode("Giris basarisiz. Baglantini kontrol edip tekrar dene.", error);
  }

  if (code === "email_provider_disabled") return PROVIDER_OFF;
  if (code === "user_already_exists" || msg.includes("already registered") || msg.includes("already been registered") || msg.includes("user_already_exists")) {
    return "Bu kullanici adi alinmis.";
  }
  if (code === "email_address_invalid" || (msg.includes("email address") && msg.includes("invalid"))) {
    return withCode("Supabase bu kullanici adinin e-posta adresini gecersiz buldu (alan adi reddedilmis olabilir).", error);
  }
  if (rateLimited) {
    return withCode("Cok fazla deneme yapildi (e-posta gonderim siniri olabilir). Biraz bekleyip tekrar dene.", error);
  }
  if (emailSending) {
    return withCode("Onay e-postasi gonderilemedi. Supabase'de 'Confirm email' ayarini kapatman gerekiyor.", error);
  }
  if (code === "weak_password" || (msg.includes("password") && (msg.includes("weak") || msg.includes("least") || msg.includes("short")))) {
    return "Sifre cok zayif. Daha uzun veya daha karisik bir sifre sec.";
  }
  if (code === "signup_disabled" || msg.includes("signups not allowed") || msg.includes("signup is disabled")) {
    return "Yeni kayit su an kapali.";
  }
  return withCode("Kayit basarisiz. Baglantini kontrol edip tekrar dene.", error);
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

// ---------------------------------------------------------------------------
// Şifre değiştirme (giriş yapmış kullanıcı)
// ---------------------------------------------------------------------------

const WRONG_CREDENTIALS = "Kullanici adi veya sifre yanlis.";

// Hata varsa Türkçe mesaj, yoksa null döner. again verilmezse eşleşme kontrolü atlanır.
export function validatePasswordChange(current, next, again) {
  if (!current) return "Mevcut sifreni yaz.";
  const perr = validatePassword(next);
  if (perr) return perr.replace("Sifre", "Yeni sifre");
  if (next === current) return "Yeni sifre mevcut sifreyle ayni olamaz.";
  if (again !== undefined && next !== again) return "Yeni sifreler ayni degil.";
  return null;
}

export function passwordChangeErrorMessage(error) {
  const msg = String((error && error.message) || "").toLowerCase();
  const code = String((error && error.code) || "").toLowerCase();
  const status = error && error.status;
  if (code === "same_password" || msg.includes("different from the old")) {
    return "Yeni sifre mevcut sifreyle ayni olamaz.";
  }
  if (code === "weak_password" || (msg.includes("password") && (msg.includes("weak") || msg.includes("least") || msg.includes("short")))) {
    return "Yeni sifre cok zayif. Daha uzun veya daha karisik bir sifre sec.";
  }
  if (status === 429 || code.includes("rate_limit") || msg.includes("rate limit") || msg.includes("too many")) {
    return "Cok fazla deneme yapildi. Biraz bekleyip tekrar dene.";
  }
  if (status === 401 || status === 403 || code.includes("session") || code === "not_authenticated" ||
      code === "reauthentication_needed" || msg.includes("jwt") || msg.includes("session")) {
    return "Oturum suren dolmus. Cikis yapip tekrar giris yap, sonra yeniden dene.";
  }
  return withCode("Sifre degistirilemedi. Baglantini kontrol edip tekrar dene.", error);
}

// Önce mevcut şifre, aynı hesapla yeniden giriş yapılarak doğrulanır (telefonu açık bırakan
// birinin şifreyi değiştirmesini zorlaştırır); sonra yeni şifre kaydedilir.
export async function changePassword(supabase, username, current, next) {
  const verr = validatePasswordChange(current, next);
  if (verr) return { error: verr };
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: usernameToEmail(username),
    password: current,
  });
  if (signInError) {
    const m = authErrorMessage(signInError, "login");
    return { error: m === WRONG_CREDENTIALS ? "Mevcut sifre yanlis." : m };
  }
  const { error } = await supabase.auth.updateUser({ password: next });
  if (error) return { error: passwordChangeErrorMessage(error) };
  return { error: null };
}
