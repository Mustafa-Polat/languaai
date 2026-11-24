import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import GermanCourse from "./GermanCourse";
import ChangePassword from "./ChangePassword";
import { DE_LIBRARY, DE_MODULES } from "./german";
import {
  shuffle, cardKey, rateCard, demoteCard, buildDeck, deckStats, pickQuizCard, prepareProgress, MIGRATED_KEY,
  previewDays, formatDays,
} from "./srs";
import { loadLibrary, allCards, levelCount, totalCount } from "./libraries";
import { signIn, signUp, toAppUser } from "./auth";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const LEVELS = ["A1", "A2", "B1", "B2", "C1"];

// Yanlış şıklar: aynı anlamı tekrar etmeyen, doğru cevaba uzunluk olarak yakın olanlar
// (çok farklı uzunluktaki şık doğru cevabı kendiliğinden ele verir)
function makeQuiz(word, turkish, allWords) {
  const seen = new Set([turkish]);
  const candidates = [];
  for (const w of shuffle(allWords)) {
    if (w.word === word || seen.has(w.turkish)) continue;
    seen.add(w.turkish);
    candidates.push(w.turkish);
    if (candidates.length >= 12) break;
  }
  const wrong = candidates
    .sort((a, b) => Math.abs(a.length - turkish.length) - Math.abs(b.length - turkish.length))
    .slice(0, 3);
  const opts = shuffle([...wrong, turkish]);
  return { word, opts, correct: opts.indexOf(turkish) };
}

// Cihaza özgü tercihler (son seçilen dil ve seviyeler); localStorage kullanılamazsa varsayılanlar
const PREF_PREFIX = "lingua_pref_";
function readPref(key, allowed, fallback) {
  try {
    const v = localStorage.getItem(PREF_PREFIX + key);
    return allowed.includes(v) ? v : fallback;
  } catch { return fallback; }
}
function writePref(key, value) {
  try { localStorage.setItem(PREF_PREFIX + key, value); } catch {}
}

// Özgün LINGUA logosu: konuşma balonu + "L" + parıltı
function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" role="img" aria-label="LinguaAI logosu" style={{ display: "block", flexShrink: 0 }}>
      <defs>
        <linearGradient id="lg-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1c1c32" /><stop offset="1" stopColor="#0a0a0f" /></linearGradient>
        <linearGradient id="lg-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffe98a" /><stop offset="1" stopColor="#f5a30a" /></linearGradient>
      </defs>
      <rect width="512" height="512" rx="112" fill="url(#lg-bg)" />
      <path d="M148 120h216a52 52 0 0 1 52 52v110a52 52 0 0 1-52 52H236l-72 60a8 8 0 0 1-13-6v-54a52 52 0 0 1-39-50V172a52 52 0 0 1 52-52z" fill="url(#lg-gold)" />
      <path d="M208 180v128h100" fill="none" stroke="#0a0a0f" strokeWidth="34" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M352 190l8 20 20 8-20 8-8 20-8-20-20-8 20-8z" fill="#0a0a0f" />
    </svg>
  );
}

// Uzun tek kelimeler kartın dışına taşmasın: en uzun kelimeye göre yazı boyutunu küçültür
function fitFont(text, max, min, avail) {
  const longest = Math.max(1, ...String(text || "").split(/\s+/).map((w) => [...w].length));
  return Math.round(Math.max(min, Math.min(max, avail / (0.6 * longest))));
}
const WRAP = { overflowWrap: "anywhere", minWidth: 0 }; // aşırı uzun kelimelerde son çare olarak böl

const TABS = [["home", "🏠", "Ana"], ["library", "📖", "Liste"], ["stats", "📊", "İlerleme"]];

const emptyProgress = () => ({ learned: {}, qCorrect: 0, qTotal: 0 });



export default function App() {
  const [user, setUser] = useState(null);
  const [authTab, setAuthTab] = useState("login");
  const [form, setForm] = useState({ username: "", password: "" });
  const [authErr, setAuthErr] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authReady, setAuthReady] = useState(false); // oturum kontrolü bitmeden giriş ekranı çakılmasın
  const [saveErr, setSaveErr] = useState(false);
  const [loadErr, setLoadErr] = useState(false);
  const [screen, setScreen] = useState("home");
  const [lang, setLang] = useState(() => readPref("lang", ["en", "ru", "de"], "en")); // "en" | "ru" | "de"
  const [level, setLevel] = useState(() => readPref("level", LEVELS, "A1"));
  const [ruLevel, setRuLevel] = useState(() => readPref("ruLevel", ["L1", "L2", "L3", "L4", "L5"], "L1"));
  const [deLevel, setDeLevel] = useState(() => readPref("deLevel", DE_MODULES.map(m => m.id), "M1"));
  const [confirmReset, setConfirmReset] = useState(false);
  const [prog, setProg] = useState(emptyProgress());
  const [deck, setDeck] = useState([]);
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [sel, setSel] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [sessionScore, setSessionScore] = useState({ c: 0, t: 0 });
  const [libSearch, setLibSearch] = useState("");
  const [libLevel, setLibLevel] = useState("A1");
  const [exampleSentence, setExampleSentence] = useState(null);
  const [exampleLoading, setExampleLoading] = useState(false);

  // Oturum Supabase Auth'tan gelir (imzalı JWT). Eski sürümün düz "lingua_u" kaydı artık güvenilmez, silinir.
  useEffect(() => {
    try { localStorage.removeItem("lingua_u"); } catch {}
    let alive = true;
    supabase.auth.getSession()
      .then(({ data }) => {
        if (!alive) return;
        setUser(toAppUser(data && data.session && data.session.user));
        setAuthReady(true);
      })
      .catch(() => { if (alive) setAuthReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      const u = toAppUser(session && session.user);
      setUser(prev => (prev && u && prev.id === u.id ? prev : u)); // sekme odağında gelen tekrar olaylarını yok say
    });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);

  // Kullanıcı değişince (giriş / başka sekmede çıkış) ilerleme yüklenir ya da temizlenir
  useEffect(() => {
    currentUid.current = user ? user.id : null;
    if (user) {
      loadProg(user.id);
    } else {
      loadedUid.current = null;
      progRef.current = emptyProgress();
      setProg(emptyProgress());
      setSaveErr(false); setLoadErr(false);
    }
  }, [user && user.id]);

  // Kelime listeleri dil bazında ihtiyaç olunca yüklenir (bkz. libraries.js)
  const [libs, setLibs] = useState({ de: DE_LIBRARY });
  const [libErr, setLibErr] = useState(false);
  const libsRef = useRef({ de: DE_LIBRARY });

  const ensureLib = useCallback(async (l) => {
    if (libsRef.current[l]) return libsRef.current[l];
    try {
      const lib = await loadLibrary(l);
      libsRef.current = { ...libsRef.current, [l]: lib };
      setLibs(libsRef.current);
      setLibErr(false);
      return lib;
    } catch {
      setLibErr(true);
      return null;
    }
  }, []);

  // Her kart/quiz cevabında ağ isteği atmamak için kayıtlar 700 ms birleştirilir.
  // Güncel ilerleme progRef'te durur; böylece art arda hızlı cevaplarda eski state okunmaz.
  const progRef = useRef(emptyProgress());
  const saveTimer = useRef(null);
  const currentUid = useRef(null);  // şu an oturum açmış kullanıcı
  const loadedUid = useRef(null);   // ilerlemesi sunucudan başarıyla okunmuş kullanıcı

  const pushProg = useCallback(async (p, uid) => {
    try {
      const { error } = await supabase.from("user_progress").upsert({
        user_id: uid, learned: p.learned,
        quiz_correct: p.qCorrect, quiz_total: p.qTotal,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" });
      if (error) throw error;
      setSaveErr(false);
      return true;
    } catch {
      setSaveErr(true);
      return false;
    }
  }, []);

  const loadProg = async (uid) => {
    try {
      const { data, error } = await supabase.from("user_progress").select().eq("user_id", uid).maybeSingle();
      if (error) throw error;
      if (currentUid.current !== uid) return; // yükleme sürerken kullanıcı değişti / çıkış yaptı
      loadedUid.current = uid;
      setLoadErr(false);
      if (data) {
        let learned = data.learned || {};
        let changed = false;
        // Eski düz anahtarları dil:seviye:kelime biçimine taşımak için listeler gerekir.
        // Yüklenemezse göç atlanır (bayrak yazılmaz), bir sonraki girişte tekrar denenir.
        // Göç zaten yapıldıysa listelere gerek yok, Rusça gibi diller ihtiyaç olunca yüklenir.
        if (learned[MIGRATED_KEY]) {
          ({ learned, changed } = prepareProgress(learned, {}));
        } else {
          const [en, ru] = await Promise.all([ensureLib("en"), ensureLib("ru")]);
          if (en && ru) ({ learned, changed } = prepareProgress(learned, { en, ru, de: DE_LIBRARY }));
        }
        const p = { learned, qCorrect: data.quiz_correct || 0, qTotal: data.quiz_total || 0 };
        progRef.current = p;
        setProg(p);
        if (changed) await pushProg(p, uid);
      }
    } catch {
      if (currentUid.current === uid) setLoadErr(true);
    }
  };

  const saveProg = useCallback((p) => {
    progRef.current = p;
    setProg(p);
    if (!user) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveTimer.current = null;
      if (loadedUid.current === user.id) pushProg(progRef.current, user.id);
    }, 700);
  }, [user, pushProg]);

  // Bekleyen kaydı hemen gönderir; tamamlanınca çözülen söz döndürür
  const flushProg = useCallback(() => {
    if (!user || !saveTimer.current) return Promise.resolve();
    clearTimeout(saveTimer.current);
    saveTimer.current = null;
    if (loadedUid.current !== user.id) return Promise.resolve();
    return pushProg(progRef.current, user.id);
  }, [user, pushProg]);

  useEffect(() => {
    const onHide = () => { if (document.visibilityState === "hidden") flushProg(); };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", flushProg);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", flushProg);
    };
  }, [flushProg]);

  const doLogin = async () => {
    setAuthErr(""); setAuthBusy(true);
    const r = await signIn(supabase, form.username, form.password);
    if (r.error) setAuthErr(r.error);
    else { setUser(r.user); setForm(f => ({ ...f, password: "" })); }
    setAuthBusy(false);
  };

  const doRegister = async () => {
    setAuthErr(""); setAuthBusy(true);
    const r = await signUp(supabase, form.username, form.password);
    if (r.error) setAuthErr(r.error);
    else { setUser(r.user); setForm(f => ({ ...f, password: "" })); }
    setAuthBusy(false);
  };

  const logout = async () => {
    await flushProg(); // çıkıştan önce bekleyen ilerleme sunucuya gitsin (oturum hâlâ geçerliyken)
    try { await supabase.auth.signOut({ scope: "local" }); } catch {}
    setUser(null); setScreen("home");
    setForm({ username: "", password: "" });
  };

  const curLevel = lang === "ru" ? ruLevel : lang === "de" ? deLevel : level;
  const libFor = (l, lvl) => (libs[l] && libs[l][lvl]) || [];
  const currentLibrary = () => libFor(lang, curLevel);

  // Dil seçilince / ilgili ekran açılınca listeyi yükle (en ilk açılışta zaten gerekli)
  useEffect(() => { ensureLib(lang); }, [lang, ensureLib]);
  useEffect(() => {
    if (screen === "stats") { ensureLib("en"); ensureLib("ru"); }
  }, [screen, ensureLib]);

  const startCards = useCallback(async () => {
    const lib = await ensureLib(lang);
    if (!lib) return;
    // Önce tekrarı gelen kartlar, kalan yere yeni kelimeler (aralıklı tekrar)
    setDeck(buildDeck(lib[curLevel] || [], progRef.current).cards);
    setCardIdx(0); setFlipped(false); setDone(false); setScreen("flashcard");
  }, [ensureLib, lang, curLevel]);

  const nextCard = useCallback((rating) => {
    const card = deck[cardIdx];
    saveProg(rateCard(progRef.current, card, rating));
    if (cardIdx + 1 >= deck.length) { setDone(true); flushProg(); }
    else { setCardIdx(i => i + 1); setFlipped(false); }
  }, [cardIdx, deck, saveProg, flushProg]);

  const startQuiz = useCallback(async () => {
    const lib = await ensureLib(lang);
    if (!lib) return;
    setScreen("quiz"); setSessionScore({ c: 0, t: 0 }); nextQuiz();
  }, [ensureLib, lang, level, ruLevel, deLevel]);

  const nextQuiz = useCallback(() => {
    const lib = libsRef.current[lang];
    const all = (lib && lib[curLevel]) || [];
    if (all.length === 0) return;
    const w = pickQuizCard(all, progRef.current);
    setQuiz({ ...makeQuiz(w.word, w.turkish, all), card: w });
    setSel(null); setCorrect(null);
  }, [lang, curLevel]);

  const submitQuiz = useCallback((idx) => {
    if (sel !== null || !quiz) return;
    setSel(idx);
    const ok = idx === quiz.correct;
    setCorrect(ok);
    setSessionScore(s => ({ c: s.c + (ok ? 1 : 0), t: s.t + 1 }));
    const cur = progRef.current;
    let np = { ...cur, qCorrect: cur.qCorrect + (ok ? 1 : 0), qTotal: cur.qTotal + 1 };
    if (!ok && quiz.card) np = demoteCard(np, quiz.card); // yanlış bilinen kelime tekrar listesine döner
    saveProg(np);
  }, [sel, quiz, saveProg]);

  // Son seçilen dil ve seviyeler cihazda hatırlanır
  useEffect(() => {
    writePref("lang", lang); writePref("level", level);
    writePref("ruLevel", ruLevel); writePref("deLevel", deLevel);
  }, [lang, level, ruLevel, deLevel]);

  // Masaüstü klavye kısayolları: Boşluk/Enter çevirir, 1-2-3 puanlar; quizde 1-4 seçer, Enter sonraki soru
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "BUTTON" || t.isContentEditable)) return;
      if (screen === "flashcard" && deck.length > 0 && !done) {
        if (e.key === " " || e.key === "Enter") { e.preventDefault(); setFlipped(f => !f); }
        else if (flipped && ["1", "2", "3"].includes(e.key)) nextCard(["hard", "ok", "learned"][Number(e.key) - 1]);
      } else if (screen === "quiz" && quiz) {
        if (sel === null && ["1", "2", "3", "4"].includes(e.key)) {
          if (Number(e.key) <= quiz.opts.length) submitQuiz(Number(e.key) - 1);
        } else if (sel !== null && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); nextQuiz(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen, deck, done, flipped, quiz, sel, nextCard, submitQuiz, nextQuiz]);

  const nav = (s) => { setScreen(s); setFlipped(false); setConfirmReset(false); };

  const speak = useCallback((word, wordLang) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(word);
    const l = wordLang || lang;
    utt.lang = l === "ru" ? "ru-RU" : l === "de" ? "de-DE" : "en-US";
    utt.rate = 0.9;
    window.speechSynthesis.speak(utt);
  }, [lang]);


  const fetchExample = async (word) => {
    setExampleSentence(null);
    setExampleLoading(true);
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!res.ok) throw new Error("not found");
      const data = await res.json();
      let found = null;
      for (const entry of data) {
        for (const meaning of entry.meanings || []) {
          for (const def of meaning.definitions || []) {
            if (def.example) { found = def.example; break; }
          }
          if (found) break;
        }
        if (found) break;
      }
      setExampleSentence(found);
    } catch { setExampleSentence(null); }
    setExampleLoading(false);
  };

  useEffect(() => {
    if (screen === "flashcard" && flipped && deck[cardIdx] && lang !== "de") {
      fetchExample(deck[cardIdx].word);
    }
  }, [screen, flipped, cardIdx]);


  // "__" ile başlayan anahtarlar ders tamamlanma kayıtlarıdır, kelime sayısına dahil değil
  const learned = Object.keys(prog.learned).filter(k => !k.startsWith("__")).length;
  const acc = prog.qTotal > 0 ? Math.round((prog.qCorrect / prog.qTotal) * 100) : 0;
  // Seçili seviye için tekrarı gelen / yeni kelime sayısı (ana sayfadaki Flashcard butonu)
  const curLevelLabel = curLevel;
  const libReady = !!libs[lang];
  const dk = screen === "home" ? deckStats(currentLibrary(), prog) : { due: 0, fresh: 0 };
  // Tüm dillerde bugün tekrarı gelen kelime sayısı (İlerleme ekranı)
  const totalDue = screen === "stats" ? deckStats(allCards(libs), prog).due : 0;
  const libWords = lang === "ru"
    ? libFor("ru", ruLevel).filter(w =>
        !libSearch || w.word.toLowerCase().includes(libSearch.toLowerCase()) ||
        w.turkish.toLowerCase().includes(libSearch.toLowerCase()))
    : lang === "de"
    ? libFor("de", deLevel).filter(w =>
        !libSearch || w.word.toLowerCase().includes(libSearch.toLowerCase()) ||
        w.turkish.toLowerCase().includes(libSearch.toLowerCase()))
    : libFor("en", libLevel).filter(w =>
        !libSearch || w.word.toLowerCase().includes(libSearch.toLowerCase()) ||
        w.turkish.toLowerCase().includes(libSearch.toLowerCase()));

  const S = {
    page: { minHeight: "100vh", background: "#0a0a0f", fontFamily: "Georgia,serif", color: "#e8e4d9" },
    card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 18, padding: "20px 24px" },
    inp: { width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#e8e4d9", padding: "12px 16px", fontSize: 15, fontFamily: "inherit", outline: "none", marginBottom: 12, display: "block" },
    btn: (a) => ({ background: a ? "linear-gradient(135deg,#ffe58a,#f7b928)" : "rgba(255,255,255,0.05)", border: a ? "1px solid rgba(255,217,90,0.6)" : "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: a ? "#1a1403" : "#e8e4d9", padding: "10px 16px", fontSize: 13, fontWeight: a ? "bold" : "normal", cursor: "pointer", fontFamily: "inherit", boxShadow: a ? "0 4px 14px rgba(247,185,40,0.28)" : "none" }),
  };

  const vw = Math.min(typeof window !== "undefined" ? window.innerWidth : 390, 660);
  const showTabs = screen !== "flashcard" && screen !== "quiz"; // çalışma ekranlarında dikkat dağıtmasın
  const finePointer = typeof window !== "undefined" && !!window.matchMedia &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches; // klavye ipuçları yalnızca masaüstünde

  if (!authReady) return (
    <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "rgba(232,228,217,0.4)", fontSize: 14 }}>Yükleniyor...</div>
    </div>
  );

  if (!user) return (
    <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12, filter: "drop-shadow(0 8px 24px rgba(255,217,90,0.25))" }}><Logo size={84} /></div>
          <h1 style={{ fontSize: 28, fontWeight: "bold", color: "#ffd95a", letterSpacing: 2, margin: 0 }}>LINGUA</h1>
          <p style={{ color: "rgba(232,228,217,0.4)", fontSize: 13, margin: "6px 0 0" }}>{totalCount("en") + totalCount("ru") + totalCount("de")} kelime · İngilizce, Rusça, Almanca</p>
        </div>
        <div style={{ display: "flex", marginBottom: 20, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4 }}>
          {["login","register"].map(t => (
            <button key={t} onClick={() => { setAuthTab(t); setAuthErr(""); }} style={{
              flex: 1, background: authTab === t ? "linear-gradient(135deg,#ffe58a,#f7b928)" : "transparent", border: "none",
              borderRadius: 8, boxShadow: authTab === t ? "0 3px 10px rgba(247,185,40,0.25)" : "none", color: authTab === t ? "#0a0a0f" : "rgba(232,228,217,0.5)",
              padding: "10px", fontSize: 14, fontWeight: authTab === t ? "bold" : "normal",
              cursor: "pointer", fontFamily: "inherit",
            }}>{t === "login" ? "Giriş Yap" : "Kayıt Ol"}</button>
          ))}
        </div>
        <div style={{ ...S.card, padding: "28px 24px" }}>
          <div style={{ fontSize: 12, color: "rgba(232,228,217,0.45)", marginBottom: 6 }}>KULLANICI ADI</div>
          <input style={S.inp} placeholder="kullanici_adi" value={form.username}
            autoComplete="username" autoCapitalize="none" autoCorrect="off" spellCheck={false}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && (authTab === "login" ? doLogin() : doRegister())} />
          <div style={{ fontSize: 12, color: "rgba(232,228,217,0.45)", marginBottom: 6 }}>ŞİFRE</div>
          <input style={S.inp} type="password" placeholder="şifre" value={form.password}
            autoComplete={authTab === "login" ? "current-password" : "new-password"}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && (authTab === "login" ? doLogin() : doRegister())} />
          {authTab === "register" && (
            <div style={{ fontSize: 11, color: "rgba(232,228,217,0.35)", marginBottom: 12, lineHeight: 1.5 }}>
              Kullanıcı adı: küçük harf, rakam, nokta, alt çizgi, tire (en az 3). Şifre en az 6 karakter.
            </div>
          )}
          {authErr && <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#f87171", marginBottom: 14 }}>{authErr}</div>}
          <button onClick={authTab === "login" ? doLogin : doRegister} disabled={authBusy}
            style={{ width: "100%", background: "linear-gradient(135deg,#ffe58a,#f7b928)", border: "none", borderRadius: 12, boxShadow: "0 6px 20px rgba(247,185,40,0.3)", color: "#1a1403", padding: "15px", fontSize: 15, fontWeight: "bold", letterSpacing: 0.3, cursor: authBusy ? "default" : "pointer", fontFamily: "inherit", opacity: authBusy ? 0.6 : 1 }}>
            {authBusy ? "Bekleyin..." : authTab === "login" ? "Giriş Yap" : "Kayıt Ol"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={S.page}>
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,15,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,217,90,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <Logo size={30} />
          <span style={{ fontSize: 15, fontWeight: "bold", color: "#ffd95a", letterSpacing: 2 }}>LINGUA</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <span title={user.username} style={{ fontSize: 12, color: "rgba(232,228,217,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 150 }}>{user.username}</span>
          <button onClick={logout} aria-label="Çıkış yap" style={{ flexShrink: 0, background: "transparent", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 8, color: "#f87171", padding: "6px 10px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Çıkış</button>
        </div>
      </nav>

      <div style={{ maxWidth: 660, margin: "0 auto", padding: showTabs ? "28px 18px calc(92px + env(safe-area-inset-bottom))" : "28px 18px 40px" }}>
        {(loadErr || saveErr) && (
          <div role="alert" style={{ ...S.card, border: "1px solid rgba(248,113,113,0.35)", color: "#f87171", marginBottom: 16, fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <span>{loadErr
              ? "İlerlemen yüklenemedi. Yuklenene kadar yeni ilerleme kaydedilmez."
              : "İlerleme kaydedilemedi. Bağlantını kontrol et."}</span>
            <button onClick={() => (loadErr ? loadProg(user.id) : pushProg(progRef.current, user.id))} style={S.btn(false)}>Tekrar dene</button>
          </div>
        )}

        {screen === "home" && (
          <div>
            {libErr && (
              <div style={{ ...S.card, border: "1px solid rgba(248,113,113,0.35)", color: "#f87171", marginBottom: 16, fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <span>Kelime listesi yüklenemedi. Bağlantını kontrol et.</span>
                <button onClick={() => ensureLib(lang)} style={S.btn(false)}>Tekrar dene</button>
              </div>
            )}
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>&#127891;</div>
              <h1 style={{ fontSize: 28, fontWeight: "bold", margin: "0 0 6px", color: "#ffd95a" }}>Merhaba, {user.username}!</h1>
              <p style={{ color: "rgba(232,228,217,0.4)", margin: 0, fontSize: 13 }}>{totalCount("en")} İng + {totalCount("ru")} Rus + {totalCount("de")} Alm kelime</p>
            </div>

            {/* Dil Seçici */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 5 }}>
              {[["en","🇬🇧 İngilizce"],["ru","🇷🇺 Rusça"],["de","🇩🇪 Almanca"]].map(([l, label]) => (
                <button key={l} onClick={() => setLang(l)} style={{
                  flex: 1, background: lang === l ? "linear-gradient(135deg,#ffe58a,#f7b928)" : "transparent", boxShadow: lang === l ? "0 3px 10px rgba(247,185,40,0.25)" : "none",
                  border: "none", borderRadius: 8, color: lang === l ? "#0a0a0f" : "rgba(232,228,217,0.5)",
                  padding: "11px", fontSize: 14, fontWeight: lang === l ? "bold" : "normal",
                  cursor: "pointer", fontFamily: "inherit"
                }}>{label}</button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24 }}>
              {[["&#11088;", learned, "Öğrenilen"], ["&#127919;", acc + "%", "Doğruluk"], ["&#129504;", prog.qTotal, "Quiz"]].map(([icon, val, label]) => (
                <div key={label} style={{ ...S.card, textAlign: "center", padding: "18px 10px" }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }} dangerouslySetInnerHTML={{ __html: icon }} />
                  <div style={{ fontSize: 22, fontWeight: "bold", color: "#ffd95a" }}>{val}</div>
                  <div style={{ fontSize: 11, color: "rgba(232,228,217,0.35)", marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ ...S.card, marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "rgba(232,228,217,0.35)", letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" }}>Seviye</div>
              {lang === "en" ? (
                <div style={{ display: "flex", gap: 8 }}>
                  {LEVELS.map(l => (
                    <button key={l} onClick={() => setLevel(l)} style={{ ...S.btn(level === l), flex: 1, padding: "12px 0", fontSize: 14 }}>
                      {l}<div style={{ fontSize: 10, opacity: 0.6, marginTop: 2 }}>{levelCount("en", l)}</div>
                    </button>
                  ))}
                </div>
              ) : lang === "de" ? (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {DE_MODULES.map((m, i) => (
                    <button key={m.id} onClick={() => setDeLevel(m.id)} style={{ ...S.btn(deLevel === m.id), flex: 1, minWidth: 52, padding: "12px 0", fontSize: 13 }}>
                      M{i + 1}<div style={{ fontSize: 10, opacity: 0.6, marginTop: 2 }}>{(DE_LIBRARY[m.id]||[]).length}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[
                    ["L1","1–5", levelCount("ru", "L1")],
                    ["L2","6–10", levelCount("ru", "L2")],
                    ["L3","11–15", levelCount("ru", "L3")],
                    ["L4","16–20", levelCount("ru", "L4")],
                    ["L5","21–25", levelCount("ru", "L5")],
                  ].map(([l, label, count]) => (
                    <button key={l} onClick={() => setRuLevel(l)} style={{ ...S.btn(ruLevel === l), flex: 1, minWidth: 60, padding: "10px 0", fontSize: 12 }}>
                      {label}<div style={{ fontSize: 9, opacity: 0.6, marginTop: 2 }}>{count}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {lang === "de" && (
              <button onClick={() => nav("german")} style={{ width: "100%", background: "linear-gradient(135deg,#34d399,#059669)", border: "none", borderRadius: 18, boxShadow: "0 8px 22px rgba(5,150,105,0.3)", color: "#052e1c", padding: "20px 16px", fontSize: 16, fontWeight: "bold", cursor: "pointer", fontFamily: "inherit", textAlign: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 26, marginBottom: 4 }}>&#127891;</div>
                Almanca A1 Dersleri
                <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4, fontWeight: "normal" }}>{DE_MODULES.reduce((n, m) => n + m.lessons.length, 0)} ders - gramer, örnekler, alıştırmalar</div>
              </button>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button onClick={startCards}style={{ background: "linear-gradient(135deg,#ffd95a,#f59e0b)", border: "none", borderRadius: 18, boxShadow: "0 8px 22px rgba(245,158,11,0.28)", color: "#1a1403", padding: "22px 16px", fontSize: 15, fontWeight: "bold", cursor: "pointer", fontFamily: "inherit", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>&#128218;</div>
                Flashcard
                <div style={{ fontSize: 11, opacity: 0.65, marginTop: 4, fontWeight: "normal" }}>{curLevelLabel} - {!libReady ? "yükleniyor..." : dk.due + dk.fresh > 0 ? dk.due + " tekrar, " + dk.fresh + " yeni" : "erken tekrar"}</div>
              </button>
              <button onClick={startQuiz} style={{ background: "linear-gradient(135deg,#60a5fa,#2563eb)", border: "none", borderRadius: 18, boxShadow: "0 8px 22px rgba(37,99,235,0.3)", color: "#fff", padding: "22px 16px", fontSize: 15, fontWeight: "bold", cursor: "pointer", fontFamily: "inherit", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>&#129504;</div>
                Quiz
                <div style={{ fontSize: 11, opacity: 0.65, marginTop: 4, fontWeight: "normal" }}>Sonsuz soru</div>
              </button>
            </div>
          </div>
        )}

        {screen === "german" && (
          <div>
            <button onClick={() => nav("home")} style={{ ...S.btn(false), marginBottom: 14 }}>Ana sayfa</button>
            <GermanCourse prog={prog} saveProg={saveProg} speak={speak} />
          </div>
        )}

        {screen === "flashcard" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <button onClick={() => nav("home")} style={S.btn(false)}>Geri</button>
              <span style={{ fontSize: 13, color: "rgba(232,228,217,0.4)" }}>{done ? "Tamamlandı!" : (cardIdx + 1) + " / " + deck.length}</span>
              <button onClick={startCards} style={{ ...S.btn(false), color: "#ffd95a" }}>Yeni</button>
            </div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 4, marginBottom: 22 }}>
              <div style={{ height: "100%", borderRadius: 4, background: "#ffd95a", width: (cardIdx / deck.length * 100) + "%", transition: "width 0.4s" }} />
            </div>
            {done ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 60, marginBottom: 14 }}>&#127881;</div>
                <h2 style={{ color: "#ffd95a", marginBottom: 8 }}>Seri Tamamlandı!</h2>
                <p style={{ color: "rgba(232,228,217,0.45)", marginBottom: 28 }}>{deck.length} kelimeyi gozden gecirdin.</p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                  <button onClick={startCards} style={{ background: "#ffd95a", border: "none", borderRadius: 12, color: "#0a0a0f", padding: "14px 24px", fontSize: 14, fontWeight: "bold", cursor: "pointer", fontFamily: "inherit" }}>Yeni Seri</button>
                  <button onClick={startQuiz} style={{ ...S.card, border: "1px solid rgba(96,165,250,0.4)", color: "#60a5fa", padding: "14px 24px", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Quiz Çöz</button>
                </div>
              </div>
            ) : deck[cardIdx] ? (
              <div>
                <div onClick={() => setFlipped(f => !f)} style={{ background: flipped ? "rgba(255,217,90,0.07)" : "rgba(255,255,255,0.04)", border: "1px solid " + (flipped ? "rgba(255,217,90,0.3)" : "rgba(255,255,255,0.09)"), borderRadius: 24, padding: "48px 20px", minHeight: 260, textAlign: "center", cursor: "pointer", transition: "all 0.3s", marginBottom: 18, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  {!flipped ? (
                    <div>
                      <div style={{ fontSize: 11, color: "rgba(255,217,90,0.45)", letterSpacing: 2, marginBottom: 14, textTransform: "uppercase" }}>{lang === "ru" ? "🇷🇺 Rusça" : lang === "de" ? "🇩🇪 Almanca" : (level + " - İngilizce")}</div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
                        <div style={{ ...WRAP, fontSize: fitFont(deck[cardIdx].word, 48, 22, vw - 134), fontWeight: "bold", color: "#ffd95a" }}>{deck[cardIdx].word}</div>
                        <button onClick={e => { e.stopPropagation(); speak(deck[cardIdx].word, lang); }} style={{ background: "rgba(255,217,90,0.12)", border: "1px solid rgba(255,217,90,0.3)", borderRadius: "50%", width: 42, height: 42, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} title="Telaffuzu dinle">🔊</button>
                      </div>
                      <div style={{ fontSize: 13, color: "rgba(232,228,217,0.25)", marginTop: 18 }}>Çevir / Geri Dön</div>
                    </div>
                  ) : (
                    <div style={{ width: "100%" }}>
                      <div style={{ fontSize: 11, color: "rgba(255,217,90,0.45)", letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" }}>Türkçe</div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 18 }}>
                        <div style={{ ...WRAP, fontSize: fitFont(deck[cardIdx].turkish, 32, 20, vw - 130), fontWeight: "bold" }}>{deck[cardIdx].turkish}</div>
                        <button onClick={() => speak(deck[cardIdx].word, lang)} style={{ background: "rgba(255,217,90,0.12)", border: "1px solid rgba(255,217,90,0.3)", borderRadius: "50%", width: 38, height: 38, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} title="Telaffuzu dinle">🔊</button>
                      </div>
                      <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: 12, padding: "12px 18px", fontSize: 14, color: "rgba(232,228,217,0.6)", fontStyle: "italic" }}>
                        {exampleLoading ? "🌐 Yükleniyor..." : exampleSentence ? `"${exampleSentence}"` : `"${deck[cardIdx].example}"`}
                      </div>
                    </div>
                  )}
                </div>
                {flipped && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    {[["Zor","hard","#f87171","rgba(248,113,113,0.1)"],["Tamam","ok","#fbbf24","rgba(251,191,36,0.1)"],["Öğrendim","learned","#34d399","rgba(52,211,153,0.1)"]].map(([label, val, color, bg]) => (
                      <button key={val} onClick={() => nextCard(val)} style={{ background: bg, border: "1px solid " + color + "40", borderRadius: 12, color, padding: "12px 8px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                        <span>{label}</span>
                        <span style={{ fontSize: 10, opacity: 0.65 }}>{formatDays(previewDays(prog, deck[cardIdx], val))}</span>
                      </button>
                    ))}
                  </div>
                )}
                {finePointer && (
                  <div style={{ textAlign: "center", fontSize: 11, color: "rgba(232,228,217,0.3)", marginTop: 12 }}>
                    {flipped ? "1 Zor · 2 Tamam · 3 Öğrendim · Boşluk: çevir" : "Boşluk: kartı çevir"}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}

        {screen === "quiz" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <button onClick={() => nav("home")} style={S.btn(false)}>Geri</button>
              <span style={{ fontSize: 13, color: "#60a5fa" }}>{sessionScore.c}/{sessionScore.t} doğru</span>
              <span style={{ fontSize: 12, color: "rgba(232,228,217,0.35)" }}>{level}</span>
            </div>
            {quiz && (
              <div>
                <div style={{ background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: 20, padding: "32px 24px", marginBottom: 20, textAlign: "center" }}>
                  <div style={{ fontSize: 12, color: "rgba(96,165,250,0.55)", letterSpacing: 2, marginBottom: 14, textTransform: "uppercase" }}>Bu kelimenin İngilizce anlamı nedir?</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
                    <div style={{ ...WRAP, fontSize: fitFont(quiz.word, 42, 20, vw - 142), fontWeight: "bold", color: "#60a5fa" }}>{quiz.word}</div>
                    <button onClick={() => speak(quiz.word, lang)} style={{ background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.3)", borderRadius: "50%", width: 42, height: 42, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} title="Telaffuzu dinle">🔊</button>
                  </div>
                </div>
                <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
                  {quiz.opts.map((opt, i) => {
                    const isSel = sel === i;
                    const isOk = quiz.correct === i;
                    let bg = "rgba(255,255,255,0.04)", border = "rgba(255,255,255,0.09)", color = "#e8e4d9";
                    if (sel !== null) {
                      if (isOk) { bg = "rgba(52,211,153,0.12)"; border = "#34d399"; color = "#34d399"; }
                      else if (isSel) { bg = "rgba(248,113,113,0.12)"; border = "#f87171"; color = "#f87171"; }
                    }
                    return (
                      <button key={i} onClick={() => submitQuiz(i)} disabled={sel !== null} style={{ background: bg, border: "1px solid " + border, borderRadius: 14, color, padding: "16px 20px", fontSize: 15, cursor: sel !== null ? "default" : "pointer", fontFamily: "inherit", textAlign: "left", transition: "all 0.25s", display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: sel !== null && isOk ? "#34d399" : sel !== null && isSel ? "#f87171" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold", color: sel !== null && (isOk || isSel) ? "#0a0a0f" : color }}>
                          {sel !== null && isOk ? "V" : sel !== null && isSel ? "X" : ["A","B","C","D"][i]}
                        </span>
                        <span style={{ ...WRAP, flex: 1 }}>{opt}</span>
                      </button>
                    );
                  })}
                </div>
                {finePointer && (
                  <div style={{ textAlign: "center", fontSize: 11, color: "rgba(232,228,217,0.3)", marginBottom: 12 }}>
                    {sel === null ? "1–4: şık seç" : "Enter: sonraki soru"}
                  </div>
                )}
                {sel !== null && (
                  <div>
                    <div style={{ background: correct ? "rgba(52,211,153,0.07)" : "rgba(248,113,113,0.07)", border: "1px solid " + (correct ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"), borderRadius: 14, padding: "14px 18px", marginBottom: 14, fontSize: 14, color: correct ? "#34d399" : "#f87171", fontWeight: "bold" }}>
                      {correct ? "Doğru!" : "Yanlış - Doğru: " + quiz.opts[quiz.correct]}
                    </div>
                    <button onClick={nextQuiz} style={{ background: "#60a5fa", border: "none", borderRadius: 14, color: "#fff", padding: "16px", fontSize: 15, fontWeight: "bold", cursor: "pointer", fontFamily: "inherit", width: "100%" }}>Sonraki Soru</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {screen === "library" && (
          <div>
            <h2 style={{ margin: "0 0 6px", fontSize: 20, color: "#ffd95a" }}>Kelime Listesi</h2>
            <p style={{ color: "rgba(232,228,217,0.35)", fontSize: 13, marginBottom: 14 }}>{totalCount("en")} İng + {totalCount("ru")} Rus kelime</p>
            {/* Dil seçici */}
            <div style={{ display: "flex", gap: 8, marginBottom: 14, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4 }}>
              {[["en","🇬🇧 İngilizce"],["ru","🇷🇺 Rusça"],["de","🇩🇪 Almanca"]].map(([l, label]) => (
                <button key={l} onClick={() => setLang(l)} style={{
                  flex: 1, background: lang === l ? "#ffd95a" : "transparent",
                  border: "none", borderRadius: 7, color: lang === l ? "#0a0a0f" : "rgba(232,228,217,0.5)",
                  padding: "9px", fontSize: 13, fontWeight: lang === l ? "bold" : "normal",
                  cursor: "pointer", fontFamily: "inherit"
                }}>{label}</button>
              ))}
            </div>
            {lang === "en" ? (
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                {LEVELS.map(l => (
                  <button key={l} onClick={() => setLibLevel(l)} style={{ ...S.btn(libLevel === l), flex: 1 }}>
                    {l}<div style={{ fontSize: 10, opacity: 0.6 }}>{levelCount("en", l)}</div>
                  </button>
                ))}
              </div>
            ) : lang === "de" ? (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                {DE_MODULES.map((m, i) => (
                  <button key={m.id} onClick={() => setDeLevel(m.id)} style={{ ...S.btn(deLevel === m.id), flex: 1, minWidth: 52 }}>
                    M{i + 1}<div style={{ fontSize: 10, opacity: 0.6 }}>{(DE_LIBRARY[m.id]||[]).length}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
                {[
                  ["L1","1–5", levelCount("ru", "L1")],
                  ["L2","6–10", levelCount("ru", "L2")],
                  ["L3","11–15", levelCount("ru", "L3")],
                  ["L4","16–20", levelCount("ru", "L4")],
                  ["L5","21–25", levelCount("ru", "L5")],
                ].map(([l, label, count]) => (
                  <button key={l} onClick={() => setRuLevel(l)} style={{ ...S.btn(ruLevel === l), flex: 1, minWidth: 55 }}>
                    {label}<div style={{ fontSize: 9, opacity: 0.6 }}>{count}</div>
                  </button>
                ))}
              </div>
            )}
            <input value={libSearch} onChange={e => setLibSearch(e.target.value)} placeholder={lang === "ru" ? "Rusça veya İngilizce ara..." : "Kelime veya Türkçe ara..."} style={{ ...S.inp, marginBottom: 14 }} />
            <div style={{ fontSize: 11, color: "rgba(232,228,217,0.25)", marginBottom: 10 }}>{libWords.length} kelime</div>
            <div style={{ display: "grid", gap: 5, maxHeight: "60vh", overflowY: "auto" }}>
              {libWords.slice(0, 200).map((w, i) => (
                <div key={i} style={{ background: prog.learned[cardKey(w)] ? "rgba(52,211,153,0.07)" : "rgba(255,255,255,0.03)", border: "1px solid " + (prog.learned[cardKey(w)] ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.07)"), borderRadius: 9, padding: "9px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={WRAP}>
                    <button onClick={() => speak(w.word, lang)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 14, padding: "0 6px 0 0", verticalAlign: "middle" }} title="Telaffuzu dinle">🔊</button>
                    <span style={{ fontWeight: "bold", color: prog.learned[cardKey(w)] ? "#34d399" : "#e8e4d9", marginRight: 10, fontSize: 14 }}>{w.word}</span>
                    <span style={{ fontSize: 13, color: "rgba(232,228,217,0.4)" }}>{w.turkish}</span>
                  </div>
                  {prog.learned[cardKey(w)] && <span style={{ fontSize: 14, color: "#34d399", flexShrink: 0 }}>&#10003;</span>}
                </div>
              ))}
              {libWords.length > 200 && <div style={{ textAlign: "center", padding: 14, color: "rgba(232,228,217,0.25)", fontSize: 12 }}>+{libWords.length - 200} kelime daha</div>}
            </div>
          </div>
        )}

        {screen === "stats" && (
          <div>
            <h2 style={{ margin: "0 0 22px", fontSize: 20, color: "#ffd95a" }}>{user.username} - İlerleme</h2>
            <div style={{ display: "grid", gap: 12 }}>
              {[["&#11088;","Öğrenilen Kelime", learned,"#ffd95a"],["&#127919;","Doğruluk", acc + "%","#60a5fa"],["&#129504;","Toplam Quiz", prog.qTotal,"#a78bfa"],["&#9989;","Doğru Cevap", prog.qCorrect,"#34d399"],["&#128260;","Bugün Tekrar Bekleyen", totalDue,"#f59e0b"]].map(([icon, label, val, color]) => (
                <div key={label} style={{ ...S.card, display: "flex", alignItems: "center", gap: 18 }}>
                  <div style={{ fontSize: 30 }} dangerouslySetInnerHTML={{ __html: icon }} />
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(232,228,217,0.35)", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 26, fontWeight: "bold", color }}>{val}</div>
                  </div>
                </div>
              ))}
              {prog.qTotal > 0 && (
                <div style={S.card}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: "rgba(232,228,217,0.45)" }}>Genel Doğruluk</span>
                    <span style={{ fontWeight: "bold", color: acc >= 70 ? "#34d399" : "#fbbf24" }}>{acc}%</span>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 6 }}>
                    <div style={{ height: "100%", borderRadius: 6, background: acc >= 70 ? "#34d399" : "#fbbf24", width: acc + "%", transition: "width 1s" }} />
                  </div>
                </div>
              )}
              {LEVELS.map(l => {
                const ws = libFor("en", l);
                const lc = ws.filter(w => prog.learned[cardKey(w)]).length;
                const pct = ws.length > 0 ? Math.round(lc / ws.length * 100) : 0;
                return (
                  <div key={l} style={S.card}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: "#ffd95a" }}>{l}</span>
                      <span style={{ fontSize: 12, color: "rgba(232,228,217,0.35)" }}>{lc}/{ws.length}</span>
                    </div>
                    <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 4 }}>
                      <div style={{ height: "100%", borderRadius: 4, background: "#ffd95a", width: pct + "%", transition: "width 1s" }} />
                    </div>
                  </div>
                );
              })}
              <ChangePassword supabase={supabase} username={user.username} S={S} />
              {!confirmReset ? (
                <button onClick={() => setConfirmReset(true)} style={{ background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 12, color: "#f87171", padding: "14px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                  İlerlemeyi Sıfırla
                </button>
              ) : (
                <div role="alert" style={{ ...S.card, border: "1px solid rgba(248,113,113,0.35)" }}>
                  <div style={{ fontSize: 14, color: "#f87171", marginBottom: 12, lineHeight: 1.5 }}>
                    Tüm dillerdeki ilerlemen silinecek. Bu işlem geri alınamaz. Emin misin?
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { saveProg(emptyProgress()); setConfirmReset(false); }} style={{ flex: 1, background: "#f87171", border: "none", borderRadius: 10, color: "#0a0a0f", padding: "12px", fontSize: 13, fontWeight: "bold", cursor: "pointer", fontFamily: "inherit" }}>Evet, sıfırla</button>
                    <button onClick={() => setConfirmReset(false)} style={S.btn(false)}>Vazgeç</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {showTabs && (
        <nav aria-label="Ana menü" style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 100, background: "rgba(10,10,15,0.97)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(255,217,90,0.12)", paddingBottom: "env(safe-area-inset-bottom)" }}>
          <div style={{ maxWidth: 660, margin: "0 auto", display: "flex" }}>
            {TABS.map(([s, icon, label]) => {
              const active = screen === s || (s === "home" && screen === "german");
              return (
                <button key={s} onClick={() => nav(s)} aria-current={active ? "page" : undefined}
                  style={{ flex: 1, background: "transparent", border: "none", padding: "8px 4px 8px", cursor: "pointer", fontFamily: "inherit", color: active ? "#ffd95a" : "rgba(232,228,217,0.45)", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <span style={{ fontSize: 20, lineHeight: 1, padding: "4px 18px", borderRadius: 999, background: active ? "rgba(255,217,90,0.14)" : "transparent", transition: "background .2s" }}>{icon}</span>
                  <span style={{ fontSize: 11, fontWeight: active ? "bold" : "normal" }}>{label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
