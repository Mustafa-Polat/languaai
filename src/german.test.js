import { DE_MODULES, DE_LIBRARY, buildPractice, wordKey } from "./german";

const lessons = DE_MODULES.flatMap((m) => m.lessons.map((l) => ({ m, l })));

test("modül ve ders kodları benzersiz", () => {
  const mods = DE_MODULES.map((m) => m.id);
  expect(new Set(mods).size).toBe(mods.length);
  const ids = lessons.map(({ l }) => l.id);
  expect(new Set(ids).size).toBe(ids.length);
});

test("her dersin zorunlu alanları dolu", () => {
  for (const { l } of lessons) {
    expect(l.title && l.tr).toBeTruthy();
    expect(l.goals.length).toBeGreaterThan(0);
    expect(l.vocab.length).toBeGreaterThan(5);
    expect(l.examples.length).toBeGreaterThan(2);
    expect(l.exercises.length).toBeGreaterThan(5);
    for (const e of l.vocab) { expect(e.de && e.tr).toBeTruthy(); }
  }
});

test("alıştırmalar tutarlı: mc doğru şık, fill cevap listesi, order kelime sırası", () => {
  for (const { l } of lessons) {
    for (const x of l.exercises) {
      if (x.t === "mc") {
        expect(x.opts[x.a]).toBeDefined();
        expect(new Set(x.opts).size).toBe(x.opts.length);
      } else if (x.t === "fill") {
        expect(Array.isArray(x.a) && x.a.length > 0).toBe(true);
      } else if (x.t === "order") {
        expect(x.words.join(" ")).toBe(x.a);
      } else { throw new Error("bilinmeyen soru türü: " + x.t + " (" + l.id + ")"); }
    }
  }
});

test("konuşma alanları: diyalog satırlarında A/B, Almanca ve Türkçe; görevlerde örnek cevap", () => {
  for (const { l } of lessons) {
    if (l.dialog) {
      expect(l.dialog.lines.length).toBeGreaterThan(3);
      for (const x of l.dialog.lines) { expect(["A", "B"]).toContain(x.who); expect(x.de && x.tr).toBeTruthy(); }
    }
    for (const t of l.speak || []) expect(t.task && t.model).toBeTruthy();
  }
});

test("bir modülde aynı kelime iki kez bulunmaz (kütüphane anahtarı çakışmaz)", () => {
  for (const m of DE_MODULES) {
    const keys = m.lessons.flatMap((l) => l.vocab.map(wordKey));
    const dup = keys.filter((k, i) => keys.indexOf(k) !== i);
    expect(dup).toEqual([]);
  }
});

test("M6 kelimeleri önceki modüllerde tekrar etmez", () => {
  const before = new Set(DE_MODULES.filter((m) => m.id !== "M6").flatMap((m) => m.lessons.flatMap((l) => l.vocab.map(wordKey))));
  const m6 = DE_MODULES.find((m) => m.id === "M6").lessons.flatMap((l) => l.vocab.map(wordKey));
  expect(m6.filter((k) => before.has(k))).toEqual([]);
});

test("kütüphane ve alıştırma üretici M6 için çalışır", () => {
  expect(DE_LIBRARY.M6.length).toBeGreaterThan(40);
  for (const { l } of lessons) expect(buildPractice(l).length).toBeGreaterThan(5);
});
