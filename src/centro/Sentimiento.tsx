import { useEffect } from "react";
import { motion, animate, useMotionValue, useTransform } from "motion/react";
import {
  MessageCircle, Smile, Meh, Frown, TrendingUp, ThumbsUp, AlertTriangle,
} from "lucide-react";
import { Wrap, PageHeader, card, container, item } from "./parts";

/** número que cuenta hacia el valor objetivo */
function CountUp({ to, className }: { to: number; className?: string }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  useEffect(() => {
    const controls = animate(mv, to, { duration: 1, ease: "easeOut", delay: 0.2 });
    return () => controls.stop();
  }, [to, mv]);
  return <motion.span className={className}>{rounded}</motion.span>;
}
import {
  sentimiento, temas, comentarios, alertaSent, ventana, type SentLabel, type TemaSent,
} from "./panel";
import { DatosPruebaBadge } from "./confid";

const SENT: Record<SentLabel, { color: string; icon: any; label: string; cls: string }> = {
  positivo: { color: "var(--color-lime)", icon: Smile, label: "Positivo", cls: "bg-lime/12 text-lime ring-lime/25" },
  neutro: { color: "var(--color-amber)", icon: Meh, label: "Neutro", cls: "bg-amber/12 text-amber ring-amber/25" },
  negativo: { color: "var(--color-negative)", icon: Frown, label: "Negativo", cls: "bg-negative/12 text-negative ring-negative/25" },
};

function ScoreRing({ score }: { score: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid h-32 w-32 place-items-center">
      <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <motion.circle
          cx="60" cy="60" r={r} fill="none" stroke="var(--color-lime)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - score / 100) }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      <div className="relative text-center">
        <CountUp to={score} className="font-display text-[30px] font-bold leading-none text-ink" />
        <div className="text-[10px] uppercase tracking-wide text-ink-mute">índice</div>
      </div>
    </div>
  );
}

function Distribucion() {
  const segs: { k: SentLabel; v: number }[] = [
    { k: "positivo", v: sentimiento.positivo },
    { k: "neutro", v: sentimiento.neutro },
    { k: "negativo", v: sentimiento.negativo },
  ];
  return (
    <div>
      <div className="mb-3 flex h-3 overflow-hidden rounded-full ring-1 ring-[var(--ln-1)]">
        {segs.map((s, i) => (
          <motion.div key={s.k} initial={{ width: 0 }} animate={{ width: `${s.v}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 + i * 0.12 }} style={{ background: SENT[s.k].color }} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {segs.map((s) => {
          const Icon = SENT[s.k].icon;
          return (
            <div key={s.k} className="rounded-xl bg-[var(--sf-1)] p-3 ring-1 ring-[var(--ln-1)]">
              <div className="mb-1 flex items-center gap-1.5"><Icon size={14} style={{ color: SENT[s.k].color }} /><span className="text-[11px] text-ink-soft">{SENT[s.k].label}</span></div>
              <div className="font-display text-[20px] font-bold text-ink">{s.v}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TemaRow({ t }: { t: TemaSent }) {
  const color = t.sent >= 65 ? "var(--color-lime)" : t.sent >= 50 ? "var(--color-amber)" : "var(--color-negative)";
  return (
    <div className="py-2.5">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[13px] font-medium text-ink">{t.tema}</span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-ink-mute">{t.menciones.toLocaleString("es-CL")} menciones</span>
          <span className="w-9 text-right text-[12px] font-bold tabular-nums" style={{ color }}>{t.sent}</span>
        </div>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--sf-2)]">
        <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${t.sent}%` }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }} style={{ background: color }} />
      </div>
    </div>
  );
}

function ComentarioCard({ c }: { c: (typeof comentarios)[number] }) {
  const s = SENT[c.sent];
  const Icon = s.icon;
  return (
    <div className="rounded-xl bg-[var(--sf-1)] p-3.5 ring-1 ring-[var(--ln-1)]">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-[12.5px] font-semibold text-ink">{c.autor}</span>
        <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ring-1 ${s.cls}`}><Icon size={10} /> {s.label}</span>
      </div>
      <p className="text-[12.5px] leading-relaxed text-ink-soft">{c.texto}</p>
      <div className="mt-2 flex items-center gap-3 text-[10.5px] text-ink-mute">
        <span className="inline-flex items-center gap-1"><ThumbsUp size={11} /> {c.likes}</span>
        <span>· {c.plataforma}</span>
        <span className="truncate">· en “{c.post}”</span>
      </div>
    </div>
  );
}

export function Sentimiento() {
  return (
    <Wrap>
      <PageHeader
        icon={<MessageCircle size={24} />}
        titulo="Análisis de sentimiento"
        subtitulo={<><span>{sentimiento.totalComentarios.toLocaleString("es-CL")} comentarios analizados</span><span className="text-ink-mute">·</span><span>{ventana}</span></>}
        right={<DatosPruebaBadge />}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* score + distribución */}
        <div className={`${card} p-5 lg:col-span-2`}>
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="flex flex-col items-center">
              <ScoreRing score={sentimiento.score} />
              <div className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-lime"><TrendingUp size={13} /> +{sentimiento.tendencia} pp vs. periodo anterior</div>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="mb-3 text-[14px] font-bold text-ink">Distribución del sentimiento</h3>
              <Distribucion />
            </div>
          </div>
        </div>

        {/* alerta */}
        <div className={`${card} p-5 ring-1 ring-negative/20`}>
          <div className="mb-2 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-negative/15 text-negative ring-1 ring-negative/25"><AlertTriangle size={18} /></div>
            <h3 className="text-[14px] font-bold text-ink">Alerta de sentimiento</h3>
          </div>
          <div className="mb-1.5 inline-flex rounded-md bg-negative/12 px-2 py-0.5 text-[11px] font-semibold text-negative ring-1 ring-negative/25">{alertaSent.tema}</div>
          <p className="text-[12.5px] leading-relaxed text-ink-soft">{alertaSent.detalle}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* temas */}
        <div className={`${card} p-5 lg:col-span-2`}>
          <h3 className="mb-2 text-[14px] font-bold text-ink">Temas más comentados</h3>
          <div className="divide-y divide-line">
            {temas.map((t) => <TemaRow key={t.tema} t={t} />)}
          </div>
        </div>

        {/* comentarios */}
        <div className={`${card} p-5 lg:col-span-3`}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-ink">Comentarios destacados</h3>
            <span className="text-[12px] text-ink-mute">muestra representativa</span>
          </div>
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {comentarios.map((c, i) => (
              <motion.div key={i} variants={item}><ComentarioCard c={c} /></motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </Wrap>
  );
}
