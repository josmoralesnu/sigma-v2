// Puerta de login (JWT real) con accesos demo (Agencia / Cliente).
import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export function Login({ onLogin, error }: { onLogin: (u: string, p: string) => Promise<void>; error: string | null }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (user?: string, pass?: string) => {
    setBusy(true);
    try {
      await onLogin(user ?? u, pass ?? p);
    } catch {
      /* error lo maneja el hook */
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grain relative grid h-screen w-screen place-items-center bg-canvas text-content">
      <div className="pointer-events-none fixed inset-0 bg-aura opacity-70" />
      <div className="glass-strong relative z-10 w-[380px] rounded-3xl p-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan/15 text-cyan glow-cyan">
            <Sparkles size={19} />
          </span>
          <div>
            <div className="font-display text-xl font-extrabold leading-none">Sigma</div>
            <div className="kicker mt-1">Cerebro de marca</div>
          </div>
        </div>

        <div className="mt-6 space-y-2.5">
          <input className="input" placeholder="Usuario o email" value={u} onChange={(e) => setU(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
          <input className="input" type="password" placeholder="Contraseña" value={p} onChange={(e) => setP(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
          {error && <div className="text-[12px] text-rose">{error}</div>}
          <button
            onClick={() => submit()}
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan py-2.5 text-[13px] font-semibold text-content-inverted transition-opacity disabled:opacity-50"
          >
            Entrar <ArrowRight size={15} />
          </button>
        </div>

        <div className="mt-5 border-t border-line pt-4">
          <div className="kicker mb-2">Acceso demo</div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => submit("admin", "admin12345")} disabled={busy} className="glass glass-hover rounded-xl px-3 py-2.5 text-[12px] font-medium text-content-secondary hover:text-content">
              Agencia
            </button>
            <button onClick={() => submit("cliente@copec.cl", "cliente12345")} disabled={busy} className="glass glass-hover rounded-xl px-3 py-2.5 text-[12px] font-medium text-content-secondary hover:text-content">
              Cliente · Copec
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
