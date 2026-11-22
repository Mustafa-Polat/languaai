import {
  DAY, SRS_KEY, MIGRATED_KEY, dayOf, cardKey, rateCard, demoteCard, buildDeck, deckStats,
  pickQuizCard, prepareProgress, shuffle, previewDays, formatDays,
} from "./srs";

const NOW = new Date("2026-11-17T10:00:00").getTime();
const en = (word, level = "A1") => ({ word, turkish: word + "-tr", level, lang: "en" });
const ru = (word, level) => ({ word, turkish: word + "-tr", level, lang: "ru" });
const de = (word) => ({ word, turkish: word + "-tr", level: "M1", lang: "de" });
const empty = () => ({ learned: {}, qCorrect: 0, qTotal: 0 });

test("cardKey: İngilizce/Rusça önekli, Almanca düz", () => {
  expect(cardKey(en("about"))).toBe("en:A1:about");
  expect(cardKey(ru("Есть", "L4"))).toBe("ru:L4:Есть");
  expect(cardKey(de("der Tisch"))).toBe("der Tisch");
});

test("rateCard: ok kutuyu bir artırır ve vade verir", () => {
  const c = en("about");
  let p = rateCard(empty(), c, "ok", NOW);
  expect(p.learned[SRS_KEY]["en:A1:about"]).toEqual([1, dayOf(NOW) + 1, 0]);
  expect(p.learned["en:A1:about"]).toBeUndefined();
  p = rateCard(p, c, "ok", NOW);
  p = rateCard(p, c, "ok", NOW);
  expect(p.learned[SRS_KEY]["en:A1:about"][0]).toBe(3);
  expect(p.learned["en:A1:about"]).toBe(true); // kutu 3 = öğrenildi
});

test("rateCard: Öğrendim yeni kartı doğrudan kutu 3'e alır, Zor sıfırlar", () => {
  const c = en("about");
  let p = rateCard(empty(), c, "learned", NOW);
  expect(p.learned[SRS_KEY]["en:A1:about"]).toEqual([3, dayOf(NOW) + 7, 0]);
  expect(p.learned["en:A1:about"]).toBe(true);
  p = rateCard(p, c, "hard", NOW);
  expect(p.learned[SRS_KEY]["en:A1:about"]).toEqual([0, dayOf(NOW), 1]);
  expect(p.learned["en:A1:about"]).toBeUndefined();
});

test("rateCard: kutu 5'i aşmaz ve girdi objesini değiştirmez", () => {
  const c = en("about");
  const base = empty();
  let p = base;
  for (let i = 0; i < 10; i++) p = rateCard(p, c, "learned", NOW);
  expect(p.learned[SRS_KEY]["en:A1:about"][0]).toBe(5);
  expect(base.learned).toEqual({});
});

test("demoteCard: yanlış cevap kartı başa döndürür", () => {
  const c = en("about");
  const p = demoteCard(rateCard(empty(), c, "learned", NOW), c, NOW);
  expect(p.learned[SRS_KEY]["en:A1:about"]).toEqual([0, dayOf(NOW), 1]);
  expect(p.learned["en:A1:about"]).toBeUndefined();
});

test("buildDeck: önce vadesi gelenler, sonra yeni; öğrenilmiş ama vadesi gelmemiş girmez", () => {
  const cards = ["a", "b", "c", "d", "e", "f"].map((w) => en(w));
  let p = empty();
  p = rateCard(p, cards[0], "hard", NOW - 3 * DAY); // a: 3 gün önce zor dendi → vadesi geldi
  p = rateCard(p, cards[1], "learned", NOW);        // b: 7 gün sonra
  const { cards: deck, due, fresh, early } = buildDeck(cards, p, { size: 4, now: NOW });
  const words = deck.map((c) => c.word);
  expect(due).toBe(1);
  expect(fresh).toBe(3);
  expect(early).toBe(0);
  expect(words).toContain("a");
  expect(words).not.toContain("b");
  expect(deck).toHaveLength(4);
});

test("buildDeck: hiçbir şey yoksa vadesi en yakın kartlarla doldurur", () => {
  const cards = ["a", "b"].map((w) => en(w));
  let p = empty();
  cards.forEach((c) => { p = rateCard(p, c, "learned", NOW); });
  const r = buildDeck(cards, p, { size: 15, now: NOW });
  expect(r.due + r.fresh).toBe(0);
  expect(r.early).toBe(2);
  expect(r.cards).toHaveLength(2);
});

test("deckStats: tekrar ve yeni sayısı", () => {
  const cards = ["a", "b", "c"].map((w) => en(w));
  let p = rateCard(empty(), cards[0], "hard", NOW);
  p = rateCard(p, cards[1], "learned", NOW);
  expect(deckStats(cards, p, NOW)).toEqual({ due: 1, fresh: 1 });
});

test("pickQuizCard: her zaman listeden bir kart döner", () => {
  const cards = ["a", "b", "c"].map((w) => en(w));
  const p = demoteCard(empty(), cards[2], NOW);
  for (let i = 0; i < 50; i++) expect(cards).toContain(pickQuizCard(cards, p, NOW));
});

test("prepareProgress: eski anahtarlar taşınır, çakışan kelime en düşük seviyeye yazılır", () => {
  const libs = {
    en: { A1: [en("about", "A1")], A2: [en("about", "A2"), en("above", "A2")] },
    ru: { L1: [ru("Есть", "L1")], L4: [ru("Есть", "L4")] },
    de: { M1: [de("der Tisch")] },
  };
  const old = { about: true, above: true, "Есть": true, "der Tisch": true, "__de_lesson_x": 80 };
  const { learned, changed } = prepareProgress(old, libs, NOW);
  expect(changed).toBe(true);
  expect(learned["en:A1:about"]).toBe(true);
  expect(learned["en:A2:about"]).toBeUndefined();
  expect(learned["en:A2:above"]).toBe(true);
  expect(learned["ru:L1:Есть"]).toBe(true);
  expect(learned["ru:L4:Есть"]).toBeUndefined();
  expect(learned["about"]).toBeUndefined();
  expect(learned["der Tisch"]).toBe(true); // Almanca anahtarı değişmez
  expect(learned["__de_lesson_x"]).toBe(80);
  expect(learned[MIGRATED_KEY]).toBe(1);
  // öğrenilmiş her kelimeye 1–7 gün arası vade verilir
  for (const k of ["en:A1:about", "en:A2:above", "ru:L1:Есть", "der Tisch"]) {
    const [box, due] = learned[SRS_KEY][k];
    expect(box).toBe(3);
    expect(due).toBeGreaterThanOrEqual(dayOf(NOW) + 1);
    expect(due).toBeLessThanOrEqual(dayOf(NOW) + 7);
  }
});

test("prepareProgress: ikinci çalıştırmada değişiklik yok", () => {
  const libs = { en: { A1: [en("about")] }, ru: {}, de: {} };
  const first = prepareProgress({ about: true }, libs, NOW);
  const second = prepareProgress(first.learned, libs, NOW);
  expect(second.changed).toBe(false);
  expect(second.learned).toEqual(first.learned);
});

test("prepareProgress: ders kayıtları ve boş ilerleme SRS'e girmez", () => {
  const libs = { en: { A1: [en("about")] }, ru: {}, de: {} };
  const { learned } = prepareProgress({ __de_lesson_m1: 90 }, libs, NOW);
  expect(learned[SRS_KEY]).toBeUndefined();
});

test("shuffle: aynı elemanları döndürür, girdiyi değiştirmez", () => {
  const src = [1, 2, 3, 4, 5, 6, 7, 8];
  const out = shuffle(src);
  expect([...out].sort()).toEqual(src);
  expect(src).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
});

test("previewDays: yeni kart için Zor=bugün, Tamam=1 gün, Öğrendim=7 gün; kaydı değiştirmez", () => {
  const p = empty();
  const c = en("about");
  expect(previewDays(p, c, "hard", NOW)).toBe(0);
  expect(previewDays(p, c, "ok", NOW)).toBe(1);
  expect(previewDays(p, c, "learned", NOW)).toBe(7);
  expect(p.learned).toEqual({});
});

test("formatDays: bugün / yarın / N gün", () => {
  expect(formatDays(0)).toBe("bugün");
  expect(formatDays(1)).toBe("yarın");
  expect(formatDays(14)).toBe("14 gün");
});
