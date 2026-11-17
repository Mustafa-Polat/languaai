// Kelime listelerini isteğe bağlı yükler. İngilizce ve Rusça veri JSON dosyalarında durur ve
// dinamik import ile ayrı parçalar (chunk) olarak yüklenir; ana pakete girmez.
// Almanca müfredatı ders ekranıyla iç içe olduğu için şimdilik german.js'te kalıyor.
//
// Kart biçimi (flashcard / quiz / liste ekranlarının kullandığı): { word, turkish, example, level, lang }

import { DE_LIBRARY } from "./german";
import meta from "./data/meta.json";

export const EN_LEVELS = ["A1", "A2", "B1", "B2", "C1"];

export const buildEnglish = (raw) =>
  Object.fromEntries(
    Object.entries(raw).map(([level, words]) => [
      level,
      words.map((w) => ({ word: w.w, turkish: w.t, example: w.e, level, lang: "en" })),
    ])
  );

export const buildRussian = (raw) =>
  Object.fromEntries(
    Object.entries(raw).map(([level, words]) => [
      level,
      words.map((w) => ({ word: w.w, turkish: w.t, example: "", level, lang: "ru" })),
    ])
  );

const loaders = {
  en: () => import("./data/en.json").then((m) => buildEnglish(m.default)),
  ru: () => import("./data/ru.json").then((m) => buildRussian(m.default)),
  de: () => Promise.resolve(DE_LIBRARY),
};

const cache = {}; // dil -> Promise (aynı dil için tek istek)

// Başarısız olursa önbellekten silinir; sonraki çağrı yeniden dener.
export function loadLibrary(lang) {
  if (!loaders[lang]) return Promise.reject(new Error("Bilinmeyen dil: " + lang));
  if (!cache[lang]) {
    cache[lang] = loaders[lang]().catch((err) => {
      delete cache[lang];
      throw err;
    });
  }
  return cache[lang];
}

// Verilen kütüphanelerdeki tüm kartlar (henüz yüklenmeyen diller boş sayılır)
export const allCards = (libs) =>
  Object.values(libs).flatMap((lib) => (lib ? Object.values(lib).flat() : []));

// Listeler yüklenmeden de gösterilebilsin diye seviye başına kelime sayıları (src/data/meta.json;
// srs/libraries testi verilerle tutarlılığını doğrular)
export const levelCount = (lang, level) =>
  lang === "de" ? (DE_LIBRARY[level] || []).length : (meta[lang] && meta[lang][level]) || 0;

export const totalCount = (lang) =>
  lang === "de"
    ? Object.values(DE_LIBRARY).flat().length
    : Object.values(meta[lang] || {}).reduce((a, b) => a + b, 0);
