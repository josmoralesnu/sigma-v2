import { useState } from "react";
import { motion } from "motion/react";
import {
  Users, Send, ChevronRight, Package, BarChart3, Layers,
} from "lucide-react";
import { Wrap, PageHeader, container, item } from "../centro/parts";
import { SubLogo, SubTile } from "./brand";
import {
  submarcas, campañasDeSubmarca, pcampañas, campañaAbierta, fmtK,
  type PCampaña, type CampañaEstado,
} from "./pdata";

const EST_META: Record<CampañaEstado, string> = {
  "Activa": "#86b04a",
  "En casting": "#c9a24b",
  "En envío": "#6f93c4",
  "Cerrada": "#8b8b93",
};

export function Submarcas({ onCasting, onCanjes, onOpenCampaña, initialSub = "todas" }: { onCasting: () => void; onCanjes: () => void; onOpenCampaña: (id: string) => void; initialSub?: string }) {
  const [sel, setSel] = useState<"todas" | string>(initialSub);
  const [soloAbiertas, setSoloAbiertas] = useState(true);

  // fuente filtrada por submarca + estado
  const base = sel === "todas" ? pcampañas : campañasDeSubmarca(sel);
  const visibles = soloAbiertas ? base.filter(campañaAbierta) : base;

  // agrupadas por submarca (para el render)
  const grupos = submarcas
    .map((s) => ({ sub: s, camps: visibles.filter((c) => c.submarca === s.id) }))
    .filter((g) => g.camps.length > 0);

  const ocultas = base.length - visibles.length;

  return (
    <Wrap>
      <PageHeader icon={<Layers size={22} />} titulo="Submarcas & campañas" subtitulo={<span>Filtra por submarca · las campañas abiertas primero</span>} />

      {/* ===== Filtros ===== */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip active={sel === "todas"} onClick={() => setSel("todas")} icon={<Layers size={13} />}>Todas</FilterChip>
          {submarcas.map((s) => (
            <FilterChip key={s.id} active={sel === s.id} onClick={() => setSel(s.id)} tint={s.tint}>
              <SubTile id={s.id} size={20} className="!rounded-md" /> {s.nombre.split(" ")[0]}
            </FilterChip>
          ))}
        </div>
        <div className="flex items-center gap-1 rounded-xl bg-[var(--sf-1)] p-1 ring-1 ring-[var(--ln-1)]">
          {[["Abiertas", true], ["Todas", false]].map(([l, v]) => (
            <button key={l as string} onClick={() => setSoloAbiertas(v as boolean)}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-colors ${soloAbiertas === v ? "bg-cyan text-content-inverted" : "text-content-secondary hover:text-content"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>
      {soloAbiertas && ocultas > 0 && (
        <p className="mb-4 text-[11.5px] text-content-muted">{ocultas} campaña{ocultas > 1 ? "s" : ""} cerrada{ocultas > 1 ? "s" : ""} o con despacho completo oculta{ocultas > 1 ? "s" : ""} · <button onClick={() => setSoloAbiertas(false)} className="font-semibold text-cyan hover:underline">ver todas</button></p>
      )}

      {/* ===== Campañas agrupadas por submarca ===== */}
      {grupos.map((g) => (
        <div key={g.sub.id} className="mb-6">
          <div className="mb-3 flex items-center gap-2.5">
            <SubLogo id={g.sub.id} w={92} h={30} />
            <h2 className="font-display text-[16px] font-bold text-content">{g.sub.nombre}</h2>
            <span className="text-[12px] text-content-muted">· {g.camps.length} campaña{g.camps.length > 1 ? "s" : ""}</span>
            <span className="ml-1 rounded-md bg-[var(--sf-1)] px-2 py-0.5 text-[10.5px] text-content-secondary ring-1 ring-[var(--ln-1)]">{g.sub.linea}</span>
          </div>
          <motion.div variants={container} initial="hidden" animate="show" className="grid gap-3 md:grid-cols-2">
            {g.camps.map((c) => (
              <CampCard key={c.id} c={c} tint={g.sub.tint} onCasting={onCasting} onCanjes={onCanjes} onOpen={() => onOpenCampaña(c.id)} />
            ))}
          </motion.div>
        </div>
      ))}
      {grupos.length === 0 && <div className="glass rounded-2xl py-14 text-center text-[13px] text-content-muted">No hay campañas para este filtro.</div>}
    </Wrap>
  );
}

function FilterChip({ active, onClick, children, icon, tint }: { active: boolean; onClick: () => void; children: React.ReactNode; icon?: React.ReactNode; tint?: string }) {
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[12.5px] font-semibold transition-colors ring-1 ${active ? "bg-[var(--sf-3)] text-content" : "bg-[var(--sf-1)] text-content-secondary ring-[var(--ln-1)] hover:text-content"}`}
      style={active && tint ? { boxShadow: `inset 0 0 0 1px ${tint}` } : undefined}>
      {icon}{children}
    </button>
  );
}

/* ============================ CAMP CARD ============================ */
function CampCard({ c, tint, onCasting, onCanjes, onOpen }: { c: PCampaña; tint: string; onCasting: () => void; onCanjes: () => void; onOpen: () => void }) {
  const est = EST_META[c.estado];
  const activo = c.estado !== "En casting";
  const canjePct = c.canjesTotal ? Math.round((c.canjesEnviados / c.canjesTotal) * 100) : 0;
  const stop = (fn: () => void) => (e: React.MouseEvent) => { e.stopPropagation(); fn(); };
  return (
    <motion.div variants={item} onClick={onOpen} className="glass group cursor-pointer rounded-2xl p-5 transition-all hover:ring-1 hover:ring-cyan/30">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-1.5 font-display text-[16px] font-bold text-content">
            {c.nombre}
            <ChevronRight size={15} className="text-content-muted transition-transform group-hover:translate-x-0.5 group-hover:text-cyan" />
          </h3>
          <p className="text-[12px] text-content-muted">{c.producto} · {c.ventana}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold" style={{ background: `${est}1c`, color: est }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: est }} /> {c.estado}
        </span>
      </div>

      {/* métricas protagonistas */}
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <BigStat label="Alcance" value={activo ? fmtK(c.alcance) : "—"} accent />
        <BigStat label="Engagement" value={activo ? `${c.engagement}%` : "—"} />
        <BigStat label="Contenidos" value={activo ? String(c.contenidos) : "—"} />
        <BigStat label="Canjes" value={`${c.canjesEnviados}/${c.canjesTotal}`} />
      </div>

      {/* squad (secundario) */}
      <div className="mt-3 flex items-center gap-2.5 text-[11.5px] text-content-muted">
        <AvatarStack tint={tint} />
        <span><span className="font-semibold text-content-secondary">{c.seleccionados}/{c.microinfluencers}</span> microinfluencers</span>
        <span className="ml-auto">Avance <span className="font-semibold text-content-secondary">{c.progreso}%</span></span>
      </div>

      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-[10.5px] text-content-muted">
          <span className="inline-flex items-center gap-1"><Package size={11} /> Seeding enviado</span>
          <span>{canjePct}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--sf-2)]">
          <motion.div className="h-full rounded-full" style={{ background: tint }} initial={{ width: 0 }} animate={{ width: `${canjePct}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button onClick={stop(onOpen)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-cyan/12 px-3 py-2 text-[12.5px] font-semibold text-cyan ring-1 ring-cyan/20 transition-colors hover:bg-cyan/20">
          <BarChart3 size={13} /> Ver panel
        </button>
        <button onClick={stop(onCasting)} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--sf-1)] px-3 py-2 text-[12.5px] font-semibold text-content-secondary ring-1 ring-[var(--ln-1)] transition-colors hover:bg-[var(--hov)] hover:text-content">
          <Users size={13} /> Casting
        </button>
        <button onClick={stop(onCanjes)} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--sf-1)] px-3 py-2 text-[12.5px] font-semibold text-content-secondary ring-1 ring-[var(--ln-1)] transition-colors hover:bg-[var(--hov)] hover:text-content">
          <Send size={13} /> Canjes
        </button>
      </div>
    </motion.div>
  );
}

function BigStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl bg-[var(--sf-1)] px-3 py-2.5 ring-1 ${accent ? "ring-cyan/25" : "ring-[var(--ln-1)]"}`}>
      <div className={`font-display text-[20px] font-bold leading-none ${accent ? "text-cyan" : "text-content"}`}>{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-wide text-content-muted">{label}</div>
    </div>
  );
}

function AvatarStack({ tint }: { tint: string }) {
  const emojis = ["💄", "🌸", "✨"];
  return (
    <div className="flex -space-x-2">
      {emojis.map((e, i) => (
        <span key={i} className="grid h-6 w-6 place-items-center rounded-full text-[11px] ring-2 ring-surface" style={{ background: `${tint}2e` }}>{e}</span>
      ))}
    </div>
  );
}

