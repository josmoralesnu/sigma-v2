import { useMemo, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";
import {
  Rows3, GalleryHorizontalEnd, Heart, X, Check, Search, ArrowUpDown, MapPin,
  Sparkles, Undo2, Send, ShieldCheck, Lock, ChevronDown, Clock,
} from "lucide-react";
import { Wrap, PageHeader, container, item } from "../centro/parts";
import { usePuig } from "./store";
import { SubLogo, SubTile } from "./brand";
import {
  candidatosDe, generoPrincipal, fmtK, pcampañas, submarcas, submarcaById,
  type Casting as C, type Zona,
} from "./pdata";

type SortKey = "fit" | "seguidores" | "engagement";

export function Casting({ campId, onCampChange }: { campId: string; onCampChange: (id: string) => void }) {
  const puig = usePuig();
  const camp = pcampañas.find((c) => c.id === campId) ?? pcampañas[0];
  const rec = puig.get(camp.id);
  const sub = submarcaById(camp.submarca)!;
  const editable = rec.estado === "borrador";

  const [mode, setMode] = useState<"tabla" | "tinder">("tabla");
  const [zona, setZona] = useState<"todas" | Zona>("todas");
  const [q, setQ] = useState("");

  const selSet = useMemo(() => new Set(rec.seleccion), [rec.seleccion]);
  const pool = useMemo(
    () =>
      candidatosDe(camp.id).filter(
        (c) =>
          (zona === "todas" || c.zona === zona) &&
          (q.trim() === "" || c.nombre.toLowerCase().includes(q.toLowerCase()) || c.handle.toLowerCase().includes(q.toLowerCase()) || c.categoria.toLowerCase().includes(q.toLowerCase()))
      ),
    [camp.id, zona, q]
  );
  const seleccionados = candidatosDe(camp.id).filter((c) => selSet.has(c.id));

  return (
    <Wrap>
      <PageHeader
        icon={<span className="text-cyan">✦</span>}
        titulo="Casting"
        subtitulo={
          <>
            <span>Perfiles que proponemos al cliente</span>
            <span className="text-content-muted">·</span>
            <span className="font-semibold text-cyan">{rec.seleccion.length} seleccionados</span>
          </>
        }
        right={editable ? (
          <div className="flex items-center gap-1 rounded-xl bg-[var(--sf-1)] p-1 ring-1 ring-[var(--ln-1)]">
            <TabBtn active={mode === "tabla"} onClick={() => setMode("tabla")} icon={<Rows3 size={15} />} label="Tabla" />
            <TabBtn active={mode === "tinder"} onClick={() => setMode("tinder")} icon={<GalleryHorizontalEnd size={15} />} label="Tinder" />
          </div>
        ) : undefined}
      />

      {/* selector de campaña */}
      <CampPicker campId={camp.id} onChange={onCampChange} />

      {/* barra de estado del flujo agencia ↔ cliente */}
      <StatusBar
        estado={rec.estado}
        n={rec.seleccion.length}
        onEnviar={() => puig.enviar(camp.id)}
        onConfirmar={() => puig.confirmar(camp.id)}
        onReabrir={() => puig.reabrir(camp.id)}
      />

      {editable ? (
        <>
          {/* filtros */}
          <div className="mb-5 flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 rounded-xl bg-[var(--sf-1)] px-3 py-2 ring-1 ring-[var(--ln-1)]">
              <Search size={15} className="text-content-muted" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar nombre, @handle o categoría"
                className="w-56 bg-transparent text-[13px] text-content placeholder:text-content-muted focus:outline-none" />
            </div>
            <div className="flex items-center gap-1 rounded-xl bg-[var(--sf-1)] p-1 ring-1 ring-[var(--ln-1)]">
              {(["todas", "RM", "Regiones"] as const).map((z) => (
                <button key={z} onClick={() => setZona(z)}
                  className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-colors ${zona === z ? "bg-cyan text-content-inverted" : "text-content-secondary hover:text-content"}`}>
                  {z === "todas" ? "Todas" : z}
                </button>
              ))}
            </div>
          </div>

          {mode === "tabla" ? (
            <Tabla pool={pool} sel={selSet} toggle={(id) => puig.toggle(camp.id, id)} />
          ) : (
            <Tinder pool={pool} sel={selSet} onSelect={(id) => { if (!selSet.has(id)) puig.toggle(camp.id, id); }} />
          )}
        </>
      ) : (
        <RosterConfirmado profiles={seleccionados} confirmado={rec.estado === "confirmado"} tint={sub.tint} />
      )}
    </Wrap>
  );
}

/* ---------- selector de campaña (por submarca · castings abiertos) ---------- */
const CAST_CHIP: Record<"borrador" | "enviado" | "confirmado", { label: string; tint: string }> = {
  borrador: { label: "Casting abierto", tint: "#c9a24b" },
  enviado: { label: "Enviado", tint: "#d99a4e" },
  confirmado: { label: "Confirmado", tint: "#86b04a" },
};
function CampPicker({ campId, onChange }: { campId: string; onChange: (id: string) => void }) {
  const puig = usePuig();
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const cur = pcampañas.find((c) => c.id === campId)!;
  const abierto = (id: string) => puig.get(id).estado !== "confirmado";
  const grupos = submarcas
    .map((s) => ({ s, camps: pcampañas.filter((c) => c.submarca === s.id && (showAll || abierto(c.id))) }))
    .filter((g) => g.camps.length > 0);
  const ocultos = pcampañas.length - grupos.reduce((a, g) => a + g.camps.length, 0);

  return (
    <div className="relative mb-4 inline-block">
      <button onClick={() => setOpen((o) => !o)} className="glass glass-hover flex items-center gap-2.5 rounded-xl px-3.5 py-2.5">
        <SubTile id={cur.submarca} size={30} className="!rounded-lg" />
        <span className="text-left leading-tight">
          <span className="block text-[10px] uppercase tracking-wide text-content-muted">Casting de la campaña</span>
          <span className="block text-[13.5px] font-semibold text-content">{cur.nombre}</span>
        </span>
        <ChevronDown size={16} className="text-content-muted" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-30 mt-1.5 max-h-[70vh] w-[360px] overflow-y-auto scroll-slim rounded-xl bg-[var(--modal)] p-1.5 shadow-2xl ring-1 ring-[var(--ln-1)]">
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-content-muted">Por submarca</span>
            <button onClick={() => setShowAll((v) => !v)} className="text-[11px] font-semibold text-cyan hover:underline">
              {showAll ? "Solo castings abiertos" : `Ver terminados${ocultos ? ` (${ocultos})` : ""}`}
            </button>
          </div>
          {grupos.map((g) => (
            <div key={g.s.id} className="mb-1">
              <div className="flex items-center gap-2 px-2 py-1.5">
                <SubLogo id={g.s.id} w={78} h={24} />
                <span className="text-[11px] font-semibold text-content-secondary">{g.s.nombre}</span>
              </div>
              {g.camps.map((c) => {
                const chip = CAST_CHIP[puig.get(c.id).estado];
                return (
                  <button key={c.id} onClick={() => { onChange(c.id); setOpen(false); }}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-[var(--hov)] ${c.id === campId ? "bg-[var(--sf-1)]" : ""}`}>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] font-semibold text-content">{c.nombre}</span>
                      <span className="mt-0.5 inline-flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9.5px] font-bold" style={{ background: `${chip.tint}1e`, color: chip.tint }}>
                          <span className="h-1 w-1 rounded-full" style={{ background: chip.tint }} /> {chip.label}
                        </span>
                        <span className="text-[10.5px] text-content-muted">{c.estado}</span>
                      </span>
                    </span>
                    {c.id === campId && <Check size={15} className="text-cyan" />}
                  </button>
                );
              })}
            </div>
          ))}
          {grupos.length === 0 && <div className="px-3 py-4 text-center text-[12px] text-content-muted">Sin castings abiertos.</div>}
        </div>
      )}
    </div>
  );
}

/* ---------- barra de estado del flujo ---------- */
function StatusBar({ estado, n, onEnviar, onConfirmar, onReabrir }: {
  estado: "borrador" | "enviado" | "confirmado"; n: number;
  onEnviar: () => void; onConfirmar: () => void; onReabrir: () => void;
}) {
  if (estado === "borrador")
    return (
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan/25 bg-cyan/8 px-4 py-3">
        <div className="flex items-center gap-2.5 text-[12.5px] text-content-secondary">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan/15 text-cyan"><Send size={15} /></span>
          El cliente elige los perfiles. Al <b className="text-content">enviar la selección</b>, la agencia (WK) la confirma y esos perfiles quedan en la campaña.
        </div>
        <button onClick={onEnviar} disabled={n === 0}
          className="inline-flex items-center gap-1.5 rounded-xl bg-cyan px-4 py-2.5 text-[13px] font-semibold text-content-inverted transition-transform enabled:hover:scale-[1.02] disabled:opacity-40">
          <Send size={15} /> Enviar selección{n > 0 ? ` (${n})` : ""}
        </button>
      </div>
    );
  if (estado === "enviado")
    return (
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber/30 bg-amber/8 px-4 py-3">
        <div className="flex items-center gap-2.5 text-[12.5px] text-content-secondary">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber/15 text-amber"><Clock size={15} /></span>
          <span><b className="text-content">Selección enviada a Waller & Kluger</b> — {n} perfiles · esperando confirmación de la agencia.</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onReabrir} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12.5px] font-medium text-content-secondary transition-colors hover:bg-[var(--hov)] hover:text-content"><Undo2 size={14} /> Editar</button>
          <button onClick={onConfirmar} className="inline-flex items-center gap-1.5 rounded-xl bg-lime/90 px-3.5 py-2 text-[12.5px] font-semibold text-[#0a0a0c] transition-transform hover:scale-[1.02]"><ShieldCheck size={15} /> Confirmar selección · vista agencia</button>
        </div>
      </div>
    );
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-lime/30 bg-lime/8 px-4 py-3">
      <div className="flex items-center gap-2.5 text-[12.5px] text-content-secondary">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-lime/15 text-lime"><Check size={16} /></span>
        <span><b className="text-content">Selección confirmada</b> — {n} perfiles quedaron en la campaña.</span>
      </div>
      <button onClick={onReabrir} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12.5px] font-medium text-content-secondary transition-colors hover:bg-[var(--hov)] hover:text-content"><Undo2 size={14} /> Reabrir selección</button>
    </div>
  );
}

/* ---------- roster confirmado (enviado/confirmado) ---------- */
function RosterConfirmado({ profiles, confirmado, tint }: { profiles: C[]; confirmado: boolean; tint: string }) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
      {profiles.map((c) => {
        const g = generoPrincipal(c);
        return (
          <motion.div key={c.id} variants={item} className="glass relative rounded-2xl p-4">
            <span className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9.5px] font-bold ${confirmado ? "bg-lime/15 text-lime" : "bg-amber/15 text-amber"}`}>
              {confirmado ? <Check size={11} /> : <Lock size={10} />} {confirmado ? "En campaña" : "Enviado"}
            </span>
            <div className="flex items-center gap-2.5">
              <span className="grid h-11 w-11 place-items-center rounded-full text-[22px] ring-1 ring-[var(--ln-2)]" style={{ background: `${c.fotoTint}2e` }}>{c.avatar}</span>
              <div className="min-w-0"><div className="truncate text-[13px] font-semibold text-content">{c.nombre}</div><div className="truncate text-[11.5px]" style={{ color: tint }}>{c.handle}</div></div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-1.5 text-[11px]">
              <Mini label="Seguidores" value={fmtK(c.seguidores)} />
              <Mini label="Engagement" value={`${c.engagement}%`} />
              <Mini label="Audiencia" value={c.edadAudiencia} />
              <Mini label="Género" value={`${g.label.slice(0, 3)} ${g.pct}%`} />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
function Mini({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-[var(--sf-1)] px-2 py-1"><div className="text-[9px] uppercase tracking-wide text-content-muted">{label}</div><div className="text-[12px] font-bold text-content">{value}</div></div>;
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${active ? "bg-cyan text-content-inverted" : "text-content-secondary hover:text-content"}`}>
      {icon} {label}
    </button>
  );
}

/* ============================ TABLA ============================ */
function Tabla({ pool, sel, toggle }: { pool: C[]; sel: Set<string>; toggle: (id: string) => void }) {
  const [sort, setSort] = useState<SortKey>("fit");
  const [dir, setDir] = useState<"asc" | "desc">("desc");
  const rows = useMemo(() => {
    const r = [...pool].sort((a, b) => (a[sort] as number) - (b[sort] as number));
    return dir === "desc" ? r.reverse() : r;
  }, [pool, sort, dir]);
  const setS = (k: SortKey) => { if (k === sort) setDir((d) => (d === "asc" ? "desc" : "asc")); else { setSort(k); setDir("desc"); } };

  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="overflow-x-auto scroll-slim">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line text-[11px] uppercase tracking-wide text-content-muted">
              <Th className="w-12 text-center">Sel.</Th>
              <Th>Influencer</Th>
              <SortTh label="Seguidores" active={sort === "seguidores"} dir={dir} onClick={() => setS("seguidores")} />
              <SortTh label="Engagement" active={sort === "engagement"} dir={dir} onClick={() => setS("engagement")} />
              <Th>Edad audiencia</Th>
              <Th>Género principal</Th>
              <Th>Categoría</Th>
              <SortTh label="Fit" active={sort === "fit"} dir={dir} onClick={() => setS("fit")} />
            </tr>
          </thead>
          <motion.tbody variants={container} initial="hidden" animate="show">
            {rows.map((c) => {
              const on = sel.has(c.id);
              const g = generoPrincipal(c);
              return (
                <motion.tr key={c.id} variants={item} onClick={() => toggle(c.id)}
                  className={`cursor-pointer border-b border-line/60 transition-colors ${on ? "bg-cyan/8" : "hover:bg-[var(--hov)]"}`}>
                  <td className="py-3 text-center">
                    <span className={`inline-grid h-5 w-5 place-items-center rounded-md border transition-colors ${on ? "border-cyan bg-cyan text-content-inverted" : "border-white/25"}`}>
                      {on && <Check size={13} strokeWidth={3} />}
                    </span>
                  </td>
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar c={c} size={34} />
                      <div className="leading-tight"><div className="text-[13px] font-semibold text-content">{c.nombre}</div><div className="text-[11.5px] text-content-muted">{c.handle}</div></div>
                    </div>
                  </td>
                  <Td className="font-semibold text-content">{fmtK(c.seguidores)}</Td>
                  <Td><span className="font-semibold text-content">{c.engagement.toFixed(1)}%</span></Td>
                  <Td>{c.edadAudiencia}</Td>
                  <Td><span className="text-content">{g.label}</span><span className="ml-1 text-content-muted">{g.pct}%</span></Td>
                  <Td><span className="rounded-md bg-[var(--sf-1)] px-2 py-0.5 text-[11.5px] text-content-secondary ring-1 ring-[var(--ln-1)]">{c.categoria}</span></Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-14 overflow-hidden rounded-full bg-[var(--sf-2)]"><div className="h-full rounded-full bg-cyan" style={{ width: `${c.fit}%` }} /></div>
                      <span className="font-semibold text-content">{c.fit}</span>
                    </div>
                  </Td>
                </motion.tr>
              );
            })}
          </motion.tbody>
        </table>
      </div>
      {rows.length === 0 && <div className="py-12 text-center text-[13px] text-content-muted">Sin resultados para este filtro.</div>}
    </div>
  );
}

const Th = ({ children, className = "" }: { children?: React.ReactNode; className?: string }) => <th className={`px-3 py-3 font-semibold ${className}`}>{children}</th>;
const Td = ({ children, className = "" }: { children?: React.ReactNode; className?: string }) => <td className={`px-3 py-3 text-[12.5px] text-content-secondary ${className}`}>{children}</td>;
function SortTh({ label, active, dir, onClick }: { label: string; active: boolean; dir: "asc" | "desc"; onClick: () => void }) {
  return (
    <th className="px-3 py-3 font-semibold">
      <button onClick={onClick} className={`inline-flex items-center gap-1 transition-colors ${active ? "text-cyan" : "hover:text-content"}`}>
        {label}<ArrowUpDown size={12} className={active ? "opacity-100" : "opacity-40"} />{active && <span className="text-[9px]">{dir === "desc" ? "▼" : "▲"}</span>}
      </button>
    </th>
  );
}
function Avatar({ c, size }: { c: C; size: number }) {
  return <span className="grid shrink-0 place-items-center rounded-full ring-1 ring-[var(--ln-2)]" style={{ width: size, height: size, background: `${c.fotoTint}2e`, fontSize: size * 0.5 }}>{c.avatar}</span>;
}

/* ============================ TINDER ============================ */
function Tinder({ pool, sel, onSelect }: { pool: C[]; sel: Set<string>; onSelect: (id: string) => void }) {
  const [i, setI] = useState(0);
  const [passed, setPassed] = useState(0);
  const deck = pool;
  const done = i >= deck.length;
  const advance = (id: string, take: boolean) => { if (take) onSelect(id); else setPassed((p) => p + 1); setI((n) => n + 1); };

  if (deck.length === 0) return <div className="glass rounded-2xl py-16 text-center text-[13px] text-content-muted">Sin candidatos para este filtro.</div>;

  return (
    <div className="flex flex-col items-center">
      <p className="mb-4 text-[12.5px] text-content-muted">Desliza <span className="font-semibold text-lime">a la derecha para seleccionar</span> · <span className="font-semibold text-content-secondary">a la izquierda para pasar</span></p>
      <div className="relative h-[440px] w-[340px]">
        {done ? (
          <ResumenDeck total={deck.length} sel={sel.size} passed={passed} onReset={() => { setI(0); setPassed(0); }} />
        ) : (
          <AnimatePresence>
            {deck.slice(i, i + 3).reverse().map((c, idx, arr) => {
              const depth = arr.length - 1 - idx;
              if (depth === 0) return <TinderCard key={c.id} c={c} onDecide={(take) => advance(c.id, take)} />;
              return <div key={c.id} className="glass absolute inset-0 rounded-3xl" style={{ transform: `scale(${1 - depth * 0.05}) translateY(${depth * 14}px)`, opacity: 1 - depth * 0.25, zIndex: 10 - depth }} />;
            })}
          </AnimatePresence>
        )}
      </div>
      {!done && (
        <div className="mt-5 flex items-center gap-4">
          <DeckBtn tone="pass" onClick={() => advance(deck[i].id, false)}><X size={22} strokeWidth={2.5} /></DeckBtn>
          <span className="w-16 text-center text-[12px] font-medium text-content-muted">{i + 1} / {deck.length}</span>
          <DeckBtn tone="take" onClick={() => advance(deck[i].id, true)}><Heart size={20} strokeWidth={2.5} /></DeckBtn>
        </div>
      )}
    </div>
  );
}
function DeckBtn({ tone, onClick, children }: { tone: "pass" | "take"; onClick: () => void; children: React.ReactNode }) {
  const cls = tone === "take" ? "border-lime/40 bg-lime/15 text-lime hover:bg-lime/25" : "border-[var(--ln-1)] bg-[var(--sf-1)] text-content-secondary hover:bg-[var(--hov)]";
  return <button onClick={onClick} className={`grid h-14 w-14 place-items-center rounded-full border transition-colors ${cls}`}>{children}</button>;
}
function TinderCard({ c, onDecide }: { c: C; onDecide: (take: boolean) => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-14, 14]);
  const likeOp = useTransform(x, [30, 150], [0, 1]);
  const nopeOp = useTransform(x, [-150, -30], [1, 0]);
  const g = generoPrincipal(c);
  return (
    <motion.div className="glass-strong absolute inset-0 cursor-grab overflow-hidden rounded-3xl active:cursor-grabbing" style={{ x, rotate, zIndex: 20 }}
      drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.7}
      onDragEnd={(_, info) => { if (info.offset.x > 130) onDecide(true); else if (info.offset.x < -130) onDecide(false); }}
      initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="relative flex h-[190px] items-center justify-center overflow-hidden" style={{ background: `radial-gradient(120% 120% at 50% 0%, ${c.fotoTint}55, transparent 70%)` }}>
        <span className="grid h-28 w-28 place-items-center rounded-full ring-2 ring-white/20" style={{ background: `${c.fotoTint}33`, fontSize: 56 }}>{c.avatar}</span>
        <motion.span style={{ opacity: likeOp }} className="absolute left-4 top-4 rotate-[-12deg] rounded-lg border-2 border-lime px-2.5 py-1 text-[15px] font-extrabold uppercase tracking-wide text-lime">Seleccionar</motion.span>
        <motion.span style={{ opacity: nopeOp }} className="absolute right-4 top-4 rotate-[12deg] rounded-lg border-2 border-white/60 px-2.5 py-1 text-[15px] font-extrabold uppercase tracking-wide text-white/80">Pasar</motion.span>
        <div className="absolute right-3 bottom-3 grid h-12 w-12 place-items-center rounded-full bg-black/40 text-center ring-1 ring-white/20 backdrop-blur">
          <span className="text-[15px] font-bold leading-none text-cyan">{c.fit}</span><span className="text-[7.5px] uppercase tracking-wide text-content-muted">fit</span>
        </div>
      </div>
      <div className="px-5 pt-4">
        <div className="flex items-baseline justify-between">
          <h3 className="font-display text-[20px] font-bold text-content">{c.nombre}</h3>
          <span className="inline-flex items-center gap-1 text-[11.5px] text-content-muted"><MapPin size={12} /> {c.ciudad}</span>
        </div>
        <p className="text-[13px] text-cyan">{c.handle}</p>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <Metric label="Seguidores" value={fmtK(c.seguidores)} />
          <Metric label="Engagement" value={`${c.engagement.toFixed(1)}%`} />
          <Metric label="Edad audiencia" value={c.edadAudiencia} />
          <Metric label="Género" value={`${g.label} ${g.pct}%`} />
        </div>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[var(--sf-1)] px-2.5 py-1 text-[11.5px] font-medium text-content-secondary ring-1 ring-[var(--ln-1)]"><Sparkles size={12} className="text-cyan" /> {c.categoria}</div>
      </div>
    </motion.div>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-[var(--sf-1)] px-3 py-2 ring-1 ring-[var(--ln-1)]"><div className="text-[10px] uppercase tracking-wide text-content-muted">{label}</div><div className="mt-0.5 text-[15px] font-bold text-content">{value}</div></div>;
}
function ResumenDeck({ total, sel, passed, onReset }: { total: number; sel: number; passed: number; onReset: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-strong absolute inset-0 grid place-items-center rounded-3xl p-8 text-center">
      <div>
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-cyan/15 text-cyan ring-1 ring-cyan/25"><Check size={30} /></div>
        <h3 className="font-display text-[22px] font-bold text-content">Casting revisado</h3>
        <p className="mt-1 text-[13px] text-content-muted">Recorriste los {total} candidatos. Envía tu selección desde arriba.</p>
        <div className="mt-5 flex items-center justify-center gap-6">
          <div><div className="text-[26px] font-bold text-cyan">{sel}</div><div className="text-[11px] uppercase tracking-wide text-content-muted">Seleccionados</div></div>
          <div className="h-10 w-px bg-line" />
          <div><div className="text-[26px] font-bold text-content-secondary">{passed}</div><div className="text-[11px] uppercase tracking-wide text-content-muted">Descartados</div></div>
        </div>
        <button onClick={onReset} className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-[var(--sf-2)] px-4 py-2 text-[12.5px] font-semibold text-content ring-1 ring-[var(--ln-1)] transition-colors hover:bg-[var(--hov)]"><Undo2 size={14} /> Volver a revisar</button>
      </div>
    </motion.div>
  );
}
