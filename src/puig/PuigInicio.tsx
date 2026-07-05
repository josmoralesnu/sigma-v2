import { useMemo } from "react";
import { motion } from "motion/react";
import {
  Activity, TrendingUp, Sparkles, ChevronRight, Heart, MessageCircle, Target, Network,
} from "lucide-react";
import { Wrap, PageHeader, container, item } from "../centro/parts";
import { SubLogo, PuigLogo } from "./brand";
import { puigResumen, submarcaById, fmtK } from "./pdata";

/* análisis/insight por submarca (nivel marca) */
const SUB_ANALISIS: Record<string, { salud: "fuerte" | "sólida" | "en foco"; insight: string; oportunidad: string }> = {
  ch: { salud: "fuerte", insight: "Good Girl lidera awareness; el squad de verano sostiene el alcance.", oportunidad: "Escalar 212 VIP con creadoras de nightlife." },
  rabanne: { salud: "fuerte", insight: "1 Million domina volumen de seeding; Phantom conecta con gamers.", oportunidad: "Activar colaboración gaming/streamers para Phantom." },
  jpg: { salud: "sólida", insight: "Le Male mantiene ER alto con nicho fragancia masculina.", oportunidad: "Sumar creadores de moda para ampliar alcance." },
  ct: { salud: "en foco", insight: "Charlotte Tilbury lidera engagement y sentimiento (beauty).", oportunidad: "Lanzar Magic Cream con rutina skincare + unboxing." },
};
const SALUD_COLOR: Record<string, string> = { fuerte: "#86b04a", "sólida": "#c9a24b", "en foco": "#6f93c4" };

export function PuigInicio({ onOpenSubmarca, onCerebro, onDashboard }: { onOpenSubmarca: (id: string) => void; onCerebro: () => void; onDashboard: () => void }) {
  const r = useMemo(() => puigResumen(), []);

  return (
    <Wrap>
      <PageHeader icon={<Activity size={22} />} titulo="Inicio · Análisis de marca" subtitulo={<span>Salud de Puig y de cada submarca en Chile</span>} />

      {/* hero salud de marca */}
      <motion.div variants={container} initial="hidden" animate="show" className="glass mb-4 overflow-hidden rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-cyan/8 to-transparent px-6 py-5">
          <div className="flex items-center gap-3.5">
            <PuigLogo h={54} />
            <div>
              <h2 className="font-display text-[20px] font-bold text-content">Salud de marca · sólida</h2>
              <p className="text-[12.5px] text-content-muted">Sentimiento {r.sentimiento}/100 · {r.campanas} campañas activas · {r.submarcas.length} submarcas</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Mini icon={<Heart size={14} />} label="Engagement prom." value={`${r.er}%`} />
            <Mini icon={<MessageCircle size={14} />} label="Sentimiento" value={String(r.sentimiento)} accent />
            <Mini icon={<TrendingUp size={14} />} label="Alcance" value={fmtK(r.alcance)} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 px-6 py-3">
          <button onClick={onCerebro} className="inline-flex items-center gap-1.5 rounded-xl bg-cyan px-3.5 py-2 text-[12.5px] font-semibold text-content-inverted transition-transform hover:scale-[1.02]"><Network size={14} /> Abrir el Cerebro</button>
          <button onClick={onDashboard} className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--sf-1)] px-3.5 py-2 text-[12.5px] font-semibold text-content-secondary ring-1 ring-[var(--ln-1)] transition-colors hover:bg-[var(--hov)] hover:text-content"><TrendingUp size={14} /> Ver dashboard</button>
        </div>
      </motion.div>

      {/* análisis por submarca */}
      <h2 className="mb-3 flex items-center gap-2 font-display text-[17px] font-bold text-content"><Sparkles size={17} className="text-cyan" /> Análisis por submarca</h2>
      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-3 md:grid-cols-2">
        {r.submarcas.map((s) => {
          const sm = submarcaById(s.id)!;
          const a = SUB_ANALISIS[s.id];
          const saludCol = SALUD_COLOR[a?.salud ?? "sólida"];
          return (
            <motion.button key={s.id} variants={item} onClick={() => onOpenSubmarca(s.id)} className="glass group rounded-2xl p-5 text-left transition-all hover:ring-1 hover:ring-cyan/30">
              <div className="flex items-center justify-between">
                <SubLogo id={s.id} w={128} h={40} />
                <span className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold capitalize" style={{ background: `${saludCol}1c`, color: saludCol }}><span className="h-1.5 w-1.5 rounded-full" style={{ background: saludCol }} /> {a?.salud}</span>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                <Stat label="Alcance" value={fmtK(s.alcance)} />
                <Stat label="ER" value={`${s.er}%`} />
                <Stat label="Sentim." value={String(s.sentimiento)} />
                <Stat label="Camp." value={String(s.campanas)} />
              </div>
              <p className="mt-3 text-[12.5px] text-content-secondary">{a?.insight}</p>
              <div className="mt-2 flex items-start gap-2 rounded-xl bg-cyan/8 px-3 py-2 ring-1 ring-cyan/15">
                <Target size={14} className="mt-0.5 shrink-0 text-cyan" />
                <span className="text-[12px] text-content-secondary"><b className="font-semibold text-cyan">Oportunidad:</b> {a?.oportunidad}</span>
              </div>
              <div className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-cyan">Ver campañas <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" /></div>
            </motion.button>
          );
        })}
      </motion.div>
    </Wrap>
  );
}

function Mini({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl px-3.5 py-2.5 ring-1 ${accent ? "bg-cyan/10 ring-cyan/25" : "bg-[var(--sf-1)] ring-[var(--ln-1)]"}`}>
      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-content-muted">{icon}{label}</div>
      <div className={`mt-1 font-display text-[20px] font-bold leading-none ${accent ? "text-cyan" : "text-content"}`}>{value}</div>
    </div>
  );
}
function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-[var(--sf-1)] py-1.5 ring-1 ring-[var(--ln-1)]"><div className="text-[13.5px] font-bold text-content">{value}</div><div className="text-[9px] uppercase tracking-wide text-content-muted">{label}</div></div>;
}
