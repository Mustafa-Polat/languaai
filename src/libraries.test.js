import en from "./data/en.json";
import ru from "./data/ru.json";
import meta from "./data/meta.json";
import {
  buildEnglish, buildRussian, loadLibrary, allCards, levelCount, totalCount,
} from "./libraries";
import { cardKey } from "./srs";

test("meta.json sayıları gerçek verilerle aynı", () => {
  for (const [lvl, words] of Object.entries(en)) expect(meta.en[lvl]).toBe(words.length);
  for (const [lvl, words] of Object.entries(ru)) expect(meta.ru[lvl]).toBe(words.length);
  expect(Object.keys(meta.en)).toEqual(Object.keys(en));
  expect(Object.keys(meta.ru)).toEqual(Object.keys(ru));
});

test("veri: her girdi w/t metni içerir, İngilizce girdilerin e alanı vardır", () => {
  for (const w of Object.values(en).flat()) {
    expect(typeof w.w).toBe("string");
    expect(w.w.length).toBeGreaterThan(0);
    expect(typeof w.t).toBe("string");
    expect(typeof w.e).toBe("string");
  }
  for (const w of Object.values(ru).flat()) {
    expect(typeof w.w).toBe("string");
    expect(w.w.length).toBeGreaterThan(0);
    expect(typeof w.t).toBe("string");
  }
});

test("veri: aynı seviyede aynı kelime iki kez geçmez (ilerleme anahtarı çakışmasın)", () => {
  for (const lib of [buildEnglish(en), buildRussian(ru)]) {
    const keys = allCards({ x: lib }).map(cardKey);
    expect(new Set(keys).size).toBe(keys.length);
  }
});

test("buildEnglish / buildRussian: kart biçimi", () => {
  const e = buildEnglish({ A1: [{ w: "about", t: "hakkinda", e: "Example." }] });
  expect(e.A1[0]).toEqual({ word: "about", turkish: "hakkinda", example: "Example.", level: "A1", lang: "en" });
  const r = buildRussian({ L1: [{ w: "Дом", t: "house" }] });
  expect(r.L1[0]).toEqual({ word: "Дом", turkish: "house", example: "", level: "L1", lang: "ru" });
});

test("loadLibrary: gerçek dosyaları yükler ve aynı dil için aynı sözü döndürür", async () => {
  const a = loadLibrary("en");
  expect(loadLibrary("en")).toBe(a);
  const lib = await a;
  expect(Object.keys(lib)).toEqual(["A1", "A2", "B1", "B2", "C1"]);
  expect(lib.A1).toHaveLength(meta.en.A1);
  expect(lib.A1[0].lang).toBe("en");
  const ruLib = await loadLibrary("ru");
  expect(ruLib.L1).toHaveLength(meta.ru.L1);
  const de = await loadLibrary("de");
  expect(Object.keys(de).length).toBeGreaterThan(0);
});

test("loadLibrary: bilinmeyen dil reddedilir", async () => {
  await expect(loadLibrary("xx")).rejects.toThrow("Bilinmeyen dil");
});

test("levelCount / totalCount: yüklemeden sayıları verir", () => {
  expect(levelCount("en", "A1")).toBe(en.A1.length);
  expect(levelCount("ru", "L5")).toBe(ru.L5.length);
  expect(levelCount("en", "Z9")).toBe(0);
  expect(totalCount("en")).toBe(Object.values(en).flat().length);
  expect(totalCount("ru")).toBe(Object.values(ru).flat().length);
  expect(totalCount("de")).toBeGreaterThan(0);
});

test("allCards: yüklenmemiş (undefined) dilleri atlar", () => {
  const lib = buildEnglish({ A1: [{ w: "a", t: "b", e: "" }] });
  expect(allCards({ en: lib, ru: undefined })).toHaveLength(1);
});
