import { useMemo, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";
import {
  LayoutGrid, Layers, Sparkles, Check, X, RotateCcw, Wand2, Send, Upload,
  MessageSquare, Trash2, ImageOff, Inbox,
} from "lucide-react";
import { Wrap, PageHeader, Chip, card } from "./parts";
import {
  MEDIOS, MEDIO_LABEL, MEDIO_FONDO, ESTADOS_PIEZA, PIEZA_TEST_IMGS,
  type Medio, type Pieza, type EstadoPieza, type TipoContenido,
} from "./panel";
import { cliente } from "../lib/data";
import { useCentro } from "./store";
import { platMeta } from "./plataformas";

/* ---- formatos sugeridos por medio (para crear / generar) ---- */
const FORMATOS: Record<Medio, string[]> = {
  RRSS: ["Post", "Reel", "Carrusel", "Historia"],
  OOH: ["Valla", "Paleta", "Pantalla LED"],
  Prensa: ["Aviso", "Doble página", "Robapágina"],
  Video: ["Spot 20s", "Bumper 6s", "Spot 30s"],
};
const ESTILOS = ["Bold", "Minimal", "Editorial", "Foto real"] as const;
const RRSS_TIPOS = new Set<string>(["Reel", "Video", "Carrusel", "Historia", "Live", "Post"]);

const EST_META: Record<EstadoPieza, { cls: string; dot: string }> = {
  Pendiente: { cls: "bg-amber/12 text-amber ring-amber/25", dot: "#f5b54a" },
  Aprobado: { cls: "bg-lime/12 text-lime ring-lime/25", dot: "#9fe870" },
  Cambios: { cls: "bg-cyan/12 text-cyan ring-cyan/25", dot: "var(--color-cyan)" },
  Descartado: { cls: "bg-[var(--sf-2)] text-ink-mute ring-[var(--ln-1)]", dot: "#7a7a85" },
};

/* miniatura de la pieza (img real o gradiente por medio) */
function PiezaThumb({ p, big = false }: { p: Pieza; big?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {p.img ? (
        <img src={p.img} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full" style={{ background: MEDIO_FONDO[p.medio] }} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
      {!p.img && (
        <div className="absolute inset-0 grid place-items-center">
          <span className={big ? "text-[88px]" : "text-[44px]"} style={{ filter: "drop-shadow(0 6px 18px rgba(0,0,0,.5))" }}>{p.avatar}</span>
        </div>
      )}
    </div>
  );
}

function MetaRow({ p }: { p: Pieza }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="rounded-md bg-[var(--sf-2)] px-2 py-0.5 text-[11px] font-semibold text-ink ring-1 ring-[var(--ln-2)] backdrop-blur">{p.formato}</span>
      {p.plataforma && (
        <span className="inline-flex items-center gap-1 rounded-md bg-black/40 px-2 py-0.5 text-[11px] font-semibold backdrop-blur" style={{ color: platMeta(p.plataforma).dot }}>
          {p.plataforma}
        </span>
      )}
      <span className="rounded-md bg-black/40 px-2 py-0.5 text-[11px] font-semibold text-ink-soft backdrop-blur">v{p.version}</span>
      {p.generadaIA && <span className="inline-flex items-center gap-1 rounded-md bg-cyan/85 px-1.5 py-0.5 text-[10px] font-bold text-content-inverted"><Sparkles size={10} /> IA</span>}
    </div>
  );
}

/* ================= Carta del deck (Tinder, draggable) ================= */
function DeckCard({ p, onAprobar, onDescartar, onCambios, onOpen, drag }: {
  p: Pieza; onAprobar: () => void; onDescartar: () => void; onCambios: () => void; onOpen: () => void; drag: boolean;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-14, 14]);
  const okOp = useTransform(x, [40, 150], [0, 1]);
  const noOp = useTransform(x, [-150, -40], [1, 0]);
  const chgOp = useTransform(y, [-150, -40], [1, 0]);

  return (
    <motion.div
      style={drag ? { x, y, rotate } : undefined}
      drag={drag}
      dragSnapToOrigin
      dragElastic={0.5}
      onDragEnd={(_, info) => {
        if (info.offset.x > 130) onAprobar();
        else if (info.offset.x < -130) onDescartar();
        else if (info.offset.y < -130) onCambios();
      }}
      whileTap={drag ? { cursor: "grabbing" } : undefined}
      onClick={() => { if (Math.abs(x.get()) < 6 && Math.abs(y.get()) < 6) onOpen(); }}
      className={`${card} absolute inset-0 cursor-grab overflow-hidden ring-1 ring-[var(--ln-1)]`}
    >
      <PiezaThumb p={p} big />
      {/* hints de swipe */}
      {drag && (
        <>
          <motion.div style={{ opacity: okOp }} className="absolute left-5 top-5 z-20 rotate-[-12deg] rounded-xl border-2 border-lime px-3 py-1 text-[18px] font-extrabold uppercase tracking-wide text-lime">Aprobar</motion.div>
          <motion.div style={{ opacity: noOp }} className="absolute right-5 top-5 z-20 rotate-[12deg] rounded-xl border-2 border-negative px-3 py-1 text-[18px] font-extrabold uppercase tracking-wide text-negative">Descartar</motion.div>
          <motion.div style={{ opacity: chgOp }} className="absolute left-1/2 top-5 z-20 -translate-x-1/2 rounded-xl border-2 border-cyan px-3 py-1 text-[16px] font-extrabold uppercase tracking-wide text-cyan">Cambios</motion.div>
        </>
      )}
      {/* info inferior */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-5">
        <MetaRow p={p} />
        <h3 className="mt-2 font-display text-[22px] font-bold leading-tight text-white">{p.titulo}</h3>
        <p className="mt-1 text-[12.5px] text-white/75">{p.autor}{p.comentarios.length > 0 && <span className="ml-2 inline-flex items-center gap-1 text-white/60"><MessageSquare size={11} /> {p.comentarios.length}</span>}</p>
      </div>
    </motion.div>
  );
}

/* ================= Modal de detalle ================= */
function DetalleModal({ pieza, onClose }: { pieza: Pieza; onClose: () => void }) {
  const { updatePieza, removePieza, comentarPieza, addPost } = useCentro();
  const [txt, setTxt] = useState("");

  const setEstado = (estado: EstadoPieza) => {
    updatePieza(pieza.id, { estado });
    if (estado === "Aprobado" && pieza.medio === "RRSS") {
      const tipo = (RRSS_TIPOS.has(pieza.formato) ? pieza.formato : "Post") as TipoContenido;
      addPost({
        tipo, titulo: pieza.titulo, autor: pieza.autor, handle: "@" + pieza.autor.split(" ")[0].toLowerCase(),
        avatar: pieza.avatar, plataforma: pieza.plataforma ?? "Instagram", fecha: "2026-06-27", hora: "12:00",
        estado: "Programado", promo: false, alcance: 0, impresiones: 0, er: 0, clics: 0, ftd: 0, guardados: 0,
      });
    }
    onClose();
  };
  const nuevaVersion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => updatePieza(pieza.id, { img: String(r.result), version: pieza.version + 1, estado: "Pendiente" });
    r.readAsDataURL(f);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/72 p-4" onClick={onClose}>
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-[var(--modal)] ring-1 ring-[var(--ln-1)]" onClick={(e) => e.stopPropagation()} style={{ maxHeight: "90vh" }}>
        <div className="grid md:grid-cols-2" style={{ maxHeight: "90vh" }}>
          {/* preview */}
          <div className="relative min-h-[260px] md:min-h-full">
            <PiezaThumb p={pieza} big />
          </div>
          {/* detalle */}
          <div className="flex max-h-[90vh] flex-col overflow-y-auto p-5 scroll-slim">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div>
                <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-bold ring-1 ${EST_META[pieza.estado].cls}`}>{pieza.estado}</span>
                <h3 className="mt-2 font-display text-[20px] font-bold leading-tight text-ink">{pieza.titulo}</h3>
                <p className="text-[12px] text-ink-mute">{pieza.autor} · {MEDIO_LABEL[pieza.medio]}</p>
              </div>
              <button onClick={onClose} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-mute hover:bg-[var(--hov)] hover:text-ink"><X size={16} /></button>
            </div>
            <div className="mb-3"><MetaRow p={pieza} /></div>
            {pieza.descripcion && <p className="mb-4 rounded-xl bg-[var(--sf-1)] p-3 text-[12.5px] leading-relaxed text-ink-soft ring-1 ring-[var(--ln-1)]">{pieza.descripcion}</p>}

            {/* comentarios */}
            <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold text-ink-soft"><MessageSquare size={14} className="text-cyan" /> Comentarios ({pieza.comentarios.length})</div>
            <div className="mb-3 space-y-2">
              {pieza.comentarios.length === 0 && <p className="text-[12px] text-ink-mute">Sin comentarios todavía.</p>}
              {pieza.comentarios.map((c, i) => (
                <div key={i} className="rounded-lg bg-[var(--sf-1)] p-2.5 ring-1 ring-[var(--ln-1)]">
                  <div className="text-[11px] font-semibold text-ink">{c.autor} <span className="font-normal text-ink-mute">· {c.fecha}</span></div>
                  <div className="text-[12.5px] text-ink-soft">{c.texto}</div>
                </div>
              ))}
            </div>
            <div className="mb-4 flex gap-2">
              <input value={txt} onChange={(e) => setTxt(e.target.value)} placeholder="Dejar un comentario…" className="flex-1 rounded-lg bg-[var(--sf-1)] px-3 py-2 text-[12.5px] text-ink outline-none ring-1 ring-[var(--ln-1)] placeholder:text-ink-mute focus:ring-cyan/40" />
              <button onClick={() => { if (txt.trim()) { comentarPieza(pieza.id, { autor: "José Ignacio", texto: txt.trim(), fecha: "2026-06-30" }); setTxt(""); } }}
                className="grid h-9 w-9 place-items-center rounded-lg bg-cyan text-content-inverted hover:opacity-90"><Send size={15} /></button>
            </div>

            {/* acciones */}
            <div className="mt-auto space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setEstado("Descartado")} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--sf-2)] py-2.5 text-[12.5px] font-semibold text-ink-soft ring-1 ring-[var(--ln-1)] hover:bg-negative/15 hover:text-negative"><X size={15} /> Descartar</button>
                <button onClick={() => setEstado("Cambios")} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--sf-2)] py-2.5 text-[12.5px] font-semibold text-ink-soft ring-1 ring-[var(--ln-1)] hover:bg-cyan/15 hover:text-cyan"><RotateCcw size={15} /> Cambios</button>
                <button onClick={() => setEstado("Aprobado")} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-lime py-2.5 text-[12.5px] font-bold text-content-inverted hover:opacity-90"><Check size={15} /> Aprobar</button>
              </div>
              <div className="flex gap-2">
                <label className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[var(--sf-1)] py-2 text-[12px] font-semibold text-ink-soft ring-1 ring-[var(--ln-1)] hover:bg-[var(--hov)]">
                  <Upload size={14} /> Subir nueva versión
                  <input type="file" accept="image/*" className="hidden" onChange={nuevaVersion} />
                </label>
                <button onClick={() => { removePieza(pieza.id); onClose(); }} title="Eliminar" className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--sf-1)] text-ink-mute ring-1 ring-[var(--ln-1)] hover:bg-negative/15 hover:text-negative"><Trash2 size={15} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= Modal Crear con IA ================= */
function CrearIAModal({ medio, onClose, onGenerar }: { medio: Medio; onClose: () => void; onGenerar: (piezas: Omit<Pieza, "id">[]) => void }) {
  const [prompt, setPrompt] = useState("");
  const [estilo, setEstilo] = useState<string>(ESTILOS[0]);
  const [cantidad, setCantidad] = useState(4);
  const [generando, setGenerando] = useState(false);

  const generar = () => {
    setGenerando(true);
    const base = prompt.trim() || cliente.campania;
    const formatos = FORMATOS[medio];
    const imgs = cliente.marca === "EstelarBet" ? PIEZA_TEST_IMGS : [];
    const out: Omit<Pieza, "id">[] = Array.from({ length: cantidad }, (_, i) => ({
      titulo: `${base} · ${estilo} ${i + 1}`,
      medio,
      formato: formatos[i % formatos.length],
      plataforma: medio === "RRSS" ? (["Instagram", "TikTok", "X"] as const)[i % 3] : undefined,
      autor: "Estudio IA",
      avatar: ["✨", "🎨", "🪄", "🌀", "💫", "🔮"][i % 6],
      version: 1,
      estado: "Pendiente",
      descripcion: `Generada con IA · estilo ${estilo}. Prompt: “${base}”.`,
      comentarios: [],
      fecha: "2026-06-30",
      generadaIA: true,
      img: imgs.length ? imgs[(i + 2) % imgs.length] : undefined,
    }));
    // pequeña espera para simular generación, luego entra al deck
    setTimeout(() => { onGenerar(out); setGenerando(false); onClose(); }, 850);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/72 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-[var(--modal)] p-6 ring-1 ring-[var(--ln-1)]" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan/15 text-cyan ring-1 ring-cyan/25"><Wand2 size={18} /></span>
          <div>
            <h3 className="font-display text-[18px] font-bold text-ink">Crear gráficas con IA</h3>
            <p className="text-[11.5px] text-ink-mute">{MEDIO_LABEL[medio]} · las candidatas entran al deck para aprobar</p>
          </div>
        </div>

        <label className="mt-4 block text-[12px] font-semibold text-ink-soft">Prompt</label>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3}
          placeholder={`Ej: “${cliente.campania}, paleta de marca, claim potente, mood ${medio === "OOH" ? "vía pública" : "energético"}”`}
          className="mt-1 w-full resize-none rounded-xl bg-[var(--sf-1)] p-3 text-[13px] text-ink outline-none ring-1 ring-[var(--ln-1)] placeholder:text-ink-mute focus:ring-cyan/40" />

        <label className="mt-4 block text-[12px] font-semibold text-ink-soft">Estilo</label>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {ESTILOS.map((s) => (
            <button key={s} onClick={() => setEstilo(s)} className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold ring-1 ${estilo === s ? "bg-cyan text-content-inverted ring-cyan" : "bg-[var(--sf-1)] text-ink-soft ring-[var(--ln-1)] hover:bg-[var(--hov)]"}`}>{s}</button>
          ))}
        </div>

        <label className="mt-4 block text-[12px] font-semibold text-ink-soft">Cantidad: {cantidad}</label>
        <input type="range" min={2} max={6} value={cantidad} onChange={(e) => setCantidad(+e.target.value)} className="mt-1 w-full accent-[var(--color-cyan)]" />

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl bg-[var(--sf-1)] px-4 py-2 text-[13px] font-semibold text-ink-soft ring-1 ring-[var(--ln-1)] hover:bg-[var(--hov)]">Cancelar</button>
          <button onClick={generar} disabled={generando} className="inline-flex items-center gap-2 rounded-xl bg-cyan px-4 py-2 text-[13px] font-bold text-content-inverted hover:opacity-90 disabled:opacity-60">
            {generando ? <><Sparkles size={15} className="animate-pulse" /> Generando…</> : <><Wand2 size={15} /> Generar {cantidad}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= Pantalla ================= */
export function Aprobacion() {
  const { piezas, addPieza, updatePieza } = useCentro();
  const [medio, setMedio] = useState<Medio>("RRSS");
  const [vista, setVista] = useState<"deck" | "tablero">("deck");
  const [detalle, setDetalle] = useState<Pieza | null>(null);
  const [crearIA, setCrearIA] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);

  const delMedio = useMemo(() => piezas.filter((p) => p.medio === medio), [piezas, medio]);
  const pendientes = delMedio.filter((p) => p.estado === "Pendiente");
  const top = pendientes[0];

  const flash = (m: string) => { setBanner(m); setTimeout(() => setBanner(null), 2600); };
  const resolver = (p: Pieza, estado: EstadoPieza) => {
    updatePieza(p.id, { estado });
    if (estado === "Aprobado") flash(medio === "RRSS" ? "Aprobada · lista para agendar en Calendario" : "Pieza aprobada");
    else if (estado === "Descartado") flash("Idea descartada");
    else flash("Devuelta con cambios");
  };

  const conteo = (e: EstadoPieza) => delMedio.filter((p) => p.estado === e).length;

  return (
    <Wrap>
      <PageHeader
        icon={<Layers size={24} />}
        titulo="Producción"
        subtitulo={<><span>{cliente.campania}</span><span className="text-ink-mute">·</span><span>{MEDIO_LABEL[medio]}</span><Chip>{pendientes.length} por revisar</Chip></>}
        right={
          <>
            <div className="flex rounded-xl bg-[var(--sf-1)] p-1 ring-1 ring-[var(--ln-1)]">
              <button onClick={() => setVista("deck")} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold ${vista === "deck" ? "bg-cyan text-content-inverted" : "text-ink-soft hover:text-ink"}`}><Layers size={14} /> Deck</button>
              <button onClick={() => setVista("tablero")} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold ${vista === "tablero" ? "bg-cyan text-content-inverted" : "text-ink-soft hover:text-ink"}`}><LayoutGrid size={14} /> Tablero</button>
            </div>
            <button onClick={() => setCrearIA(true)} className="inline-flex items-center gap-2 rounded-xl bg-cyan px-3.5 py-2 text-[13px] font-bold text-content-inverted hover:opacity-90"><Wand2 size={15} /> Crear con IA</button>
          </>
        }
      />

      {/* filtro por medio */}
      <div className="mb-5 flex flex-wrap gap-2">
        {MEDIOS.map((m) => {
          const n = piezas.filter((p) => p.medio === m && p.estado === "Pendiente").length;
          const active = m === medio;
          return (
            <button key={m} onClick={() => setMedio(m)}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-[12.5px] font-semibold ring-1 transition ${active ? "bg-cyan text-content-inverted ring-cyan" : "bg-[var(--sf-1)] text-ink-soft ring-[var(--ln-1)] hover:bg-[var(--hov)]"}`}>
              {MEDIO_LABEL[m]}
              {n > 0 && <span className={`rounded-md px-1.5 text-[11px] ${active ? "bg-black/20 text-content-inverted" : "bg-[var(--sf-2)] text-ink"}`}>{n}</span>}
            </button>
          );
        })}
      </div>

      {/* banner ephemeral */}
      <AnimatePresence>
        {banner && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="mb-4 inline-flex items-center gap-2 rounded-xl bg-lime/12 px-3.5 py-2 text-[12.5px] font-semibold text-lime ring-1 ring-lime/25"><Sparkles size={14} /> {banner}</motion.div>
        )}
      </AnimatePresence>

      {vista === "deck" ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
          {/* deck */}
          <div>
            <div className="relative mx-auto h-[520px] w-full max-w-[400px]">
              {pendientes.length === 0 ? (
                <div className={`${card} grid h-full place-items-center p-8 text-center`}>
                  <div>
                    <Inbox size={40} className="mx-auto mb-3 text-ink-mute" />
                    <h3 className="font-display text-[17px] font-bold text-ink">Todo revisado</h3>
                    <p className="mt-1 text-[12.5px] text-ink-mute">No quedan piezas pendientes en {MEDIO_LABEL[medio]}.</p>
                    <button onClick={() => setCrearIA(true)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-cyan px-3.5 py-2 text-[12.5px] font-bold text-content-inverted hover:opacity-90"><Wand2 size={14} /> Generar ideas</button>
                  </div>
                </div>
              ) : (
                <>
                  {/* cartas apiladas (fondo) */}
                  {pendientes.slice(1, 3).map((p, i) => (
                    <div key={p.id} className={`${card} absolute inset-0 ring-1 ring-[var(--ln-1)]`} style={{ transform: `translateY(${(i + 1) * 10}px) scale(${1 - (i + 1) * 0.035})`, opacity: 0.5 - i * 0.2, zIndex: 1 }}>
                      <PiezaThumb p={p} big />
                    </div>
                  ))}
                  <AnimatePresence>
                    {top && (
                      <motion.div key={top.id} className="absolute inset-0 z-10"
                        initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        exit={{ x: 0, opacity: 0, scale: 0.9, transition: { duration: 0.18 } }}>
                        <DeckCard p={top} drag
                          onAprobar={() => resolver(top, "Aprobado")}
                          onDescartar={() => resolver(top, "Descartado")}
                          onCambios={() => resolver(top, "Cambios")}
                          onOpen={() => setDetalle(top)} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>

            {/* botones de acción */}
            {top && (
              <div className="mt-5 flex items-center justify-center gap-4">
                <button onClick={() => resolver(top, "Descartado")} title="Descartar" className="grid h-14 w-14 place-items-center rounded-full bg-[var(--sf-1)] text-negative ring-1 ring-[var(--ln-1)] transition hover:scale-105 hover:bg-negative/15"><X size={24} /></button>
                <button onClick={() => resolver(top, "Cambios")} title="Pedir cambios" className="grid h-12 w-12 place-items-center rounded-full bg-[var(--sf-1)] text-cyan ring-1 ring-[var(--ln-1)] transition hover:scale-105 hover:bg-cyan/15"><RotateCcw size={20} /></button>
                <button onClick={() => resolver(top, "Aprobado")} title="Aprobar" className="grid h-14 w-14 place-items-center rounded-full bg-lime/15 text-lime ring-1 ring-lime/30 transition hover:scale-105 hover:bg-lime/25"><Check size={24} /></button>
              </div>
            )}
            <p className="mt-3 text-center text-[11.5px] text-ink-mute">Arrastrá la carta · derecha aprueba, izquierda descarta, arriba pide cambios</p>
          </div>

          {/* resumen lateral */}
          <div className="space-y-3">
            <div className={`${card} p-5`}>
              <h3 className="mb-3 text-[14px] font-bold text-ink">Estado de {MEDIO_LABEL[medio]}</h3>
              <div className="grid grid-cols-2 gap-3">
                {ESTADOS_PIEZA.map((e) => (
                  <div key={e} className="rounded-xl bg-[var(--sf-1)] p-3 ring-1 ring-[var(--ln-1)]">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: EST_META[e].dot }} />
                      <span className="text-[12px] text-ink-soft">{e}</span>
                    </div>
                    <div className="mt-1 font-display text-[24px] font-bold tabular-nums text-ink">{conteo(e)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className={`${card} p-5`}>
              <div className="flex items-center gap-2 text-[12.5px] text-ink-soft"><Sparkles size={15} className="text-cyan" /> Swipeá las ideas como en Tinder o usá <b className="text-ink">Crear con IA</b> para generar nuevas candidatas.</div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= Tablero ================= */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {ESTADOS_PIEZA.map((e) => {
            const items = delMedio.filter((p) => p.estado === e);
            return (
              <div key={e} className="rounded-2xl bg-[var(--sf-1)] p-3 ring-1 ring-[var(--ln-1)]">
                <div className="mb-3 flex items-center justify-between px-1">
                  <span className="inline-flex items-center gap-2 text-[13px] font-bold text-ink"><span className="h-2.5 w-2.5 rounded-full" style={{ background: EST_META[e].dot }} /> {e}</span>
                  <span className="rounded-md bg-[var(--sf-2)] px-1.5 py-0.5 text-[11px] font-semibold text-ink-soft">{items.length}</span>
                </div>
                <div className="space-y-2.5">
                  <AnimatePresence>
                    {items.map((p) => (
                      <motion.button layout key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        onClick={() => setDetalle(p)} className="group block w-full overflow-hidden rounded-xl text-left ring-1 ring-[var(--ln-1)] hover:ring-white/25">
                        <div className="relative h-28">
                          <PiezaThumb p={p} />
                          <div className="absolute bottom-2 left-2 right-2 z-10"><MetaRow p={p} /></div>
                        </div>
                        <div className="bg-[var(--sf-1)] p-2.5">
                          <div className="truncate text-[12.5px] font-semibold text-ink">{p.titulo}</div>
                          <div className="mt-0.5 flex items-center justify-between text-[10.5px] text-ink-mute">
                            <span className="truncate">{p.autor}</span>
                            {p.comentarios.length > 0 && <span className="inline-flex items-center gap-1"><MessageSquare size={10} /> {p.comentarios.length}</span>}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                  {items.length === 0 && <div className="grid h-20 place-items-center rounded-xl text-[11.5px] text-ink-mute ring-1 ring-dashed ring-[var(--ln-1)]"><ImageOff size={16} /></div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {detalle && <DetalleModal pieza={detalle} onClose={() => setDetalle(null)} />}
      {crearIA && <CrearIAModal medio={medio} onClose={() => setCrearIA(false)} onGenerar={(arr) => { arr.forEach(addPieza); flash(`${arr.length} ideas generadas · al deck`); setVista("deck"); }} />}
    </Wrap>
  );
}
