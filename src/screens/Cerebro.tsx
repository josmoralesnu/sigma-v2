import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  useReactFlow,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from "@xyflow/react";
import { motion, AnimatePresence } from "motion/react";
import { Maximize2, RefreshCw, Sparkles, PlusCircle, AlertTriangle, ArrowRight, Wand2, X } from "lucide-react";
import { ContextoNode, CerebroNode, ConceptoNode } from "../components/flow/nodes";
import { BeamEdge } from "../components/flow/BeamEdge";
import { ConceptoModal } from "../components/ConceptoModal";
import { Brain3D, BrainStage } from "../components/Brain3D";
import {
  conceptosPorNivel, acentoHex, NIVEL_LABEL, conceptos, cliente,
  oportunidades, influencers, influencerById, tendencias, competidores,
  contextoItems, guiarPlaceholders,
  type Nivel, type Concepto, type Acento,
} from "../lib/data";
import type { Plan } from "../lib/budget";

/* arma un Concepto a medida desde el formulario "guiar al cerebro" */
const PALETA: Acento[] = ["cyan", "violet", "lime", "amber", "coral", "rose"];
let customSeq = 0;
function buildConcepto(form: { idea: string; bajada: string; refId: string; territorio: string }, idx: number): Concepto {
  const ref = influencerById(form.refId);
  const acento = PALETA[idx % PALETA.length];
  customSeq += 1;
  return {
    id: `cx${customSeq}`,
    titulo: form.idea.trim() || "Concepto a medida",
    territorio: form.territorio.trim() || "Concepto guiado",
    mood: "a medida",
    arquetipo: ref?.arquetipo ?? "viajes",
    acento,
    nivel: 1,
    rationale: `${form.bajada.trim() ? form.bajada.trim() + ". " : ""}Concepto guiado por el equipo. Sigma lo aterrizó cruzando los insights de ${cliente.marca}${ref ? ` y tomando como referencia a ${ref.nombre} (${ref.arquetipo})` : ""}.`,
    ideasContenido: [
      `Reel principal alrededor de “${form.idea.trim() || "la idea"}”`,
      form.bajada.trim() ? `Bajada: “${form.bajada.trim()}”` : "Serie corta duetable para amplificar",
      ref ? `Colaboración con ${ref.nombre} y creadores afines` : "Versión replicable para creadores afines",
    ],
    tendencias: ["t1"],
    aprendizaje: "a1",
    influencers: ref ? [ref.id] : [],
    confianza: 82,
    alcance: 0,
    engagement: 0,
    cpm: 0,
    riesgo: "Medio",
  };
}

const nodeTypes = { contexto: ContextoNode, cerebro: CerebroNode, concepto: ConceptoNode };
const edgeTypes = { beam: BeamEdge };

const GAP = 380;
const STAGGER = 2500;
const REVEAL = 4200;

interface CerebroProps {
  token: number;
  animatedToken: number;
  onAnimated: (t: number) => void;
  presupuesto: number;
  onThinking: (b: boolean) => void;
  onGoNueva: () => void;
  onGoAnalisis: () => void;
  onActivate: () => void;
  onAprobar: (titulo: string, plan: Plan) => void;
}

/* ============================ Canvas ============================ */
function CerebroCanvas(props: CerebroProps) {
  const { token, animatedToken, onAnimated, presupuesto, onThinking } = props;
  const { setCenter, fitView } = useReactFlow();
  const [nivel, setNivel] = useState<Nivel>(1);
  const [bornIds, setBornIds] = useState<string[]>([]);
  const [thinking, setThinking] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [custom, setCustom] = useState<Concepto[]>([]);
  const [guiar, setGuiar] = useState(false);
  const customRef = useRef<Concepto[]>([]);
  useEffect(() => { customRef.current = custom; }, [custom]);
  const timers = useRef<any[]>([]);

  const list = useMemo(() => [...conceptosPorNivel(nivel), ...custom], [nivel, custom]);
  const midX = (list.length - 1) * GAP / 2;
  const cerebroPos = { x: midX + 5, y: -130 };
  const contextoPos = { x: midX + 5 - 380, y: -70 };
  const pos = useCallback((i: number) => ({ x: i * GAP, y: 360 }), []);
  const onOpen = useCallback((id: string) => setSelectedId(id), []);

  const [nodes, setNodes] = useNodesState<Node>([]);
  const [edges, setEdges] = useEdgesState<Edge>([]);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  // build nodes/edges
  useEffect(() => {
    const ns: Node[] = [
      { id: "contexto", type: "contexto", position: contextoPos, data: { titulo: "Ingesta + Insights", items: contextoItems }, draggable: false },
      { id: "cerebro", type: "cerebro", position: cerebroPos, data: { thinking, sub: `${list.length} conceptos` }, draggable: false },
      ...list.map((c, i): Node => ({ id: c.id, type: "concepto", position: pos(i), data: { concepto: c, born: bornIds.includes(c.id), selected: c.id === selectedId, onOpen } })),
    ];
    setNodes(ns);
    const es: Edge[] = [
      { id: "ctx-cer", source: "contexto", target: "cerebro", type: "beam", data: { color: "#cf4d6b", dur: 5 } },
      ...list.map((c): Edge => ({ id: `cer-${c.id}`, source: "cerebro", target: c.id, type: "beam", data: { color: acentoHex[c.acento], dur: 4.6, pending: !bornIds.includes(c.id), active: c.id === selectedId } })),
    ];
    setEdges(es);
  }, [bornIds, selectedId, thinking, list]);

  const runGeneration = useCallback((nivelArg: Nivel) => {
    clearTimers();
    const arr = [...conceptosPorNivel(nivelArg), ...customRef.current];
    setBornIds([]);
    setSelectedId(null);
    setThinking(true);
    onThinking(true);
    const mid = (arr.length - 1) * GAP / 2;
    timers.current.push(setTimeout(() => setCenter(mid + 110, -10, { zoom: 0.9, duration: 1200 }), 120));
    arr.forEach((c, i) => {
      const t0 = 1300 + i * STAGGER;
      timers.current.push(setTimeout(() => {
        setBornIds((b) => [...b, c.id]);
        setCenter(i * GAP + 165, 360 + 200, { zoom: 0.94, duration: 1500 });
      }, t0));
    });
    const total = 1300 + (arr.length - 1) * STAGGER + REVEAL;
    timers.current.push(setTimeout(() => {
      setThinking(false);
      onThinking(false);
      fitView({ padding: 0.22, duration: 1400 });
      onAnimated(token);
    }, total));
  }, [setCenter, fitView, onThinking, onAnimated, token]);

  const showAll = useCallback((nivelArg: Nivel) => {
    clearTimers();
    const arr = [...conceptosPorNivel(nivelArg), ...customRef.current];
    setBornIds(arr.map((c) => c.id));
    setThinking(false);
    onThinking(false);
    timers.current.push(setTimeout(() => fitView({ padding: 0.22, duration: 800 }), 120));
  }, [fitView, onThinking]);

  // "Guiar al cerebro": genera un concepto a medida y lo hace nacer con animación
  const generarCustom = (concepto: Concepto) => {
    setGuiar(false);
    const newIndex = list.length;
    setCustom((cs) => [...cs, concepto]);
    setThinking(true);
    onThinking(true);
    clearTimers();
    timers.current.push(setTimeout(() => {
      setBornIds((b) => [...b, concepto.id]);
      setCenter(newIndex * GAP + 165, 360 + 200, { zoom: 0.92, duration: 1400 });
    }, 1800));
    timers.current.push(setTimeout(() => {
      setThinking(false);
      onThinking(false);
      fitView({ padding: 0.2, duration: 1200 });
    }, 1800 + REVEAL));
  };

  // mount decision: animate only if fresh token
  useEffect(() => {
    if (token === animatedToken) showAll(1);
    else runGeneration(1);
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cambiarNivel = (n: Nivel) => { setNivel(n); runGeneration(n); };

  const selected = list.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="relative h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        minZoom={0.3}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.85 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
      >
        <Background variant={BackgroundVariant.Dots} gap={26} size={1} color="#ffffff12" />
        <Controls showInteractive={false} position="bottom-right" />
      </ReactFlow>

      <div className="pointer-events-none absolute left-6 top-5 z-10 max-w-sm">
        <div className="kicker mb-1">Sigma · generación en vivo</div>
        <h2 className="font-display text-[20px] font-bold leading-tight text-content">{thinking ? "El cerebro está construyendo conceptos…" : "Conceptos listos para revisar."}</h2>
        <p className="mt-1 text-[12px] text-content-secondary">Cada concepto nace del cerebro con su rationale, ideas de contenido, tendencias y un aprendizaje pasado.</p>
      </div>

      <div className="absolute right-6 top-5 z-10 flex items-center gap-2">
        <div className="glass flex items-center gap-1 rounded-xl p-1">
          {([1, 2, 3] as Nivel[]).map((n) => (
            <button key={n} onClick={() => cambiarNivel(n)} className={"rounded-lg px-3 py-1.5 text-[11.5px] font-semibold transition-colors " + (nivel === n ? "bg-white/10 text-cyan" : "text-content-secondary hover:text-content")}>{NIVEL_LABEL[n]}</button>
          ))}
        </div>
        <button onClick={() => runGeneration(nivel)} className="glass glass-hover flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[12px] font-semibold text-content-secondary transition-colors hover:text-content">
          <Sparkles size={14} className="text-cyan" /> Regenerar <RefreshCw size={13} />
        </button>
        <button onClick={() => fitView({ padding: 0.22, duration: 900 })} className="glass glass-hover grid h-[38px] w-[38px] place-items-center rounded-xl text-content-secondary transition-colors hover:text-content" title="Ver todo"><Maximize2 size={15} /></button>
        <button onClick={() => setGuiar(true)} className="group flex items-center gap-2 rounded-xl bg-cyan px-4 py-2.5 text-[12px] font-bold text-void transition-all hover:shadow-[0_0_24px_-6px_var(--color-cyan)]">
          <Wand2 size={14} /> Nuevo concepto
        </button>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
        <div className="glass flex items-center gap-2 rounded-full px-4 py-2">
          <span className="font-mono text-[10px] text-ink-mute">nivel creativo</span>
          <span className="text-[12px] font-semibold text-cyan">{NIVEL_LABEL[nivel]}</span>
          <span className="font-mono text-[10px] text-ink-mute">· {list.length} conceptos</span>
        </div>
      </div>

      <ConceptoModal concepto={selected} initialBudget={presupuesto} onAprobar={props.onAprobar} onClose={() => setSelectedId(null)} />
      <GuiarModal open={guiar} onClose={() => setGuiar(false)} onGenerar={(form) => generarCustom(buildConcepto(form, list.length))} />
    </div>
  );
}

/* ============================ Guiar al cerebro (formulario) ============================ */
interface GuiarForm { idea: string; bajada: string; refId: string; territorio: string; }
function GuiarModal({ open, onClose, onGenerar }: { open: boolean; onClose: () => void; onGenerar: (f: GuiarForm) => void }) {
  const [form, setForm] = useState<GuiarForm>({ idea: "", bajada: "", refId: "", territorio: "" });
  const set = (k: keyof GuiarForm) => (e: any) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const puede = form.idea.trim().length > 2;

  return (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-50 grid place-items-center p-4 sm:p-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="glass-strong relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-cyan/30 shadow-2xl"
          >
            <div className="relative border-b border-line p-5" style={{ background: "linear-gradient(160deg, rgba(207,77,107,0.14), transparent 65%)" }}>
              <button onClick={onClose} className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg border border-line text-ink-soft transition-colors hover:text-ink"><X size={16} /></button>
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-cyan/40 bg-cyan/10 text-cyan"><Wand2 size={17} /></span>
                <div>
                  <h2 className="font-display text-[18px] font-bold leading-tight text-ink">Guiar al cerebro</h2>
                  <p className="text-[11.5px] text-ink-soft">Dale una dirección y Sigma genera un concepto a medida.</p>
                </div>
              </div>
            </div>

            <div className="space-y-3.5 p-5">
              <label className="block">
                <span className="kicker mb-1.5 block">Concepto que imaginan *</span>
                <input value={form.idea} onChange={set("idea")} placeholder={guiarPlaceholders.idea} className="input" autoFocus />
              </label>
              <label className="block">
                <span className="kicker mb-1.5 block">Bajada / tono (opcional)</span>
                <textarea value={form.bajada} onChange={set("bajada")} rows={2} placeholder="Ej: humor cercano, sin sonar corporativo, foco en la App" className="input resize-none leading-relaxed" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="kicker mb-1.5 block">Influencer de referencia</span>
                  <select value={form.refId} onChange={set("refId")} className="input">
                    <option value="">— sin referencia —</option>
                    {influencers.map((i) => (
                      <option key={i.id} value={i.id}>{i.nombre} · {i.arquetipo}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="kicker mb-1.5 block">Territorio (opcional)</span>
                  <input value={form.territorio} onChange={set("territorio")} placeholder={guiarPlaceholders.territorio} className="input" />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-line bg-white/5 p-4">
              <span className="flex-1 font-mono text-[10px] text-ink-mute">el cerebro cruzará tu guía con los insights de {cliente.marca}</span>
              <button onClick={onClose} className="rounded-xl border border-line px-4 py-2.5 text-[12.5px] font-semibold text-ink-soft transition-colors hover:text-ink">Cancelar</button>
              <button
                onClick={() => { if (puede) { onGenerar(form); setForm({ idea: "", bajada: "", refId: "", territorio: "" }); } }}
                disabled={!puede}
                className="group flex items-center gap-2 rounded-xl bg-cyan px-5 py-2.5 text-[13px] font-bold text-void transition-all hover:shadow-[0_0_24px_-6px_var(--color-cyan)] disabled:opacity-40"
              >
                <Sparkles size={15} /> Generar concepto
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ============================ Idle (reposo) ============================ */
/* etiquetas flotantes = señales del cliente activo (se computan por marca dentro del componente) */
const TAG_POS = [
  { top: "11%", left: "17%" }, { top: "7%", left: "70%" }, { top: "34%", left: "89%" },
  { top: "67%", left: "87%" }, { top: "89%", left: "52%" }, { top: "70%", left: "11%" }, { top: "35%", left: "9%" },
];

function IdleStandby({ onActivate, onGoNueva, onGoAnalisis }: { onActivate: () => void; onGoNueva: () => void; onGoAnalisis: () => void }) {
  const RED_TAGS = [
    ...tendencias.slice(0, 4).map((t) => t.nombre.split(/[/·]/)[0].trim()),
    ...competidores.slice(0, 3).map((k) => k.nombre.split(/[·]/)[0].trim()),
  ].map((s) => (s.length > 18 ? s.slice(0, 17) + "…" : s));
  return (
    <div className="relative grid h-full place-items-center overflow-y-auto overflow-x-hidden px-6 py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_38%,rgba(207,77,107,0.10),transparent_72%)]" />
      <div className="relative w-full max-w-2xl text-center">
        {/* brain protagonista · escenario inmersivo · interactivo (arrastra para girar) */}
        <div className="mx-auto mb-6 w-full max-w-[560px]">
          <BrainStage thinking={false} className="relative mx-auto grid h-[440px] place-items-center">
            <Brain3D size={400} thinking={false} interactive />
            {RED_TAGS.map((tag, i) => (
              <span key={tag} className="float-soft pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 font-mono text-[9.5px] text-white/85 backdrop-blur-md" style={{ top: TAG_POS[i].top, left: TAG_POS[i].left, animationDelay: `${i * 0.5}s` }}>
                <span className="mr-1 inline-block h-1 w-1 rounded-full bg-rose align-middle think-dot" style={{ animationDelay: `${i * 0.3}s` }} />{tag}
              </span>
            ))}
          </BrainStage>
        </div>

        <div className="kicker mb-1">cerebro en reposo · aprendiendo</div>
        <h2 className="font-display text-[24px] font-extrabold leading-tight text-ink">Formando redes con los insights de {cliente.marca}.</h2>
        <p className="mx-auto mt-1.5 max-w-md text-[13px] text-ink-soft">
          El cerebro está absorbiendo el análisis, las tendencias y los aprendizajes. Elige una oportunidad para que arme la campaña.
        </p>

        {/* análisis reciente */}
        <button onClick={onGoAnalisis} className="glass mx-auto mt-4 flex max-w-lg items-center gap-2.5 rounded-xl border-rose/30 px-4 py-2.5 text-left transition-colors hover:border-rose/50">
          <AlertTriangle size={15} className="shrink-0 text-rose" />
          <span className="flex-1 text-[12px] text-ink-soft"><span className="font-semibold text-rose">Análisis reciente:</span> {competidores[0]?.nombre.split("·")[0].trim()} presiona en {competidores[0]?.territorio.split(/[·/]/)[0].trim().toLowerCase()}.</span>
          <span className="flex items-center gap-1 text-[11.5px] font-semibold text-rose">ver análisis <ArrowRight size={13} /></span>
        </button>

        {/* oportunidades = ramas */}
        <div className="mx-auto mt-4 max-w-xl">
          <div className="kicker mb-2">oportunidades detectadas · elige una rama</div>
          <div className="flex flex-wrap justify-center gap-2">
            {oportunidades.map((o) => {
              const color = acentoHex[o.acento];
              return (
                <button key={o.id} onClick={onActivate} className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-medium text-content-secondary transition-colors hover:text-content" style={{ borderColor: `${color}40` }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} /> {o.titulo}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button onClick={onGoNueva} className="glass glass-hover flex items-center gap-2 rounded-xl px-4 py-3 text-[12.5px] font-semibold text-content-secondary transition-colors hover:text-content"><PlusCircle size={15} /> Nueva campaña</button>
          <button onClick={onActivate} className="group flex items-center gap-2.5 rounded-xl bg-cyan px-5 py-3 text-[13px] font-semibold text-void transition-all hover:shadow-[0_0_28px_-4px_var(--color-cyan)]">
            <Sparkles size={16} /> Generar conceptos
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================ Export ============================ */
export function Cerebro(props: CerebroProps) {
  if (props.token === 0) {
    return <IdleStandby onActivate={props.onActivate} onGoNueva={props.onGoNueva} onGoAnalisis={props.onGoAnalisis} />;
  }
  return (
    <ReactFlowProvider>
      <CerebroCanvas {...props} />
    </ReactFlowProvider>
  );
}
