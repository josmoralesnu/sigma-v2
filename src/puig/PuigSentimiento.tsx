import { useMemo } from "react";
import { motion } from "motion/react";
import { MessageCircle, TrendingUp, Lightbulb, ThumbsUp, ThumbsDown, ArrowLeft } from "lucide-react";
import { Wrap, PageHeader, container, item } from "../centro/parts";
import { SubTile } from "./brand";
import { sentimientoMacro, submarcaById, fmtK } from "./pdata";

export function PuigSentimiento({ onBack }: { onBack: () => void }) {
  const m = useMemo(() => sentimientoMacro(), []);
  const C = 2 * Math.PI * 52;
  const maxSub = Math.max(...m.porSubmarca.map((s) => s.indice), 1);

  return (
    <Wrap>
      <PageHeader
        icon={<MessageCircle size={22} />}
        titulo="Análisis de sentimiento · Puig"
        subtitulo={<span>Lectura macro de la conversación de marca en todas las campañas</span>}
        right={<button onClick={onBack} className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--sf-1)] px-3 py-2 text-[12.5px] font-medium text-content-secondary ring-1 ring-[var(--ln-1)] transition-colors hover:bg-[var(--hov)] hover:text-content"><ArrowLeft size={14} /> Volver al dashboard</button>}
      />

      <div className="grid gap-3 lg:grid-cols-[1fr_1.3fr]">
        {/* índice macro + tendencia */}
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
          <motion.div variants={item} className="glass rounded-2xl p-5">
            <div className="flex items-center gap-5">
              <div className="relative grid shrink-0 place-items-center">
                <svg width="136" height="136" className="-rotate-90"><circle cx="68" cy="68" r="52" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="10" /><motion.circle cx="68" cy="68" r="52" fill="none" stroke="#86b04a" strokeWidth="10" strokeLinecap="round" strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - m.indice / 100) }} transition={{ duration: 1 }} /></svg>
                <div className="absolute text-center"><div className="font-display text-[36px] font-bold text-content">{m.indice}</div><div className="text-[10px] uppercase text-content-muted">índice macro</div></div>
              </div>
              <div className="flex-1">
                <div className="mb-2 text-[12px] text-content-muted">{fmtK(m.menciones)} menciones · <span className="font-semibold text-lime">+{m.tendencia}% vs. mes anterior</span></div>
                <div className="space-y-2">
                  {[["Positivo", m.pos, "#86b04a"], ["Neutro", m.neu, "#c79a52"], ["Negativo", m.neg, "#e06a86"]].map(([l, v, col]) => (
                    <div key={l as string}><div className="mb-0.5 flex justify-between text-[11.5px]"><span className="text-content-secondary">{l}</span><span className="font-semibold text-content">{v}%</span></div><div className="h-2 overflow-hidden rounded-full bg-[var(--sf-2)]"><motion.div className="h-full rounded-full" style={{ background: col as string }} initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.7 }} /></div></div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* tendencia */}
          <motion.div variants={item} className="glass rounded-2xl p-5">
            <div className="mb-3 flex items-center gap-2 font-display text-[14.5px] font-bold text-content"><TrendingUp size={15} className="text-cyan" /> Evolución del índice</div>
            <Spark serie={m.serie} />
          </motion.div>
        </motion.div>

        {/* por submarca + drivers */}
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
          <motion.div variants={item} className="glass rounded-2xl p-5">
            <div className="mb-3 font-display text-[14.5px] font-bold text-content">Sentimiento por submarca</div>
            <div className="space-y-3">
              {m.porSubmarca.map((s) => {
                const sm = submarcaById(s.id)!;
                return (
                  <div key={s.id} className="flex items-center gap-3">
                    <SubTile id={s.id} size={30} />
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between text-[12px]"><span className="truncate text-content-secondary">{sm.nombre}</span><span className="font-semibold text-content">{s.indice} · {fmtK(s.menciones)} menc.</span></div>
                      <div className="h-2 overflow-hidden rounded-full bg-[var(--sf-2)]"><motion.div className="h-full rounded-full" style={{ background: sm.tint }} initial={{ width: 0 }} animate={{ width: `${(s.indice / maxSub) * 100}%` }} transition={{ duration: 0.7 }} /></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={item} className="glass rounded-2xl p-5">
            <div className="mb-3 font-display text-[14.5px] font-bold text-content">Drivers de conversación</div>
            <div className="space-y-2">
              {m.drivers.map((d) => (
                <div key={d.label} className="flex items-center gap-2.5">
                  <span className="grid h-6 w-6 place-items-center rounded-md" style={{ background: d.tono === "pos" ? "#86b04a1c" : "#e06a861c", color: d.tono === "pos" ? "#86b04a" : "#e06a86" }}>{d.tono === "pos" ? <ThumbsUp size={12} /> : <ThumbsDown size={12} />}</span>
                  <span className="flex-1 text-[12.5px] text-content-secondary">{d.label}</span>
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[var(--sf-2)]"><motion.div className="h-full rounded-full" style={{ background: d.tono === "pos" ? "#86b04a" : "#e06a86" }} initial={{ width: 0 }} animate={{ width: `${d.pct}%` }} transition={{ duration: 0.7 }} /></div>
                  <span className="w-8 text-right text-[12px] font-bold text-content">{d.pct}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* insights macro */}
      <motion.div variants={item} initial="hidden" animate="show" className="glass mt-3 rounded-2xl p-5">
        <div className="mb-3 flex items-center gap-2 font-display text-[14.5px] font-bold text-content"><Lightbulb size={15} className="text-cyan" /> Insights a nivel marca</div>
        <div className="grid gap-2.5 md:grid-cols-2">
          {m.insights.map((t, i) => (
            <div key={i} className="flex gap-2.5 rounded-xl bg-[var(--sf-1)] px-3.5 py-2.5 text-[12.5px] text-content-secondary ring-1 ring-[var(--ln-1)]">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
              <p>{t.split(/(\*\*[^*]+\*\*)/g).map((x, j) => x.startsWith("**") ? <b key={j} className="font-semibold text-content">{x.slice(2, -2)}</b> : <span key={j}>{x}</span>)}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </Wrap>
  );
}

function Spark({ serie }: { serie: number[] }) {
  const W = 460, H = 90, pad = 8;
  const min = Math.min(...serie), max = Math.max(...serie);
  const rng = Math.max(1, max - min);
  const pts = serie.map((v, i) => [pad + (i / (serie.length - 1)) * (W - pad * 2), H - pad - ((v - min) / rng) * (H - pad * 2)] as const);
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-[90px] w-full">
      <motion.path d={line} fill="none" stroke="var(--color-cyan)" strokeWidth={2.5} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 4 : 2} fill="var(--color-cyan)" />)}
    </svg>
  );
}
