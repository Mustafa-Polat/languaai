// Uçtan uca duman testi: App'i jsdom'da çizer, Supabase'i taklit eder ve
// listelerin ihtiyaç olunca yüklendiğini, eski ilerlemenin taşındığını doğrular.
import React, { act } from "react";
import { createRoot } from "react-dom/client";

const mockUpserts = [];
let mockProgressRow;

jest.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: (table) => {
      const chain = {
        select: () => chain,
        eq: () => chain,
        single: () => Promise.resolve({ data: table === "progress" ? mockProgressRow : null }),
        upsert: (row) => { mockUpserts.push(row); return Promise.resolve({ error: null }); },
      };
      return chain;
    },
  }),
}));

// eslint-disable-next-line import/first
import App from "./App";

global.IS_REACT_ACT_ENVIRONMENT = true;

const flush = () => act(async () => { await new Promise((r) => setTimeout(r, 30)); });
const textOf = (el) => el.textContent.replace(/\s+/g, " ");

let container, root;

beforeEach(() => {
  global.fetch = jest.fn(() => Promise.resolve({ ok: false })); // Free Dictionary API çağrısını taklit et
  mockUpserts.length = 0;
  mockProgressRow = { learned: { about: true, "der Tisch": true }, quiz_correct: 3, quiz_total: 5 };
  localStorage.setItem("lingua_u", JSON.stringify({ id: "u1", username: "test" }));
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  localStorage.clear();
});

test("ana sayfa: sayılar yüklemeden görünür, İngilizce listesi yüklenince tekrar/yeni sayıları gelir", async () => {
  await act(async () => { root.render(<App />); });
  await flush();
  const t = textOf(container);
  expect(t).toContain("4124 İng + 568 Rus");
  expect(t).toMatch(/\d+ tekrar, \d+ yeni/); // liste yüklendi, "yukleniyor..." gitti
  expect(t).not.toContain("yukleniyor");
});

test("eski ilerleme ilk girişte taşınır ve sunucuya yazılır", async () => {
  await act(async () => { root.render(<App />); });
  await flush();
  const row = mockUpserts[mockUpserts.length - 1];
  expect(row).toBeDefined();
  expect(row.learned["en:A1:about"]).toBe(true);
  expect(row.learned.about).toBeUndefined();
  expect(row.learned["der Tisch"]).toBe(true); // Almanca anahtarı değişmez
  expect(row.learned.__keys_v2).toBe(1);
  expect(row.learned.__srs["en:A1:about"][0]).toBe(3);
});

test("göç zaten yapılmışsa açılışta gereksiz yazma olmaz", async () => {
  mockProgressRow = {
    learned: { "en:A1:about": true, __keys_v2: 1, __srs: { "en:A1:about": [3, 99999, 0] } },
    quiz_correct: 1, quiz_total: 2,
  };
  await act(async () => { root.render(<App />); });
  await flush();
  expect(mockUpserts).toHaveLength(0);
  expect(textOf(container)).toContain("4124 İng + 568 Rus");
});

test("Flashcard: kart çevrilip Öğrendim denince SRS kaydı sunucuya yazılır", async () => {
  await act(async () => { root.render(<App />); });
  await flush();
  const before = mockUpserts.length;
  const flashBtn = [...container.querySelectorAll("button")].find((b) => b.textContent.includes("Flashcard"));
  await act(async () => { flashBtn.click(); });
  await flush();
  expect(textOf(container)).toMatch(/1 ?\/ ?15/);
  const cardEl = [...container.querySelectorAll("div")].find((d) => d.style.cursor === "pointer");
  await act(async () => { cardEl.click(); });
  const learnedBtn = [...container.querySelectorAll("button")].find((b) => b.textContent.includes("Ogrendim"));
  expect(learnedBtn).toBeDefined();
  await act(async () => { learnedBtn.click(); });
  await act(async () => { await new Promise((r) => setTimeout(r, 900)); }); // 700 ms birleştirme süresi
  expect(mockUpserts.length).toBeGreaterThan(before);
  const row = mockUpserts[mockUpserts.length - 1];
  const newKeys = Object.keys(row.learned.__srs).filter((k) => k.startsWith("en:A1:") && k !== "en:A1:about");
  expect(newKeys).toHaveLength(1);
  expect(row.learned.__srs[newKeys[0]][0]).toBe(3);
  expect(row.learned[newKeys[0]]).toBe(true);
});

test("Rusça seçilince Rusça listesi yüklenir", async () => {
  await act(async () => { root.render(<App />); });
  await flush();
  const ruBtn = [...container.querySelectorAll("button")].find((b) => /Rus/.test(b.textContent) && b.textContent.length < 20);
  await act(async () => { ruBtn.click(); });
  await flush();
  expect(textOf(container)).toMatch(/\d+ tekrar, \d+ yeni/);
  expect(textOf(container)).toContain("240"); // L1 kelime sayısı
});
