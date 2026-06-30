import { useState } from "react";
import { motion } from "motion/react";
import { Search, FileBarChart, Lock, ShieldCheck } from "lucide-react";
import { influencers, tendencias, aprendizajes, fmt, type Tier, type Campaña } from "../lib/data";
import { cn } from "../lib/cn";

const CONFIDENCIAL = "Datos confidenciales";

function Wrap({ children }: { children: React.ReactNode }) {
  return <div className="h-full overflow-y-auto px-8 py-7"><div className="mx-auto max-w-6xl">{children}</div></div>;
}

/* ---------------- Campañas ---------------- */
const estadoColor: Record<string, string> = {
  Activa: "var(--color-lime)",
  "En estrategia": "var(--color-cyan)",
  Cerrada: "var(--color-ink-mute)",
  Borrador: "var(--color-amber)",
};
export function Campañas({ campañas }: { campañas: Campaña[] }) {
  return (
    <Wrap>
      <div className="mb-4 flex items-center gap-2 rounded-xl glass px-3.5 py-2.5 text-[11.5px] text-ink-soft">
        <ShieldCheck size={14} className="text-cyan" />
        Solo se muestran las campañas creadas en esta sesión. El portafolio histórico está protegido por confidencialidad.
      </div>
      <div className="grid gap-2.5">
        {campañas.map((c, i) => {
          const reveal = c.id.startsWith("cu"); // creadas en sesión
          return (
          <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass flex items-center gap-4 rounded-2xl p-4">
            <span className="h-2 w-2 rounded-full" style={{ background: estadoColor[c.estado] }} />
            <div className="min-w-0 flex-1">
              {reveal ? (
                <>
                  <div className="text-[14px] font-semibold text-ink">{c.nombre}</div>
                  <div className="font-mono text-[10px] text-ink-mute">{c.marca} · {c.ventana}</div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1.5 text-[14px] font-semibold text-ink-mute"><Lock size={13} /> {CONFIDENCIAL}</div>
                  <div className="font-mono text-[10px] text-ink-mute/70">acceso restringido · {c.ventana}</div>
                </>
              )}
            </div>
            <span className="chip py-0.5" style={{ color: estadoColor[c.estado] }}>{c.estado}</span>
            <div className="text-right">
              <div className="font-mono text-[13px] font-bold text-ink">{reveal ? c.alcance : "•••"}</div>
              <div className="font-mono text-[9px] text-ink-mute">alcance</div>
            </div>
            <div className="w-32">
              <div className="mb-1 flex justify-between font-mono text-[9px] text-ink-mute"><span>avance</span><span>{c.progreso}%</span></div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan to-violet" style={{ width: `${c.progreso}%` }} /></div>
            </div>
          </motion.div>
          );
        })}
      </div>
    </Wrap>
  );
}

/* ---------------- Talento ---------------- */
const TIERS: { id: Tier | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "nano", label: "Nano" },
  { id: "micro", label: "Micro" },
  { id: "macro", label: "Macro" },
];
export function Talento() {
  const preview = influencers.slice(0, 9);
  return (
    <Wrap>
      <div className="relative">
        {/* teaser borroso — la cartera real va protegida */}
        <div aria-hidden className="pointer-events-none grid select-none grid-cols-1 gap-3 blur-[7px] [filter:blur(7px)_saturate(0.7)] sm:grid-cols-2 lg:grid-cols-3" style={{ opacity: 0.45 }}>
          {preview.map((p) => (
            <div key={p.id} className="rounded-2xl border border-line bg-surface/60 p-4">
              <div className="flex items-start gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-surface-2 text-[22px]">{p.avatar}</span>
                <div className="min-w-0 flex-1">
                  <div className="h-3.5 w-28 rounded bg-ink/20" />
                  <div className="mt-1.5 h-2.5 w-20 rounded bg-ink/10" />
                </div>
                <span className="chip py-0.5">{p.tier}</span>
              </div>
              <div className="mt-4 h-2.5 w-3/4 rounded bg-ink/10" />
              <div className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3">
                {[0, 1, 2].map((k) => <div key={k} className="h-5 rounded bg-ink/10" />)}
              </div>
            </div>
          ))}
        </div>

        {/* overlay confidencial */}
        <div className="absolute inset-0 grid place-items-center">
          <div className="glass-strong max-w-md rounded-2xl p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-cyan/30 bg-cyan/10 text-cyan"><Lock size={24} /></div>
            <div className="font-display text-[20px] font-bold text-ink">Talento reservado</div>
            <div className="kicker mt-1">{CONFIDENCIAL}</div>
            <p className="mt-3 text-[12.5px] leading-relaxed text-ink-soft">La cartera de creadores y su bajada por campaña es información sensible. No se expone en el demo para proteger a los talentos que proponemos a cada marca.</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-[10px] text-ink-mute"><Lock size={12} /> acceso restringido</div>
          </div>
        </div>
      </div>
    </Wrap>
  );
}

/* ---------------- Tendencias ---------------- */
export function Tendencias() {
  return (
    <Wrap>
      <div className="space-y-2.5">
        {tendencias.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-ink">{t.nombre}</span>
                <span className="chip py-0.5">{t.plataforma}</span>
              </div>
              <div className="text-right"><div className="font-mono text-[15px] font-bold text-lime">+{t.momentum}%</div><div className="font-mono text-[10px] text-ink-mute">{t.volumen}</div></div>
            </div>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/10"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, t.momentum / 1.5)}%` }} transition={{ delay: 0.2 + i * 0.06, duration: 0.7 }} className="h-full rounded-full bg-gradient-to-r from-cyan to-violet" /></div>
          </motion.div>
        ))}
      </div>
    </Wrap>
  );
}

/* ---------------- Aprendizajes ---------------- */
export function Aprendizajes() {
  return (
    <Wrap>
      <div className="grid gap-3 md:grid-cols-2">
        {aprendizajes.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="glass rounded-2xl p-4">
            <div className="text-[14px] font-bold text-ink">{a.titulo}</div>
            <p className="mt-1.5 text-[12px] leading-snug text-ink-soft">{a.detalle}</p>
            <div className="mt-2.5 font-mono text-[10px] text-ink-mute">↳ {a.fuente}</div>
          </motion.div>
        ))}
      </div>
    </Wrap>
  );
}

/* ---------------- Reportes (empty/coming) ---------------- */
export function Reportes() {
  return (
    <Wrap>
      <div className="grid min-h-[60vh] place-items-center">
        <div className="glass-strong max-w-md rounded-2xl p-10 text-center shadow-2xl">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-cyan/30 bg-cyan/10 text-cyan"><Lock size={24} /></div>
          <div className="font-display text-[20px] font-bold text-ink">Reportes</div>
          <div className="kicker mt-1">{CONFIDENCIAL}</div>
          <p className="mt-3 text-[12.5px] leading-relaxed text-ink-soft">El performance de cada campaña —alcance real, prueba de producto y aprendizajes que vuelven a alimentar al cerebro— es información sensible de cada marca y no se expone en el demo.</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-[10px] text-ink-mute"><Lock size={12} /> acceso restringido</div>
        </div>
      </div>
    </Wrap>
  );
}
