import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, TrendingDown, Activity, Users, MapPin, Shield, Swords, Target, ArrowRight, Sparkles, BookOpen, ExternalLink, ChevronDown, Tv } from "lucide-react";
import { analisis, oportunidades, competidores, acentoHex, fmt, cliente, fuentesAnalisis } from "../lib/data";

const amenazaColor: Record<string, string> = { alta: "var(--color-rose)", media: "var(--color-amber)", baja: "var(--color-lime)" };

export function Analisis({ onGenerar }: { onGenerar: () => void }) {
  const a = analisis;
  const [verFuentes, setVerFuentes] = useState(false);
  return (
    <div className="h-full overflow-y-auto px-8 py-7">
      <div className="mx-auto max-w-6xl space-y-5">
        {/* header del análisis + acceso a fuentes */}
        <div className="flex items-center justify-between">
          <div className="kicker">Análisis de marca · {cliente.marca} · respaldado por research</div>
          <button
            onClick={() => setVerFuentes((v) => !v)}
            className="glass glass-hover flex items-center gap-2 rounded-xl px-3.5 py-2 text-[12px] font-semibold text-content-secondary transition-colors hover:text-content"
          >
            <BookOpen size={14} className="text-cyan" /> Ver fuentes
            <span className="rounded-md bg-cyan/15 px-1.5 py-0.5 font-mono text-[10px] text-cyan">{fuentesAnalisis.length}</span>
            <ChevronDown size={14} className={"transition-transform " + (verFuentes ? "rotate-180" : "")} />
          </button>
        </div>

        <FuentesPanel open={verFuentes} />

        {/* crisis banner */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass relative overflow-hidden rounded-2xl border-rose/30 p-5">
          <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-rose/15 blur-3xl" />
          <div className="relative flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-rose/40 bg-rose/10 text-rose"><AlertTriangle size={18} /></span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold text-content">{a.crisis.titulo}</span>
                <span className="chip py-0.5 text-rose" style={{ borderColor: "var(--color-rose)" }}>severidad {a.crisis.severidad}</span>
              </div>
              <p className="mt-1 max-w-3xl text-[12.5px] leading-snug text-content-secondary">{a.crisis.detalle}</p>
            </div>
          </div>
        </motion.div>

        {/* jugada destacada (hallazgo resaltado · ej. alianza Chilevisión / Mundial) */}
        {a.jugadaDestacada && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass glass-accent relative overflow-hidden rounded-2xl p-5">
            <div className="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-cyan/20 blur-3xl" />
            <div className="relative flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-cyan/40 bg-cyan/10 text-cyan"><Tv size={18} /></span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-cyan px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-void">Nuevo</span>
                  <span className="kicker">{a.jugadaDestacada.tag}</span>
                </div>
                <div className="mt-1.5 font-display text-[16px] font-bold leading-tight text-content">{a.jugadaDestacada.titulo}</div>
                <p className="mt-1 max-w-3xl text-[12.5px] leading-snug text-content-secondary">{a.jugadaDestacada.detalle}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* health KPIs */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Kpi icon={Activity} label="Sentimiento" value={`${a.sentimiento}%`} extra={`${a.tendenciaSentimiento}% vs. mes ant.`} down />
          <Kpi icon={Target} label="Share of voice" value={`${a.sov}%`} extra="líder del rubro" />
          <Kpi icon={Users} label="Comunidad IG" value={fmt(a.seguidoresIG)} extra={a.comunidadExtra} />
          <Kpi icon={MapPin} label={a.kpiLider.label} value={a.kpiLider.value} extra={a.kpiLider.extra} />
        </div>

        {/* competencia */}
        <div>
          <SectionHead icon={Swords} title="Mapa competitivo" sub="Quién ataca y por dónde" />
          <div className="grid gap-2.5 md:grid-cols-3">
            {competidores.map((k, i) => (
              <motion.div key={k.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="glass rounded-xl p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[13.5px] font-bold text-content">{k.nombre}</span>
                  <span className="font-mono text-[10px]" style={{ color: amenazaColor[k.amenaza] }}>amenaza {k.amenaza}</span>
                </div>
                <p className="mt-1 text-[11.5px] leading-snug text-content-secondary">{k.territorio}</p>
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--sf-2)]"><div className="h-full rounded-full bg-gradient-to-r from-cyan to-violet" style={{ width: `${k.sov}%` }} /></div>
                  <span className="font-mono text-[10px] text-content-secondary">{k.sov}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* fortalezas / amenazas */}
        <div className="grid gap-3 md:grid-cols-2">
          <ListCard icon={Shield} title="Fortalezas" color="var(--color-lime)" items={a.fortalezas} />
          <ListCard icon={TrendingDown} title="Amenazas" color="var(--color-rose)" items={a.amenazas} />
        </div>

        {/* oportunidades */}
        <div>
          <SectionHead icon={Sparkles} title="Oportunidades detectadas" sub="El cerebro ya formó estas redes con los insights" />
          <div className="grid gap-3 md:grid-cols-2">
            {oportunidades.map((o, i) => {
              const color = acentoHex[o.acento];
              return (
                <motion.div key={o.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="group glass flex flex-col rounded-2xl p-4 transition-colors" style={{ borderColor: `${color}40` }}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider" style={{ background: `${color}1f`, color }}>{o.territorio}</span>
                    {o.impacto === "alto" && <span className="chip py-0.5 text-amber">impacto alto</span>}
                  </div>
                  <div className="font-display text-[16px] font-bold leading-tight text-content">{o.titulo}</div>
                  <p className="mt-1 flex-1 text-[12px] leading-snug text-content-secondary">{o.detalle}</p>
                  <button onClick={onGenerar} className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-line py-2.5 text-[12px] font-semibold transition-colors hover:text-void" style={{ color }} onMouseEnter={(e) => (e.currentTarget.style.background = color)} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <Sparkles size={14} /> Generar campaña <ArrowRight size={14} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="glass flex items-center justify-between rounded-2xl p-5">
          <div>
            <div className="font-display text-[16px] font-bold text-content">¿Pasamos del análisis a la acción?</div>
            <p className="text-[12px] text-content-secondary">Sigma puede armar la campaña para {cliente.marca} a partir de estas oportunidades.</p>
          </div>
          <button onClick={onGenerar} className="group flex items-center gap-2.5 rounded-xl bg-cyan px-5 py-3 text-[13px] font-semibold text-void transition-all hover:shadow-[0_0_28px_-4px_var(--color-cyan)]">
            Crear nueva campaña <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function FuentesPanel({ open }: { open: boolean }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="glass glass-accent rounded-2xl p-4">
            <div className="mb-3 flex items-center gap-2">
              <BookOpen size={15} className="text-cyan" />
              <span className="text-[13px] font-bold text-content">Fuentes del análisis</span>
              <span className="kicker">de dónde salió cada lectura</span>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {fuentesAnalisis.map((f, i) => {
                const real = f.url !== "#";
                const Tag = real ? "a" : "div";
                return (
                  <motion.div key={f.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Tag
                      {...(real ? { href: f.url, target: "_blank", rel: "noreferrer" } : {})}
                      className={"group glass flex items-start gap-3 rounded-xl p-3 transition-colors " + (real ? "glass-hover" : "")}
                    >
                      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-line bg-[var(--sf-1)] font-mono text-[10px] text-cyan">{i + 1}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[12.5px] font-semibold leading-snug text-content">{f.titulo}</span>
                        <span className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] text-ink-mute">
                          <span className="chip py-0 text-[9px]">{f.tipo}</span>
                          {f.fuente} · {f.fecha}
                        </span>
                      </span>
                      {real && <ExternalLink size={13} className="mt-0.5 shrink-0 text-ink-mute transition-colors group-hover:text-cyan" />}
                    </Tag>
                  </motion.div>
                );
              })}
            </div>
            <p className="mt-3 flex items-center gap-1.5 font-mono text-[10px] text-ink-mute">
              <Sparkles size={11} className="text-cyan" /> Las métricas de talento y sentimiento son estimaciones para planificación.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Kpi({ icon: Icon, label, value, extra, down }: { icon: any; label: string; value: string; extra: string; down?: boolean }) {
  return (
    <div className="glass rounded-2xl p-4">
      <Icon size={16} className="text-cyan" />
      <div className="mt-3 font-display text-[26px] font-extrabold leading-none text-content">{value}</div>
      <div className="kicker mt-1.5">{label}</div>
      <div className={"mt-1 font-mono text-[10px] " + (down ? "text-rose" : "text-ink-mute")}>{extra}</div>
    </div>
  );
}
function ListCard({ icon: Icon, title, color, items }: { icon: any; title: string; color: string; items: string[] }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-2.5 flex items-center gap-2"><Icon size={15} style={{ color }} /><span className="text-[13px] font-bold text-content">{title}</span></div>
      <div className="space-y-2">
        {items.map((it) => <div key={it} className="flex items-start gap-2 text-[12px] text-content-secondary"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: color }} /> {it}</div>)}
      </div>
    </div>
  );
}
function SectionHead({ icon: Icon, title, sub }: { icon: any; title: string; sub: string }) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-[var(--sf-1)] text-cyan"><Icon size={15} /></span>
      <div><div className="text-[14px] font-bold text-content">{title}</div><div className="kicker">{sub}</div></div>
    </div>
  );
}
