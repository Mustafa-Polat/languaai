import { RU_LESSONS, buildRuPractice, stripStress } from "./russian_grammar";

test("ders kodları benzersiz ve zorunlu alanlar dolu", () => {
  const ids = RU_LESSONS.map((l) => l.id);
  expect(new Set(ids).size).toBe(ids.length);
  for (const l of RU_LESSONS) {
    expect(l.title && l.tr).toBeTruthy();
    expect(l.source).toMatch(/^https:\/\/learnrussian\.github\.io\/lessons\//);
    for (const k of ["goals", "vocab", "grammar", "examples", "exercises", "speak"]) expect(l[k].length).toBeGreaterThan(0);
    for (const e of [...l.vocab, ...l.examples, ...l.dialog.lines]) expect(e.ru && e.tr).toBeTruthy();
  }
});

test("alıştırmalar tutarlı", () => {
  for (const l of RU_LESSONS) {
    for (const x of l.exercises) {
      if (x.t === "mc") {
        expect(x.opts[x.a]).toBeDefined();
        expect(new Set(x.opts).size).toBe(x.opts.length);
      } else if (x.t === "fill") {
        expect(x.a.length).toBeGreaterThan(0);
        // Cevaplar yalnızca ekran klavyesindeki harflerle yazılabilmeli
        for (const a of x.a) expect(a).toMatch(/^[а-яё-]+$/i);
      } else if (x.t === "order") {
        expect(x.words.join(" ")).toBe(x.a);
      } else throw new Error("bilinmeyen soru türü: " + x.t);
    }
  }
});

test("pratik tüm elle yazılan soruları ve kelime sorularını içerir", () => {
  for (const l of RU_LESSONS) {
    const items = buildRuPractice(l);
    expect(items).toHaveLength(l.exercises.length + 3);
    for (const x of items.filter((i) => i.t === "mc")) expect(x.opts[x.a]).toBeDefined();
  }
});

test("seslendirme için vurgu işareti silinir", () => {
  expect(stripStress("приве́т")).toBe("привет");
});
