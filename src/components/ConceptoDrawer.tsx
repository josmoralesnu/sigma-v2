import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, Sparkles, Gauge, Target, Activity, DollarSign, TrendingUp, GraduationCap, Lightbulb, ArrowRight } from "lucide-react";
import { acentoHex, fmt, influencerById, tendenciaById, aprendizajeById, type Concepto } from "../lib/data";

const riesgoColor: Record<Concepto["riesgo"], string> = {
  Bajo: "var(--color-lime)",
  Medio: "var(--color-amber)",
  Alto: "var(--color-rose)",
};

export function ConceptoDrawer({ concepto, onClose }: { concepto: Concepto | null; onClose: () => void }) {
  useEffect(() => {
    if (!concepto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [concepto, onClose]);

  return (
    <AnimatePresence>
      {concepto && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 z-40 bg-void/60 backdrop-blur-[2px]" />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 34 }}
            className="absolute right-0 top-0 z-50 flex h-full w-[470px] flex-col border-l border-line bg-graphite/95 backdrop-blur-xl"
          >
            <Body c={concepto} onClose={onClose} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Body({ c, onClose }: { c: Concepto; onClose: () => void }) {
  const color = acentoHex[c.acento];
  const inf = c.influencers.map((id) => influencerById(id)!).filter(Boolean);

  return (
    <>
      <div className="relative shrink-0 overflow-hidden border-b border-line p-5" style={{ background: `linear-gradient(160deg, ${color}1f, transparent 70%)` }}>
        <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full blur-3xl" style={{ background: `${color}33` }} />
        <button onClick={onClose} className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg border border-line text-ink-soft transition-colors hover:text-ink">
          <X size={16} />
        </button>
        <span className="rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider" style={{ background: `${color}26`, color }}>
          {c.territorio}
        </span>
        <h2 className="mt-3 font-display text-[26px] font-extrabold leading-tight text-ink">“{c.titulo}”</h2>
        <div className="mt-1 font-mono text-[11px] text-ink-mute">mood: {c.mood}</div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-5">
        <div className="grid grid-cols-2 gap-2.5">
          <Kpi icon={Gauge} label="Confianza" value={`${c.confianza}%`} color={color} />
          <Kpi icon={Target} label="Alcance proy." value={fmt(c.alcance)} color={color} />
          <Kpi icon={Activity} label="Engagement" value={`${c.engagement}%`} color={color} />
          <Kpi icon={DollarSign} label="CPM" value={`$${c.cpm}`} color={color} />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-line bg-surface/60 p-3.5">
          <span className="text-[12px] text-ink-soft">Nivel de riesgo</span>
          <span className="font-mono text-[12px] font-bold" style={{ color: riesgoColor[c.riesgo] }}>{c.riesgo}</span>
        </div>

        <Section title="Rationale">
          <p className="text-[13px] leading-relaxed text-ink-soft">{c.rationale}</p>
        </Section>

        <Section title="Ideas de contenido">
          <div className="space-y-2">
            {c.ideasContenido.map((idea, i) => (
              <div key={i} className="flex items-start gap-2.5 rounded-lg border border-line bg-surface/60 p-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md font-mono text-[10px]" style={{ background: `${color}26`, color }}>
                  {i + 1}
                </span>
                <span className="text-[12.5px] leading-snug text-ink-soft"><Lightbulb size={11} className="mr-1 inline" style={{ color }} />{idea}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Insumos que usó Sigma">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {c.tendencias.map((tid) => (
              <span key={tid} className="chip py-0.5" style={{ borderColor: `${color}40`, color }}>
                <TrendingUp size={10} /> {tendenciaById(tid)?.nombre.replace(/“|”/g, "")}
              </span>
            ))}
          </div>
          <div className="flex items-start gap-2 rounded-lg border border-line bg-surface/60 p-2.5">
            <GraduationCap size={14} className="mt-0.5 shrink-0 text-amber" />
            <div>
              <div className="text-[12px] font-semibold text-ink">{aprendizajeById(c.aprendizaje)?.titulo}</div>
              <div className="text-[11px] text-ink-soft">{aprendizajeById(c.aprendizaje)?.detalle}</div>
            </div>
          </div>
        </Section>

        <Section title={`Bajada a influencers · ${inf.length}`}>
          <div className="space-y-2">
            {inf.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-xl border border-line bg-surface/60 p-2.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-surface-2 text-[18px]">{p.avatar}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[13px] font-semibold text-ink">{p.nombre}</span>
                    <span className="chip py-0 text-[9px]">{p.mood}</span>
                  </div>
                  <div className="font-mono text-[10.5px] text-ink-mute">{p.handle} · {p.tier}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-mono text-[12px] font-bold text-ink">{fmt(p.seguidores)}</div>
                  <div className="font-mono text-[9.5px] text-ink-mute">{p.engagement}% ER</div>
                </div>
                <div className="ml-1 shrink-0 text-center">
                  <div className="font-mono text-[12px] font-bold" style={{ color }}>{p.fit}</div>
                  <div className="font-mono text-[9px] text-ink-mute">fit</div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div className="flex shrink-0 items-center gap-3 border-t border-line bg-graphite/80 p-4">
        <button onClick={onClose} className="rounded-xl border border-line px-4 py-3 text-[12.5px] font-semibold text-ink-soft transition-colors hover:text-ink">Volver</button>
        <button className="group flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-[13px] font-bold text-void transition-all" style={{ background: color, boxShadow: `0 0 26px -6px ${color}` }}>
          <Sparkles size={15} /> Aprobar concepto <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </>
  );
}

function Kpi({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface/60 p-3">
      <div className="mb-1.5 flex items-center gap-1.5">
        <Icon size={13} style={{ color }} />
        <span className="kicker">{label}</span>
      </div>
      <div className="font-display text-[20px] font-bold text-ink">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2.5 text-[12px] font-bold uppercase tracking-wide text-ink-soft">{title}</div>
      {children}
    </div>
  );
}
