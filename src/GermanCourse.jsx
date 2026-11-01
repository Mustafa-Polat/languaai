import { useState } from "react";
import { DE_MODULES, displayWord, wordKey, buildPractice } from "./german";

const GOLD = "#ffd95a";
const dim = "rgba(232,228,217,0.45)";
const card = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, padding: "16px 18px" };
const btn = (active) => ({
  background: active ? GOLD : "rgba(255,255,255,0.06)", border: "none", borderRadius: 10,
  color: active ? "#0a0a0f" : "#e8e4d9", padding: "10px 16px", fontSize: 13,
  fontWeight: active ? "bold" : "normal", cursor: "pointer", fontFamily: "inherit",
});
const ARTICLE_COLOR = { der: "#60a5fa", die: "#f87171", das: "#34d399" };

const norm = (s) => s.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.!?]+$/, "");
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// Ders kodlarından tamamlanma kaydı: prog.learned["__de_lesson_<id>"] = en iyi yüzde
export const lessonKey = (id) => "__de_lesson_" + id;

function Speaker({ text, speak, size = 15 }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); speak(text, "de"); }}
      style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: size, padding: "0 6px 0 0" }}
      title="Telaffuzu dinle">🔊</button>
  );
}

function Art({ art }) {
  if (!art) return null;
  return <span style={{ color: ARTICLE_COLOR[art], fontWeight: "bold", marginRight: 5 }}>{art}</span>;
}

// ---------------- Tek soru ----------------
function Question({ item, onNext, speak }) {
  const [sel, setSel] = useState(null);
  const [val, setVal] = useState("");
  const [tokens] = useState(() => (item.t === "order" ? shuffle(item.words.map((w, i) => ({ w, i }))) : []));
  const [picked, setPicked] = useState([]);
  const [result, setResult] = useState(null); // null | true | false

  const finish = (ok) => setResult(ok);

  const checkFill = () => {
    if (!val.trim() || result !== null) return;
    finish(item.a.map(norm).includes(norm(val)));
  };
  const checkOrder = () => {
    if (result !== null || picked.length === 0) return;
    finish(picked.map((i) => tokens[i].w).join(" ") === item.a);
  };

  const correctText =
    item.t === "mc" ? item.opts[item.a] :
    item.t === "fill" ? item.a[0] :
    item.t === "order" ? item.a : item.a;

  return (
    <div>
      {item.t === "mc" && (
        <div>
          <div style={{ fontSize: 17, marginBottom: 16, lineHeight: 1.5 }}>{item.q}</div>
          <div style={{ display: "grid", gap: 8 }}>
            {item.opts.map((o, i) => {
              const state = sel === null ? "" : i === item.a ? "ok" : i === sel ? "bad" : "";
              return (
                <button key={i} disabled={sel !== null} onClick={() => { setSel(i); finish(i === item.a); }}
                  style={{ ...btn(false), textAlign: "left", padding: "13px 16px", fontSize: 15,
                    background: state === "ok" ? "rgba(52,211,153,0.18)" : state === "bad" ? "rgba(248,113,113,0.18)" : "rgba(255,255,255,0.06)",
                    border: "1px solid " + (state === "ok" ? "#34d399" : state === "bad" ? "#f87171" : "rgba(255,255,255,0.1)") }}>{o}</button>
              );
            })}
          </div>
        </div>
      )}

      {item.t === "article" && (
        <div>
          <div style={{ fontSize: 13, color: dim, marginBottom: 6 }}>Doğru artikeli seç</div>
          <div style={{ fontSize: 26, fontWeight: "bold", color: GOLD, marginBottom: 4 }}>
            <Speaker text={item.q} speak={speak} size={20} />___ {item.q}
          </div>
          <div style={{ fontSize: 13, color: dim, marginBottom: 16 }}>{item.tr}</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["der", "die", "das"].map((a) => {
              const state = sel === null ? "" : a === item.a ? "ok" : a === sel ? "bad" : "";
              return (
                <button key={a} disabled={sel !== null} onClick={() => { setSel(a); finish(a === item.a); }}
                  style={{ ...btn(false), flex: 1, padding: "14px 0", fontSize: 17, color: ARTICLE_COLOR[a],
                    background: state === "ok" ? "rgba(52,211,153,0.18)" : state === "bad" ? "rgba(248,113,113,0.18)" : "rgba(255,255,255,0.06)",
                    border: "1px solid " + (state === "ok" ? "#34d399" : state === "bad" ? "#f87171" : "rgba(255,255,255,0.1)") }}>{a}</button>
              );
            })}
          </div>
        </div>
      )}

      {item.t === "fill" && (
        <div>
          <div style={{ fontSize: 13, color: dim, marginBottom: 6 }}>Boşluğu doldur</div>
          <div style={{ fontSize: 19, marginBottom: 16, lineHeight: 1.5 }}>{item.q}</div>
          <input value={val} disabled={result !== null} autoFocus
            onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && checkFill()}
            placeholder="Cevabın..."
            style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#e8e4d9", padding: "12px 16px", fontSize: 16, fontFamily: "inherit", outline: "none", marginBottom: 8 }} />
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {["ä", "ö", "ü", "ß"].map((c) => (
              <button key={c} disabled={result !== null} onClick={() => setVal((v) => v + c)} style={{ ...btn(false), padding: "6px 14px", fontSize: 15 }}>{c}</button>
            ))}
          </div>
          {result === null && <button onClick={checkFill} style={btn(true)}>Kontrol et</button>}
        </div>
      )}

      {item.t === "order" && (
        <div>
          <div style={{ fontSize: 13, color: dim, marginBottom: 12 }}>Kelimeleri doğru sıraya diz</div>
          <div style={{ minHeight: 54, ...card, padding: "10px 12px", marginBottom: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {picked.map((i, pos) => (
              <button key={pos} disabled={result !== null} onClick={() => setPicked((p) => p.filter((_, k) => k !== pos))}
                style={{ ...btn(true), padding: "8px 12px", fontSize: 15 }}>{tokens[i].w}</button>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            {tokens.map((t, i) => (
              <button key={i} disabled={result !== null || picked.includes(i)} onClick={() => setPicked((p) => [...p, i])}
                style={{ ...btn(false), padding: "8px 12px", fontSize: 15, opacity: picked.includes(i) ? 0.3 : 1 }}>{t.w}</button>
            ))}
          </div>
          {result === null && <button onClick={checkOrder} style={btn(true)}>Kontrol et</button>}
        </div>
      )}

      {result !== null && (
        <div style={{ marginTop: 18 }}>
          <div style={{ background: result ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)", border: "1px solid " + (result ? "rgba(52,211,153,0.35)" : "rgba(248,113,113,0.35)"), borderRadius: 10, padding: "12px 14px", fontSize: 14, color: result ? "#34d399" : "#f87171", marginBottom: 12 }}>
            {result ? "Doğru!" : "Yanlış. Doğru cevap: " + correctText}
          </div>
          <button onClick={() => onNext(result)} style={btn(true)}>Sonraki</button>
        </div>
      )}
    </div>
  );
}

// ---------------- Alıştırma oturumu ----------------
function Practice({ lesson, prog, saveProg, speak, onExit }) {
  const [items, setItems] = useState(() => buildPractice(lesson));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const next = async (ok) => {
    const s = score + (ok ? 1 : 0);
    setScore(s);
    if (idx + 1 >= items.length) {
      const pct = Math.round((s / items.length) * 100);
      const key = lessonKey(lesson.id);
      if (!(prog.learned[key] >= pct)) {
        await saveProg({ ...prog, learned: { ...prog.learned, [key]: pct } });
      }
      setDone(true);
    } else setIdx(idx + 1);
  };

  const restart = () => { setItems(buildPractice(lesson)); setIdx(0); setScore(0); setDone(false); };

  if (done) {
    const pct = Math.round((score / items.length) * 100);
    return (
      <div style={{ ...card, textAlign: "center", padding: "30px 20px" }}>
        <div style={{ fontSize: 44, marginBottom: 8 }}>{pct >= 70 ? "🎉" : "💪"}</div>
        <div style={{ fontSize: 22, fontWeight: "bold", color: GOLD, marginBottom: 4 }}>{score} / {items.length} doğru</div>
        <div style={{ color: dim, fontSize: 13, marginBottom: 20 }}>
          {pct >= 70 ? "Ders tamamlandı!" : "Dersi tamamlamak için en az %70 gerekiyor. Tekrar dene."}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={restart} style={btn(true)}>Tekrar</button>
          <button onClick={onExit} style={btn(false)}>Derse dön</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <button onClick={onExit} style={btn(false)}>Çık</button>
        <span style={{ fontSize: 13, color: dim }}>{idx + 1} / {items.length}</span>
      </div>
      <div style={{ height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 4, marginBottom: 18 }}>
        <div style={{ height: "100%", borderRadius: 4, background: GOLD, width: (idx / items.length) * 100 + "%", transition: "width .3s" }} />
      </div>
      <div style={card}>
        <Question key={idx} item={items[idx]} onNext={next} speak={speak} />
      </div>
    </div>
  );
}

// ---------------- Ders ekranı ----------------
function Lesson({ lesson, prog, saveProg, speak, onBack }) {
  const [tab, setTab] = useState("words");
  const [practice, setPractice] = useState(false);

  if (practice) {
    return <Practice lesson={lesson} prog={prog} saveProg={saveProg} speak={speak} onExit={() => setPractice(false)} />;
  }

  const toggleLearned = async (e) => {
    const k = wordKey(e);
    const learned = { ...prog.learned };
    if (learned[k]) delete learned[k]; else learned[k] = true;
    await saveProg({ ...prog, learned });
  };

  const learnedCount = lesson.vocab.filter((e) => prog.learned[wordKey(e)]).length;
  const best = prog.learned[lessonKey(lesson.id)];

  return (
    <div>
      <button onClick={onBack} style={{ ...btn(false), marginBottom: 14 }}>Geri</button>
      <h2 style={{ margin: "0 0 2px", fontSize: 22, color: GOLD }}>{lesson.title}</h2>
      <div style={{ color: dim, fontSize: 13, marginBottom: 14 }}>{lesson.tr}</div>

      <div style={{ ...card, marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: dim, letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>Hedefler</div>
        {lesson.goals.map((g, i) => <div key={i} style={{ fontSize: 14, padding: "2px 0" }}>• {g}</div>)}
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {[["words", "Kelimeler"], ["grammar", "Gramer"], ["examples", "Örnekler"]].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} style={{ ...btn(tab === k), flex: 1 }}>{label}</button>
        ))}
      </div>

      {tab === "words" && (
        <div style={{ display: "grid", gap: 5, marginBottom: 18 }}>
          <div style={{ fontSize: 12, color: dim, marginBottom: 4 }}>{learnedCount} / {lesson.vocab.length} kelime öğrenildi (✓ ile işaretle)</div>
          {lesson.vocab.map((e, i) => {
            const on = !!prog.learned[wordKey(e)];
            return (
              <div key={i} style={{ background: on ? "rgba(52,211,153,0.07)" : "rgba(255,255,255,0.03)", border: "1px solid " + (on ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.07)"), borderRadius: 9, padding: "9px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                  <Speaker text={e.art ? e.art + " " + e.de : e.de} speak={speak} />
                  <Art art={e.art} />
                  <span style={{ fontWeight: "bold", fontSize: 15, marginRight: 8 }}>{e.de}</span>
                  {e.fem && <span style={{ fontSize: 13, color: ARTICLE_COLOR.die, marginRight: 8 }}>/ die {e.fem}</span>}
                  {e.pl && <span style={{ fontSize: 12, color: dim, marginRight: 8 }}>(Pl. {e.pl})</span>}
                  <span style={{ fontSize: 13, color: dim }}>{e.tr}</span>
                </div>
                <button onClick={() => toggleLearned(e)} style={{ background: on ? "#34d399" : "transparent", border: "1px solid " + (on ? "#34d399" : "rgba(255,255,255,0.2)"), borderRadius: 6, color: on ? "#0a0a0f" : dim, width: 30, height: 30, cursor: "pointer", fontSize: 14, flexShrink: 0 }}>✓</button>
              </div>
            );
          })}
        </div>
      )}

      {tab === "grammar" && (
        <div style={{ display: "grid", gap: 14, marginBottom: 18 }}>
          {lesson.grammar.map((g, i) => (
            <div key={i} style={card}>
              <div style={{ fontSize: 16, fontWeight: "bold", color: GOLD, marginBottom: 8 }}>{g.title}</div>
              <div style={{ fontSize: 14, lineHeight: 1.6, marginBottom: g.tables.length ? 12 : 0 }}>{g.body}</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {g.tables.map((t, j) => (
                  <div key={j} style={{ background: "rgba(255,217,90,0.06)", border: "1px solid rgba(255,217,90,0.2)", borderRadius: 10, padding: "10px 14px", minWidth: 150 }}>
                    <div style={{ fontWeight: "bold", marginBottom: 6, color: GOLD }}>{t.head}</div>
                    {t.rows.map((r, k) => (
                      <div key={k} style={{ fontSize: 14, display: "flex", gap: 10, padding: "2px 0" }}>
                        <span style={{ color: dim, minWidth: 74 }}>{r[0]}</span><span>{r[1]}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "examples" && (
        <div style={{ display: "grid", gap: 8, marginBottom: 18 }}>
          {lesson.examples.map((x, i) => (
            <div key={i} style={card}>
              <div style={{ fontSize: 16, marginBottom: 4 }}><Speaker text={x.de} speak={speak} />{x.de}</div>
              <div style={{ fontSize: 13, color: dim }}>{x.tr}</div>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => setPractice(true)} style={{ width: "100%", background: "linear-gradient(135deg,#ffd95a,#f59e0b)", border: "none", borderRadius: 14, color: "#0a0a0f", padding: "16px", fontSize: 15, fontWeight: "bold", cursor: "pointer", fontFamily: "inherit" }}>
        Alıştırmaya başla {best >= 0 && best !== undefined ? "(en iyi: %" + best + ")" : ""}
      </button>
    </div>
  );
}

// ---------------- Modül listesi ----------------
export default function GermanCourse({ prog, saveProg, speak }) {
  const [lessonId, setLessonId] = useState(null);
  const all = DE_MODULES.flatMap((m) => m.lessons);
  const current = all.find((l) => l.id === lessonId);

  if (current) {
    return <Lesson lesson={current} prog={prog} saveProg={saveProg} speak={speak} onBack={() => setLessonId(null)} />;
  }

  const doneCount = all.filter((l) => prog.learned[lessonKey(l.id)] >= 70).length;

  return (
    <div>
      <h2 style={{ margin: "0 0 4px", fontSize: 22, color: GOLD }}>🇩🇪 Almanca A1</h2>
      <p style={{ color: dim, fontSize: 13, margin: "0 0 18px" }}>{doneCount} / {all.length} ders tamamlandı</p>
      {DE_MODULES.map((m, mi) => (
        <div key={m.id} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: dim, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
            Modül {mi + 1} · {m.title}
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {m.lessons.map((l) => {
              const score = prog.learned[lessonKey(l.id)];
              const ok = score >= 70;
              const lc = l.vocab.filter((e) => prog.learned[wordKey(e)]).length;
              return (
                <button key={l.id} onClick={() => setLessonId(l.id)}
                  style={{ ...card, textAlign: "left", cursor: "pointer", fontFamily: "inherit", color: "#e8e4d9", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid " + (ok ? "rgba(52,211,153,0.35)" : "rgba(255,255,255,0.09)") }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: "bold" }}>{l.title}</div>
                    <div style={{ fontSize: 12, color: dim, marginTop: 2 }}>{l.tr}</div>
                    <div style={{ fontSize: 11, color: dim, marginTop: 4 }}>{lc} / {l.vocab.length} kelime</div>
                  </div>
                  <div style={{ fontSize: 13, color: ok ? "#34d399" : dim, whiteSpace: "nowrap" }}>
                    {score !== undefined ? (ok ? "✓ %" : "%") + score : "Başla"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
