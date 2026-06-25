import { useState } from "react";
import {
  LayoutDashboard,
  PlusCircle,
  Sparkles,
  Network,
  Megaphone,
  Users,
  FileBarChart,
  ChevronDown,
  Check,
  Circle,
  Lock,
} from "lucide-react";
import { cn } from "../lib/cn";
import { marcas, acentoHex, type Marca } from "../lib/data";

export type View =
  | "inicio"
  | "analisis"
  | "nueva"
  | "insights"
  | "cerebro"
  | "tendencias"
  | "aprendizajes"
  | "campañas"
  | "talento"
  | "reportes";

const GRUPOS: { titulo: string; items: { id: View; label: string; icon: any }[] }[] = [
  {
    titulo: "Operación",
    items: [
      { id: "inicio", label: "Inicio", icon: LayoutDashboard },
      { id: "nueva", label: "Nueva campaña", icon: PlusCircle },
    ],
  },
  {
    titulo: "Inteligencia",
    items: [
      { id: "insights", label: "Insights", icon: Sparkles },
      { id: "cerebro", label: "Cerebro", icon: Network },
    ],
  },
  {
    titulo: "Activos",
    items: [
      { id: "campañas", label: "Campañas", icon: Megaphone },
      { id: "talento", label: "Talento", icon: Users },
    ],
  },
  {
    titulo: "Salida",
    items: [{ id: "reportes", label: "Reportes", icon: FileBarChart }],
  },
];

export function Sidebar({
  view,
  setView,
  marca,
  setMarca,
}: {
  view: View;
  setView: (v: View) => void;
  marca: Marca;
  setMarca: (m: Marca) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <aside className="relative z-30 flex h-full w-[244px] shrink-0 flex-col border-r border-line bg-graphite/70 backdrop-blur-xl">
      {/* Brand of platform */}
      <div className="flex items-center gap-2.5 px-4 pb-4 pt-5">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-surface-2 glow-cyan">
          <span className="font-display text-lg font-extrabold text-cyan text-glow-cyan">Σ</span>
        </div>
        <div className="leading-tight">
          <div className="font-display text-[14px] font-bold tracking-tight text-ink">SIGMA</div>
          <div className="kicker">la sala de control</div>
        </div>
      </div>

      {/* Brand switcher */}
      <div className="relative px-3">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center gap-2.5 rounded-xl border border-line bg-surface/60 px-3 py-2.5 text-left transition-colors hover:border-line-strong"
        >
          <span
            className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[13px] font-bold"
            style={{ background: `${acentoHex[marca.acento]}1f`, color: acentoHex[marca.acento] }}
          >
            {marca.glyph}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-bold text-ink">{marca.nombre}</span>
            <span className="block truncate font-mono text-[9px] text-ink-mute">{marca.rubro}</span>
          </span>
          <ChevronDown size={14} className={cn("text-ink-mute transition-transform", open && "rotate-180")} />
        </button>

        {open && (
          <div className="absolute left-3 right-3 z-40 mt-1.5 overflow-hidden rounded-xl border border-line-strong bg-surface-2 shadow-2xl">
            {marcas.map((m) => {
              const locked = m.id !== "copec"; // demo: el resto de marcas va censurado
              return (
                <button
                  key={m.id}
                  disabled={locked}
                  onClick={() => { if (!locked) { setMarca(m); setOpen(false); } }}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors",
                    locked ? "cursor-not-allowed opacity-55" : "hover:bg-white/5"
                  )}
                >
                  <span
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-[12px] font-bold"
                    style={locked ? { background: "var(--color-line)", color: "var(--color-ink-mute)" } : { background: `${acentoHex[m.acento]}1f`, color: acentoHex[m.acento] }}
                  >
                    {locked ? <Lock size={11} /> : m.glyph}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block truncate text-[12.5px] font-semibold", locked ? "text-ink-mute" : "text-ink")}>{locked ? "Datos confidenciales" : m.nombre}</span>
                    <span className="block truncate font-mono text-[9px] text-ink-mute">{locked ? "cliente reservado · no disponible" : `${m.campañasActivas} campañas activas`}</span>
                  </span>
                  {m.id === marca.id && !locked && <Check size={14} className="text-cyan" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="mt-3 flex-1 space-y-4 overflow-y-auto px-3 pb-3">
        {GRUPOS.map((g) => (
          <div key={g.titulo}>
            <div className="kicker px-2 pb-1.5">{g.titulo}</div>
            <div className="space-y-0.5">
              {g.items.map((item) => {
                const active = view === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={cn(
                      "group relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all",
                      active ? "bg-surface-2 text-ink" : "text-ink-soft hover:bg-white/[0.03] hover:text-ink"
                    )}
                  >
                    {active && <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-cyan shadow-[0_0_12px_var(--color-cyan)]" />}
                    <Icon size={15} className={cn("shrink-0", active ? "text-cyan" : "text-ink-mute group-hover:text-ink-soft")} />
                    <span className="flex-1 text-[12.5px] font-medium">{item.label}</span>
                    {item.id === "nueva" && <span className="chip py-0 text-[8px] text-cyan">+IA</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* status */}
      <div className="flex items-center justify-between border-t border-line px-4 py-3">
        <span className="flex items-center gap-2 font-mono text-[10px] text-ink-soft">
          <Circle size={7} className="fill-lime text-lime" /> sigma engine
        </span>
        <span className="font-mono text-[10px] text-cyan">online</span>
      </div>
    </aside>
  );
}
