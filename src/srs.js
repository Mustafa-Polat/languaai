// Aralıklı tekrar (Leitner kutuları) + ilerleme anahtarları.
//
// İlerleme, Supabase'deki `progress.learned` jsonb sütununda tutulur. Yeni bir sütun
// gerekmesin diye SRS verisi aynı objenin içinde "__" ile başlayan ayrılmış anahtarlarda saklanır
// (uygulama zaten "__" ile başlayanları kelime sayısına katmıyor):
//
//   learned["en:A1:about"] = true         → "öğrenildi" işareti (kutu >= 3)
//   learned["__srs"]["en:A1:about"] = [kutu, vadeGünü, hataSayısı]
//   learned["__keys_v2"] = 1              → eski anahtarların taşındığını belirtir
//
// Anahtar biçimi: İngilizce/Rusça için "<dil>:<seviye>:<kelime>". Almanca için
// kelimenin kendisi ("der Tisch"), çünkü GermanCourse aynı anahtarı doğrudan kullanıyor.

export const DAY = 86400000;
export const INTERVAL_DAYS = [0, 1, 3, 7, 14, 30]; // kutu 0..5
export const MAX_BOX = INTERVAL_DAYS.length - 1;
export const LEARNED_BOX = 3; // bu kutu ve üstü "öğrenildi" sayılır
export const SRS_KEY = "__srs";
export const MIGRATED_KEY = "__keys_v2";

// Fisher-Yates (sort(() => Math.random() - 0.5) düzgün dağılım vermez)
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Yerel saate göre gün numarası (gece yarısı geçince yeni gün başlar)
export const dayOf = (now = Date.now()) =>
  Math.floor((now - new Date(now).getTimezoneOffset() * 60000) / DAY);

export const cardKey = (card) =>
  card.lang === "de" ? card.word : card.lang + ":" + card.level + ":" + card.word;

const srsOf = (prog) => prog.learned[SRS_KEY] || {};

function withEntry(prog, key, entry) {
  const learned = { ...prog.learned, [SRS_KEY]: { ...srsOf(prog), [key]: entry } };
  if (entry[0] >= LEARNED_BOX) learned[key] = true;
  else delete learned[key];
  return { ...prog, learned };
}

// rating: "hard" | "ok" | "learned"
export function rateCard(prog, card, rating, now = Date.now()) {
  const key = cardKey(card);
  const [prevBox, , prevLapses] = srsOf(prog)[key] || [0, 0, 0];
  const t = dayOf(now);
  let box = prevBox;
  let lapses = prevLapses;
  if (rating === "hard") { box = 0; lapses += 1; }
  else if (rating === "ok") box = Math.min(prevBox + 1, MAX_BOX);
  else box = Math.min(Math.max(prevBox + 2, LEARNED_BOX), MAX_BOX); // "Öğrendim"
  const due = rating === "hard" ? t : t + INTERVAL_DAYS[box];
  return withEntry(prog, key, [box, due, lapses]);
}

// Bir puanın kartı kaç gün sonra geri getireceği (arayüzde butonların altında gösterilir)
export function previewDays(prog, card, rating, now = Date.now()) {
  const next = rateCard(prog, card, rating, now);
  const e = (next.learned[SRS_KEY] || {})[cardKey(card)];
  return e ? Math.max(0, e[1] - dayOf(now)) : 0;
}

export const formatDays = (d) => (d <= 0 ? "bugün" : d === 1 ? "yarın" : d + " gün");

// Quiz'de yanlış bilinen kelime başa döner (doğru cevap mevcut kutuyu değiştirmez)
export function demoteCard(prog, card, now = Date.now()) {
  const key = cardKey(card);
  const [, , prevLapses] = srsOf(prog)[key] || [0, 0, 0];
  return withEntry(prog, key, [0, dayOf(now), prevLapses + 1]);
}

// Bir kart listesi için: tekrarı gelen / yeni / henüz vadesi gelmemiş sayıları
export function deckStats(cards, prog, now = Date.now()) {
  const srs = srsOf(prog);
  const t = dayOf(now);
  let due = 0, fresh = 0;
  for (const c of cards) {
    const k = cardKey(c);
    const e = srs[k];
    if (e) { if (e[1] <= t) due++; }
    else if (!prog.learned[k]) fresh++;
  }
  return { due, fresh };
}

// Flashcard destesi: önce vadesi gelenler (en gecikmiş önce), kalan yere yeni kelimeler.
// Hiçbiri yoksa vadesi en yakın kartlarla doldurulur (deste asla boş kalmasın).
export function buildDeck(cards, prog, { size = 15, now = Date.now() } = {}) {
  const srs = srsOf(prog);
  const t = dayOf(now);
  const due = [], fresh = [], later = [];
  for (const c of cards) {
    const k = cardKey(c);
    const e = srs[k];
    if (e) (e[1] <= t ? due : later).push([c, e[1]]);
    else if (!prog.learned[k]) fresh.push(c);
  }
  due.sort((a, b) => a[1] - b[1]);
  const dueCards = due.slice(0, size).map((x) => x[0]);
  const newCards = shuffle(fresh).slice(0, size - dueCards.length);
  let list = [...dueCards, ...newCards];
  let early = 0;
  if (list.length < size) {
    later.sort((a, b) => a[1] - b[1]);
    const extra = later.slice(0, size - list.length).map((x) => x[0]);
    early = extra.length;
    list = [...list, ...extra];
  }
  return { cards: shuffle(list), due: dueCards.length, fresh: newCards.length, early };
}

// Quiz sorusu için kelime: %60 ihtimalle vadesi gelmiş / zayıf kelimeler, yoksa rastgele
export function pickQuizCard(cards, prog, now = Date.now()) {
  const srs = srsOf(prog);
  const t = dayOf(now);
  const weak = cards.filter((c) => {
    const e = srs[cardKey(c)];
    return e && (e[1] <= t || e[0] <= 1);
  });
  const pool = weak.length > 0 && Math.random() < 0.6 ? weak : cards;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ---- Eski ilerlemeyi yeni biçime taşıma ----

const hash = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

// libs: { en: {A1: [...]}, ru: {L1: [...]}, de: {M1: [...]} } (kart objeleriyle)
// 1) Eski düz anahtarları ("about") "en:A1:about" biçimine taşır. Aynı kelime birden çok
//    seviyede geçiyorsa en düşük seviyeye yazılır (hiç öğrenilmemiş bir kartı öğrenilmiş saymamak için).
// 2) "Öğrenildi" işaretli ama SRS kaydı olmayan her kelimeye kutu 3 verir ve vade günlerini
//    1–7 gün arasına yayar (hepsi aynı gün tekrar çıkmasın).
// Dönüş: { learned, changed }
export function prepareProgress(learned, libs, now = Date.now()) {
  const out = { ...learned };
  let changed = false;

  if (!out[MIGRATED_KEY]) {
    const deWords = new Set();
    for (const cards of Object.values(libs.de || {})) for (const c of cards) deWords.add(c.word);
    const index = new Map();
    for (const lang of ["en", "ru"]) {
      for (const cards of Object.values(libs[lang] || {})) {
        for (const c of cards) if (!index.has(c.word)) index.set(c.word, cardKey(c));
      }
    }
    for (const k of Object.keys(learned)) {
      if (k.startsWith("__") || !index.has(k)) continue;
      const nk = index.get(k);
      if (!out[nk]) out[nk] = learned[k];
      if (!deWords.has(k)) delete out[k];
    }
    out[MIGRATED_KEY] = 1;
    changed = true;
  }

  const srs = { ...(out[SRS_KEY] || {}) };
  const t = dayOf(now);
  let added = false;
  for (const k of Object.keys(out)) {
    if (k.startsWith("__") || !out[k] || srs[k]) continue;
    srs[k] = [LEARNED_BOX, t + 1 + (hash(k) % 7), 0];
    added = true;
  }
  if (added) { out[SRS_KEY] = srs; changed = true; }

  return { learned: out, changed };
}
