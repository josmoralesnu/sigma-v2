import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, RefreshCw, Sparkles, Lightbulb, TrendingUp, GraduationCap, Wallet,
  Gauge, Target, Activity, FlaskConical, Users, ArrowRight, Check, AlertTriangle,
  Minus, Plus, ImagePlus, Handshake, Lock,
} from "lucide-react";
import {
  acentoHex, fmt, fmtCLP, conceptoVariantes, tendenciaById, aprendizajeById,
  TIER_CONFIG, TIERS, tierLabel, tierRango, type Concepto, type Tier,
} from "../lib/data";
import { planificar, PRESETS, BUDGET_MIN, BUDGET_MAX, BUDGET_STEP, BUDGET_DEFAULT, IMAGE_RIGHTS_UPLIFT, type Plan } from "../lib/budget";

const CONFIDENCIAL = "Datos confidenciales";

function wrapSlice(arr: string[], start: number, n: number) {
  const out: string[] = [];
  for (let i = 0; i < Math.min(n, arr.length); i++) out.push(arr[(start + i) % arr.length]);
  return out;
}

export function ConceptoModal({ concepto, initialBudget = BUDGET_DEFAULT, onAprobar, onClose }: { concepto: Concepto | null; initialBudget?: number; onAprobar?: (titulo: string, plan: Plan) => void; onClose: () => void }) {
  useEffect(() => {
    if (!concepto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [concepto, onClose]);

  return (
    <AnimatePresence>
      {concepto && (
        <div className="absolute inset-0 z-50 grid place-items-center p-4 sm:p-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-void/75 backdrop-blur-md" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="relative z-10 flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-line-strong bg-graphite/95 shadow-2xl backdrop-blur-xl"
          >
            <Body c={concepto} initialBudget={initialBudget} onAprobar={onAprobar} onClose={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Body({ c, initialBudget, onAprobar, onClose }: { c: Concepto; initialBudget: number; onAprobar?: (titulo: string, plan: Plan) => void; onClose: () => void }) {
  const color = acentoHex[c.acento];
  const v = conceptoVariantes[c.id] ?? { titulos: [c.titulo], rationales: [c.rationale], ideasPool: c.ideasContenido };

  // título y rationale van acoplados (mismo índice → siempre coherentes)
  const [varIdx, setVarIdx] = useState(0);
  const [ideaOff, setIdeaOff] = useState(0);
  const [regen, setRegen] = useState<{ t?: boolean; r?: boolean; i?: boolean }>({});
  const [budget, setBudget] = useState(initialBudget);
  const [pieces, setPieces] = useState(1);
  const [imageRights, setImageRights] = useState(false);

  const n = Math.min(v.titulos.length, v.rationales.length);
  const titulo = v.titulos[varIdx % n];
  const rationale = v.rationales[varIdx % n];
  const ideas = wrapSlice(v.ideasPool, ideaOff, 3);

  const plan = useMemo(() => planificar(c, budget, { pieces, imageRights }), [c, budget, pieces, imageRights]);

  // regenera el par título+rationale juntos (coherentes)
  function bumpPair() {
    setRegen({ t: true, r: true });
    setTimeout(() => {
      setVarIdx((i) => i + 1);
      setRegen({});
    }, 560);
  }
  function bumpIdeas() {
    setRegen((s) => ({ ...s, i: true }));
    setTimeout(() => {
      setIdeaOff((o) => o + 3);
      setRegen((s) => ({ ...s, i: false }));
    }, 560);
  }

  const tonoColor = plan.tono === "warn" ? "var(--color-amber)" : plan.tono === "good" ? "var(--color-lime)" : "var(--color-cyan)";

  return (
    <>
      {/* header */}
      <div className="relative shrink-0 border-b border-line p-5" style={{ background: `linear-gradient(160deg, ${color}1f, transparent 65%)` }}>
        <button onClick={onClose} className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg border border-line text-ink-soft transition-colors hover:text-ink"><X size={16} /></button>
        <div className="flex items-center gap-2">
          <span className="rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider" style={{ background: `${color}26`, color }}>{c.territorio}</span>
          <span className="font-mono text-[10px] text-ink-mute">mood: {c.mood}</span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <h2 className="font-display text-[28px] font-extrabold leading-tight text-ink">
            {regen.t ? <span className="skeleton inline-block h-7 w-72 align-middle" /> : <>“{titulo}”</>}
          </h2>
          <RegenBtn label="nombre" onClick={bumpPair} color={color} busy={regen.t} />
        </div>
      </div>

      {/* body */}
      <div className="min-h-0 flex-1 overflow-y-auto">
       <div className="grid grid-cols-1 gap-0 lg:grid-cols-12">
        {/* LEFT: concepto */}
        <div className="space-y-5 p-5 lg:col-span-7 lg:border-r lg:border-line">
          <Block icon={Sparkles} title="Rationale" color={color} action={<RegenBtn label="rationale" onClick={bumpPair} color={color} busy={regen.r} />}>
            {regen.r ? <SkeletonLines n={3} /> : <p className="text-[13px] leading-relaxed text-ink-soft">{rationale}</p>}
          </Block>

          <Block icon={Lightbulb} title="Ideas de contenido" color={color} action={<RegenBtn label="ideas" onClick={bumpIdeas} color={color} busy={regen.i} />}>
            {regen.i ? <SkeletonLines n={3} /> : (
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {ideas.map((idea, i) => (
                    <motion.div key={idea} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.08 }} className="flex items-start gap-2.5 rounded-lg border border-line bg-surface/50 p-2.5">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md font-mono text-[10px]" style={{ background: `${color}26`, color }}>{i + 1}</span>
                      <span className="text-[12.5px] leading-snug text-ink-soft">{idea}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </Block>

          <Block icon={TrendingUp} title="Insumos que usó Sigma" color={color}>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {c.tendencias.map((tid) => (
                <span key={tid} className="chip py-0.5" style={{ borderColor: `${color}40`, color }}>
                  <TrendingUp size={10} /> {tendenciaById(tid)?.nombre.replace(/“|”/g, "")}
                </span>
              ))}
            </div>
            <div className="flex items-start gap-2 rounded-lg border border-line bg-surface/50 p-2.5">
              <GraduationCap size={14} className="mt-0.5 shrink-0 text-amber" />
              <div>
                <div className="text-[12px] font-semibold text-ink">{aprendizajeById(c.aprendizaje)?.titulo}</div>
                <div className="text-[11px] text-ink-soft">{aprendizajeById(c.aprendizaje)?.detalle}</div>
              </div>
            </div>
          </Block>
        </div>

        {/* RIGHT: recomendación + presupuesto */}
        <div className="space-y-4 p-5 lg:col-span-5">
          {/* recommendation — arriba del presupuesto */}
          <div className="flex items-start gap-2.5 rounded-xl border p-3.5" style={{ borderColor: `${tonoColor}40`, background: `${tonoColor}12` }}>
            {plan.tono === "warn" ? <AlertTriangle size={16} className="mt-0.5 shrink-0" style={{ color: tonoColor }} /> : <Sparkles size={16} className="mt-0.5 shrink-0" style={{ color: tonoColor }} />}
            <p className="text-[12px] leading-snug text-ink-soft"><span className="font-semibold" style={{ color: tonoColor }}>Sigma recomienda: </span>{plan.recomendacion}</p>
          </div>

          {/* budget */}
          <div className="rounded-2xl border border-line bg-surface/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet size={15} style={{ color }} />
                <span className="text-[13px] font-bold text-ink">Presupuesto</span>
              </div>
              <span className="font-display text-[18px] font-extrabold text-ink">CLP {fmtCLP(budget)}</span>
            </div>
            <input
              type="range" min={BUDGET_MIN} max={BUDGET_MAX} step={BUDGET_STEP} value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full" style={{ accentColor: color }}
            />
            <div className="mt-2 flex gap-1.5">
              {PRESETS.map((p) => (
                <button key={p.label} onClick={() => setBudget(p.value)} className={"flex-1 rounded-lg border px-2 py-1.5 text-[11px] font-semibold transition-colors " + (budget === p.value ? "text-void" : "border-line text-ink-soft hover:text-ink")} style={budget === p.value ? { background: color, borderColor: color } : {}}>
                  {p.label}
                </button>
              ))}
            </div>

            {/* controles de paquete: piezas + derecho a imagen */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between rounded-lg border border-line bg-void/40 px-2.5 py-2">
                <span className="text-[10.5px] leading-tight text-ink-soft">Piezas<br /><span className="text-ink-mute">1 reel + 2 hist.</span></span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setPieces((p) => Math.max(1, p - 1))} className="grid h-5 w-5 place-items-center rounded-md border border-line text-ink-soft transition-colors hover:text-ink"><Minus size={11} /></button>
                  <span className="w-4 text-center font-mono text-[13px] font-bold text-ink">{pieces}</span>
                  <button onClick={() => setPieces((p) => Math.min(3, p + 1))} className="grid h-5 w-5 place-items-center rounded-md border border-line text-ink-soft transition-colors hover:text-ink"><Plus size={11} /></button>
                </div>
              </div>
              <button onClick={() => setImageRights((v) => !v)} className={"flex items-center justify-between rounded-lg border px-2.5 py-2 text-left transition-colors " + (imageRights ? "" : "border-line hover:border-line-strong")} style={imageRights ? { borderColor: color, background: `${color}12` } : {}}>
                <span className="flex items-center gap-1.5 text-[10.5px] leading-tight text-ink-soft"><ImagePlus size={13} style={{ color: imageRights ? color : undefined }} /> Derecho<br />de imagen</span>
                <span className="flex flex-col items-end">
                  <span className={"grid h-4 w-7 items-center rounded-full px-0.5 transition-colors " + (imageRights ? "" : "bg-line")} style={imageRights ? { background: color } : {}}>
                    <span className={"h-3 w-3 rounded-full bg-white transition-transform " + (imageRights ? "translate-x-3" : "")} />
                  </span>
                  <span className="mt-0.5 font-mono text-[9px] text-ink-mute">+{Math.round(IMAGE_RIGHTS_UPLIFT * 100)}%</span>
                </span>
              </button>
            </div>

            {/* donut de inversión por categoría */}
            <DesgloseInversion plan={plan} />

            <div className="mt-3 flex items-center justify-between border-t border-line pt-2.5 font-mono text-[10px] text-ink-mute">
              <span>asignado <span className="text-ink">CLP {fmtCLP(plan.totalFee)}</span></span>
              <span>libre <span className="text-ink">CLP {fmtCLP(Math.max(0, plan.restante))}</span></span>
            </div>
          </div>

        </div>
       </div>

       {/* franja inferior horizontal — resultados + talento censurados por confidencialidad */}
       <div className="space-y-4 border-t border-line p-5">
         {/* resultado esperado · censurado */}
         <div>
           <div className="mb-2 flex items-center gap-1.5"><Lock size={12} className="text-ink-mute" /><span className="kicker">resultado esperado · confidencial</span></div>
           <div className="relative overflow-hidden rounded-xl">
             <div aria-hidden className="pointer-events-none grid select-none grid-cols-2 gap-2 blur-[8px] sm:grid-cols-4" style={{ opacity: 0.5 }}>
               <Mini icon={Target} label="Alcance" value={fmt(plan.totalReach)} color={color} />
               <Mini icon={FlaskConical} label="Prueba est." value={fmt(plan.pruebaEst)} color={color} />
               <Mini icon={Activity} label="ER blend" value={`${plan.erBlend}%`} color={color} />
               <Mini icon={Gauge} label="CPM" value={`$${fmtCLP(plan.cpm)}`} color={color} />
             </div>
             <div className="absolute inset-0 grid place-items-center">
               <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-graphite/85 px-4 py-2 text-[11.5px] font-semibold text-ink shadow-xl backdrop-blur-md"><Lock size={13} className="text-cyan" /> Resultados proyectados · {CONFIDENCIAL}</span>
             </div>
           </div>
         </div>

         {/* bajada de talento · censurado */}
         <div>
           <div className="mb-2 flex items-center gap-1.5"><Lock size={12} className="text-ink-mute" /><span className="kicker">bajada de talento · confidencial</span></div>
           <div className="relative overflow-hidden rounded-xl border border-line bg-surface/40 p-4">
             <div aria-hidden className="pointer-events-none flex select-none flex-wrap gap-2 blur-[7px]" style={{ opacity: 0.5 }}>
               {plan.elegidos.slice(0, 6).map((e) => (
                 <div key={e.inf.id} className="flex items-center gap-2.5 rounded-xl border border-line bg-surface/60 p-2.5">
                   <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-[20px]" style={{ background: `${color}18` }}>{e.inf.avatar}</span>
                   <div className="space-y-1.5"><div className="h-2.5 w-24 rounded bg-ink/20" /><div className="h-2 w-16 rounded bg-ink/10" /></div>
                 </div>
               ))}
             </div>
             <div className="absolute inset-0 grid place-items-center px-4 text-center">
               <div>
                 <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-graphite/85 px-4 py-2 text-[11.5px] font-semibold text-ink shadow-xl backdrop-blur-md"><Lock size={13} className="text-cyan" /> Talento reservado · {CONFIDENCIAL}</span>
                 <p className="mx-auto mt-2 max-w-sm text-[10.5px] text-ink-mute">No exponemos los creadores que proponemos a la marca en el demo.</p>
               </div>
             </div>
           </div>
         </div>
       </div>
      </div>

      {/* footer */}
      <div className="flex shrink-0 items-center gap-3 border-t border-line bg-graphite/80 p-4">
        <div className="flex items-center gap-2 font-mono text-[10px] text-ink-mute">
          <Check size={12} className="text-lime" /> plan listo · CLP {fmtCLP(plan.totalFee)} asignado · <span className="inline-flex items-center gap-1"><Lock size={10} /> resultados confidenciales</span>
        </div>
        <div className="flex-1" />
        <button onClick={onClose} className="rounded-xl border border-line px-4 py-3 text-[12.5px] font-semibold text-ink-soft transition-colors hover:text-ink">Volver</button>
        <button onClick={() => { onAprobar?.(titulo, plan); onClose(); }} className="group flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[13px] font-bold text-void transition-all" style={{ background: color, boxShadow: `0 0 26px -6px ${color}` }}>
          <Sparkles size={15} /> Crear campaña con esta rama <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </>
  );
}

/* ---- bits ---- */
function RegenBtn({ label, onClick, color, busy }: { label: string; onClick: () => void; color: string; busy?: boolean }) {
  return (
    <button onClick={onClick} disabled={busy} className="flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10.5px] font-semibold transition-colors disabled:opacity-60" style={{ borderColor: `${color}40`, color }}>
      <RefreshCw size={12} className={busy ? "animate-spin" : ""} /> {busy ? "generando…" : `regenerar ${label}`}
    </button>
  );
}
function Block({ icon: Icon, title, color, action, children }: { icon: any; title: string; color: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={14} style={{ color }} />
          <span className="text-[12px] font-bold uppercase tracking-wide text-ink-soft">{title}</span>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
function Mini({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface/50 p-2.5">
      <div className="mb-1 flex items-center gap-1.5"><Icon size={12} style={{ color }} /><span className="kicker">{label}</span></div>
      <div className="font-display text-[17px] font-bold text-ink">{value}</div>
    </div>
  );
}
function SkeletonLines({ n }: { n: number }) {
  return <div className="space-y-2">{Array.from({ length: n }).map((_, i) => <div key={i} className="skeleton h-3" style={{ width: `${90 - i * 12}%` }} />)}</div>;
}

/* Donut de inversión por categoría de creador + desglose */
function DesgloseInversion({ plan }: { plan: Plan }) {
  const total = plan.totalFee;
  const segs = TIERS
    .filter((t) => plan.inversionPorTier[t] > 0)
    .map((t) => ({ t, value: plan.inversionPorTier[t], count: plan.porTier[t], color: acentoHex[TIER_CONFIG[t].color] }));

  if (total <= 0 || segs.length === 0) {
    return <div className="mt-3 rounded-xl border border-dashed border-line bg-void/30 px-3 py-4 text-center text-[11px] text-ink-mute">Sube el presupuesto para ver la mezcla de inversión.</div>;
  }

  const R = 42, SW = 13, C = 2 * Math.PI * R;
  let acc = 0;

  return (
    <div className="mt-3 rounded-xl border border-line bg-void/30 p-3">
      <div className="kicker mb-2.5">inversión en creadores · por categoría</div>
      <div className="flex items-center gap-4">
        <div className="relative h-[104px] w-[104px] shrink-0">
          <svg viewBox="0 0 110 110" className="h-full w-full -rotate-90">
            <circle cx="55" cy="55" r={R} fill="none" stroke="var(--color-line)" strokeWidth={SW} />
            {segs.map((s) => {
              const dash = (s.value / total) * C;
              const el = (
                <circle key={s.t} cx="55" cy="55" r={R} fill="none" stroke={s.color} strokeWidth={SW}
                  strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={-acc} strokeLinecap="butt" />
              );
              acc += dash;
              return el;
            })}
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <div className="font-display text-[15px] font-extrabold leading-none text-ink">CLP {fmtCLP(total)}</div>
              <div className="font-mono text-[8.5px] text-ink-mute">{plan.elegidos.length} creadores</div>
            </div>
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          {segs.map((s) => (
            <div key={s.t} className="flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: s.color }} />
              <span className="flex-1 text-[11px] text-ink-soft">{tierLabel(s.t)} <span className="text-ink-mute">·{s.count}</span></span>
              <span className="font-mono text-[10.5px] text-ink">CLP {fmtCLP(s.value)}</span>
              <span className="w-9 text-right font-mono text-[9.5px] text-ink-mute">{Math.round((s.value / total) * 100)}%</span>
            </div>
          ))}
          {plan.imageRights && (
            <div className="mt-1 flex items-center gap-1.5 border-t border-line pt-1.5 text-[9.5px] text-ink-mute">
              <ImagePlus size={10} /> incluye derecho de imagen (+{Math.round(IMAGE_RIGHTS_UPLIFT * 100)}%)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
