import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  Swords,
  Link2,
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  X,
  Target,
  Loader2,
  Upload,
} from "lucide-react";
import { ReasoningStream } from "../components/ReasoningStream";
import { cn } from "../lib/cn";
import {
  competidores,
  campañas,
  pasosCompetencia,
  pasosBrief,
  cliente,
  fmt,
  fmtCLP,
  espacioBlanco,
  objetivoDefault,
  refLinks,
  briefDefault,
  kpiPrincipal,
  type Marca,
} from "../lib/data";
import { PRESETS, BUDGET_MIN, BUDGET_MAX, BUDGET_STEP } from "../lib/budget";

const STEPS = [
  { id: 0, label: "Marca", icon: Building2 },
  { id: 1, label: "Competencia", icon: Swords },
  { id: 2, label: "Importar", icon: Link2 },
  { id: 3, label: "Brief", icon: FileText },
  { id: 4, label: "Analizar", icon: Sparkles },
];

const amenazaColor: Record<string, string> = {
  alta: "var(--color-rose)",
  media: "var(--color-amber)",
  baja: "var(--color-lime)",
};

export function NewCampaign({ marca, presupuesto, setPresupuesto, onFinish, onThinking }: { marca: Marca; presupuesto: number; setPresupuesto: (n: number) => void; onFinish: () => void; onThinking: (b: boolean) => void }) {
  const [step, setStep] = useState(0);

  return (
    <div className="h-full overflow-y-auto px-8 py-7">
      <div className="mx-auto max-w-3xl">
        {/* stepper */}
        <div className="mb-7 flex items-center">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = step === s.id;
            const done = step > s.id;
            return (
              <div key={s.id} className="flex flex-1 items-center last:flex-none">
                <button onClick={() => s.id < step && setStep(s.id)} className="flex items-center gap-2.5" disabled={s.id > step}>
                  <span
                    className={cn(
                      "grid h-9 w-9 place-items-center rounded-xl border transition-all",
                      active ? "border-cyan/50 bg-[var(--sf-2)] text-cyan glass glow-cyan" : done ? "border-lime/40 bg-lime/10 text-lime" : "border-line text-ink-mute"
                    )}
                  >
                    {done ? <Check size={16} /> : <Icon size={16} />}
                  </span>
                  <span className={cn("hidden text-[12.5px] font-semibold sm:block", active ? "text-ink" : done ? "text-ink-soft" : "text-ink-mute")}>{s.label}</span>
                </button>
                {i < STEPS.length - 1 && <div className={cn("mx-3 h-px flex-1 transition-colors", done ? "bg-lime/40" : "bg-line")} />}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45 }}
          >
            {step === 0 && <StepMarca marca={marca} presupuesto={presupuesto} setPresupuesto={setPresupuesto} />}
            {step === 1 && <StepCompetencia />}
            {step === 2 && <StepImportar />}
            {step === 3 && <StepBrief />}
            {step === 4 && <StepAnalizar onThinking={onThinking} onFinish={onFinish} />}
          </motion.div>
        </AnimatePresence>

        {/* footer nav */}
        {step < 4 && (
          <div className="mt-7 flex items-center justify-between">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-2 rounded-xl glass glass-hover px-4 py-3 text-[12.5px] font-semibold text-ink-soft transition-colors hover:text-ink disabled:opacity-30"
            >
              <ArrowLeft size={15} /> Atrás
            </button>
            <button
              onClick={() => setStep((s) => s + 1)}
              className="group flex items-center gap-2.5 rounded-xl bg-cyan px-5 py-3 text-[13px] font-semibold text-void transition-all hover:shadow-[0_0_28px_-4px_var(--color-cyan)]"
            >
              {step === 3 ? "Analizar con Sigma" : "Siguiente"}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Step 0: Marca + Presupuesto ---------------- */
function StepMarca({ marca, presupuesto, setPresupuesto }: { marca: Marca; presupuesto: number; setPresupuesto: (n: number) => void }) {
  const [nombre, setNombre] = useState(marca.nombre);
  return (
    <Card title="¿Para qué marca y con qué presupuesto?" sub="Definir el presupuesto desde el inicio condiciona toda la estrategia: cuántos creadores y de qué tamaño.">
      <Field label="Nombre de la marca">
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="input" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Rubro">
          <input defaultValue={marca.rubro} className="input" />
        </Field>
        <Field label="Mercado">
          <input defaultValue="Chile" className="input" />
        </Field>
      </div>

      {/* presupuesto al inicio */}
      <div className="rounded-xl border border-cyan/25 bg-cyan/5 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="kicker">Presupuesto total de campaña</span>
          <span className="font-display text-[20px] font-extrabold text-ink">CLP {fmtCLP(presupuesto)}</span>
        </div>
        <input type="range" min={BUDGET_MIN} max={BUDGET_MAX} step={BUDGET_STEP} value={presupuesto} onChange={(e) => setPresupuesto(Number(e.target.value))} className="w-full" style={{ accentColor: "var(--color-cyan)" }} />
        <div className="mt-1 flex justify-between font-mono text-[10px] text-ink-mute">
          <span>CLP {fmtCLP(BUDGET_MIN)}</span>
          <span>CLP {fmtCLP(BUDGET_MAX)}</span>
        </div>
        <div className="mt-2 flex gap-1.5">
          {PRESETS.map((p) => (
            <button key={p.label} onClick={() => setPresupuesto(p.value)} className={"flex-1 rounded-lg border px-2 py-1.5 text-[11px] font-semibold transition-colors " + (presupuesto === p.value ? "border-cyan bg-cyan text-void" : "glass glass-hover text-ink-soft hover:text-ink")}>
              {p.label} <span className="opacity-70">· {fmtCLP(p.value)}</span>
            </button>
          ))}
        </div>
        <p className="mt-2.5 text-[11px] text-ink-soft">Sigma usará este monto para recomendar la mezcla de talento en cada concepto (más adelante puedes ajustarlo por estrategia).</p>
      </div>

      <div className="flex items-center gap-2 rounded-xl glass p-3">
        <Check size={14} className="text-lime" />
        <p className="text-[11.5px] text-ink-soft"><span className="font-semibold text-ink">Memoria de marca encontrada:</span> {marca.campañasActivas} campañas previas, tono y aprendizajes disponibles para el cerebro.</p>
      </div>
    </Card>
  );
}

/* ---------------- Step 1: Competencia ---------------- */
function StepCompetencia() {
  const [running, setRunning] = useState(true);
  const [done, setDone] = useState(false);
  return (
    <Card title="Analizando la competencia" sub="Sigma rastrea el rubro y busca el espacio en blanco.">
      <div className="rounded-xl border border-line bg-[var(--sf-1)] p-4">
        <ReasoningStream steps={pasosCompetencia} running={running} perStep={1000} onDone={() => { setRunning(false); setDone(true); }} />
      </div>

      <AnimatePresence>
        {done && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2.5">
            {competidores.map((k, i) => (
              <motion.div key={k.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }} className="glass rounded-xl p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[13.5px] font-bold text-ink">{k.nombre}</span>
                    <span className="chip py-0.5">{k.territorio}</span>
                  </div>
                  <span className="font-mono text-[11px]" style={{ color: amenazaColor[k.amenaza] }}>amenaza {k.amenaza}</span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--sf-2)]">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${k.sov}%` }} transition={{ delay: 0.2 + i * 0.1, duration: 0.7 }} className="h-full rounded-full bg-gradient-to-r from-cyan to-violet" />
                  </div>
                  <span className="font-mono text-[11px] text-ink-soft">{k.sov}% SOV</span>
                </div>
              </motion.div>
            ))}
            <div className="mt-1 flex items-start gap-2.5 rounded-xl border border-lime/30 bg-lime/10 p-3.5">
              <Target size={16} className="mt-0.5 shrink-0 text-lime" />
              <div>
                <div className="text-[13px] font-semibold text-lime">{espacioBlanco.titulo}</div>
                <p className="text-[12px] text-ink-soft">{espacioBlanco.detalle}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

/* ---------------- Step 2: Importar ---------------- */
function StepImportar() {
  const prev = campañas.filter((c) => c.marca === cliente.marca);
  const [picked, setPicked] = useState<string[]>(prev.map((p) => p.id));
  const [links, setLinks] = useState<string[]>(refLinks);
  const [draft, setDraft] = useState("");

  return (
    <Card title="Importa referencias y campañas anteriores" sub="Mientras más contexto, mejores conceptos.">
      <div>
        <div className="kicker mb-2">Campañas anteriores de la marca</div>
        <div className="space-y-2">
          {prev.map((p) => {
            const on = picked.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => setPicked((s) => (on ? s.filter((x) => x !== p.id) : [...s, p.id]))}
                className={cn("flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors", on ? "border-cyan/40 bg-cyan/5" : "glass glass-hover hover:border-line-strong")}
              >
                <span className={cn("grid h-5 w-5 place-items-center rounded-md border", on ? "border-cyan bg-cyan text-void" : "border-line")}>{on && <Check size={12} />}</span>
                <span className="flex-1">
                  <span className="block text-[13px] font-semibold text-ink">{p.nombre}</span>
                  <span className="block font-mono text-[10px] text-ink-mute">{p.estado} · {p.ventana} · alcance {p.alcance}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="kicker mb-2">Links de referencia</div>
        <div className="mb-2 flex flex-wrap gap-2">
          {links.map((l) => (
            <span key={l} className="flex items-center gap-1.5 rounded-lg glass px-2.5 py-1.5 font-mono text-[11px] text-ink-soft">
              <Link2 size={11} className="text-cyan" /> {l}
              <button onClick={() => setLinks((s) => s.filter((x) => x !== l))} className="text-ink-mute hover:text-rose"><X size={12} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Pega un link de TikTok, Reel, web…" className="input flex-1" onKeyDown={(e) => { if (e.key === "Enter" && draft) { setLinks((s) => [...s, draft]); setDraft(""); } }} />
          <button onClick={() => { if (draft) { setLinks((s) => [...s, draft]); setDraft(""); } }} className="flex items-center gap-1.5 rounded-xl glass glass-hover px-3.5 text-[12.5px] font-semibold text-ink-soft transition-colors hover:text-ink">
            <Plus size={14} /> Agregar
          </button>
        </div>
      </div>
    </Card>
  );
}

/* ---------------- Step 3: Brief ---------------- */
function StepBrief() {
  const [file, setFile] = useState<string | null>(null);
  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f.name);
  };
  return (
    <Card title="Brief de la campaña" sub="Sube el brief en PDF o pégalo. Sigma extrae objetivos, tono y restricciones.">
      {/* dropzone PDF */}
      <Field label="Brief en PDF">
        {file ? (
          <div className="flex items-center gap-3 rounded-xl border border-cyan/40 bg-cyan/5 p-3.5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-cyan/30 bg-cyan/10 text-cyan"><FileText size={18} /></span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-semibold text-ink">{file}</div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-lime"><Check size={11} /> brief cargado · listo para analizar</div>
            </div>
            <button onClick={() => setFile(null)} className="grid h-7 w-7 place-items-center rounded-lg border border-line text-ink-mute transition-colors hover:text-rose"><X size={14} /></button>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-[var(--sf-1)] px-4 py-7 text-center transition-colors hover:border-cyan/40 hover:bg-cyan/[0.03]">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-surface-2 text-cyan"><Upload size={20} /></span>
            <span className="text-[12.5px] font-semibold text-ink">Arrastra el brief o haz clic para subir</span>
            <span className="font-mono text-[10px] text-ink-mute">PDF · hasta 10&nbsp;MB</span>
            <input type="file" accept="application/pdf,.pdf" className="hidden" onChange={onPick} />
          </label>
        )}
      </Field>

      <div className="flex items-center gap-2">
        <span className="h-px flex-1 bg-line" />
        <span className="font-mono text-[10px] text-ink-mute">o pégalo a mano</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <Field label="Brief">
        <textarea
          defaultValue={briefDefault}
          rows={5}
          className="input resize-none leading-relaxed"
        />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Objetivo"><input defaultValue={objetivoDefault} className="input" /></Field>
        <Field label="KPI principal"><input defaultValue={kpiPrincipal} className="input" /></Field>
        <Field label="Ventana"><input defaultValue={cliente.ventana} className="input" /></Field>
      </div>
    </Card>
  );
}

/* ---------------- Step 4: Analizar ---------------- */
function StepAnalizar({ onFinish, onThinking }: { onFinish: () => void; onThinking: (b: boolean) => void }) {
  const [running, setRunning] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    onThinking(true);
    return () => onThinking(false);
  }, []);

  return (
    <Card title="Consolidando el contexto" sub="El cerebro está integrando todo lo que cargaste.">
      <div className="flex flex-col items-center py-4">
        <div className="pulse-ring relative mb-4 grid h-28 w-28 place-items-center rounded-full">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_40%,rgba(207,77,107,0.3),transparent_60%)]" />
          <div className="relative grid h-20 w-20 place-items-center rounded-full border border-cyan/40 glass-strong breathe">
            <span className="font-display text-3xl font-extrabold text-cyan text-glow-cyan">Σ</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-[var(--sf-1)] p-4">
        <ReasoningStream steps={pasosBrief} running={running} perStep={1200} onDone={() => { setRunning(false); setDone(true); onThinking(false); }} />
      </div>

      <AnimatePresence>
        {done && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-lime/30 bg-lime/10 p-4">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-lime"><Check size={15} /> Contexto consolidado</div>
            <p className="mt-1 text-[12px] text-ink-soft">Sigma ya tiene marca, competencia, referencias y brief. El siguiente paso es subir la reunión para extraer insights.</p>
            <button onClick={onFinish} className="group mt-3 flex items-center gap-2.5 rounded-xl bg-cyan px-5 py-3 text-[13px] font-semibold text-void transition-all hover:shadow-[0_0_28px_-4px_var(--color-cyan)]">
              Ir a Insights <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </motion.div>
        )}
        {!done && (
          <div className="flex items-center justify-center gap-2 text-[12px] text-ink-mute">
            <Loader2 size={13} className="animate-spin" /> esto toma unos segundos…
          </div>
        )}
      </AnimatePresence>
    </Card>
  );
}

/* ---------------- shared ---------------- */
function Card({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="font-display text-[20px] font-bold leading-tight text-ink">{title}</h2>
      <p className="mt-1 text-[12.5px] text-ink-soft">{sub}</p>
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="kicker mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}
