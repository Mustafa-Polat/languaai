// Uçtan uca duman testi: App'i jsdom'da çizer, Supabase (Auth + veritabanı) taklit edilir.
// Giriş/kayıt/çıkış akışını, ilerlemenin yalnızca yeni tablodan okunup yazıldığını, hata
// durumlarında sunucudaki verinin ezilmediğini ve listelerin ihtiyaç olunca yüklendiğini doğrular.
import React, { act } from "react";
import { createRoot } from "react-dom/client";

// jest.mock fabrikası yalnızca "mock" ile başlayan değişkenlere erişebilir
const mockState = {
  session: null,        // { user: {...} } | null
  progressRow: null,    // user_progress satırı
  loadError: null,
  saveError: null,
  signInResult: null,
  signUpResult: null,
  updateUserResult: { data: {}, error: null },
  lastUpdateUser: null,
  upserts: [],
  tables: [],           // from() ile istenen tablo adları
  events: [],           // sıralı olaylar: "upsert", "signOut"
  listener: null,
};

jest.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    auth: {
      getSession: () => Promise.resolve({ data: { session: mockState.session } }),
      onAuthStateChange: (cb) => {
        mockState.listener = cb;
        return { data: { subscription: { unsubscribe: () => { mockState.listener = null; } } } };
      },
      // Not: jest.fn kullanılmaz; Create React App her testten önce jest.fn uygulamalarını sıfırlar
      signInWithPassword: (creds) => {
        mockState.lastSignIn = creds;
        return Promise.resolve(mockState.signInResult);
      },
      signUp: (args) => {
        mockState.lastSignUp = args;
        return Promise.resolve(mockState.signUpResult);
      },
      updateUser: (attrs) => {
        mockState.lastUpdateUser = attrs;
        mockState.events.push("updateUser");
        return Promise.resolve(mockState.updateUserResult);
      },
      signOut: () => {
        mockState.events.push("signOut");
        mockState.session = null;
        return Promise.resolve({ error: null });
      },
    },
    from: (table) => {
      mockState.tables.push(table);
      const chain = {
        select: () => chain,
        eq: () => chain,
        maybeSingle: () => Promise.resolve(
          mockState.loadError
            ? { data: null, error: mockState.loadError }
            : { data: mockState.progressRow, error: null }
        ),
        upsert: (row) => {
          mockState.events.push("upsert");
          if (mockState.saveError) return Promise.resolve({ error: mockState.saveError });
          mockState.upserts.push(row);
          return Promise.resolve({ error: null });
        },
      };
      return chain;
    },
  }),
}));

// eslint-disable-next-line import/first
import App from "./App";

global.IS_REACT_ACT_ENVIRONMENT = true;

const sleep = (ms) => act(async () => { await new Promise((r) => setTimeout(r, ms)); });
const flush = () => sleep(30);
const textOf = (el) => el.textContent.replace(/\s+/g, " ");
const buttons = (c) => [...c.querySelectorAll("button")];
const byText = (c, txt) => buttons(c).find((b) => b.textContent.includes(txt));

const authUser = (name = "test") => ({
  id: "u1", email: name + "@linguaai.app", user_metadata: { username: name },
});

function typeInto(el, value) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  setter.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

async function rateFirstCard(container, label = "Ogrendim") {
  await act(async () => { byText(container, "Flashcard").click(); });
  await flush();
  const cardEl = [...container.querySelectorAll("div")].find((d) => d.style.cursor === "pointer");
  await act(async () => { cardEl.click(); });
  await act(async () => { byText(container, label).click(); });
}

let container, root;

beforeEach(() => {
  global.fetch = jest.fn(() => Promise.resolve({ ok: false })); // Free Dictionary API çağrısını taklit et
  Object.assign(mockState, {
    session: { user: authUser() },
    progressRow: { learned: { about: true, "der Tisch": true }, quiz_correct: 3, quiz_total: 5 },
    loadError: null, saveError: null, signInResult: null, signUpResult: null,
    updateUserResult: { data: {}, error: null }, lastUpdateUser: null,
    upserts: [], tables: [], events: [], listener: null, lastSignIn: null, lastSignUp: null,
  });
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  localStorage.clear();
});

// ---------- Oturum ----------

test("oturum yokken giriş ekranı gelir; eski 'lingua_u' kaydı artık oturum açmaz ve silinir", async () => {
  mockState.session = null;
  localStorage.setItem("lingua_u", JSON.stringify({ id: "baskasi", username: "hacker" }));
  await act(async () => { root.render(<App />); });
  await flush();
  expect(textOf(container)).toContain("KULLANICI ADI");
  expect(textOf(container)).not.toContain("Merhaba");
  expect(localStorage.getItem("lingua_u")).toBeNull();
  expect(mockState.tables).toHaveLength(0); // giriş yoksa hiçbir tabloya istek yok
});

test("oturum kontrolü bitene kadar giriş ekranı yerine yükleme görünür", async () => {
  await act(async () => { root.render(<App />); });
  expect(textOf(container)).not.toContain("KULLANICI ADI");
});

test("giriş: doğru e-posta ile Auth çağrılır, başarılı olunca ana sayfa gelir", async () => {
  mockState.session = null;
  mockState.signInResult = { data: { user: authUser("ali") }, error: null };
  await act(async () => { root.render(<App />); });
  await flush();
  const [u, p] = container.querySelectorAll("input");
  await act(async () => { typeInto(u, "Ali"); typeInto(p, "secret1"); });
  const submit = buttons(container).filter((b) => b.textContent.includes("Giris Yap")).pop();
  await act(async () => { submit.click(); });
  await flush();
  expect(mockState.lastSignIn).toEqual({ email: "ali@linguaai.app", password: "secret1" });
  expect(textOf(container)).toContain("Merhaba, ali!");
});

test("giriş: yanlış şifre tek tip hata gösterir ve ana sayfaya geçmez", async () => {
  mockState.session = null;
  mockState.signInResult = { data: {}, error: { message: "Invalid login credentials", status: 400 } };
  await act(async () => { root.render(<App />); });
  await flush();
  const [u, p] = container.querySelectorAll("input");
  await act(async () => { typeInto(u, "ali"); typeInto(p, "yanlis1"); });
  await act(async () => { buttons(container).filter((b) => b.textContent.includes("Giris Yap")).pop().click(); });
  await flush();
  expect(textOf(container)).toContain("Kullanici adi veya sifre yanlis.");
  expect(textOf(container)).not.toContain("Merhaba");
});

test("kayıt: geçersiz kullanıcı adı ağa çıkmadan reddedilir, geçerli olan hesabı açar", async () => {
  mockState.session = null;
  mockState.signUpResult = {
    data: { user: { ...authUser("veli"), identities: [{}] }, session: { access_token: "t" } }, error: null,
  };
  await act(async () => { root.render(<App />); });
  await flush();
  await act(async () => { byText(container, "Kayit Ol").click(); });
  const [u, p] = container.querySelectorAll("input");
  await act(async () => { typeInto(u, "veli yilmaz"); typeInto(p, "secret1"); });
  await act(async () => { buttons(container).filter((b) => b.textContent.includes("Kayit Ol")).pop().click(); });
  expect(textOf(container)).toContain("sadece kucuk harf");
  expect(mockState.lastSignUp).toBeNull();
  await act(async () => { typeInto(u, "veli"); });
  await act(async () => { buttons(container).filter((b) => b.textContent.includes("Kayit Ol")).pop().click(); });
  await flush();
  expect(mockState.lastSignUp.email).toBe("veli@linguaai.app");
  expect(textOf(container)).toContain("Merhaba, veli!");
});

test("çıkış: bekleyen ilerleme önce gönderilir, sonra oturum kapanır", async () => {
  await act(async () => { root.render(<App />); });
  await flush();
  mockState.events.length = 0;
  await rateFirstCard(container);          // 700 ms'lik bekleyen kayıt oluşur
  await act(async () => { byText(container, "Cikis").click(); });
  await flush();
  expect(mockState.events).toEqual(["upsert", "signOut"]);
  expect(textOf(container)).toContain("KULLANICI ADI");
});

// ---------- Veri erişimi ----------

test("yalnızca user_progress tablosuna erişilir (eski users/progress değil)", async () => {
  await act(async () => { root.render(<App />); });
  await flush();
  await rateFirstCard(container);
  await sleep(900);
  expect(mockState.tables.length).toBeGreaterThan(0);
  expect(new Set(mockState.tables)).toEqual(new Set(["user_progress"]));
});

test("kayıt, oturumdaki kullanıcının kimliğiyle yapılır", async () => {
  await act(async () => { root.render(<App />); });
  await flush();
  await rateFirstCard(container);
  await sleep(900);
  expect(mockState.upserts[mockState.upserts.length - 1].user_id).toBe("u1");
});

// ---------- Hata durumları ----------

test("yükleme başarısızsa uyarı çıkar ve sunucudaki veri boş ilerlemeyle ezilmez; tekrar deneyince düzelir", async () => {
  mockState.loadError = { message: "network" };
  await act(async () => { root.render(<App />); });
  await flush();
  expect(textOf(container)).toContain("Ilerlemen yuklenemedi");
  mockState.events.length = 0;
  await rateFirstCard(container);
  await sleep(900);
  expect(mockState.events).not.toContain("upsert"); // sunucu verisi korunur
  mockState.loadError = null;
  await act(async () => { byText(container, "Tekrar dene").click(); });
  await flush();
  expect(textOf(container)).not.toContain("yuklenemedi");
});

test("kayıt başarısızsa uyarı çıkar, tekrar denenince kalkar", async () => {
  await act(async () => { root.render(<App />); });
  await flush();
  mockState.saveError = { message: "offline" };
  await rateFirstCard(container);
  await sleep(900);
  expect(textOf(container)).toContain("Ilerleme kaydedilemedi");
  mockState.saveError = null;
  await act(async () => { byText(container, "Tekrar dene").click(); });
  await flush();
  expect(textOf(container)).not.toContain("kaydedilemedi");
  expect(mockState.upserts.length).toBeGreaterThan(0);
});

test("başka sekmede çıkış yapılırsa (SIGNED_OUT) giriş ekranına dönülür", async () => {
  await act(async () => { root.render(<App />); });
  await flush();
  expect(textOf(container)).toContain("Merhaba");
  await act(async () => { mockState.listener("SIGNED_OUT", null); });
  await flush();
  expect(textOf(container)).toContain("KULLANICI ADI");
});

// ---------- Mevcut davranışlar (SRS, tembel yükleme, göç) ----------

test("ana sayfa: sayılar yüklemeden görünür, İngilizce listesi yüklenince tekrar/yeni sayıları gelir", async () => {
  await act(async () => { root.render(<App />); });
  await flush();
  const t = textOf(container);
  expect(t).toContain("4124 İng + 568 Rus");
  expect(t).toMatch(/\d+ tekrar, \d+ yeni/);
  expect(t).not.toContain("yukleniyor");
});

test("eski ilerleme ilk girişte taşınır ve sunucuya yazılır", async () => {
  await act(async () => { root.render(<App />); });
  await flush();
  const row = mockState.upserts[mockState.upserts.length - 1];
  expect(row).toBeDefined();
  expect(row.learned["en:A1:about"]).toBe(true);
  expect(row.learned.about).toBeUndefined();
  expect(row.learned["der Tisch"]).toBe(true); // Almanca anahtarı değişmez
  expect(row.learned.__keys_v2).toBe(1);
  expect(row.learned.__srs["en:A1:about"][0]).toBe(3);
});

test("göç zaten yapılmışsa açılışta gereksiz yazma olmaz", async () => {
  mockState.progressRow = {
    learned: { "en:A1:about": true, __keys_v2: 1, __srs: { "en:A1:about": [3, 99999, 0] } },
    quiz_correct: 1, quiz_total: 2,
  };
  await act(async () => { root.render(<App />); });
  await flush();
  expect(mockState.upserts).toHaveLength(0);
  expect(textOf(container)).toContain("4124 İng + 568 Rus");
});

test("yeni kullanıcı (ilerleme satırı yok) sorunsuz açılır ve ilk kart kaydedilir", async () => {
  mockState.progressRow = null;
  await act(async () => { root.render(<App />); });
  await flush();
  expect(textOf(container)).toContain("Merhaba");
  await rateFirstCard(container);
  await sleep(900);
  const row = mockState.upserts[mockState.upserts.length - 1];
  expect(Object.keys(row.learned.__srs)).toHaveLength(1);
});

test("Flashcard: kart çevrilip Öğrendim denince SRS kaydı sunucuya yazılır", async () => {
  await act(async () => { root.render(<App />); });
  await flush();
  const before = mockState.upserts.length;
  await act(async () => { byText(container, "Flashcard").click(); });
  await flush();
  expect(textOf(container)).toMatch(/1 ?\/ ?15/);
  const cardEl = [...container.querySelectorAll("div")].find((d) => d.style.cursor === "pointer");
  await act(async () => { cardEl.click(); });
  const learnedBtn = byText(container, "Ogrendim");
  expect(learnedBtn).toBeDefined();
  await act(async () => { learnedBtn.click(); });
  await sleep(900); // 700 ms birleştirme süresi
  expect(mockState.upserts.length).toBeGreaterThan(before);
  const row = mockState.upserts[mockState.upserts.length - 1];
  const newKeys = Object.keys(row.learned.__srs).filter((k) => k.startsWith("en:A1:") && k !== "en:A1:about");
  expect(newKeys).toHaveLength(1);
  expect(row.learned.__srs[newKeys[0]][0]).toBe(3);
  expect(row.learned[newKeys[0]]).toBe(true);
});

test("Rusça seçilince Rusça listesi yüklenir", async () => {
  await act(async () => { root.render(<App />); });
  await flush();
  const ruBtn = buttons(container).find((b) => /Rus/.test(b.textContent) && b.textContent.length < 20);
  await act(async () => { ruBtn.click(); });
  await flush();
  expect(textOf(container)).toMatch(/\d+ tekrar, \d+ yeni/);
  expect(textOf(container)).toContain("240"); // L1 kelime sayısı
});

// ---------- Şifre değiştirme ----------

async function openChangePassword(container) {
  await act(async () => { byText(container, "Ilerleme").click(); });
  await act(async () => { byText(container, "Sifre Degistir").click(); });
  const inputs = container.querySelectorAll('input[type="password"]');
  expect(inputs).toHaveLength(3);
  return inputs;
}

test("şifre değiştir: İlerleme ekranında hesap bölümü görünür, form açılır", async () => {
  await act(async () => { root.render(<App />); });
  await flush();
  await act(async () => { byText(container, "Ilerleme").click(); });
  expect(textOf(container)).toContain("HESAP");
  expect(textOf(container)).toContain("test");
  expect(container.querySelectorAll('input[type="password"]')).toHaveLength(0);
  await act(async () => { byText(container, "Sifre Degistir").click(); });
  expect(container.querySelectorAll('input[type="password"]')).toHaveLength(3);
});

test("şifre değiştir: başarılı akış eski şifreyi doğrular, yenisini kaydeder, form kapanır", async () => {
  mockState.signInResult = { data: { user: authUser() }, error: null };
  await act(async () => { root.render(<App />); });
  await flush();
  const [cur, next, again] = await openChangePassword(container);
  await act(async () => { typeInto(cur, "eski123"); typeInto(next, "yeni123"); typeInto(again, "yeni123"); });
  await act(async () => { byText(container, "Sifreyi Guncelle").click(); });
  await flush();
  expect(mockState.lastSignIn).toEqual({ email: "test@linguaai.app", password: "eski123" });
  expect(mockState.lastUpdateUser).toEqual({ password: "yeni123" });
  expect(textOf(container)).toContain("Sifren degistirildi");
  expect(container.querySelectorAll('input[type="password"]')).toHaveLength(0);
});

test("şifre değiştir: tekrar eşleşmezse ağa çıkılmaz", async () => {
  await act(async () => { root.render(<App />); });
  await flush();
  const [cur, next, again] = await openChangePassword(container);
  await act(async () => { typeInto(cur, "eski123"); typeInto(next, "yeni123"); typeInto(again, "yeni124"); });
  await act(async () => { byText(container, "Sifreyi Guncelle").click(); });
  expect(textOf(container)).toContain("Yeni sifreler ayni degil");
  expect(mockState.lastSignIn).toBeNull();
  expect(mockState.lastUpdateUser).toBeNull();
});

test("şifre değiştir: mevcut şifre yanlışsa yeni şifre kaydedilmez ve form açık kalır", async () => {
  mockState.signInResult = { data: {}, error: { code: "invalid_credentials", status: 400, message: "Invalid login credentials" } };
  await act(async () => { root.render(<App />); });
  await flush();
  const [cur, next, again] = await openChangePassword(container);
  await act(async () => { typeInto(cur, "yanlis1"); typeInto(next, "yeni123"); typeInto(again, "yeni123"); });
  await act(async () => { byText(container, "Sifreyi Guncelle").click(); });
  await flush();
  expect(textOf(container)).toContain("Mevcut sifre yanlis.");
  expect(mockState.lastUpdateUser).toBeNull();
  expect(container.querySelectorAll('input[type="password"]')).toHaveLength(3);
});

test("şifre değiştir: Vazgeç formu kapatır ve alanları temizler", async () => {
  await act(async () => { root.render(<App />); });
  await flush();
  const [cur] = await openChangePassword(container);
  await act(async () => { typeInto(cur, "bir seyler"); });
  await act(async () => { byText(container, "Vazgec").click(); });
  expect(container.querySelectorAll('input[type="password"]')).toHaveLength(0);
  await act(async () => { byText(container, "Sifre Degistir").click(); });
  expect(container.querySelectorAll('input[type="password"]')[0].value).toBe("");
});
