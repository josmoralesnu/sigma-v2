import { useMemo } from "react";
import { motion } from "motion/react";
import {
  Eye, TrendingUp, TrendingDown, MessageCircle, DollarSign, Users, ImageIcon, ChevronRight,
  Sparkles, Camera, Music2, MonitorPlay, Layers, Lightbulb, Send, CheckCircle2, CalendarDays, Clock,
} from "lucide-react";
import { Wrap, container, item } from "../centro/parts";
import { SubLogo, PuigLogo } from "./brand";
import {
  puigResumen, submarcaById, fmtK, audienciaRollup, entregablesPuig, BENCHMARK_PUIG, INSIGHTS_PUIG,
  type Plataforma, type Contenido, type BenchItem,
} from "./pdata";

const clp = (n: number) => "$" + (n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + "M" : n >= 1000 ? Math.round(n / 1000) + "K" : String(n));
const PLAT_ICON: Record<Plataforma, any> = { Instagram: Camera, TikTok: Music2, Reel: MonitorPlay };

export function PuigDashboard({ onOpenSubmarca, onVerCampanas, onVerSentimiento }: { onOpenSubmarca: (id: string) => void; onVerCampanas: () => void; onVerSentimiento: () => void }) {
  const r = useMemo(() => puigResumen(), []);
  const entregables = useMemo(() => entregablesPuig(), []);

  return (
    <Wrap>
      {/* hero */}
      <motion.div variants={container} initial="hidden" animate="show" className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <PuigLogo h={64} />
          <div>
            <h1 className="font-display text-[26px] font-bold leading-tight text-content">Puig · Chile</h1>
            <p className="text-[13px] text-content-muted">{r.campanas} campañas medidas · {r.submarcas.length} submarcas · vista de marca</p>
          </div>
        </div>
      </motion.div>

      {/* KPIs a nivel marca */}
      <motion.div variants={container} initial="hidden" animate="show" className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Kpi icon={<Eye size={15} />} label="Alcance acumulado" value={fmtK(r.alcance)} accent />
        <Kpi icon={<TrendingUp size={15} />} label="Engagement prom." value={`${r.er}%`} />
        <Kpi icon={<MessageCircle size={15} />} label="Sentimiento" value={String(r.sentimiento)} sub="índice /100" />
        <Kpi icon={<DollarSign size={15} />} label="EMV total" value={clp(r.emv)} />
        <Kpi icon={<Users size={15} />} label="Microinfluencers" value={String(r.micro)} />
        <Kpi icon={<DollarSign size={15} />} label="Costo / 1K alcance" value={clp(r.cpr)} />
      </motion.div>

      {/* Rendimiento por submarca — protagonista */}
      <div className="mb-3 flex items-center gap-2">
        <Layers size={16} className="text-cyan" />
        <h2 className="font-display text-[17px] font-bold text-content">Rendimiento por submarca</h2>
        <span className="text-[12px] text-content-muted">— la marca manda; entra al detalle desde aquí</span>
      </div>
      <motion.div variants={container} initial="hidden" animate="show" className="mb-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {r.submarcas.map((s) => {
          const sm = submarcaById(s.id)!;
          return (
            <motion.button key={s.id} variants={item} onClick={() => onOpenSubmarca(s.id)}
              className="glass group rounded-2xl p-4 text-left transition-all hover:ring-1 hover:ring-cyan/30">
              <div className="flex items-center justify-between">
                <SubLogo id={s.id} w={128} h={40} />
                <span className="inline-flex items-center gap-0.5 rounded-lg px-2 py-1 text-[12px] font-bold" style={{ background: `${sm.tint}1e`, color: sm.tint }}>{s.share}%</span>
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <div className="font-display text-[22px] font-bold leading-none text-content">{fmtK(s.alcance)}</div>
                  <div className="text-[11px] text-content-muted">alcance · {s.campanas} camp.</div>
                </div>
                <ChevronRight size={16} className="text-content-muted transition-transform group-hover:translate-x-0.5 group-hover:text-cyan" />
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--sf-2)]">
                <motion.div className="h-full rounded-full" style={{ background: sm.tint }} initial={{ width: 0 }} animate={{ width: `${s.share}%` }} transition={{ duration: 0.8 }} />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
                <Mini label="ER" value={`${s.er}%`} />
                <Mini label="Sentim." value={String(s.sentimiento)} />
                <Mini label="Content." value={String(s.contenidos)} />
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* fila 1: piezas · plataforma · audiencia · sentimiento */}
      <div className="mb-3 grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
        <TopContenidos data={r.topContenidos} onVerMas={onVerCampanas} />
        <Plataformas data={r.plataformas} onVerMas={onVerCampanas} />
        <Audiencia onVerMas={onVerCampanas} />
        <SentimientoGeneral indice={r.sentimiento} onVerMas={onVerSentimiento} />
      </div>

      {/* fila 2: entregables · benchmark · insights */}
      <div className="grid gap-3 lg:grid-cols-3">
        <Entregables e={entregables} onVerMas={onVerCampanas} />
        <Benchmark data={BENCHMARK_PUIG} onVerMas={onVerCampanas} />
        <Insights data={INSIGHTS_PUIG} onVerMas={onVerCampanas} />
      </div>
    </Wrap>
  );
}

function Cta({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--sf-1)] px-3 py-2 text-[12px] font-semibold text-cyan ring-1 ring-[var(--ln-1)] transition-colors hover:bg-cyan/12">
      {children} <ChevronRight size={13} />
    </button>
  );
}
function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <motion.div variants={item} initial="hidden" animate="show" className="glass flex flex-col rounded-2xl p-5">
      <div className="mb-3 flex items-center gap-2 font-display text-[14.5px] font-bold text-content">{icon} {title}</div>
      <div className="flex-1">{children}</div>
    </motion.div>
  );
}

function TopContenidos({ data, onVerMas }: { data: Contenido[]; onVerMas: () => void }) {
  return (
    <Card title="Top piezas" icon={<ImageIcon size={15} className="text-cyan" />}>
      <div className="space-y-2">
        {data.map((c) => {
          const Icon = PLAT_ICON[c.plataforma];
          return (
            <div key={c.id} className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[18px]" style={{ background: `radial-gradient(120% 120% at 50% 0%, ${c.fotoTint}55, ${c.fotoTint}18)` }}>{c.avatar}</span>
              <div className="min-w-0 flex-1"><div className="truncate text-[12px] font-semibold text-content">{c.handle}</div><div className="flex items-center gap-1 text-[10.5px] text-content-muted"><Icon size={10} /> {c.plataforma}</div></div>
              <div className="text-right"><div className="text-[12.5px] font-bold text-content">{fmtK(c.alcance)}</div><div className="text-[10px] text-content-muted">ER {c.er}%</div></div>
            </div>
          );
        })}
      </div>
      <Cta onClick={onVerMas}>Ver todas las piezas</Cta>
    </Card>
  );
}

function Audiencia({ onVerMas }: { onVerMas: () => void }) {
  const a = useMemo(() => audienciaRollup(), []);
  return (
    <Card title="Audiencia" icon={<Users size={15} className="text-cyan" />}>
      <div className="mb-2 text-[10.5px] text-content-muted">Rollup de todos los microinfluencers · ponderado por seguidores</div>
      <div className="mb-3 space-y-1.5">
        {a.edad.map((e) => (
          <div key={e.rango} className="flex items-center gap-2 text-[11px]">
            <span className="w-12 text-content-muted">{e.rango}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--sf-2)]"><motion.div className="h-full rounded-full bg-cyan" initial={{ width: 0 }} animate={{ width: `${e.pct}%` }} transition={{ duration: 0.7 }} /></div>
            <span className="w-8 text-right font-semibold text-content">{e.pct}%</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-line pt-2.5 text-[11.5px]">
        <span className="text-content-secondary">Género</span>
        <span className="font-semibold text-content">{a.generoF}% mujeres · {100 - a.generoF}% hombres</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {a.ciudades.slice(0, 4).map((ci) => <span key={ci.ciudad} className="rounded-md bg-[var(--sf-1)] px-2 py-0.5 text-[10.5px] text-content-secondary ring-1 ring-[var(--ln-1)]">{ci.ciudad} {ci.pct}%</span>)}
      </div>
      <Cta onClick={onVerMas}>Ver audiencia completa</Cta>
    </Card>
  );
}

function Entregables({ e, onVerMas }: { e: { brief: number; aprobados: number; publicados: number; pendientes: number }; onVerMas: () => void }) {
  const items = [
    { label: "Brief enviado", value: e.brief, icon: <Send size={15} />, tint: "#6f93c4" },
    { label: "Contenido aprobado", value: e.aprobados, icon: <CheckCircle2 size={15} />, tint: "#86b04a" },
    { label: "Publicado", value: e.publicados, icon: <CalendarDays size={15} />, tint: "#c9a24b" },
    { label: "Pendiente", value: e.pendientes, icon: <Clock size={15} />, tint: "#e06a86" },
  ];
  return (
    <Card title="Estado de entregables" icon={<CheckCircle2 size={15} className="text-cyan" />}>
      <div className="grid grid-cols-2 gap-2.5">
        {items.map((it) => (
          <div key={it.label} className="rounded-xl bg-[var(--sf-1)] p-3 ring-1 ring-[var(--ln-1)]">
            <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: `${it.tint}1c`, color: it.tint }}>{it.icon}</span>
            <div className="mt-2 font-display text-[22px] font-bold leading-none text-content">{it.value}</div>
            <div className="mt-1 text-[10.5px] text-content-muted">{it.label}</div>
          </div>
        ))}
      </div>
      <Cta onClick={onVerMas}>Ver entregables</Cta>
    </Card>
  );
}

function Benchmark({ data, onVerMas }: { data: BenchItem[]; onVerMas: () => void }) {
  return (
    <Card title="Benchmark vs. período anterior" icon={<TrendingUp size={15} className="text-cyan" />}>
      <div className="grid grid-cols-5 gap-1.5">
        {data.map((b) => {
          const positivo = b.bueno; const col = positivo ? "#86b04a" : "#e06a86";
          const Arrow = b.up ? TrendingUp : TrendingDown;
          return (
            <div key={b.key} className="rounded-lg bg-[var(--sf-1)] px-1.5 py-2 text-center ring-1 ring-[var(--ln-1)]">
              <div className="text-[9.5px] uppercase tracking-wide text-content-muted">{b.label}</div>
              <div className="mt-1 inline-flex items-center gap-0.5 text-[12.5px] font-bold" style={{ color: col }}><Arrow size={11} /> {b.delta}{b.key === "er" ? "pp" : "%"}</div>
            </div>
          );
        })}
      </div>
      <Cta onClick={onVerMas}>Ver benchmark completo</Cta>
    </Card>
  );
}

function Insights({ data, onVerMas }: { data: string[]; onVerMas: () => void }) {
  return (
    <Card title="Insights & recomendaciones" icon={<Lightbulb size={15} className="text-cyan" />}>
      <div className="space-y-2.5">
        {data.map((t, i) => (
          <div key={i} className="flex gap-2.5 text-[12px] text-content-secondary">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
            <p>{t.split(/(\*\*[^*]+\*\*)/g).map((x, j) => x.startsWith("**") ? <b key={j} className="font-semibold text-content">{x.slice(2, -2)}</b> : <span key={j}>{x}</span>)}</p>
          </div>
        ))}
      </div>
      <Cta onClick={onVerMas}>Ver todas las recomendaciones</Cta>
    </Card>
  );
}

function Kpi({ icon, label, value, sub, accent }: { icon: React.ReactNode; label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <motion.div variants={item} className={`glass rounded-2xl p-3.5 ${accent ? "ring-1 ring-cyan/30" : ""}`}>
      <div className="flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-wide text-content-muted">{icon}{label}</div>
      <div className={`mt-1.5 font-display text-[22px] font-bold leading-none ${accent ? "text-cyan" : "text-content"}`}>{value}</div>
      {sub && <div className="mt-1 text-[10.5px] text-content-muted">{sub}</div>}
    </motion.div>
  );
}
function Mini({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-[var(--sf-1)] py-1.5 ring-1 ring-[var(--ln-1)]"><div className="text-[13px] font-bold text-content">{value}</div><div className="text-[9px] uppercase tracking-wide text-content-muted">{label}</div></div>;
}

function SentimientoGeneral({ indice, onVerMas }: { indice: number; onVerMas: () => void }) {
  const C = 2 * Math.PI * 34;
  const pos = 61, neg = 8, neu = 31;
  return (
    <motion.div variants={item} initial="hidden" animate="show" className="glass flex flex-col rounded-2xl p-5">
      <div className="mb-3 flex items-center gap-2 font-display text-[14.5px] font-bold text-content"><MessageCircle size={15} className="text-cyan" /> Sentimiento general</div>
      <div className="flex flex-1 items-center gap-4">
        <div className="relative grid place-items-center">
          <svg width="86" height="86" className="-rotate-90">
            <circle cx="43" cy="43" r="34" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="7" />
            <motion.circle cx="43" cy="43" r="34" fill="none" stroke="#86b04a" strokeWidth="7" strokeLinecap="round" strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - indice / 100) }} transition={{ duration: 1 }} />
          </svg>
          <div className="absolute text-center"><div className="font-display text-[22px] font-bold text-content">{indice}</div><div className="text-[9px] uppercase text-content-muted">índice</div></div>
        </div>
        <div className="flex-1 space-y-2">
          {[["Positivo", pos, "#86b04a"], ["Neutro", neu, "#c79a52"], ["Negativo", neg, "#e06a86"]].map(([l, v, col]) => (
            <div key={l as string}>
              <div className="mb-0.5 flex justify-between text-[11px]"><span className="text-content-secondary">{l}</span><span className="font-semibold text-content">{v}%</span></div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[var(--sf-2)]"><motion.div className="h-full rounded-full" style={{ background: col as string }} initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.7 }} /></div>
            </div>
          ))}
        </div>
      </div>
      <Cta onClick={onVerMas}>Ver análisis de sentimiento</Cta>
    </motion.div>
  );
}

const PLAT_COLOR: Record<Plataforma, string> = { Reel: "#c9a24b", TikTok: "#d1859c", Instagram: "#6f93c4" };
function Plataformas({ data, onVerMas }: { data: { plat: Plataforma; alcance: number; pct: number }[]; onVerMas: () => void }) {
  const total = data.reduce((a, p) => a + p.alcance, 0) || 1;
  const R = 40, SW = 16, C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <motion.div variants={item} initial="hidden" animate="show" className="glass flex flex-col rounded-2xl p-5">
      <div className="mb-3 flex items-center gap-2 font-display text-[14.5px] font-bold text-content"><Sparkles size={15} className="text-cyan" /> Alcance por plataforma</div>
      <div className="flex flex-1 items-center gap-4">
        <div className="relative grid shrink-0 place-items-center">
          <svg width="112" height="112" className="-rotate-90">
            {data.map((p) => {
              const frac = p.alcance / total;
              const seg = (
                <motion.circle key={p.plat} cx="56" cy="56" r={R} fill="none" stroke={PLAT_COLOR[p.plat]} strokeWidth={SW}
                  strokeDasharray={`${frac * C} ${C}`} strokeDashoffset={-acc * C}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />
              );
              acc += frac;
              return seg;
            })}
          </svg>
          <div className="absolute text-center"><div className="font-display text-[17px] font-bold text-content">{fmtK(total)}</div><div className="text-[8.5px] uppercase text-content-muted">total</div></div>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((p) => {
            const Icon = PLAT_ICON[p.plat];
            return (
              <div key={p.plat} className="flex items-center gap-2 text-[12px]">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: PLAT_COLOR[p.plat] }} />
                <Icon size={13} className="text-content-muted" />
                <span className="flex-1 text-content-secondary">{p.plat}</span>
                <span className="font-semibold text-content">{p.pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
      <Cta onClick={onVerMas}>Ver desempeño por plataforma</Cta>
    </motion.div>
  );
}
