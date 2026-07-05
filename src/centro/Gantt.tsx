import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GanttChartSquare, Flag, Plus, X, Trash2 } from "lucide-react";
import { Wrap, PageHeader } from "./parts";
import {
  ganttDias, ganttSemanas, ganttFecha, ganttIdx, ACENTOS_GANTT,
  type TareaGantt, type HitoGantt, type AcentoGantt,
} from "./panel";
import { cliente } from "../lib/data";
import { useCentro } from "./store";
import { DatosPruebaBadge } from "./confid";

const ACENTO: Record<AcentoGantt, string> = {
  cyan: "var(--color-cyan)", violet: "var(--color-violet)", lime: "var(--color-lime)",
  amber: "var(--color-amber)", rose: "var(--color-rose)", coral: "var(--color-coral)",
};
const pct = (d: number) => (d / ganttDias) * 100;
const field = "w-full rounded-xl border border-[var(--ln-1)] bg-[var(--sf-1)] px-3 py-2.5 text-[13px] text-ink outline-none transition-colors focus:border-cyan/60 focus:bg-[var(--sf-2)]";
const lbl = "mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-ink-mute";
const clamp = (n: number) => Math.max(0, Math.min(ganttDias, n));

/* ---------------- Modal fase ---------------- */
function FaseModal({ tarea, onClose }: { tarea?: TareaGantt | null; onClose: () => void }) {
  const { addTarea, updateTarea, removeTarea } = useCentro();
  const editing = !!tarea;
  const [fase, setFase] = useState(tarea?.fase ?? "");
  const [responsable, setResponsable] = useState(tarea?.responsable ?? "");
  const [inicio, setInicio] = useState(ganttFecha(tarea?.inicio ?? 0));
  const [fin, setFin] = useState(ganttFecha(tarea?.fin ?? 7));
  const [progreso, setProgreso] = useState<number>(tarea?.progreso ?? 0);
  const [acento, setAcento] = useState<AcentoGantt>(tarea?.acento ?? "cyan");

  const i = clamp(ganttIdx(inicio));
  const f = clamp(ganttIdx(fin));
  const valido = fase.trim().length > 1 && f > i;

  const guardar = () => {
    if (!valido) return;
    const payload = { fase: fase.trim(), responsable: responsable.trim() || "—", inicio: i, fin: f, progreso: Math.max(0, Math.min(100, Number(progreso) || 0)), acento };
    if (editing && tarea) updateTarea(tarea.id, payload);
    else addTarea(payload);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[120] grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="absolute inset-0 bg-black/72 backdrop-blur-md" onClick={onClose} />
        <motion.div initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl ring-1 ring-[var(--ln-1)] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]" style={{ background: "#101016" }}>
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h3 className="font-display text-[17px] font-bold text-ink">{editing ? "Editar fase" : "Nueva fase"}</h3>
            <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft hover:bg-[var(--hov)] hover:text-ink"><X size={17} /></button>
          </div>
          <div className="space-y-3.5 p-5">
            <div><label className={lbl}>Fase</label><input className={field} value={fase} onChange={(e) => setFase(e.target.value)} placeholder="Ej: Fase de grupos" autoFocus /></div>
            <div><label className={lbl}>Responsable</label><input className={field} value={responsable} onChange={(e) => setResponsable(e.target.value)} placeholder="Ej: Pool futbolero" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lbl}>Inicio</label><input type="date" min="2026-06-01" max="2026-07-19" className={field} value={inicio} onChange={(e) => setInicio(e.target.value)} /></div>
              <div><label className={lbl}>Fin</label><input type="date" min="2026-06-01" max="2026-07-19" className={field} value={fin} onChange={(e) => setFin(e.target.value)} /></div>
            </div>
            {!valido && fase.trim().length > 1 && <p className="text-[11px] text-negative">La fecha de fin debe ser posterior al inicio.</p>}
            <div>
              <label className={lbl}>Avance · {progreso}%</label>
              <input type="range" min={0} max={100} step={2} value={progreso} onChange={(e) => setProgreso(Number(e.target.value))} className="w-full accent-cyan" style={{ accentColor: "var(--color-cyan)" }} />
            </div>
            <div>
              <label className={lbl}>Color</label>
              <div className="flex gap-2">
                {ACENTOS_GANTT.map((a) => (
                  <button key={a} onClick={() => setAcento(a)} className={`h-7 w-7 rounded-lg ring-2 transition-transform hover:scale-110 ${acento === a ? "ring-white/70" : "ring-transparent"}`} style={{ background: ACENTO[a] }} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-line px-5 py-4">
            {editing ? (
              <button onClick={() => { removeTarea(tarea!.id); onClose(); }} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-semibold text-ink-mute hover:bg-[var(--hov)] hover:text-negative"><Trash2 size={14} /> Eliminar</button>
            ) : <span />}
            <div className="flex gap-2">
              <button onClick={onClose} className="rounded-xl px-4 py-2 text-[13px] font-semibold text-ink-soft hover:bg-[var(--hov)]">Cancelar</button>
              <button onClick={guardar} disabled={!valido} className="rounded-xl bg-cyan px-4 py-2 text-[13px] font-bold text-content-inverted transition-opacity enabled:hover:opacity-90 disabled:opacity-40">{editing ? "Guardar" : "Crear fase"}</button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ---------------- Modal hito ---------------- */
function HitoModal({ onClose }: { onClose: () => void }) {
  const { addHito } = useCentro();
  const [label, setLabel] = useState("");
  const [dia, setDia] = useState(ganttFecha(10));
  const valido = label.trim().length > 1;
  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[120] grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="absolute inset-0 bg-black/72 backdrop-blur-md" onClick={onClose} />
        <motion.div initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl ring-1 ring-[var(--ln-1)] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]" style={{ background: "#101016" }}>
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h3 className="font-display text-[17px] font-bold text-ink">Nuevo hito</h3>
            <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft hover:bg-[var(--hov)] hover:text-ink"><X size={17} /></button>
          </div>
          <div className="space-y-3.5 p-5">
            <div><label className={lbl}>Nombre del hito</label><input className={field} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Ej: Cuartos de final" autoFocus /></div>
            <div><label className={lbl}>Fecha</label><input type="date" min="2026-06-01" max="2026-07-19" className={field} value={dia} onChange={(e) => setDia(e.target.value)} /></div>
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-line px-5 py-4">
            <button onClick={onClose} className="rounded-xl px-4 py-2 text-[13px] font-semibold text-ink-soft hover:bg-[var(--hov)]">Cancelar</button>
            <button onClick={() => { if (valido) { addHito({ dia: clamp(ganttIdx(dia)), label: label.trim() }); onClose(); } }} disabled={!valido} className="rounded-xl bg-cyan px-4 py-2 text-[13px] font-bold text-content-inverted transition-opacity enabled:hover:opacity-90 disabled:opacity-40">Crear hito</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Barra({ t, onClick }: { t: TareaGantt; onClick: () => void }) {
  const color = ACENTO[t.acento];
  return (
    <motion.button onClick={onClick}
      initial={{ width: 0, opacity: 0.2 }}
      animate={{ width: `${pct(t.fin - t.inicio)}%`, opacity: 1 }}
      transition={{ type: "spring", stiffness: 130, damping: 22, delay: 0.05 }}
      className="absolute top-1/2 h-7 -translate-y-1/2 overflow-hidden rounded-lg text-left ring-1 transition-shadow hover:ring-2"
      style={{ left: `${pct(t.inicio)}%`, background: `color-mix(in srgb, ${color} 22%, transparent)`, borderColor: `color-mix(in srgb, ${color} 45%, transparent)` }}
      title={`${t.fase} · ${t.progreso}% · click para editar`}>
      <motion.div className="h-full rounded-lg" initial={{ width: 0 }} animate={{ width: `${t.progreso}%` }} transition={{ delay: 0.35, duration: 0.7, ease: "easeOut" }}
        style={{ background: `linear-gradient(90deg, color-mix(in srgb, ${color} 85%, transparent), ${color})` }} />
      <span className="absolute inset-0 flex items-center px-2 text-[10.5px] font-semibold text-ink">{t.progreso > 0 ? `${t.progreso}%` : "Por iniciar"}</span>
    </motion.button>
  );
}

export function Gantt() {
  const { tareas, hitos, removeHito } = useCentro();
  const [faseModal, setFaseModal] = useState<{ tarea?: TareaGantt | null } | null>(null);
  const [hitoModal, setHitoModal] = useState(false);

  return (
    <Wrap>
      <PageHeader
        icon={<GanttChartSquare size={24} />}
        titulo="Carta Gantt de la campaña"
        subtitulo={<><span>{tareas.length} fases · {hitos.length} hitos</span><span className="text-ink-mute">·</span><span>{cliente.campania}</span></>}
        right={
          <>
            <DatosPruebaBadge />
            <button onClick={() => setHitoModal(true)} className="glass glass-hover inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-semibold text-ink"><Flag size={14} className="text-cyan" /> Hito</button>
            <button onClick={() => setFaseModal({})} className="inline-flex items-center gap-2 rounded-xl bg-cyan px-3.5 py-2 text-[13px] font-bold text-content-inverted transition-opacity hover:opacity-90"><Plus size={15} /> Nueva fase</button>
          </>
        }
      />

      <div className="mb-3 flex flex-wrap items-center gap-3 text-[11.5px] text-ink-soft">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-4 rounded bg-white/15" /> planificado</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-4 rounded" style={{ background: "var(--color-cyan)" }} /> avance</span>
        <span className="text-ink-mute">· click en una barra para editarla</span>
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            {/* cabecera: semanas + hitos */}
            <div className="grid border-b border-line" style={{ gridTemplateColumns: "248px 1fr" }}>
              <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-ink-mute">Fase</div>
              <div className="relative">
                <div className="grid h-full" style={{ gridTemplateColumns: `repeat(${ganttSemanas.length}, 1fr)` }}>
                  {ganttSemanas.map((s, i) => <div key={i} className="border-l border-line px-2 py-3 text-[10.5px] font-medium text-ink-mute">{s}</div>)}
                </div>
                {hitos.map((h) => (
                  <div key={h.id} className="group/h absolute top-0 z-10 -translate-x-1/2" style={{ left: `${pct(h.dia)}%` }}>
                    <div className="flex items-center gap-1 whitespace-nowrap rounded-md bg-cyan/15 px-1.5 py-0.5 text-[9.5px] font-semibold text-cyan ring-1 ring-cyan/25">
                      <Flag size={9} /> {h.label}
                      <button onClick={() => removeHito(h.id)} title="Eliminar hito" className="ml-0.5 opacity-0 transition-opacity hover:text-negative group-hover/h:opacity-100"><X size={9} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* filas */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-0" style={{ marginLeft: 248 }}>
                {hitos.map((h) => <div key={h.id} className="absolute top-0 bottom-0 border-l border-dashed border-cyan/25" style={{ left: `${pct(h.dia)}%` }} />)}
              </div>

              {tareas.map((t) => (
                <div key={t.id} className="grid items-center border-b border-line last:border-0 hover:bg-[var(--sf-1)]" style={{ gridTemplateColumns: "248px 1fr" }}>
                  <button onClick={() => setFaseModal({ tarea: t })} className="min-w-0 px-4 py-3 text-left hover:text-cyan">
                    <div className="truncate text-[13px] font-semibold text-ink">{t.fase}</div>
                    <div className="truncate text-[11px] text-ink-mute">{t.responsable}</div>
                  </button>
                  <div className="relative h-14">
                    <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${ganttSemanas.length}, 1fr)` }}>
                      {ganttSemanas.map((_, k) => <div key={k} className="border-l border-line/60" />)}
                    </div>
                    <Barra t={t} onClick={() => setFaseModal({ tarea: t })} />
                  </div>
                </div>
              ))}
              {tareas.length === 0 && (
                <div className="grid place-items-center py-16 text-center">
                  <p className="text-[13px] text-ink-mute">Sin fases todavía.</p>
                  <button onClick={() => setFaseModal({})} className="mt-3 inline-flex items-center gap-2 rounded-xl border border-line px-3.5 py-2 text-[13px] font-semibold text-ink-soft hover:bg-[var(--hov)]"><Plus size={15} /> Crear la primera fase</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-[12px] text-ink-mute">Línea de tiempo del 1 de junio al 19 de julio · creá fases e hitos desde aquí; el calendario del Mundial guía la cadencia.</p>

      {faseModal && <FaseModal tarea={faseModal.tarea} onClose={() => setFaseModal(null)} />}
      {hitoModal && <HitoModal onClose={() => setHitoModal(false)} />}
    </Wrap>
  );
}
