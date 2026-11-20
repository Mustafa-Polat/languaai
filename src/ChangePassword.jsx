import { useState } from "react";
import { changePassword, validatePasswordChange } from "./auth";

// "Ilerleme" ekranındaki hesap bölümü: giriş yapmış kullanıcı kendi şifresini değiştirir.
// S: App'in ortak stil nesnesi (card, inp, btn).
export default function ChangePassword({ supabase, username, S }) {
  const [open, setOpen] = useState(false);
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [again, setAgain] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null); // { ok: boolean, text: string }

  const reset = () => { setCur(""); setNext(""); setAgain(""); };

  const submit = async () => {
    if (busy) return;
    const err = validatePasswordChange(cur, next, again);
    if (err) { setMsg({ ok: false, text: err }); return; }
    setBusy(true); setMsg(null);
    const r = await changePassword(supabase, username, cur, next);
    setBusy(false);
    if (r.error) { setMsg({ ok: false, text: r.error }); return; }
    reset(); setOpen(false);
    setMsg({ ok: true, text: "Sifren degistirildi. Bundan sonra yeni sifrenle giris yap." });
  };

  const label = { fontSize: 12, color: "rgba(232,228,217,0.45)", marginBottom: 6 };
  const onEnter = (e) => { if (e.key === "Enter") submit(); };

  return (
    <div style={S.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <div>
          <div style={{ fontSize: 11, color: "rgba(232,228,217,0.35)", marginBottom: 4 }}>HESAP</div>
          <div style={{ fontSize: 15, color: "#e8e4d9" }}>{username}</div>
        </div>
        {!open && (
          <button onClick={() => { setOpen(true); setMsg(null); }} style={S.btn(false)}>Sifre Degistir</button>
        )}
      </div>

      {open && (
        <div style={{ marginTop: 16 }}>
          <div style={label}>MEVCUT SIFRE</div>
          <input style={S.inp} type="password" value={cur} autoComplete="current-password"
            onChange={(e) => setCur(e.target.value)} onKeyDown={onEnter} />
          <div style={{ ...label, marginTop: 12 }}>YENI SIFRE (en az 6 karakter)</div>
          <input style={S.inp} type="password" value={next} autoComplete="new-password"
            onChange={(e) => setNext(e.target.value)} onKeyDown={onEnter} />
          <div style={{ ...label, marginTop: 12 }}>YENI SIFRE (tekrar)</div>
          <input style={S.inp} type="password" value={again} autoComplete="new-password"
            onChange={(e) => setAgain(e.target.value)} onKeyDown={onEnter} />
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button onClick={submit} disabled={busy}
              style={{ ...S.btn(true), flex: 1, padding: "12px 16px", opacity: busy ? 0.6 : 1 }}>
              {busy ? "Bekleyin..." : "Sifreyi Guncelle"}
            </button>
            <button onClick={() => { setOpen(false); reset(); setMsg(null); }} disabled={busy} style={S.btn(false)}>Vazgec</button>
          </div>
        </div>
      )}

      {msg && (
        <div role={msg.ok ? "status" : "alert"} style={{
          marginTop: 14, borderRadius: 8, padding: "10px 12px", fontSize: 13,
          background: msg.ok ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
          border: "1px solid " + (msg.ok ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"),
          color: msg.ok ? "#34d399" : "#f87171",
        }}>{msg.text}</div>
      )}
    </div>
  );
}
