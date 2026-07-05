import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Users, TrendingUp, Eye, Heart, Bookmark, ImageIcon, DollarSign,
  Sparkles, MessageCircle, Camera, Music2, MonitorPlay, CalendarDays, Package,
  FileText, Plus, Clock, PackageOpen, Truck, Home, ChevronRight, Lightbulb, MapPin,
} from "lucide-react";
import { Wrap, container, item } from "../centro/parts";
import { SubLogo, tintVars } from "./brand";
import { usePuig } from "./store";
import {
  pcampañas, submarcaById, campañaPanel, campDespacho, seedDocs, candidatosDe, fmtK,
  ENVIO_META, type PCampaña, type Contenido, type SeriePunto, type EnvioEstado, type DocItem,
} from "./pdata";

const clp = (n: number) => "$" + (n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + "M" : n >= 1000 ? Math.round(n / 1000) + "K" : String(n));
const PLAT_ICON: Record<Contenido["plataforma"], any> = { Instagram: Camera, TikTok: Music2, Reel: MonitorPlay };

type Sec = "resumen" | "galeria" | "sentimiento" | "calendario" | "despachos" | "casting" | "documentos";
const SECS: { id: Sec; label: string; icon: any }[] = [
  { id: "resumen", label: "Resumen", icon: TrendingUp },
  { id: "galeria", label: "Galería", icon: ImageIcon },
  { id: "sentimiento", label: "Sentimiento", icon: MessageCircle },
  { id: "calendario", label: "Calendario", icon: CalendarDays },
  { id: "despachos", label: "Despachos", icon: Package },
  { id: "casting", label: "Casting presentado", icon: Users },
  { id: "documentos", label: "Documentos", icon: FileText },
];

export function CampañaDetalle({ campId, onBack, onCasting }: { campId: string; onBack: () => void; onCasting: () => void }) {
  const c = pcampañas.find((x) => x.id === campId) ?? pcampañas[0];
  const sub = submarcaById(c.submarca)!;
  const p = useMemo(() => campañaPanel(c), [c]);
  const [tab, setTab] = useState<Sec>("resumen");

  return (
    <Wrap>
      <div style={tintVars(sub.tint)}>
        {/* header */}
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <button onClick={onBack} className="mt-0.5 grid h-9 w-9 place-items-center rounded-xl bg-[var(--sf-1)] text-content-secondary ring-1 ring-[var(--ln-1)] transition-colors hover:bg-[var(--hov)] hover:text-content"><ArrowLeft size={17} /></button>
            <div>
              <SubLogo id={c.submarca} w={150} h={46} />
              <h1 className="mt-2 font-display text-[26px] font-bold leading-tight tracking-tight text-content">{c.nombre}</h1>
              <p className="text-[13px] text-content-muted">{c.producto} · {c.ventana} · {c.microinfluencers} microinfluencers</p>
            </div>
          </div>
          <button onClick={onCasting} className="inline-flex items-center gap-1.5 rounded-xl bg-cyan/12 px-3.5 py-2 text-[12.5px] font-semibold text-cyan ring-1 ring-cyan/25 transition-colors hover:bg-cyan/20"><Users size={14} /> Ver casting</button>
        </div>

        {!p.activo ? (
          <EnCasting c={c} onCasting={onCasting} />
        ) : (
          <>
            {/* navegación de secciones */}
            <div className="mb-5 flex flex-wrap gap-1.5 border-b border-line pb-3">
              {SECS.map((s) => {
                const on = tab === s.id;
                const Icon = s.icon;
                return (
                  <button key={s.id} onClick={() => setTab(s.id)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12.5px] font-semibold transition-colors ${on ? "bg-cyan text-content-inverted" : "text-content-secondary hover:bg-[var(--hov)] hover:text-content"}`}>
                    <Icon size={14} /> {s.label}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {tab === "resumen" && <SecResumen c={c} p={p} tint={sub.tint} goTab={setTab} />}
                {tab === "galeria" && <SecGaleria contenidos={p.contenidos} />}
                {tab === "sentimiento" && <SecSentimiento p={p} />}
                {tab === "calendario" && <SecCalendario contenidos={p.contenidos} />}
                {tab === "despachos" && <SecDespachos c={c} />}
                {tab === "casting" && <SecCasting c={c} onCasting={onCasting} />}
                {tab === "documentos" && <SecDocumentos c={c} />}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </Wrap>
  );
}

/* ============================ RESUMEN ============================ */
function SecResumen({ c, p, tint, goTab }: { c: PCampaña; p: ReturnType<typeof campañaPanel>; tint: string; goTab: (s: Sec) => void }) {
  return (
    <div>
      <motion.div variants={container} initial="hidden" animate="show" className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Kpi icon={<Eye size={15} />} label="Alcance" value={fmtK(p.kpis.alcance)} accent />
        <Kpi icon={<TrendingUp size={15} />} label="Impresiones" value={fmtK(p.kpis.impresiones)} />
        <Kpi icon={<Heart size={15} />} label="Engagement" value={`${p.kpis.engagement}%`} />
        <Kpi icon={<ImageIcon size={15} />} label="Contenidos" value={String(p.kpis.contenidos)} />
        <Kpi icon={<DollarSign size={15} />} label="EMV" value={clp(p.kpis.emv)} />
        <Kpi icon={<Bookmark size={15} />} label="Guardados" value={fmtK(p.kpis.guardados)} />
      </motion.div>

      <div className="mb-4 grid gap-3 lg:grid-cols-[1.5fr_1fr]">
        <Curva serie={p.serie} tint={tint} />
        <SentimientoResumen p={p} onVerMas={() => goTab("sentimiento")} />
      </div>

      <div className="mb-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-[17px] font-bold text-content"><ImageIcon size={17} className="text-cyan" /> Contenidos de la campaña</h2>
          <button onClick={() => goTab("galeria")} className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--sf-1)] px-3.5 py-2 text-[12.5px] font-semibold text-content-secondary ring-1 ring-[var(--ln-1)] transition-colors hover:bg-[var(--hov)] hover:text-content">Ver galería completa ({p.contenidos.length}) <ChevronRight size={13} /></button>
        </div>
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {p.contenidos.slice(0, 6).map((ct) => <ContenidoCard key={ct.id} c={ct} />)}
        </motion.div>
      </div>

      <TopCreators list={p.topCreators} onCasting={() => goTab("casting")} />
    </div>
  );
}

/* ---- estado en casting ---- */
function EnCasting({ c, onCasting }: { c: PCampaña; onCasting: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8 text-center">
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-cyan/15 text-cyan ring-1 ring-cyan/25"><Users size={30} /></div>
      <h2 className="font-display text-[22px] font-bold text-content">Campaña en casting</h2>
      <p className="mx-auto mt-1 max-w-md text-[13px] text-content-muted">Aún no hay resultados: estamos seleccionando el squad. Cuando el cliente confirme la selección, verás aquí las secciones de resultados.</p>
      <div className="mx-auto mt-5 max-w-sm">
        <div className="mb-1 flex justify-between text-[12px] text-content-muted"><span>Perfiles seleccionados</span><span className="font-semibold text-content">{c.seleccionados}/{c.microinfluencers}</span></div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--sf-2)]"><div className="h-full rounded-full bg-cyan" style={{ width: `${(c.seleccionados / c.microinfluencers) * 100}%` }} /></div>
      </div>
      <button onClick={onCasting} className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-cyan px-4 py-2.5 text-[13px] font-semibold text-content-inverted transition-transform hover:scale-[1.02]"><Users size={15} /> Ir al casting</button>
    </motion.div>
  );
}

function Kpi({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <motion.div variants={item} className={`glass rounded-2xl p-3.5 ${accent ? "ring-1 ring-cyan/30" : ""}`}>
      <div className="flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-wide text-content-muted">{icon}{label}</div>
      <div className={`mt-1.5 font-display text-[22px] font-bold leading-none ${accent ? "text-cyan" : "text-content"}`}>{value}</div>
    </motion.div>
  );
}

/* ---- curva interactiva ---- */
function Curva({ serie, tint }: { serie: SeriePunto[]; tint: string }) {
  const W = 520, H = 200, padX = 10, padY = 14;
  const [hi, setHi] = useState<number | null>(null);
  const max = Math.max(1, ...serie.map((s) => s.valor));
  const pts = serie.map((s, i) => [padX + (i / (serie.length - 1)) * (W - padX * 2), H - padY - (s.valor / max) * (H - padY * 2 - 6)] as const);
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${H - padY} L${pts[0][0].toFixed(1)},${H - padY} Z`;
  const active = hi != null ? serie[hi] : null;
  return (
    <motion.div variants={item} initial="hidden" animate="show" className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 font-display text-[15px] font-bold text-content"><TrendingUp size={15} className="text-cyan" /> Alcance acumulado</div>
          <div className="text-[11.5px] text-content-muted">Evolución semanal · pasa el cursor para ver el detalle</div>
        </div>
        {active && <div className="text-right"><div className="font-display text-[18px] font-bold text-cyan">{fmtK(active.valor)}</div><div className="text-[11px] text-content-muted">{active.fecha}</div></div>}
      </div>
      <div className="relative mt-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-[200px] w-full" onMouseLeave={() => setHi(null)}>
          <defs><linearGradient id="grad-curva" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={tint} stopOpacity="0.35" /><stop offset="100%" stopColor={tint} stopOpacity="0" /></linearGradient></defs>
          <motion.path d={area} fill="url(#grad-curva)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} />
          <motion.path d={line} fill="none" stroke={tint} strokeWidth={2.5} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: "easeOut" }} />
          {hi != null && <line x1={pts[hi][0]} y1={padY} x2={pts[hi][0]} y2={H - padY} stroke={tint} strokeOpacity={0.35} strokeDasharray="3 3" />}
          {pts.map((pt, i) => (
            <g key={i}>
              <circle cx={pt[0]} cy={pt[1]} r={hi === i ? 5 : i === pts.length - 1 ? 4 : 2.5} fill={tint} />
              <rect x={pt[0] - (W / serie.length) / 2} y={0} width={W / serie.length} height={H} fill="transparent" onMouseEnter={() => setHi(i)} />
            </g>
          ))}
        </svg>
        <div className="mt-1 flex justify-between px-1 text-[9.5px] text-content-muted">{serie.map((s, i) => <span key={i} className={hi === i ? "text-content" : ""}>{s.fecha}</span>)}</div>
      </div>
    </motion.div>
  );
}

/* ---- sentimiento resumen (con "ver más") ---- */
function SentimientoResumen({ p, onVerMas }: { p: ReturnType<typeof campañaPanel>; onVerMas: () => void }) {
  const s = p.sentimiento;
  const C = 2 * Math.PI * 34;
  return (
    <motion.div variants={item} initial="hidden" animate="show" className="glass flex flex-col rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-display text-[15px] font-bold text-content"><MessageCircle size={15} className="text-cyan" /> Sentimiento</div>
        <span className="text-[11px] text-content-muted">{fmtK(s.menciones)} menciones · <span className="font-semibold text-lime">+{s.tendencia}%</span></span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative grid place-items-center">
          <svg width="88" height="88" className="-rotate-90"><circle cx="44" cy="44" r="34" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="7" /><motion.circle cx="44" cy="44" r="34" fill="none" stroke="#86b04a" strokeWidth="7" strokeLinecap="round" strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - s.indice / 100) }} transition={{ duration: 1 }} /></svg>
          <div className="absolute text-center"><div className="font-display text-[22px] font-bold text-content">{s.indice}</div><div className="text-[9px] uppercase text-content-muted">índice</div></div>
        </div>
        <div className="flex-1 space-y-2">
          {[["Positivo", s.pos, "#86b04a"], ["Neutro", s.neu, "#c79a52"], ["Negativo", s.neg, "#e06a86"]].map(([l, v, col]) => (
            <div key={l as string}><div className="mb-0.5 flex justify-between text-[11px]"><span className="text-content-secondary">{l}</span><span className="font-semibold text-content">{v}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-[var(--sf-2)]"><motion.div className="h-full rounded-full" style={{ background: col as string }} initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.7 }} /></div></div>
          ))}
        </div>
      </div>
      <button onClick={onVerMas} className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--sf-1)] px-3 py-2 text-[12.5px] font-semibold text-cyan ring-1 ring-cyan/20 transition-colors hover:bg-cyan/15">
        Ver análisis de sentimiento <ChevronRight size={13} />
      </button>
    </motion.div>
  );
}

/* ============================ SENTIMIENTO (expandido) ============================ */
function SecSentimiento({ p }: { p: ReturnType<typeof campañaPanel> }) {
  const s = p.sentimiento;
  const C = 2 * Math.PI * 46;
  const tono = (t: string) => (t === "pos" ? "#86b04a" : t === "neg" ? "#e06a86" : "#c79a52");
  const insights = [
    "El **aroma y la duración** dominan la conversación positiva (42%): es el driver #1 de recomendación.",
    "El **packaging del canje** genera contenido espontáneo de unboxing — reforzar en próximos envíos.",
    "Las menciones negativas se concentran en **disponibilidad/dónde comprar** (12%): sumar link a e-commerce en bio.",
    `Sentimiento **+${s.tendencia}%** vs. la semana anterior, impulsado por los Reels de GRWM.`,
  ];
  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_1.1fr]">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
        <motion.div variants={item} className="glass rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 font-display text-[15px] font-bold text-content"><MessageCircle size={16} className="text-cyan" /> Sentimiento de la campaña</div>
            <span className="text-[11.5px] text-content-muted">{fmtK(s.menciones)} menciones · <span className="font-semibold text-lime">+{s.tendencia}%</span></span>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative grid place-items-center">
              <svg width="120" height="120" className="-rotate-90"><circle cx="60" cy="60" r="46" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="9" /><motion.circle cx="60" cy="60" r="46" fill="none" stroke="#86b04a" strokeWidth="9" strokeLinecap="round" strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - s.indice / 100) }} transition={{ duration: 1 }} /></svg>
              <div className="absolute text-center"><div className="font-display text-[30px] font-bold text-content">{s.indice}</div><div className="text-[10px] uppercase text-content-muted">índice</div></div>
            </div>
            <div className="flex-1 space-y-2.5">
              {[["Positivo", s.pos, "#86b04a"], ["Neutro", s.neu, "#c79a52"], ["Negativo", s.neg, "#e06a86"]].map(([l, v, col]) => (
                <div key={l as string}><div className="mb-0.5 flex justify-between text-[12px]"><span className="text-content-secondary">{l}</span><span className="font-semibold text-content">{v}%</span></div><div className="h-2 overflow-hidden rounded-full bg-[var(--sf-2)]"><motion.div className="h-full rounded-full" style={{ background: col as string }} initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.7 }} /></div></div>
              ))}
            </div>
          </div>
          <div className="mt-4 border-t border-line pt-3">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-content-muted">Temas de conversación</div>
            <div className="flex flex-wrap gap-1.5">
              {p.temas.map((t) => <span key={t.label} className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--sf-1)] px-2.5 py-1.5 text-[11.5px] text-content-secondary ring-1 ring-[var(--ln-1)]"><span className="h-1.5 w-1.5 rounded-full" style={{ background: tono(t.tono) }} /> {t.label} <span className="font-semibold text-content">{t.pct}%</span></span>)}
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="glass rounded-2xl p-5">
          <div className="mb-3 flex items-center gap-2 font-display text-[15px] font-bold text-content"><Lightbulb size={16} className="text-cyan" /> Insights de sentimiento</div>
          <div className="space-y-2.5">
            {insights.map((t, i) => <div key={i} className="flex gap-2.5 text-[12.5px] text-content-secondary"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" /><Rich t={t} /></div>)}
          </div>
        </motion.div>
      </motion.div>

      <motion.div variants={item} initial="hidden" animate="show" className="glass rounded-2xl p-5">
        <div className="mb-3 flex items-center gap-2 font-display text-[15px] font-bold text-content"><MessageCircle size={16} className="text-cyan" /> Comentarios destacados</div>
        <div className="space-y-2.5">
          {p.comentarios.map((c, i) => (
            <div key={i} className="flex gap-2.5 rounded-xl bg-[var(--sf-1)] px-3 py-2.5 ring-1 ring-[var(--ln-1)]">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: tono(c.tono) }} />
              <div><div className="text-[11.5px] font-semibold text-cyan">{c.autor}</div><div className="text-[12px] text-content-secondary">{c.texto}</div></div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
function Rich({ t }: { t: string }) {
  const parts = t.split(/(\*\*[^*]+\*\*)/g);
  return <p>{parts.map((x, i) => x.startsWith("**") ? <b key={i} className="font-semibold text-content">{x.slice(2, -2)}</b> : <span key={i}>{x}</span>)}</p>;
}

/* ============================ GALERÍA ============================ */
type GalSort = "creador" | "alcance" | "engagement" | "reciente";
const GAL_OPTS: { k: GalSort; label: string }[] = [
  { k: "creador", label: "Por creador" },
  { k: "alcance", label: "Mayor alcance" },
  { k: "engagement", label: "Mayor engagement" },
  { k: "reciente", label: "Más reciente" },
];
function SecGaleria({ contenidos }: { contenidos: Contenido[] }) {
  const [sort, setSort] = useState<GalSort>("creador");
  const grupos = useMemo(() => {
    const m = new Map<string, { handle: string; avatar: string; fotoTint: string; nombre: string; items: Contenido[]; total: number }>();
    for (const c of contenidos) {
      const g = m.get(c.handle) ?? { handle: c.handle, avatar: c.avatar, fotoTint: c.fotoTint, nombre: c.autor, items: [], total: 0 };
      g.items.push(c); g.total += c.alcance; m.set(c.handle, g);
    }
    const arr = [...m.values()]; arr.forEach((g) => g.items.sort((a, b) => b.alcance - a.alcance));
    return arr.sort((a, b) => b.total - a.total);
  }, [contenidos]);
  const flat = useMemo(() => {
    const arr = [...contenidos];
    if (sort === "alcance") arr.sort((a, b) => b.alcance - a.alcance);
    else if (sort === "engagement") arr.sort((a, b) => b.er - a.er);
    else if (sort === "reciente") arr.reverse();
    return arr;
  }, [contenidos, sort]);
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12.5px] text-content-muted">{contenidos.length} piezas</p>
        <div className="flex items-center gap-1 rounded-xl bg-[var(--sf-1)] p-1 ring-1 ring-[var(--ln-1)]">
          {GAL_OPTS.map((o) => (
            <button key={o.k} onClick={() => setSort(o.k)} className={`rounded-lg px-2.5 py-1.5 text-[11.5px] font-semibold transition-colors ${sort === o.k ? "bg-cyan text-content-inverted" : "text-content-secondary hover:text-content"}`}>{o.label}</button>
          ))}
        </div>
      </div>
      {sort === "creador" ? (
        grupos.map((g) => (
          <div key={g.handle} className="mb-6">
            <div className="mb-2.5 flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full text-[17px] ring-1 ring-[var(--ln-2)]" style={{ background: `${g.fotoTint}2e` }}>{g.avatar}</span>
              <div><div className="text-[13px] font-semibold text-content">{g.nombre}</div><div className="text-[11px] text-content-muted">{g.handle}</div></div>
              <span className="ml-auto text-[12px] text-content-muted">alcance total <span className="font-bold text-content">{fmtK(g.total)}</span> · {g.items.length} piezas</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">{g.items.map((ct) => <ContenidoCard key={ct.id} c={ct} />)}</div>
          </div>
        ))
      ) : (
        <motion.div key={sort} variants={container} initial="hidden" animate="show" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {flat.map((ct) => <ContenidoCard key={ct.id} c={ct} />)}
        </motion.div>
      )}
    </div>
  );
}

/* ============================ CALENDARIO ============================ */
const MESES_AB = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const DIAS_MES: Record<string, number> = { ene: 31, feb: 28, mar: 31, abr: 30, may: 31, jun: 30, jul: 31, ago: 31, sep: 30, oct: 31, nov: 30, dic: 31 };
function SecCalendario({ contenidos }: { contenidos: Contenido[] }) {
  const [vista, setVista] = useState<"agenda" | "mes">("agenda");
  const byFecha = useMemo(() => {
    const m = new Map<string, Contenido[]>();
    for (const c of contenidos) { const a = m.get(c.fecha) ?? []; a.push(c); m.set(c.fecha, a); }
    return [...m.entries()];
  }, [contenidos]);
  // meses presentes → grillas
  const meses = useMemo(() => {
    const m = new Map<string, Map<number, Contenido[]>>();
    for (const c of contenidos) {
      const [d, mes] = c.fecha.split(" ");
      if (!m.has(mes)) m.set(mes, new Map());
      const dm = m.get(mes)!; const day = parseInt(d, 10);
      const a = dm.get(day) ?? []; a.push(c); dm.set(day, a);
    }
    return [...m.entries()].sort((a, b) => MESES_AB.indexOf(a[0]) - MESES_AB.indexOf(b[0]));
  }, [contenidos]);

  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-display text-[15px] font-bold text-content"><CalendarDays size={16} className="text-cyan" /> Calendario de contenidos</div>
        <div className="flex items-center gap-1 rounded-xl bg-[var(--sf-1)] p-1 ring-1 ring-[var(--ln-1)]">
          {([["agenda", "Agenda"], ["mes", "Mes"]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setVista(k)} className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-colors ${vista === k ? "bg-cyan text-content-inverted" : "text-content-secondary hover:text-content"}`}>{l}</button>
          ))}
        </div>
      </div>

      {vista === "mes" ? (
        <div className="grid gap-5 md:grid-cols-2">
          {meses.map(([mes, dm], i) => <MonthGrid key={mes} mes={mes} dias={dm} offset={(MESES_AB.indexOf(mes) * 3 + 2) % 7} idx={i} />)}
        </div>
      ) : (
      <div className="space-y-4">
        {byFecha.map(([fecha, items]) => (
          <div key={fecha} className="flex gap-4">
            <div className="w-16 shrink-0 pt-1 text-right">
              <div className="font-display text-[15px] font-bold text-content">{fecha.split(" ")[0]}</div>
              <div className="text-[10.5px] uppercase text-content-muted">{fecha.split(" ")[1]}</div>
            </div>
            <div className="relative flex-1 border-l border-line pl-4">
              <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-cyan ring-2 ring-canvas" />
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((c) => {
                  const Icon = PLAT_ICON[c.plataforma];
                  return (
                    <div key={c.id} className="flex items-center gap-2.5 rounded-xl bg-[var(--sf-1)] px-3 py-2 ring-1 ring-[var(--ln-1)]">
                      <span className="grid h-8 w-8 place-items-center rounded-full text-[15px] ring-1 ring-[var(--ln-2)]" style={{ background: `${c.fotoTint}2e` }}>{c.avatar}</span>
                      <div className="min-w-0 flex-1"><div className="truncate text-[12px] font-semibold text-content">{c.handle}</div><div className="flex items-center gap-1 text-[10.5px] text-content-muted"><Icon size={10} /> {c.plataforma} · {c.tipo}</div></div>
                      <span className="text-[11px] font-semibold text-content-secondary">{fmtK(c.alcance)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}

function MonthGrid({ mes, dias, offset, idx }: { mes: string; dias: Map<number, Contenido[]>; offset: number; idx: number }) {
  const n = DIAS_MES[mes] ?? 30;
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: n }, (_, i) => i + 1)];
  const maxN = Math.max(1, ...[...dias.values()].map((v) => v.length));
  return (
    <motion.div variants={item} initial="hidden" animate="show" transition={{ delay: idx * 0.05 }} className="rounded-2xl bg-[var(--sf-1)] p-4 ring-1 ring-[var(--ln-1)]">
      <div className="mb-2 font-display text-[14px] font-bold capitalize text-content">{mes}</div>
      <div className="grid grid-cols-7 gap-1 text-center text-[9px] uppercase text-content-muted">
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => <div key={i} className="py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const items = dias.get(day);
          const on = !!items;
          const intensity = on ? 0.12 + (items!.length / maxN) * 0.5 : 0;
          return (
            <div key={i} className="relative grid aspect-square place-items-center rounded-lg text-[11px]"
              style={{ background: on ? `color-mix(in srgb, var(--color-cyan) ${Math.round(intensity * 100)}%, transparent)` : "rgba(255,255,255,.03)" }}
              title={on ? `${items!.length} pieza(s)` : undefined}>
              <span className={on ? "font-bold text-content" : "text-content-muted"}>{day}</span>
              {on && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-cyan" />}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ============================ DESPACHOS (por campaña) ============================ */
const STAGE_ICON: Record<EnvioEstado, any> = { "Pendiente": Clock, "Preparando": PackageOpen, "Despachado": Package, "En tránsito": Truck, "Entregado": Home, "Publicado": Sparkles };
function SecDespachos({ c }: { c: PCampaña }) {
  const d = useMemo(() => campDespacho(c), [c]);
  const stages: { e: EnvioEstado; n: number }[] = [
    { e: "Pendiente", n: d.pendiente }, { e: "Preparando", n: d.preparando },
    { e: "En tránsito", n: d.enTransito }, { e: "Entregado", n: d.entregado }, { e: "Publicado", n: d.publicado },
  ];
  const avgIdx = d.total ? stages.reduce((a, s, i) => a + s.n * i, 0) / d.total : 0;
  const fill = (avgIdx / (stages.length - 1)) * 100;
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <DKpi tint="#c9a24b" icon={<Package size={16} />} label="Canjes totales" value={String(d.total)} sub="en la campaña" />
        <DKpi tint="#86b04a" icon={<Home size={16} />} label="Entregados" value={String(d.entregado)} sub={`${d.pctEntregado}% del total`} />
        <DKpi tint="#6f93c4" icon={<Truck size={16} />} label="En tránsito" value={String(d.enTransito)} sub="camino al destino" />
        <DKpi tint="#c9a24b" icon={<Sparkles size={16} />} label="% Publicado" value={`${d.pctPublicado}%`} sub={`${d.publicado} de ${d.entregado} entregados`} />
      </div>
      {/* pipeline */}
      <motion.div variants={item} className="glass rounded-2xl p-5">
        <div className="relative mt-2">
          <div className="absolute top-[24px] h-[3px] rounded-full bg-[var(--sf-2)]" style={{ left: "10%", right: "10%" }} />
          <motion.div className="absolute top-[24px] h-[3px] rounded-full bg-cyan" style={{ left: "10%" }} initial={{ width: 0 }} animate={{ width: `${(fill / 100) * 80}%` }} transition={{ duration: 1 }} />
          <div className="relative grid grid-cols-5 gap-1">
            {stages.map((s) => {
              const meta = ENVIO_META[s.e]; const Icon = STAGE_ICON[s.e]; const on = s.n > 0;
              return (
                <div key={s.e} className="flex flex-col items-center">
                  <div className="grid h-12 w-12 place-items-center rounded-full" style={{ background: on ? `${meta.tint}1f` : "rgba(255,255,255,.03)", boxShadow: `0 0 0 2px ${on ? meta.tint : "rgba(255,255,255,.08)"}` }}><Icon size={18} style={{ color: on ? meta.tint : "rgba(255,255,255,.35)" }} /></div>
                  <span className="mt-2 font-display text-[20px] font-bold leading-none" style={{ color: on ? meta.tint : "var(--color-content-muted)" }}>{s.n}</span>
                  <span className="mt-1 text-[10.5px] font-medium text-content-secondary">{meta.label.replace(" ✦", "")}</span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
      {/* recientes + resumen */}
      <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr]">
        <motion.div variants={item} className="glass overflow-hidden rounded-2xl">
          <div className="border-b border-line px-5 py-3 text-[12px] font-semibold uppercase tracking-wide text-content-muted">Despachos recientes</div>
          <div className="divide-y divide-line/60">
            {d.recientes.length === 0 && <div className="px-5 py-6 text-center text-[12.5px] text-content-muted">Sin despachos registrados.</div>}
            {d.recientes.map((r, i) => {
              const m = ENVIO_META[r.estado];
              return (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full text-[15px] ring-1 ring-[var(--ln-2)]" style={{ background: `${r.fotoTint}2e` }}>{r.avatar}</span>
                  <span className="flex-1 truncate text-[12.5px] font-semibold text-content">{r.handle}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold" style={{ background: `${m.tint}1c`, color: m.tint }}><span className="h-1.5 w-1.5 rounded-full" style={{ background: m.tint }} /> {m.label}</span>
                  <span className="hidden w-24 text-[11.5px] text-content-secondary sm:inline-flex"><MapPin size={12} className="mr-1 text-content-muted" /> {r.region}</span>
                  <span className="w-14 text-right text-[11.5px] text-content-muted">{r.fecha}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
        <motion.div variants={item} className="glass rounded-2xl p-5">
          <div className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-content-muted">Regiones destino</div>
          <div className="space-y-2">
            {d.regiones.map((r) => (
              <div key={r.region} className="flex items-center gap-2">
                <span className="w-28 truncate text-[12px] text-content-secondary">{r.region}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--sf-2)]"><motion.div className="h-full rounded-full bg-cyan" initial={{ width: 0 }} animate={{ width: `${r.pct}%` }} transition={{ duration: 0.7 }} /></div>
                <span className="w-8 text-right text-[12px] font-bold text-content">{r.n}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3 border-t border-line pt-4">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-cyan/12 text-cyan"><Clock size={18} /></span>
            <div><div className="font-display text-[20px] font-bold text-content">{d.tiempoProm.toFixed(1)} días</div><div className="text-[11px] text-content-muted">tiempo promedio de entrega</div></div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
function DKpi({ icon, label, value, sub, tint }: { icon: React.ReactNode; label: string; value: string; sub: string; tint: string }) {
  return (
    <motion.div variants={item} className="glass rounded-2xl p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: `${tint}1c`, color: tint }}>{icon}</span>
        <span className="text-[11px] font-medium uppercase tracking-wide text-content-muted">{label}</span>
      </div>
      <div className="font-display text-[24px] font-bold leading-none text-content">{value}</div>
      <div className="mt-1.5 text-[11px] text-content-muted">{sub}</div>
    </motion.div>
  );
}

/* ============================ CASTING PRESENTADO ============================ */
function SecCasting({ c, onCasting }: { c: PCampaña; onCasting: () => void }) {
  const puig = usePuig();
  const rec = puig.get(c.id);
  const sel = useMemo(() => new Set(rec.estado === "confirmado" ? rec.confirmados : rec.seleccion), [rec]);
  const all = candidatosDe(c.id);
  const [filtro, setFiltro] = useState<"todos" | "sel" | "no">("todos");
  const list = all.filter((x) => filtro === "todos" || (filtro === "sel" ? sel.has(x.id) : !sel.has(x.id)));
  const estadoLabel = rec.estado === "confirmado" ? "Confirmados en campaña" : rec.estado === "enviado" ? "Enviados · esperando confirmación" : "Selección en borrador";
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-[13px] text-content-secondary">{all.length} perfiles presentados · <span className="font-semibold text-lime">{sel.size} seleccionados</span> · <span className="text-content-muted">{all.length - sel.size} no</span> · <span className="text-cyan">{estadoLabel}</span></div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl bg-[var(--sf-1)] p-1 ring-1 ring-[var(--ln-1)]">
            {([["todos", "Todos"], ["sel", "Seleccionados"], ["no", "No sel."]] as const).map(([k, l]) => (
              <button key={k} onClick={() => setFiltro(k)} className={`rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition-colors ${filtro === k ? "bg-cyan text-content-inverted" : "text-content-secondary hover:text-content"}`}>{l}</button>
            ))}
          </div>
          <button onClick={onCasting} className="inline-flex items-center gap-1.5 rounded-xl bg-cyan/12 px-3.5 py-2 text-[12.5px] font-semibold text-cyan ring-1 ring-cyan/25 transition-colors hover:bg-cyan/20"><Users size={14} /> Gestionar</button>
        </div>
      </div>
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {list.map((prf) => {
          const on = sel.has(prf.id);
          return (
            <motion.div key={prf.id} variants={item} className={`glass relative rounded-2xl p-4 transition-all ${on ? "ring-1 ring-lime/40" : "opacity-55 grayscale-[0.3]"}`}>
              <span className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9.5px] font-bold ${on ? "bg-lime/15 text-lime" : "bg-[var(--sf-2)] text-content-muted"}`}>{on ? "✓ Seleccionado" : "No sel."}</span>
              <div className="flex items-center gap-2.5">
                <span className="grid h-11 w-11 place-items-center rounded-full text-[22px] ring-1 ring-[var(--ln-2)]" style={{ background: `${prf.fotoTint}2e` }}>{prf.avatar}</span>
                <div className="min-w-0"><div className="truncate text-[13px] font-semibold text-content">{prf.nombre}</div><div className="truncate text-[11.5px] text-cyan">{prf.handle}</div></div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-1.5 text-[11px]">
                <MiniStat label="Seguidores" value={fmtK(prf.seguidores)} />
                <MiniStat label="Engagement" value={`${prf.engagement}%`} />
                <MiniStat label="Audiencia" value={prf.edadAudiencia} />
                <MiniStat label="Fit" value={`${prf.fit}`} />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
function MiniStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-[var(--sf-1)] px-2 py-1"><div className="text-[9px] uppercase tracking-wide text-content-muted">{label}</div><div className="text-[12px] font-bold text-content">{value}</div></div>;
}

/* ============================ DOCUMENTOS ============================ */
const DOC_TINT: Record<string, string> = { "Cotización": "#c9a24b", "Factura": "#86b04a", "Guion": "#6f93c4", "Brief": "#d1859c", "Reporte": "#d99a4e" };
function SecDocumentos({ c }: { c: PCampaña }) {
  const [docs, setDocs] = useState<DocItem[]>(() => seedDocs(c));
  const subir = () => setDocs((d) => [{ id: `${c.id}-u${d.length}`, nombre: `Documento cargado ${d.length + 1}.pdf`, tipo: "Reporte", peso: "320 KB", fecha: "hoy" }, ...d]);
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-display text-[15px] font-bold text-content"><FileText size={16} className="text-cyan" /> Documentos de la campaña</div>
        <button onClick={subir} className="inline-flex items-center gap-1.5 rounded-xl bg-cyan px-3.5 py-2 text-[12.5px] font-semibold text-content-inverted transition-transform hover:scale-[1.02]"><Plus size={14} /> Subir documento</button>
      </div>
      <p className="mb-4 text-[12px] text-content-muted">Cotizaciones, facturas, guiones y entregables que compartimos con el cliente.</p>
      <div className="space-y-2">
        {docs.map((doc) => {
          const tint = DOC_TINT[doc.tipo] ?? "#c9a24b";
          return (
            <div key={doc.id} className="flex items-center gap-3 rounded-xl bg-[var(--sf-1)] px-3.5 py-2.5 ring-1 ring-[var(--ln-1)]">
              <span className="grid h-10 w-10 place-items-center rounded-lg" style={{ background: `${tint}1c`, color: tint }}><FileText size={18} /></span>
              <div className="min-w-0 flex-1"><div className="truncate text-[13px] font-semibold text-content">{doc.nombre}</div><div className="text-[11px] text-content-muted">{doc.tipo} · {doc.peso} · {doc.fecha}</div></div>
              <button className="rounded-lg bg-[var(--sf-1)] px-3 py-1.5 text-[11.5px] font-semibold text-content-secondary ring-1 ring-[var(--ln-1)] transition-colors hover:bg-[var(--hov)] hover:text-content">Descargar</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---- compartidos ---- */
function ContenidoCard({ c }: { c: Contenido }) {
  const Icon = PLAT_ICON[c.plataforma];
  return (
    <motion.div variants={item} className="glass overflow-hidden rounded-xl">
      <div className="relative flex h-28 items-center justify-center" style={{ background: `radial-gradient(120% 120% at 50% 0%, ${c.fotoTint}44, ${c.fotoTint}12)` }}>
        <span className="text-[40px]">{c.avatar}</span>
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/45 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur"><Icon size={11} /> {c.plataforma}</span>
        <span className="absolute bottom-2 right-2 rounded-md bg-black/45 px-1.5 py-0.5 text-[10px] font-semibold text-cyan backdrop-blur">ER {c.er}%</span>
      </div>
      <div className="p-2.5">
        <div className="truncate text-[11.5px] font-semibold text-content">{c.handle}</div>
        <div className="truncate text-[10.5px] text-content-muted">{c.tipo} · {c.fecha}</div>
        <div className="mt-2 flex items-center justify-between text-[10.5px] text-content-secondary">
          <span className="inline-flex items-center gap-0.5"><Eye size={11} /> {fmtK(c.alcance)}</span>
          <span className="inline-flex items-center gap-0.5"><Heart size={11} /> {fmtK(c.likes)}</span>
          <span className="inline-flex items-center gap-0.5"><Bookmark size={11} /> {fmtK(c.saves)}</span>
        </div>
      </div>
    </motion.div>
  );
}

function TopCreators({ list, onCasting }: { list: { nombre: string; handle: string; avatar: string; fotoTint: string; alcance: number; er: number }[]; onCasting: () => void }) {
  return (
    <motion.div variants={item} initial="hidden" animate="show" className="glass rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-display text-[15px] font-bold text-content"><Sparkles size={15} className="text-cyan" /> Top creadores · por alcance</div>
        <button onClick={onCasting} className="text-[12px] font-semibold text-cyan hover:underline">Ver casting presentado</button>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {list.map((t, i) => (
          <div key={t.handle} className="flex items-center gap-3 rounded-xl bg-[var(--sf-1)] px-3 py-2.5 ring-1 ring-[var(--ln-1)]">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-cyan/15 text-[11px] font-bold text-cyan">{i + 1}</span>
            <span className="grid h-9 w-9 place-items-center rounded-full text-[17px] ring-1 ring-[var(--ln-2)]" style={{ background: `${t.fotoTint}2e` }}>{t.avatar}</span>
            <div className="min-w-0 flex-1"><div className="truncate text-[12.5px] font-semibold text-content">{t.nombre}</div><div className="truncate text-[11px] text-content-muted">{t.handle}</div></div>
            <div className="text-right"><div className="text-[13px] font-bold text-content">{fmtK(t.alcance)}</div><div className="text-[10.5px] text-content-muted">ER {t.er}%</div></div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
