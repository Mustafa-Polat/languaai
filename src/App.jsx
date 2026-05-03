import { useState, useEffect, useCallback } from "react";

// ============================================================
// OXFORD 3000 KELİME KÜTÜPHANESİ (A1-B2) - 2725 kelime
// ============================================================
const RAW_LIBRARY = {"A1":[{"w":"about","t":"hakkında, yaklaşık","e":"We use 'about' in many sentences."},{"w":"above","t":"üstünde, yukarıda","e":"We use 'above' in many sentences."},{"w":"a[...]

const LIBRARY = {};
for (const [level, words] of Object.entries(RAW_LIBRARY)) {
  LIBRARY[level] = words.map(w => ({ word: w.w, turkish: w.t, example: w.e, level }));
}

const LEVELS = ["A1", "A2", "B1", "B2"];

// Backend API endpoint - Vercel'de çalışacak şekilde
const API_BASE = typeof window !== 'undefined' 
  ? window.location.origin 
  : 'http://localhost:3000';

// AI ile örnek cümle + ipucu üret
async function enrichWord(word, turkish, level) {
  try {
    const res = await fetch(`${API_BASE}/api/enrich-word`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word, turkish, level })
    });
    const data = await res.json();
    return data || null;
  } catch { 
    return null; 
  }
}

// AI ile quiz sorusu üret
async function generateQuizQuestion(word, turkish, level, allWords) {
  // Yanlış seçenekler için aynı seviyeden 3 farklı kelime al
  const distractors = allWords
    .filter(w => w.word !== word)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(w => w.turkish);

  const options = [...distractors, turkish].sort(() => Math.random() - 0.5);
  const correctIdx = options.indexOf(turkish);

  try {
    const res = await fetch(`${API_BASE}/api/generate-question`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word, turkish, level })
    });
    const data = await res.json();
    return { 
      sentence: data.sentence || `What does "${word}" mean?`, 
      explanation: data.explanation || "", 
      options, 
      correctIdx, 
      word 
    };
  } catch {
    return { 
      sentence: `What does "${word}" mean in Turkish?`, 
      explanation: "", 
      options, 
      correctIdx, 
      word 
    };
  }
}

const defaultStats = () => ({ learned: {}, quizCorrect: 0, quizTotal: 0, sessions: 0 });

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

export default function App() {
  const [screen, setScreen] = useState("home");
  const [level, setLevel] = useState("A1");
  const [stats, setStats] = useState(defaultStats);
  const [mode, setMode] = useState(null); // "flashcard" | "quiz" | "library"

  // Flashcard state
  const [deck, setDeck] = useState([]);
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [enriched, setEnriched] = useState(null);
  const [enriching, setEnriching] = useState(false);
  const [deckComplete, setDeckComplete] = useState(false);

  // Quiz state
  const [quiz, setQuiz] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [sessionScore, setSessionScore] = useState({ c: 0, t: 0 });

  // Library state
  const [libSearch, setLibSearch] = useState("");
  const [libLevel, setLibLevel] = useState("A1");

  // Load stats from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lingua_stats");
      if (saved) {
        setStats(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  }, []);

  const saveStats = useCallback(async (ns) => {
    setStats(ns);
    try { 
      localStorage.setItem("lingua_stats", JSON.stringify(ns));
    } catch (err) {
      console.error("Failed to save stats:", err);
    }
  }, []);

  // Start flashcard session
  const startFlashcards = useCallback(() => {
    const allWords = LIBRARY[level] || [];
    const newDeck = shuffle(allWords).slice(0, 15);
    setDeck(newDeck);
    setCardIdx(0);
    setFlipped(false);
    setEnriched(null);
    setDeckComplete(false);
    setScreen("flashcard");
  }, [level]);

  // Flip card & enrich with AI
  const flipCard = useCallback(async () => {
    if (flipped) return;
    setFlipped(true);
    const card = deck[cardIdx];
    if (!card) return;
    setEnriching(true);
    setEnriched(null);
    const data = await enrichWord(card.word, card.turkish, card.level);
    setEnriched(data);
    setEnriching(false);
  }, [flipped, deck, cardIdx]);

  const nextCard = useCallback((rating) => {
    const card = deck[cardIdx];
    if (rating === "learned") {
      const ns = { ...stats, learned: { ...stats.learned, [card.word]: true } };
      saveStats(ns);
    }
    if (cardIdx + 1 >= deck.length) {
      setDeckComplete(true);
    } else {
      setCardIdx(i => i + 1);
      setFlipped(false);
      setEnriched(null);
    }
  }, [cardIdx, deck, stats, saveStats]);

  // Start quiz
  const startQuiz = useCallback(async () => {
    setScreen("quiz");
    setQuiz(null);
    setSelected(null);
    setQuizResult(null);
    setSessionScore({ c: 0, t: 0 });
    await loadQuizQuestion();
  }, [level]);

  const loadQuizQuestion = useCallback(async () => {
    setQuizLoading(true);
    setQuiz(null);
    setSelected(null);
    setQuizResult(null);
    const allWords = LIBRARY[level] || [];
    const word = allWords[Math.floor(Math.random() * allWords.length)];
    const q = await generateQuizQuestion(word.word, word.turkish, word.level, allWords);
    setQuiz(q);
    setQuizLoading(false);
  }, [level]);

  const submitAnswer = useCallback(async (idx) => {
    if (selected !== null || !quiz) return;
    setSelected(idx);
    const correct = idx === quiz.correctIdx;
    setQuizResult(correct);
    const newScore = { c: sessionScore.c + (correct ? 1 : 0), t: sessionScore.t + 1 };
    setSessionScore(newScore);
    const ns = { ...stats, quizCorrect: stats.quizCorrect + (correct ? 1 : 0), quizTotal: stats.quizTotal + 1 };
    await saveStats(ns);
  }, [selected, quiz, sessionScore, stats, saveStats]);

  // Computed
  const totalLearned = Object.keys(stats.learned).length;
  const quizAccuracy = stats.quizTotal > 0 ? Math.round((stats.quizCorrect / stats.quizTotal) * 100) : 0;
  const levelWords = LIBRARY[level] || [];

  // Library filtered words
  const libWords = (LIBRARY[libLevel] || []).filter(w =>
    !libSearch || w.word.toLowerCase().includes(libSearch.toLowerCase()) || w.turkish.toLowerCase().includes(libSearch.toLowerCase())
  );

  const nav = (s) => { setScreen(s); setFlipped(false); setEnriched(null); };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", fontFamily: "'Georgia', serif", color: "#e8e4d9" }}>
      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(10,10,15,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,220,100,0.1)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 24px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>📖</span>
          <span style={{ fontSize: 17, fontWeight: "bold", letterSpacing: 2, color: "#ffd95a" }}>LINGUA</span>
          <span style={{ fontSize: 11, color: "rgba(255,217,90,0.5)", letterSpacing: 1 }}>AI · OXFORD 3000</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[["home","🏠"],["library","📚"],["stats","📊"]].map(([s, icon]) => (
            <button key={s} onClick={() => nav(s)} style={{
              background: screen === s ? "rgba(255,217,90,0.15)" : "transparent",
              border: screen === s ? "1px solid rgba(255,217,90,0.4)" : "1px solid transparent",
              borderRadius: 8, color: screen === s ? "#ffd95a" : "rgba(232,228,217,0.5)",
              padding: "7px 14px", fontSize: 13, cursor: "pointer", fontFamily: "inherit",
            }}>{icon} {s === "home" ? "Ana Sayfa" : s === "library" ? "Kütüphane" : "İlerleme"}</button>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "28px 20px" }}>

        {/* ======= HOME ======= */}
        {screen === "home" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>🎓</div>
              <h1 style={{ fontSize: 34, fontWeight: "bold", margin: "0 0 8px", color: "#ffd95a", letterSpacing: 1 }}>
                İngilizce Öğren
              </h1>
              <p style={{ color: "rgba(232,228,217,0.5)", margin: 0, fontSize: 14 }}>
                Oxford 3000 · {Object.values(LIBRARY).flat().length} kelime · AI destekli
              </p>
            </div>

            {/* Quick stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 28 }}>
              {[
                { v: totalLearned, l: "Öğrenilen", icon: "⭐" },
                { v: `${quizAccuracy}%`, l: "Doğruluk", icon: "🎯" },
                { v: stats.quizTotal, l: "Quiz", icon: "🧠" },
              ].map(s => (
                <div key={s.l} style={{
                  background: "rgba(255,217,90,0.05)", border: "1px solid rgba(255,217,90,0.15)",
                  borderRadius: 14, padding: "18px 12px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 26, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontSize: 24, fontWeight: "bold", color: "#ffd95a" }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: "rgba(232,228,217,0.4)", marginTop: 3 }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Level picker */}
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16, padding: "20px 24px", marginBottom: 20,
            }}>
              <div style={{ fontSize: 12, color: "rgba(232,228,217,0.4)", letterSpacing: 2, marginBottom: 14, textTransform: "uppercase" }}>Seviye Seç</div>
              <div style={{ display: "flex", gap: 8 }}>
                {LEVELS.map(l => (
                  <button key={l} onClick={() => setLevel(l)} style={{
                    flex: 1, background: level === l ? "#ffd95a" : "rgba(255,255,255,0.05)",
                    border: "none", borderRadius: 10, color: level === l ? "#0a0a0f" : "#e8e4d9",
                    padding: "12px 0", fontSize: 14, fontWeight: level === l ? "bold" : "normal",
                    cursor: "pointer", fontFamily: "inherit",
                  }}>
                    {l}
                    <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>
                      {(LIBRARY[l] || []).length}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button onClick={startFlashcards} style={{
                background: "linear-gradient(135deg,#ffd95a,#f59e0b)",
                border: "none", borderRadius: 16, color: "#0a0a0f",
                padding: "22px 16px", fontSize: 15, fontWeight: "bold",
                cursor: "pointer", fontFamily: "inherit",
              }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>📚</div>
                Flashcard
                <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4, fontWeight: "normal" }}>
                  {level} · 15 kart
                </div>
              </button>
              <button onClick={startQuiz} style={{
                background: "linear-gradient(135deg,#60a5fa,#2563eb)",
                border: "none", borderRadius: 16, color: "#fff",
                padding: "22px 16px", fontSize: 15, fontWeight: "bold",
                cursor: "pointer", fontFamily: "inherit",
              }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>🧠</div>
                Quiz
                <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4, fontWeight: "normal" }}>
                  AI sorular
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ======= FLASHCARD ======= */}
        {screen === "flashcard" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <button onClick={() => nav("home")} style={{
                background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 8, color: "rgba(232,228,217,0.6)", padding: "8px 14px",
                cursor: "pointer", fontFamily: "inherit", fontSize: 13,
              }}>← Geri</button>
              <span style={{ fontSize: 13, color: "rgba(232,228,217,0.4)" }}>
                {level} · {cardIdx + 1}/{deck.length}
              </span>
              <button onClick={startFlashcards} style={{
                background: "transparent", border: "1px solid rgba(255,217,90,0.3)",
                borderRadius: 8, color: "#ffd95a", padding: "8px 14px",
                cursor: "pointer", fontFamily: "inherit", fontSize: 13,
              }}>🔄 Yeni Seri</button>
            </div>

            {/* Progress bar */}
            <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 4, marginBottom: 24 }}>
              <div style={{
                height: "100%", borderRadius: 4, background: "#ffd95a",
                width: `${((cardIdx) / deck.length) * 100}%`, transition: "width 0.4s",
              }} />
            </div>

            {deckComplete ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
                <h2 style={{ color: "#ffd95a", marginBottom: 8 }}>Seri Tamamlandı!</h2>
                <p style={{ color: "rgba(232,228,217,0.5)", marginBottom: 28 }}>
                  {deck.length} kelimeyi gözden geçirdin.
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                  <button onClick={startFlashcards} style={{
                    background: "#ffd95a", border: "none", borderRadius: 12, color: "#0a0a0f",
                    padding: "14px 24px", fontSize: 14, fontWeight: "bold",
                    cursor: "pointer", fontFamily: "inherit",
                  }}>Yeni Seri</button>
                  <button onClick={startQuiz} style={{
                    background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.4)",
                    borderRadius: 12, color: "#60a5fa",
                    padding: "14px 24px", fontSize: 14,
                    cursor: "pointer", fontFamily: "inherit",
                  }}>Quiz Çöz</button>
                </div>
              </div>
            ) : deck[cardIdx] ? (
              <div>
                {/* Card */}
                <div
                  onClick={!flipped ? flipCard : undefined}
                  style={{
                    background: flipped
                      ? "linear-gradient(135deg,rgba(255,217,90,0.08),rgba(245,158,11,0.05))"
                      : "rgba(255,255,255,0.04)",
                    border: flipped ? "1px solid rgba(255,217,90,0.3)" : "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 24, padding: "48px 32px", minHeight: 260,
                    textAlign: "center", cursor: flipped ? "default" : "pointer",
                    transition: "all 0.35s", marginBottom: 20,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  }}>
                  {!flipped ? (
                    <>
                      <div style={{ fontSize: 11, color: "rgba(255,217,90,0.5)", letterSpacing: 2, marginBottom: 16, textTransform: "uppercase" }}>
                        {level} · İngilizce
                      </div>
                      <div style={{ fontSize: 46, fontWeight: "bold", marginBottom: 10, color: "#ffd95a" }}>
                        {deck[cardIdx].word}
                      </div>
                      <div style={{ fontSize: 13, color: "rgba(232,228,217,0.3)", marginTop: 16 }}>
                        👆 Çevirmek için dokun
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 11, color: "rgba(255,217,90,0.5)", letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" }}>
                        Türkçe
                      </div>
                      <div style={{ fontSize: 30, fontWeight: "bold", marginBottom: 16 }}>
                        {deck[cardIdx].turkish}
                      </div>
                      {enriching && (
                        <div style={{ fontSize: 13, color: "rgba(232,228,217,0.3)" }}>AI detayları yüklüyor...</div>
                      )}
                      {enriched && !enriching && (
                        <div style={{ width: "100%", marginTop: 8 }}>
                          {enriched.pronunciation && (
                            <div style={{ fontSize: 14, color: "#60a5fa", marginBottom: 12, fontStyle: "italic" }}>
                              /{enriched.pronunciation}/
                            </div>
                          )}
                          <div style={{
                            background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: "12px 16px",
                            fontSize: 14, color: "rgba(232,228,217,0.7)", fontStyle: "italic", marginBottom: 10,
                          }}>
                            "{enriched.example || deck[cardIdx].example}"
                          </div>
                          {enriched.tip && (
                            <div style={{ fontSize: 12, color: "rgba(255,217,90,0.6)" }}>
                              💡 {enriched.tip}
                            </div>
                          )}
                        </div>
                      )}
                      {!enriched && !enriching && (
                        <div style={{
                          background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: "12px 16px",
                          fontSize: 14, color: "rgba(232,228,217,0.6)", fontStyle: "italic",
                        }}>
                          "{deck[cardIdx].example}"
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Rating buttons */}
                {flipped && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    {[
                      { label: "😅 Zor", val: "hard", color: "#f87171", bg: "rgba(248,113,113,0.1)" },
                      { label: "🤔 Tamam", val: "ok", color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
                      { label: "✨ Öğrendim", val: "learned", color: "#34d399", bg: "rgba(52,211,153,0.1)" },
                    ].map(r => (
                      <button key={r.val} onClick={() => nextCard(r.val)} style={{
                        background: r.bg, border: `1px solid ${r.color}40`,
                        borderRadius: 12, color: r.color, padding: "14px 8px",
                        fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                      }}>{r.label}</button>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* ======= QUIZ ======= */}
        {screen === "quiz" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <button onClick={() => nav("home")} style={{
                background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 8, color: "rgba(232,228,217,0.6)", padding: "8px 14px",
                cursor: "pointer", fontFamily: "inherit", fontSize: 13,
              }}>← Geri</button>
              <span style={{ fontSize: 13, color: "#60a5fa" }}>
                {sessionScore.c}/{sessionScore.t} doğru
              </span>
              <span style={{ fontSize: 13, color: "rgba(232,228,217,0.4)" }}>{level}</span>
            </div>

            {quizLoading && (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>⚡</div>
                <p style={{ color: "rgba(232,228,217,0.4)" }}>AI soru hazırlıyor...</p>
              </div>
            )}

            {!quizLoading && quiz && (
              <div>
                <div style={{
                  background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.2)",
                  borderRadius: 20, padding: "28px 24px", marginBottom: 20, textAlign: "center",
                }}>
                  <div style={{ fontSize: 12, color: "rgba(96,165,250,0.6)", letterSpacing: 2, marginBottom: 14, textTransform: "uppercase" }}>
                    "{quiz.word}" kelimesinin Türkçe anlamı nedir?
                  </div>
                  <div style={{ fontSize: 32, fontWeight: "bold", color: "#60a5fa" }}>
                    {quiz.word}
                  </div>
                  {quiz.sentence && (
                    <div style={{ marginTop: 14, fontSize: 14, color: "rgba(232,228,217,0.5)", fontStyle: "italic" }}>
                      {quiz.sentence.replace("___", `___`)}
                    </div>
                  )}
                </div>

                <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
                  {quiz.options.map((opt, i) => {
                    const isSelected = selected === i;
                    const isCorrect = quiz.correctIdx === i;
                    let bg = "rgba(255,255,255,0.04)";
                    let border = "rgba(255,255,255,0.1)";
                    let color = "#e8e4d9";
                    if (selected !== null) {
                      if (isCorrect) { bg = "rgba(52,211,153,0.12)"; border = "#34d399"; color = "#34d399"; }
                      else if (isSelected) { bg = "rgba(248,113,113,0.12)"; border = "#f87171"; color = "#f87171"; }
                    }
                    return (
                      <button key={i} onClick={() => submitAnswer(i)} disabled={selected !== null} style={{
                        background: bg, border: `1px solid ${border}`, borderRadius: 14,
                        color, padding: "16px 20px", fontSize: 15, cursor: selected !== null ? "default" : "pointer",
                        fontFamily: "inherit", textAlign: "left", transition: "all 0.25s",
                        display: "flex", alignItems: "center", gap: 12,
                      }}>
                        <span style={{
                          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                          background: selected !== null && isCorrect ? "#34d399" : selected !== null && isSelected ? "#f87171" : "rgba(255,255,255,0.08)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12, fontWeight: "bold",
                        }}>
                          {selected !== null && isCorrect ? "✓" : selected !== null && isSelected ? "✗" : ["A","B","C","D"][i]}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {selected !== null && (
                  <div>
                    <div style={{
                      background: quizResult ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)",
                      border: `1px solid ${quizResult ? "#34d399" : "#f87171"}40`,
                      borderRadius: 14, padding: "16px 20px", marginBottom: 14,
                    }}>
                      <div style={{ fontWeight: "bold", color: quizResult ? "#34d399" : "#f87171", marginBottom: 6 }}>
                        {quizResult ? "✅ Doğru!" : `❌ Yanlış — Doğru cevap: "${quiz.options[quiz.correctIdx]}"`}
                      </div>
                      {quiz.explanation && (
                        <div style={{ fontSize: 13, color: "rgba(232,228,217,0.6)" }}>{quiz.explanation}</div>
                      )}
                    </div>
                    <button onClick={loadQuizQuestion} style={{
                      background: "#60a5fa", border: "none", borderRadius: 14, color: "#fff",
                      padding: "16px", fontSize: 15, fontWeight: "bold",
                      cursor: "pointer", fontFamily: "inherit", width: "100%",
                    }}>Sonraki Soru →</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ======= LIBRARY ======= */}
        {screen === "library" && (
          <div>
            <h2 style={{ margin: "0 0 20px", fontSize: 22, color: "#ffd95a" }}>📚 Kelime Kütüphanesi</h2>
            <p style={{ color: "rgba(232,228,217,0.4)", fontSize: 13, marginBottom: 20 }}>
              Oxford 3000 · {Object.values(LIBRARY).flat().length} kelime
            </p>

            {/* Level filter */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {LEVELS.map(l => (
                <button key={l} onClick={() => setLibLevel(l)} style={{
                  background: libLevel === l ? "#ffd95a" : "rgba(255,255,255,0.05)",
                  border: "none", borderRadius: 8, color: libLevel === l ? "#0a0a0f" : "#e8e4d9",
                  padding: "8px 16px", fontSize: 13, fontWeight: libLevel === l ? "bold" : "normal",
                  cursor: "pointer", fontFamily: "inherit",
                }}>{l} ({(LIBRARY[l]||[]).length})</button>
              ))}
            </div>

            {/* Search */}
            <input
              value={libSearch}
              onChange={e => setLibSearch(e.target.value)}
              placeholder="Kelime veya Türkçe ara..."
              style={{
                width: "100%", boxSizing: "border-box",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, color: "#e8e4d9", padding: "12px 16px",
                fontSize: 14, fontFamily: "inherit", marginBottom: 16, outline: "none",
              }}
            />

            <div style={{ fontSize: 12, color: "rgba(232,228,217,0.3)", marginBottom: 12 }}>
              {libWords.length} kelime gösteriliyor
            </div>

            {/* Word list */}
            <div style={{ display: "grid", gap: 6, maxHeight: "60vh", overflowY: "auto" }}>
              {libWords.slice(0, 150).map((w, i) => (
                <div key={i} style={{
                  background: stats.learned[w.word] ? "rgba(52,211,153,0.06)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${stats.learned[w.word] ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 10, padding: "10px 16px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div>
                    <span style={{ fontWeight: "bold", color: stats.learned[w.word] ? "#34d399" : "#e8e4d9", marginRight: 10 }}>
                      {w.word}
                    </span>
                    <span style={{ fontSize: 13, color: "rgba(232,228,217,0.45)" }}>{w.turkish}</span>
                  </div>
                  {stats.learned[w.word] && <span style={{ fontSize: 14 }}>⭐</span>}
                </div>
              ))}
              {libWords.length > 150 && (
                <div style={{ textAlign: "center", padding: 16, color: "rgba(232,228,217,0.3)", fontSize: 13 }}>
                  + {libWords.length - 150} kelime daha (arama yaparak filtrele)
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======= STATS ======= */}
        {screen === "stats" && (
          <div>
            <h2 style={{ margin: "0 0 24px", fontSize: 22, color: "#ffd95a" }}>📊 İlerleme Takibi</h2>

            <div style={{ display: "grid", gap: 14 }}>
              {[
                { icon: "⭐", label: "Öğrenilen Kelime", value: totalLearned, color: "#ffd95a" },
                { icon: "🎯", label: "Quiz Doğruluk", value: `${quizAccuracy}%`, color: "#60a5fa" },
                { icon: "🧠", label: "Toplam Quiz", value: stats.quizTotal, color: "#a78bfa" },
                { icon: "✅", label: "Doğru Cevap", value: stats.quizCorrect, color: "#34d399" },
              ].map(s => (
                <div key={s.label} style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16, padding: "20px 24px",
                  display: "flex", alignItems: "center", gap: 20,
                }}>
                  <div style={{ fontSize: 34 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(232,228,217,0.4)", marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 30, fontWeight: "bold", color: s.color }}>{s.value}</div>
                  </div>
                </div>
              ))}

              {stats.quizTotal > 0 && (
                <div style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16, padding: "20px 24px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 13, color: "rgba(232,228,217,0.5)" }}>Genel Doğruluk</span>
                    <span style={{ fontWeight: "bold", color: quizAccuracy >= 70 ? "#34d399" : "#fbbf24" }}>{quizAccuracy}%</span>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 6 }}>
                    <div style={{
                      height: "100%", borderRadius: 6, transition: "width 1s",
                      background: quizAccuracy >= 70 ? "#34d399" : "#fbbf24",
                      width: `${quizAccuracy}%`,
                    }} />
                  </div>
                  <div style={{ marginTop: 10, fontSize: 12, color: "rgba(232,228,217,0.4)" }}>
                    {quizAccuracy >= 80 ? "🌟 Harika gidiyorsun!" : quizAccuracy >= 60 ? "💪 İyi ilerliyorsun!" : "📖 Daha fazla pratik yap!"}
                  </div>
                </div>
              )}

              {/* Per-level progress */}
              <div style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16, padding: "20px 24px",
              }}>
                <div style={{ fontSize: 12, color: "rgba(232,228,217,0.4)", marginBottom: 16, letterSpacing: 2, textTransform: "uppercase" }}>Seviye Bazında Öğrenilenler</div>
                {LEVELS.map(l => {
                  const words = LIBRARY[l] || [];
                  const learnedCount = words.filter(w => stats.learned[w.word]).length;
                  const pct = words.length > 0 ? Math.round((learnedCount / words.length) * 100) : 0;
                  return (
                    <div key={l} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 13, color: "#ffd95a" }}>{l}</span>
                        <span style={{ fontSize: 12, color: "rgba(232,228,217,0.4)" }}>{learnedCount}/{words.length}</span>
                      </div>
                      <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 4 }}>
                        <div style={{
                          height: "100%", borderRadius: 4, background: "#ffd95a",
                          width: `${pct}%`, transition: "width 1s",
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <button onClick={async () => {
                if (confirm("Tüm ilerleme silinecek. Emin misin?")) {
                  await saveStats(defaultStats());
                }
              }} style={{
                background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.2)",
                borderRadius: 12, color: "#f87171", padding: "14px",
                fontSize: 13, cursor: "pointer", fontFamily: "inherit",
              }}>🗑️ İlerlemeyi Sıfırla</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
