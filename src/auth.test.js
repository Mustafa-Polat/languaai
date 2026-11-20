import {
  usernameToEmail, validateUsername, validatePassword, authErrorMessage, toAppUser, signIn, signUp,
} from "./auth";

test("usernameToEmail: küçük harfe çevirir ve alan adını ekler", () => {
  expect(usernameToEmail("  Mustafa ")).toBe("mustafa@linguaai.app");
});

test("validateUsername: geçerli ve geçersiz adlar", () => {
  for (const ok of ["abc", "mustafa", "ali.veli", "a_b-c", "user123", "A1b"]) {
    expect(validateUsername(ok)).toBeNull();
  }
  expect(validateUsername("ab")).toMatch(/en az 3/);
  expect(validateUsername("a".repeat(31))).toMatch(/en fazla 30/);
  for (const bad of ["mustafa polat", "müstafa", "ali@veli", ".ali", "ali.", "a..b", "a__b", "-abc", "ab/c", "<script>"]) {
    expect(validateUsername(bad)).toMatch(/sadece/);
  }
});

test("validatePassword: alt ve üst sınır", () => {
  expect(validatePassword("12345")).toMatch(/en az 6/);
  expect(validatePassword("")).toMatch(/en az 6/);
  expect(validatePassword("123456")).toBeNull();
  expect(validatePassword("x".repeat(73))).toMatch(/en fazla 72/);
});

test("authErrorMessage: giriş hataları kullanıcı adını sızdırmaz", () => {
  const wrong = authErrorMessage({ message: "Invalid login credentials", status: 400 }, "login");
  expect(wrong).toBe("Kullanici adi veya sifre yanlis.");
  expect(authErrorMessage({ message: "Email not confirmed" }, "login")).toMatch(/Confirm email/);
  expect(authErrorMessage({ message: "x", status: 429 }, "login")).toMatch(/Cok fazla/);
  expect(authErrorMessage({ message: "boom" }, "login")).toMatch(/Giris basarisiz/);
});

test("authErrorMessage: kayıt hataları", () => {
  expect(authErrorMessage({ message: "User already registered" }, "register")).toBe("Bu kullanici adi alinmis.");
  expect(authErrorMessage({ message: "Password should be at least 6 characters" }, "register")).toMatch(/zayif/);
  expect(authErrorMessage({ message: "Signups not allowed for this instance" }, "register")).toMatch(/kapali/);
  expect(authErrorMessage({ message: "boom" }, "register")).toMatch(/Kayit basarisiz/);
});

test("toAppUser: kullanıcı adı metadata'dan, yoksa e-postadan gelir", () => {
  expect(toAppUser({ id: "1", email: "ali@linguaai.app", user_metadata: { username: "ali" } })).toEqual({ id: "1", username: "ali" });
  expect(toAppUser({ id: "2", email: "veli@linguaai.app" })).toEqual({ id: "2", username: "veli" });
  expect(toAppUser(null)).toBeNull();
});

const fakeClient = (over = {}) => ({
  auth: {
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    ...over,
  },
});

test("signIn: geçersiz ad ağa çıkmadan reddedilir", async () => {
  const c = fakeClient();
  const r = await signIn(c, "a b", "123456");
  expect(r.error).toMatch(/sadece/);
  expect(c.auth.signInWithPassword).not.toHaveBeenCalled();
});

test("signIn: doğru e-posta ile çağırır ve kullanıcıyı döndürür", async () => {
  const c = fakeClient();
  c.auth.signInWithPassword.mockResolvedValue({ data: { user: { id: "u1", email: "ali@linguaai.app", user_metadata: { username: "ali" } } }, error: null });
  const r = await signIn(c, "Ali", "secret1");
  expect(c.auth.signInWithPassword).toHaveBeenCalledWith({ email: "ali@linguaai.app", password: "secret1" });
  expect(r).toEqual({ user: { id: "u1", username: "ali" }, error: null });
});

test("signIn: yanlış şifre tek tip mesaj verir", async () => {
  const c = fakeClient();
  c.auth.signInWithPassword.mockResolvedValue({ data: {}, error: { message: "Invalid login credentials", status: 400 } });
  const r = await signIn(c, "ali", "yanlis1");
  expect(r.user).toBeNull();
  expect(r.error).toBe("Kullanici adi veya sifre yanlis.");
});

test("signUp: kısa şifre ve geçersiz ad ağa çıkmadan reddedilir", async () => {
  const c = fakeClient();
  expect((await signUp(c, "ali", "123")).error).toMatch(/en az 6/);
  expect((await signUp(c, "a", "123456")).error).toMatch(/en az 3/);
  expect(c.auth.signUp).not.toHaveBeenCalled();
});

test("signUp: başarılı kayıt oturum ve kullanıcı adı metadata'sı ile döner", async () => {
  const c = fakeClient();
  c.auth.signUp.mockResolvedValue({ data: { user: { id: "u2", email: "veli@linguaai.app", identities: [{}], user_metadata: { username: "veli" } }, session: { access_token: "t" } }, error: null });
  const r = await signUp(c, "Veli", "secret1");
  expect(c.auth.signUp).toHaveBeenCalledWith({ email: "veli@linguaai.app", password: "secret1", options: { data: { username: "veli" } } });
  expect(r).toEqual({ user: { id: "u2", username: "veli" }, error: null });
});

test("signUp: oturum yoksa (e-posta onayı açık) açık hata verir", async () => {
  const c = fakeClient();
  c.auth.signUp.mockResolvedValue({ data: { user: { id: "u3", identities: [{}] }, session: null }, error: null });
  const r = await signUp(c, "veli", "secret1");
  expect(r.user).toBeNull();
  expect(r.error).toMatch(/Confirm email/);
});

test("signUp: var olan hesap (boş identities) 'alinmis' döner", async () => {
  const c = fakeClient();
  c.auth.signUp.mockResolvedValue({ data: { user: { id: "u4", identities: [] }, session: { access_token: "t" } }, error: null });
  const r = await signUp(c, "veli", "secret1");
  expect(r.error).toBe("Bu kullanici adi alinmis.");
});

test("signUp: Supabase hatası çevrilir", async () => {
  const c = fakeClient();
  c.auth.signUp.mockResolvedValue({ data: {}, error: { message: "User already registered", status: 422 } });
  expect((await signUp(c, "veli", "secret1")).error).toBe("Bu kullanici adi alinmis.");
});

// ---- Hata tanısı: gerçek neden görünsün ----
import { errorCode } from "./auth";

test("errorCode: code, yoksa status, yoksa name; çok uzunsa kırpar", () => {
  expect(errorCode({ code: "email_address_invalid", status: 400 })).toBe("email_address_invalid");
  expect(errorCode({ status: 500 })).toBe("500");
  expect(errorCode({ name: "AuthApiError" })).toBe("AuthApiError");
  expect(errorCode(null)).toBe("");
  expect(errorCode({ code: "x".repeat(100) })).toHaveLength(60);
});

test("kayıt: e-posta alan adı reddedilirse bunu açıkça söyler ve kodu gösterir", () => {
  const m = authErrorMessage({ code: "email_address_invalid", status: 400, message: 'Email address "a@linguaai.app" is invalid' }, "register");
  expect(m).toMatch(/gecersiz buldu/);
  expect(m).toContain("(email_address_invalid)");
});

test("kayıt: e-posta gönderimi / sınır hataları 'Confirm email' ayarına yönlendirir", () => {
  expect(authErrorMessage({ code: "email_address_not_authorized", status: 400, message: "Email address not authorized" }, "register"))
    .toMatch(/Confirm email/);
  expect(authErrorMessage({ status: 500, message: "Error sending confirmation email" }, "register"))
    .toMatch(/Confirm email/);
  const rl = authErrorMessage({ code: "over_email_send_rate_limit", status: 429, message: "email rate limit exceeded" }, "register");
  expect(rl).toMatch(/Cok fazla deneme/);
  expect(rl).toContain("(over_email_send_rate_limit)");
});

test("kayıt: Supabase hata kodlarıyla mevcut kullanıcı ve zayıf şifre tanınır", () => {
  expect(authErrorMessage({ code: "user_already_exists", status: 422, message: "x" }, "register")).toBe("Bu kullanici adi alinmis.");
  expect(authErrorMessage({ code: "weak_password", status: 422, message: "x" }, "register")).toMatch(/zayif/);
  expect(authErrorMessage({ code: "signup_disabled", status: 422, message: "x" }, "register")).toMatch(/kapali/);
});

test("bilinmeyen hatada kod mesajın sonuna eklenir (giriş ve kayıt)", () => {
  expect(authErrorMessage({ code: "weird_thing", status: 418, message: "x" }, "register")).toMatch(/Kayit basarisiz.*\(weird_thing\)$/);
  expect(authErrorMessage({ code: "weird_thing", status: 418, message: "x" }, "login")).toMatch(/Giris basarisiz.*\(weird_thing\)$/);
});

test("giriş: email_not_confirmed kodu onaysız hesap mesajını verir", () => {
  expect(authErrorMessage({ code: "email_not_confirmed", status: 400, message: "Email not confirmed" }, "login")).toMatch(/onay bekliyor/);
});
