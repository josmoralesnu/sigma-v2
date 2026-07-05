import { useState } from "react";
import { motion } from "motion/react";
import {
  Target, FileDown, Flame, ArrowRight, Users, Eye, Heart, MousePointerClick,
  ShoppingBag, DollarSign, TrendingUp, Trophy, Sparkles, Play,
} from "lucide-react";
import { Wrap, PageHeader, Chip, card, container, item } from "./parts";
import { brandPanel, short, pesosK } from "./panel";
import { cliente } from "../lib/data";
import { CampaignPicker } from "./CampaignPicker";
import { useCentro } from "./store";
import { Thumb } from "./Thumb";
import { ConfProvider, Conf, ConfToggle } from "./confid";

const KPI_ICON: Record<string, any> = {
  alcance: Users, impresiones: Eye, engagement: Heart, clics: MousePointerClick,
  conversiones: ShoppingBag, roi: DollarSign,
};

/* anillo de ROI (estilo "score") */
function RoiRing({ roi, label, nota }: { roi: string; label: string; nota: string }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 18 }}
      className="grid h-28 w-28 shrink-0 place-items-center rounded-full bg-[var(--sf-2)] text-center ring-1 ring-white/20 backdrop-blur-md">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wide text-white/70">{label.replace(" (EMV)", "")}</div>
        <div className="font-display text-[30px] font-bold leading-none text-white"><Conf px={8}>{roi}</Conf></div>
        <div className="mt-0.5 inline-flex items-center gap-0.5 text-[10px] font-semibold text-lime"><TrendingUp size={10} /> {nota}</div>
      </div>
    </motion.div>
  );
}

/* curva de rendimiento (área SVG animada) */
function Curva({ fechas, puntos, label, unidad }: { fechas: string[]; puntos: number[]; label: string; unidad: string }) {
  const max = Math.max(...puntos) * 1.08;
  const pts = puntos.map((v, i) => [(i / (puntos.length - 1)) * 100, 100 - (v / max) * 100] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
  const area = `M0 100 ` + pts.map(([x, y]) => `L${x.toFixed(2)} ${y.toFixed(2)}`).join(" ") + " L100 100 Z";
  const last = pts[pts.length - 1];
  return (
    <div className={`${card} p-5`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-ink">Rendimiento de la campaña</h3>
        <Chip>{label}</Chip>
      </div>
      <div className="relative h-[200px] w-full">
        {/* líneas guía */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-px w-full bg-[var(--sf-2)]" />)}
        </div>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <linearGradient id="cv-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-cyan)" stopOpacity="0.34" />
              <stop offset="100%" stopColor="var(--color-cyan)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path d={area} fill="url(#cv-fill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }} />
          <motion.path d={line} fill="none" stroke="var(--color-cyan)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: "easeInOut" }} />
          <motion.circle cx={last[0]} cy={last[1]} r="2.4" fill="var(--color-cyan)" stroke="#0a0a0c" strokeWidth="1" vectorEffect="non-scaling-stroke"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.1, type: "spring", stiffness: 300 }} />
        </svg>
        {/* valor del último punto */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
          className="absolute -translate-x-1/2 rounded-lg bg-[var(--sf-2)] px-2 py-1 text-center ring-1 ring-[var(--ln-2)] backdrop-blur"
          style={{ left: `${last[0]}%`, top: `${last[1]}%`, transform: "translate(-50%,-130%)" }}>
          <div className="font-display text-[13px] font-bold leading-none text-ink"><Conf px={5}>{short(puntos[puntos.length - 1])}</Conf></div>
          <div className="text-[9px] text-ink-mute">{unidad}</div>
        </motion.div>
      </div>
      <div className="mt-2 flex justify-between text-[10.5px] text-ink-mute">
        {fechas.map((f) => <span key={f}>{f}</span>)}
      </div>
    </div>
  );
}

export function PanelBrand() {
  const { posts } = useCentro();
  const [reveal, setReveal] = useState(false);
  const [camp, setCamp] = useState(() => ({ nombre: cliente.campania, ventana: cliente.ventana }));
  const bp = brandPanel;
  if (!bp) return null;
  const galeria = [...posts].sort((a, b) => (b.estado === "Publicado" ? 1 : 0) - (a.estado === "Publicado" ? 1 : 0) || b.alcance - a.alcance).slice(0, 4);

  return (
    <ConfProvider revealed={reveal}>
    <Wrap>
      <PageHeader
        icon={<Target size={24} />}
        titulo="Centro de optimización"
        subtitulo={<><CampaignPicker value={camp.nombre} onChange={(nombre, ventana) => setCamp({ nombre, ventana: nombre === cliente.campania ? cliente.ventana : ventana })} /><span className="text-ink-mute">·</span><span>{camp.ventana}</span><Chip>Últimos 30 días</Chip></>}
        right={
          <>
            <ConfToggle revealed={reveal} onToggle={() => setReveal((v) => !v)} />
            <button className="glass glass-hover inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-semibold text-ink">
              <FileDown size={15} className="text-cyan" /> Exportar reporte
            </button>
          </>
        }
      />

      {/* Campaña destacada */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 26 }}
        className="glass glass-accent relative mb-5 overflow-hidden rounded-2xl">
        <div className="absolute inset-0" style={{ background: "linear-gradient(115deg, var(--color-cyan) -10%, transparent 60%)", opacity: 0.5, filter: "blur(40px)" }} />
        <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-cyan/25 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-6 p-6">
          <div className="min-w-0 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-cyan/20 px-2 py-1 text-[11px] font-bold text-cyan ring-1 ring-cyan/30"><Flame size={12} /> Top performing</span>
            <h2 className="mt-3 font-display text-[32px] font-extrabold leading-none tracking-tight text-ink">{bp.campania.nombre}</h2>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-soft">{bp.campania.bajada}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {bp.campania.badges.map((b) => (
                <span key={b} className="rounded-lg bg-[var(--sf-2)] px-2.5 py-1 text-[11.5px] font-semibold text-ink-soft ring-1 ring-[var(--ln-1)]">{b}</span>
              ))}
            </div>
            <button className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan px-4 py-2.5 text-[13px] font-bold text-content-inverted transition-opacity hover:opacity-90">
              Ver campaña <ArrowRight size={15} />
            </button>
          </div>
          <RoiRing roi={bp.campania.roi} label={bp.campania.roiLabel} nota={bp.campania.nota} />
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.section variants={container} initial="hidden" animate="show" className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {bp.kpis.map((k) => {
          const Icon = KPI_ICON[k.id] ?? DollarSign;
          return (
            <motion.div key={k.id} variants={item} whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className={`${card} p-4`}>
              <div className="mb-2.5 flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan/12 text-cyan ring-1 ring-cyan/20"><Icon size={15} /></span>
              </div>
              <div className="text-[12px] font-medium text-ink-soft">{k.label}</div>
              <div className="mt-0.5 font-display text-[22px] font-bold leading-none tracking-tight text-ink"><Conf px={7}>{k.valor}</Conf></div>
              <div className="mt-2 flex items-center gap-1.5">
                <TrendingUp size={13} className="text-lime" />
                <span className="text-[11.5px] font-semibold text-lime"><Conf px={5}>{k.delta}</Conf></span>
                <span className="text-[10.5px] text-ink-mute">{k.sub}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.section>

      {/* Contenido + curva */}
      <section className="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className={`${card} p-5`}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-ink">Contenido de la campaña</h3>
            <span className="text-[11.5px] text-ink-mute">{galeria.length} piezas destacadas</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {galeria.map((p) => (
              <div key={p.id} className="overflow-hidden rounded-xl ring-1 ring-[var(--ln-1)]">
                <div className="relative grid h-28 place-items-center overflow-hidden">
                  <Thumb img={p.img} tipo={p.tipo} />
                  <span className="absolute left-2 top-2 z-10 rounded-md bg-black/45 px-1.5 py-0.5 text-[9px] font-semibold text-white/90 backdrop-blur">{p.tipo}</span>
                  <div className="relative z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-content-inverted"><Play size={14} className="translate-x-px fill-current" /></div>
                  <span className="absolute bottom-2 left-2 z-10 text-[15px]">{p.avatar}</span>
                </div>
                <div className="p-2.5">
                  <div className="text-[11.5px] font-semibold text-ink"><Conf px={4} className="max-w-full truncate">{p.autor}</Conf></div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-ink-mute">
                    <span className="inline-flex items-center gap-1"><Eye size={10} /> <Conf px={4}>{short(p.alcance)}</Conf></span>
                    <span className="inline-flex items-center gap-1"><Heart size={10} /> <Conf px={4}>{p.er || "—"}%</Conf></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Curva fechas={bp.chart.fechas} puntos={bp.chart.puntos} label={bp.chart.label} unidad={bp.chart.unidad} />
      </section>

      {/* Top creators + meta */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className={`${card} p-5 xl:col-span-8`}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-ink">Top creators · por EMV</h3>
            <span className="text-[11.5px] text-ink-mute">valor de medios ganados</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {bp.topCreators.map((c, i) => (
              <motion.div key={c.handle} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
                className="rounded-xl bg-[var(--sf-1)] p-4 ring-1 ring-[var(--ln-1)]">
                <div className="mb-3 flex items-center justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-[var(--sf-1)] text-[20px] ring-1 ring-[var(--ln-1)]">{c.avatar}</div>
                  <span className="rounded-md bg-cyan/15 px-2 py-0.5 text-[10.5px] font-bold text-cyan ring-1 ring-cyan/25">{c.badge}</span>
                </div>
                <div className="text-[13.5px] font-semibold text-ink"><Conf px={5} className="max-w-full truncate">{c.nombre}</Conf></div>
                <div className="text-[11px] text-ink-mute"><Conf px={4}>{c.handle}</Conf></div>
                <div className="mt-3 grid grid-cols-3 gap-1 border-t border-line pt-3 text-center">
                  {[["Alcance", short(c.alcance)], ["Eng.", c.er + "%"], ["EMV", pesosK(c.emv)]].map(([l, v]) => (
                    <div key={l} className="leading-tight">
                      <div className="text-[8.5px] uppercase tracking-wide text-ink-mute">{l}</div>
                      <div className="mt-0.5 text-[12px] font-bold tabular-nums text-ink"><Conf px={4}>{v}</Conf></div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="glass glass-accent relative overflow-hidden rounded-2xl p-5 xl:col-span-4">
          <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-cyan/20 blur-3xl" />
          <div className="relative">
            <div className="mb-2 flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan/15 text-cyan ring-1 ring-cyan/25"><Trophy size={18} /></span>
              <h3 className="text-[15px] font-bold text-ink">¡Vas increíble!</h3>
            </div>
            <p className="text-[12.5px] leading-relaxed text-ink-soft">Tu campaña está superando los objetivos y generando un impacto real en medios ganados.</p>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-[12px] text-ink-mute">{bp.goal.label} {bp.goal.objetivo}</span>
              <span className="font-display text-[26px] font-bold text-cyan"><Conf px={7}>{bp.goal.actual}</Conf></span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--sf-2)]">
              <motion.div className="h-full rounded-full bg-cyan" initial={{ width: 0 }} animate={{ width: `${bp.goal.pct}%` }} transition={{ duration: 0.9, ease: "easeOut" }} />
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-lime"><Sparkles size={13} /> Objetivo de ROI superado</div>
          </div>
        </div>
      </section>

      <footer className="mt-6 flex items-center gap-1.5 text-[12px] text-ink-mute">
        <Sparkles size={13} className="text-cyan" /> Métricas de awareness y EMV de los últimos 30 días · inversión en CLP.
      </footer>
    </Wrap>
    </ConfProvider>
  );
}
