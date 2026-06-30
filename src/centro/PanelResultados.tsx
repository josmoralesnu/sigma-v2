import { useState } from "react";
import { motion } from "motion/react";
import {
  Target, ChevronDown, FileDown, Info, ChevronRight, Lightbulb, Zap, ArrowRight,
  DollarSign, Eye, Heart, MousePointerClick, UserPlus, Trophy, CircleDollarSign, Users,
  TrendingUp, TrendingDown, BadgeCheck, BarChart3, Images, Play, ArrowUpDown, ArrowUp, ArrowDown,
} from "lucide-react";
import { Wrap, PageHeader, Chip, card, container, item } from "./parts";
import {
  kpis, embudo, conectores, conversionTotal, creadores, recomendaciones,
  fondoDe, short, pesos, type Kpi, type Calidad, type CreadorRow,
} from "./panel";
import { cliente } from "../lib/data";
import { useCentro } from "./store";

const KPI_ICON: Record<string, any> = {
  inversion: DollarSign, alcance: Users, impresiones: Eye, engagement: Heart,
  clics: MousePointerClick, registros: UserPlus, ftd: Trophy, costo: CircleDollarSign,
};
const CALIDAD: Record<Calidad, string> = {
  "Excelente": "bg-lime/12 text-lime ring-lime/25",
  "Muy bueno": "bg-cyan/12 text-cyan ring-cyan/25",
  "Bueno": "bg-amber/12 text-amber ring-amber/25",
  "Regular": "bg-white/5 text-ink-mute ring-white/10",
};
const FUNNEL_ICON = [Eye, MousePointerClick, UserPlus, Trophy];

function KpiCard({ k }: { k: Kpi }) {
  const Icon = KPI_ICON[k.id] ?? DollarSign;
  const Trend = k.dir === "up" ? TrendingUp : TrendingDown;
  return (
    <motion.div variants={item} whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className={`${card} p-4`}>
      <div className="mb-3 flex items-center gap-2">
        <Icon size={16} className="text-cyan" />
        <span className="flex-1 text-[12.5px] font-medium text-ink-soft">{k.label}</span>
        <Info size={13} className="text-ink-mute/60" />
      </div>
      <div className="font-display text-[24px] font-bold leading-none tracking-tight text-ink">{k.valor}</div>
      <div className="mt-3 flex items-center gap-1.5">
        <Trend size={14} className="text-lime" />
        <span className="text-[12px] font-semibold text-lime">{k.delta}</span>
      </div>
      <div className="mt-0.5 text-[11px] text-ink-mute">{k.sub}</div>
    </motion.div>
  );
}

function Embudo() {
  return (
    <div className={`${card} p-5`}>
      <div className="mb-5 flex items-center gap-2">
        <h3 className="text-[15px] font-bold text-ink">Embudo de conversión: del influencer al FTD</h3>
        <Info size={14} className="text-ink-mute/60" />
      </div>

      <div className="flex items-stretch">
        {embudo.map((p, i) => {
          const Icon = FUNNEL_ICON[i];
          const isFirst = i === 0;
          const isLast = i === embudo.length - 1;
          const clip = isFirst
            ? "polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%)"
            : isLast
            ? "polygon(0 0, 100% 0, 100% 100%, 0 100%, 16px 50%)"
            : "polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%, 16px 50%)";
          return (
            <motion.div key={p.id} className="relative flex-1"
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 + i * 0.1, type: "spring", stiffness: 240, damping: 22 }}
              style={{ marginLeft: isFirst ? 0 : -10, zIndex: embudo.length - i }}>
              <div
                className="flex flex-col items-center gap-1.5 px-4 py-5 text-center"
                style={{ clipPath: clip, background: "linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.035))" }}
              >
                <Icon size={20} className="text-cyan" />
                <div className="text-[12px] font-medium text-ink-soft">{p.label}</div>
                <div className="font-display text-[15px] font-bold text-ink">{p.valor}</div>
                <div className="text-[12px] font-semibold text-cyan">{p.pct}</div>
              </div>
              {!isLast && (
                <div className="absolute right-[-7px] top-1/2 z-10 -translate-y-1/2 text-cyan/70">
                  <ChevronRight size={16} strokeWidth={2.5} />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 px-2">
        {conectores.map((c) => (
          <div key={c.label} className="flex flex-col items-center text-center">
            <div className="flex w-full items-center text-ink-mute/40">
              <span className="h-px flex-1 bg-white/10" />
              <ChevronChev />
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <div className="mt-1 text-[11px] text-ink-soft">{c.label}</div>
            <div className="text-[13px] font-bold text-cyan">{c.valor}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-center">
        <div className="rounded-lg bg-cyan/10 px-4 py-2 text-[13px] font-semibold text-cyan ring-1 ring-cyan/20">
          Conversión total alcance → FTD: {conversionTotal}
        </div>
      </div>
    </div>
  );
}
function ChevronChev() {
  return <ChevronRight size={12} className="mx-1 rotate-90" />;
}

type SortKey = "alcance" | "er" | "clics" | "ftd" | "costo";
const COLS: { key: SortKey; label: string; fmt: (c: CreadorRow) => string }[] = [
  { key: "alcance", label: "Alcance", fmt: (c) => short(c.alcance) },
  { key: "er", label: "ER", fmt: (c) => c.er.toFixed(1) + "%" },
  { key: "clics", label: "Clics", fmt: (c) => c.clics.toLocaleString("es-CL") },
  { key: "ftd", label: "FTD", fmt: (c) => String(c.ftd) },
  { key: "costo", label: "Costo/FTD", fmt: (c) => pesos(c.costo) },
];

function Tabla() {
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "ftd", dir: "desc" });
  const sorted = [...creadores].sort((a, b) => {
    const d = a[sort.key] - b[sort.key];
    return sort.dir === "asc" ? d : -d;
  });
  const onSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));

  return (
    <div className={`${card} p-5`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-ink">Rendimiento de influencer marketing</h3>
        <span className="text-[11.5px] text-ink-mute">ordená por columna ↑↓</span>
      </div>
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col className="w-[30%]" /><col className="w-[11%]" /><col className="w-[10%]" />
          <col className="w-[12%]" /><col className="w-[9%]" /><col className="w-[15%]" /><col className="w-[13%]" />
        </colgroup>
        <thead>
          <tr className="text-[10.5px] font-medium uppercase tracking-wide text-ink-mute">
            <th className="pb-3 text-left font-medium">Creador</th>
            {COLS.map((col) => {
              const active = sort.key === col.key;
              const Arrow = !active ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
              return (
                <th key={col.key} className="pb-3 text-right font-medium">
                  <button onClick={() => onSort(col.key)} className={`inline-flex w-full items-center justify-end gap-1 transition-colors hover:text-ink ${active ? "text-cyan" : ""}`}>
                    {col.label}
                    <Arrow size={11} className={active ? "text-cyan" : "text-ink-mute/50"} />
                  </button>
                </th>
              );
            })}
            <th className="pb-3" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((c) => (
            <motion.tr layout key={c.handle} transition={{ type: "spring", stiffness: 600, damping: 42 }} className="border-t border-line">
              <td className="py-3 pr-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/5 text-[16px] ring-1 ring-white/10">{c.avatar}</div>
                  <div className="min-w-0 leading-tight">
                    <div className="flex items-center gap-1 text-[13px] font-semibold text-ink">
                      <span className="truncate">{c.nombre}</span>
                      <BadgeCheck size={13} className="shrink-0 text-cyan" />
                    </div>
                    <div className="truncate text-[11px] text-ink-mute">{c.handle}</div>
                  </div>
                </div>
              </td>
              {COLS.map((col) => (
                <td key={col.key} className={`whitespace-nowrap text-right text-[12.5px] font-medium tabular-nums ${sort.key === col.key ? "text-ink" : "text-ink-soft"}`}>
                  {col.fmt(c)}
                </td>
              ))}
              <td className="py-3 pl-2 text-right">
                <span className={`inline-flex whitespace-nowrap rounded-md px-1.5 py-1 text-[10.5px] font-semibold ring-1 ${CALIDAD[c.calidad]}`}>{c.calidad}</span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ContenidoTop() {
  const { posts } = useCentro();
  const top = posts.filter((p) => p.estado === "Publicado").sort((a, b) => b.ftd - a.ftd).slice(0, 3);
  return (
    <div className={`${card} p-5`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-ink">Contenido con mayor rendimiento</h3>
        <span className="inline-flex items-center gap-1.5 text-[12px] text-ink-mute"><Images size={14} /> top 3 por FTD</span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {top.map((c) => (
          <div key={c.id} className="overflow-hidden rounded-xl ring-1 ring-white/10">
            <div className="relative grid h-28 place-items-center" style={c.img ? { backgroundImage: `url(${c.img})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: fondoDe(c.tipo) }}>
              <span className="absolute left-2.5 top-2.5 rounded-md bg-black/45 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur">{c.tipo}</span>
              {c.promo && <span className="absolute right-2.5 top-2.5 rounded-md bg-cyan/85 px-1.5 py-0.5 text-[9px] font-bold text-content-inverted">PROMO</span>}
              <div className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-content-inverted"><Play size={16} className="translate-x-px fill-current" /></div>
            </div>
            <div className="p-3">
              <div className="truncate text-[12.5px] font-semibold text-ink">{c.titulo}</div>
              <div className="mb-2.5 text-[11px] text-ink-mute">{c.autor}</div>
              <div className="grid grid-cols-4 gap-x-1.5 border-t border-line pt-2.5 text-center">
                {[["Alc", short(c.alcance)], ["ER", c.er + "%"], ["Clics", short(c.clics)], ["FTD", String(c.ftd)]].map(([l, v]) => (
                  <div key={l} className="min-w-0 leading-tight">
                    <div className="text-[8px] uppercase tracking-wide text-ink-mute">{l}</div>
                    <div className="mt-0.5 whitespace-nowrap text-[10px] font-bold tabular-nums text-ink-soft">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function Insights() {
  return (
    <div className={`${card} p-5`}>
      <div className="mb-3 flex items-center gap-2.5">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber/15 text-amber ring-1 ring-amber/25"><Lightbulb size={18} /></div>
        <h3 className="text-[15px] font-bold text-ink">Insights clave</h3>
      </div>
      <p className="text-[13px] leading-relaxed text-ink-soft">
        Los <span className="font-semibold text-ink">Reels con código promocional</span> y engagement rate sobre 6% generan{" "}
        <span className="font-semibold text-cyan">2.3x más FTD</span> que el promedio de la campaña.
      </p>
      <div className="mt-4 rounded-xl bg-white/[0.04] p-3.5 ring-1 ring-white/10">
        <div className="mb-2 text-[12px] font-semibold text-ink">Impacto estimado</div>
        <div className="flex items-center gap-2 text-[13px]"><TrendingUp size={15} className="text-lime" /><span className="font-semibold text-lime">+1.480 FTD adicionales</span></div>
        <div className="mt-1.5 flex items-center gap-2 text-[13px]"><TrendingDown size={15} className="text-lime" /><span className="font-semibold text-lime">−$640 costo por FTD</span></div>
      </div>
      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan/10 px-4 py-2.5 text-[13px] font-semibold text-cyan ring-1 ring-cyan/25 transition-colors hover:bg-cyan/15">
        Ver recomendaciones <ArrowRight size={15} />
      </button>
    </div>
  );
}

const REC_ICON = [BarChart3, Images, Heart, Play, Target];
function Recs() {
  return (
    <div className={`${card} p-5`}>
      <h3 className="mb-4 text-[15px] font-bold text-ink">Recomendaciones accionables</h3>
      <div className="flex flex-col gap-2.5">
        {recomendaciones.map((r, i) => {
          const Icon = REC_ICON[i] ?? Target;
          const alta = r.prioridad === "Alta";
          return (
            <div key={i} className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-white/5">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cyan/12 text-cyan"><Icon size={16} /></div>
              <span className="flex-1 text-[12.5px] font-medium leading-snug text-ink-soft">{r.texto}</span>
              <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ${alta ? "bg-rose/12 text-rose ring-rose/25" : "bg-amber/12 text-amber ring-amber/25"}`}>{r.prioridad}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PanelResultados() {
  return (
    <Wrap>
      <PageHeader
        icon={<Target size={24} />}
        titulo="Centro de optimización"
        subtitulo={<>
          <span>{cliente.campania}</span>
          <span className="text-ink-mute">·</span>
          <span>{cliente.ventana}</span>
          <Chip>Últimos 7 días <ChevronDown size={13} /></Chip>
        </>}
        right={
          <button className="glass glass-hover inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-semibold text-ink">
            <FileDown size={15} className="text-cyan" /> Exportar reporte
          </button>
        }
      />

      <motion.section variants={container} initial="hidden" animate="show" className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
        {kpis.map((k) => <KpiCard key={k.id} k={k} />)}
      </motion.section>

      <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Embudo />
        <Tabla />
      </section>

      <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="xl:col-span-5"><ContenidoTop /></div>
        <div className="xl:col-span-3"><Insights /></div>
        <div className="xl:col-span-4"><Recs /></div>
      </section>

      <footer className="mt-6 flex items-center justify-between text-[12px] text-ink-mute">
        <span>Métricas agregadas de los últimos 7 días · inversión en CLP.</span>
        <span className="flex items-center gap-1.5 font-medium text-ink-soft"><Zap size={13} className="text-cyan" /> Optimiza. Escala. Juega responsable.</span>
        <span className="w-48" />
      </footer>
    </Wrap>
  );
}
