import { useEffect, useMemo, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { motion, AnimatePresence } from "motion/react";
import { Gauge, Users, TrendingUp, GraduationCap, Lightbulb, ArrowUpRight, Sparkles } from "lucide-react";
import {
  acentoHex,
  fmt,
  fmtCLP,
  influencerById,
  tendenciaById,
  aprendizajeById,
  arquetipoLabel,
  type Concepto,
} from "../../lib/data";
import { planificar, BUDGET_DEFAULT } from "../../lib/budget";
import { Brain3D, BrainStage } from "../Brain3D";

/* -------- Contexto (ingesta) -------- */
export function ContextoNode({ data }: NodeProps) {
  const d = data as any;
  return (
    <div className="glass w-[196px] rounded-2xl p-4">
      <div className="kicker mb-2">contexto cargado</div>
      <div className="font-display text-[14px] font-bold leading-tight text-content">{d.titulo}</div>
      <div className="mt-2.5 space-y-1.5">
        {d.items?.map((it: string) => (
          <div key={it} className="flex items-center gap-1.5 text-[10.5px] text-content-secondary">
            <span className="h-1 w-1 rounded-full bg-cyan" /> {it}
          </div>
        ))}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

/* -------- Cerebro (núcleo) -------- */
export function CerebroNode({ data }: NodeProps) {
  const d = data as any;
  const thinking = d.thinking ?? false;
  return (
    <div className="relative grid w-[360px] place-items-center">
      {/* bloom suave que difumina el disco contra el canvas claro */}
      <div className="pointer-events-none absolute left-1/2 top-[150px] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgba(207,77,107,0.18), transparent 68%)" }} />
      {/* escenario oscuro inmersivo: da contraste y protagonismo al cerebro */}
      <div className={"relative grid h-[340px] w-[340px] place-items-center rounded-full " + (thinking ? "pulse-ring pulse-ring-strong" : "pulse-ring")}>
        <BrainStage variant="disc" thinking={thinking} className="absolute inset-0 grid place-items-center">
          <Brain3D size={320} thinking={thinking} />
        </BrainStage>
      </div>
      <div className="mt-3 text-center">
        <div className="font-display text-[15px] font-bold text-content">Cerebro Sigma</div>
        {thinking ? (
          <div className="mt-1 flex items-center justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full bg-cyan think-dot" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        ) : (
          <div className="kicker mt-0.5">{d.sub ?? "conceptos listos"}</div>
        )}
      </div>
      <Handle type="target" position={Position.Left} style={{ top: "42%" }} />
      <Handle type="source" position={Position.Bottom} style={{ left: "50%" }} />
    </div>
  );
}

/* -------- Concepto generativo -------- */
export function ConceptoNode({ data, selected }: NodeProps) {
  const c = (data as any).concepto as Concepto;
  const born = (data as any).born ?? false;
  const onOpen = (data as any).onOpen as ((id: string) => void) | undefined;
  const color = acentoHex[c.acento];
  const isSel = (data as any).selected ?? selected;

  // staged generative reveal
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (!born) return;
    const ts = [180, 1000, 1900, 2900, 3900]; // → stages 1..5, lento a propósito
    const timers = ts.map((t, i) => setTimeout(() => setStage(i + 1), t));
    return () => timers.forEach(clearTimeout);
  }, [born]);

  const inf = c.influencers.map((id) => influencerById(id)!).filter(Boolean);
  // métricas estimadas por el motor (no inventadas) según el presupuesto base
  const est = useMemo(() => planificar(c, BUDGET_DEFAULT), [c]);

  return (
    <div
      onClick={() => stage >= 5 && onOpen?.(c.id)}
      className="glass-strong w-[330px] rounded-2xl border p-4 transition-all duration-300"
      style={{
        borderColor: isSel ? color : "var(--color-line)",
        boxShadow: isSel ? `0 0 0 1px ${color}, 0 0 34px -6px ${color}` : undefined,
        cursor: stage >= 5 ? "pointer" : "default",
      }}
    >
      <Handle type="target" position={Position.Top} />

      {/* header */}
      <div className="flex items-center justify-between">
        <span
          className="rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider"
          style={{ background: `${color}1f`, color }}
        >
          {stage >= 1 ? c.territorio : "generando concepto"}
        </span>
        {stage < 5 ? (
          <span className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1 w-1 rounded-full think-dot" style={{ background: color, animationDelay: `${i * 0.2}s` }} />
            ))}
          </span>
        ) : (
          <span className="flex items-center gap-1 font-mono text-[10px] text-ink-soft">
            <Gauge size={11} style={{ color }} /> {c.confianza}%
          </span>
        )}
      </div>

      {/* title */}
      <div className="mt-2 min-h-[26px]">
        {stage >= 1 ? (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-display text-[19px] font-bold leading-tight text-ink">
            “{c.titulo}”
          </motion.div>
        ) : (
          <div className="skeleton h-5 w-3/4" />
        )}
        {stage >= 1 && <div className="mt-0.5 font-mono text-[10px] text-ink-mute">mood: {c.mood}</div>}
      </div>

      {/* rationale */}
      <div className="mt-2.5 min-h-[34px]">
        {stage >= 2 ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11.5px] leading-snug text-ink-soft">
            {c.rationale}
          </motion.p>
        ) : stage >= 1 ? (
          <div className="space-y-1.5">
            <div className="skeleton h-2.5 w-full" />
            <div className="skeleton h-2.5 w-5/6" />
          </div>
        ) : null}
      </div>

      {/* content ideas */}
      <AnimatePresence>
        {stage >= 3 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 overflow-hidden">
            <div className="mb-1.5 flex items-center gap-1.5">
              <Lightbulb size={12} style={{ color }} />
              <span className="kicker">ideas de contenido</span>
            </div>
            <div className="space-y-1.5">
              {c.ideasContenido.map((idea, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 * i }}
                  className="flex items-start gap-2 rounded-lg border border-line bg-white/5 px-2.5 py-1.5"
                >
                  <span className="mt-0.5 font-mono text-[9px]" style={{ color }}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[11px] leading-snug text-ink-soft">{idea}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* trends + learning pulled from ingest */}
      <AnimatePresence>
        {stage >= 4 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-1.5">
            <div className="flex flex-wrap gap-1.5">
              {c.tendencias.map((tid) => {
                const t = tendenciaById(tid);
                return (
                  <span key={tid} className="chip py-0.5" style={{ borderColor: `${color}40`, color }}>
                    <TrendingUp size={10} /> {t?.nombre.replace(/“|”/g, "").slice(0, 18)}
                  </span>
                );
              })}
            </div>
            <div className="flex items-start gap-1.5 rounded-lg border border-line bg-white/5 px-2.5 py-1.5">
              <GraduationCap size={12} className="mt-0.5 shrink-0 text-amber" />
              <span className="text-[10.5px] leading-snug text-ink-soft">
                <span className="text-amber">aprendizaje: </span>
                {aprendizajeById(c.aprendizaje)?.titulo}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* influencers grouped by mood + metrics */}
      <AnimatePresence>
        {stage >= 5 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 border-t border-line pt-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Users size={12} style={{ color }} />
                <span className="text-[11px] text-ink-soft">
                  {arquetipoLabel[c.arquetipo]} · <span className="text-ink-mute">mood {inf[0]?.mood}</span>
                </span>
              </div>
              <div className="flex -space-x-2">
                {inf.slice(0, 4).map((p) => (
                  <span key={p.id} className="grid h-6 w-6 place-items-center rounded-full border border-white/10 bg-white/10 text-[11px]" title={p.nombre}>
                    {p.avatar}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <Metric label="alcance" value={fmt(est.totalReach)} color={color} />
                <Metric label="ER" value={`${est.erBlend}%`} color={color} />
                <Metric label="CPM" value={`$${fmtCLP(est.cpm)}`} color={color} />
              </div>
              <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color }}>
                abrir <ArrowUpRight size={13} />
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <div className="font-mono text-[12px] font-bold" style={{ color }}>{value}</div>
      <div className="font-mono text-[8px] uppercase tracking-wider text-ink-mute">{label}</div>
    </div>
  );
}

export const _genIcon = Sparkles;
