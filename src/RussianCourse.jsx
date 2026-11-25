import { useState, useEffect } from "react";
import { RU_LESSONS, buildRuPractice, stripStress } from "./russian_grammar";
import { Question } from "./GermanCourse";

const GOLD = "#ffd95a";
const dim = "rgba(232,228,217,0.45)";
const card = { overflowWrap: "break-word", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, padding: "16px 18px" };
const btn = (active) => ({
  background: active ? GOLD : "rgba(255,255,255,0.06)", border: "none", borderRadius: 10,
  color: active ? "#0a0a0f" : "#e8e4d9", padding: "10px 16px", fontSize: 13,
  fontWeight: active ? "bold" : "normal", cursor: "pointer", fontFamily: "inherit",
});

// Kiril klavyesi olmayanlar için boşluk doldurma sorularında ekran harfleri
const CYRILLIC = [..."абвгдеёжзийклмнопрстуфхцчшщъыьэюя", "-"];

// Ders tamamlanma kaydı: prog.learned["__ru_lesson_<id>"] = en iyi yüzde
export const ruLessonKey = (id) => "__ru_lesson_" + id;

function Speaker({ text, speak }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); speak(stripStress(text), "ru"); }}
      style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 15, padding: "0 6px 0 0" }}
      title="Telaffuzu dinle">🔊</button>
  );
}

function Heading({ children }) {
  return <div style={{ fontSize: 16, fontWeight: "bold", color: GOLD, marginBottom: 8 }}>{children}</div>;
}

// ---------------- Alıştırma oturumu ----------------
function Practice({ lesson, prog, saveProg, speak, onExit }) {
  const [items, setItems] = useState(() => buildRuPractice(lesson));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const next = async (ok) => {
    const s = score + (ok ? 1 : 0);
    setScore(s);
    if (idx + 1 >= items.length) {
      const pct = Math.round((s / items.length) * 100);
      const key = ruLessonKey(lesson.id);
      if (!(prog.learned[key] >= pct)) {
        await saveProg({ ...prog, learned: { ...prog.learned, [key]: pct } });
      }
      setDone(true);
    } else setIdx(idx + 1);
  };

  const restart = () => { setItems(buildRuPractice(lesson)); setIdx(0); setScore(0); setDone(false); };

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
        <Question key={idx} item={items[idx]} onNext={next} speak={speak} chars={CYRILLIC} />
      </div>
    </div>
  );
}

// ---------------- Konuşma: diyalog + görevler ----------------
function Speaking({ lesson, speak }) {
  const [shown, setShown] = useState({});
  return (
    <div style={{ display: "grid", gap: 14, marginBottom: 18 }}>
      <div style={card}>
        <Heading>{lesson.dialog.title}</Heading>
        <div style={{ display: "grid", gap: 10 }}>
          {lesson.dialog.lines.map((l, i) => (
            <div key={i} style={{ display: "flex", gap: 10 }}>
              <span style={{ fontWeight: "bold", color: l.who === "A" ? "#60a5fa" : GOLD, minWidth: 16 }}>{l.who}</span>
              <div>
                <div style={{ fontSize: 15 }}><Speaker text={l.ru} speak={speak} />{l.ru}</div>
                <div style={{ fontSize: 12, color: dim, marginTop: 2 }}>{l.tr}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={card}>
        <Heading>Konuşma görevleri</Heading>
        <div style={{ fontSize: 12, color: dim, marginBottom: 10 }}>Görevi sesli olarak Rusça söyle, sonra örnek cevaba bak.</div>
        <div style={{ display: "grid", gap: 10 }}>
          {lesson.speak.map((t, i) => (
            <div key={i}>
              <div style={{ fontSize: 14, marginBottom: 8 }}>{i + 1}. {t.task}</div>
              {shown[i] ? (
                <div style={{ fontSize: 15, color: "#34d399" }}><Speaker text={t.model} speak={speak} />{t.model}</div>
              ) : (
                <button onClick={() => setShown((s) => ({ ...s, [i]: true }))} style={{ ...btn(false), padding: "7px 12px", fontSize: 12 }}>Örnek cevabı göster</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------- Ders ekranı ----------------
function Lesson({ lesson, number, prog, saveProg, speak, onBack }) {
  const [tab, setTab] = useState("grammar");
  const [practice, setPractice] = useState(false);

  if (practice) {
    return <Practice lesson={lesson} prog={prog} saveProg={saveProg} speak={speak} onExit={() => setPractice(false)} />;
  }

  const best = prog.learned[ruLessonKey(lesson.id)];

  return (
    <div>
      <button onClick={onBack} style={{ ...btn(false), marginBottom: 14 }}>Ders listesi</button>
      <h2 style={{ margin: "0 0 2px", fontSize: 22, color: GOLD }}>{number}. {lesson.title}</h2>
      <div style={{ color: dim, fontSize: 13, marginBottom: 14 }}>{lesson.tr}</div>

      <div style={{ ...card, marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: dim, letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>Hedefler</div>
        {lesson.goals.map((g, i) => <div key={i} style={{ fontSize: 14, padding: "2px 0" }}>• {g}</div>)}
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {[["grammar", "Gramer"], ["words", "Kelimeler"], ["examples", "Örnekler"], ["speaking", "Konuşma"]].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} style={{ ...btn(tab === k), flex: 1, padding: "10px 4px" }}>{label}</button>
        ))}
      </div>

      {tab === "grammar" && (
        <div style={{ display: "grid", gap: 14, marginBottom: 18 }}>
          {lesson.grammar.map((g, i) => (
            <div key={i} style={card}>
              <Heading>{g.title}</Heading>
              <div style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>{g.body}</div>
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
          <a href={lesson.source} target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa", fontSize: 13 }}>
            Ek okuma: aynı konu LearnRussian sitesinde (İngilizce) ↗
          </a>
        </div>
      )}

      {tab === "words" && (
        <div style={{ display: "grid", gap: 5, marginBottom: 18 }}>
          {lesson.vocab.map((e, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 9, padding: "9px 12px" }}>
              <Speaker text={e.ru} speak={speak} />
              <span style={{ fontWeight: "bold", fontSize: 15, marginRight: 8 }}>{e.ru}</span>
              <span style={{ fontSize: 13, color: dim }}>{e.tr}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "examples" && (
        <div style={{ display: "grid", gap: 8, marginBottom: 18 }}>
          {lesson.examples.map((x, i) => (
            <div key={i} style={card}>
              <div style={{ fontSize: 16, marginBottom: 4 }}><Speaker text={x.ru} speak={speak} />{x.ru}</div>
              <div style={{ fontSize: 13, color: dim }}>{x.tr}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "speaking" && <Speaking lesson={lesson} speak={speak} />}

      <button onClick={() => setPractice(true)} style={{ width: "100%", background: "linear-gradient(135deg,#ffd95a,#f59e0b)", border: "none", borderRadius: 14, color: "#0a0a0f", padding: "16px", fontSize: 15, fontWeight: "bold", cursor: "pointer", fontFamily: "inherit" }}>
        Alıştırmaya başla {best !== undefined ? "(en iyi: %" + best + ")" : ""}
      </button>
    </div>
  );
}

// ---------------- Ders listesi ----------------
export default function RussianCourse({ prog, saveProg, speak }) {
  const [lessonId, setLessonId] = useState(null);
  const index = RU_LESSONS.findIndex((l) => l.id === lessonId);

  useEffect(() => { document.documentElement.scrollTop = 0; }, [lessonId]);

  if (index >= 0) {
    return <Lesson lesson={RU_LESSONS[index]} number={index + 1} prog={prog} saveProg={saveProg} speak={speak} onBack={() => setLessonId(null)} />;
  }

  const doneCount = RU_LESSONS.filter((l) => prog.learned[ruLessonKey(l.id)] >= 70).length;

  return (
    <div>
      <h2 style={{ margin: "0 0 4px", fontSize: 22, color: GOLD }}>🇷🇺 Rusça Gramer</h2>
      <p style={{ color: dim, fontSize: 13, margin: "0 0 18px" }}>{doneCount} / {RU_LESSONS.length} ders tamamlandı</p>
      <div style={{ display: "grid", gap: 8 }}>
        {RU_LESSONS.map((l, i) => {
          const score = prog.learned[ruLessonKey(l.id)];
          const ok = score >= 70;
          return (
            <button key={l.id} onClick={() => setLessonId(l.id)}
              style={{ ...card, textAlign: "left", cursor: "pointer", fontFamily: "inherit", color: "#e8e4d9", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, border: "1px solid " + (ok ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.09)") }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: "bold" }}>{i + 1}. {l.title}</div>
                <div style={{ fontSize: 12, color: dim, marginTop: 2 }}>{l.tr}</div>
              </div>
              <div style={{ fontSize: 13, color: ok ? "#34d399" : dim, whiteSpace: "nowrap" }}>
                {score !== undefined ? (ok ? "✓ %" : "%") + score : "Başla"}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
