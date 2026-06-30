import { useState } from "react";
import {
  LayoutDashboard,
  PlusCircle,
  Sparkles,
  Network,
  Megaphone,
  Users,
  FileBarChart,
  Gauge,
  Images,
  CalendarDays,
  GanttChartSquare,
  MessageCircle,
  Target,
  UsersRound,
  ChevronsUpDown,
  Check,
  Lock,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { cn } from "../lib/cn";
import { marcas, type Marca } from "../lib/data";
import { BrandTile } from "./BrandMark";

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
  | "reportes"
  | "panel"
  | "contenidos"
  | "calendario"
  | "gantt"
  | "sentimiento"
  | "atribucion"
  | "roster";

const GRUPOS: { titulo: string; items: { id: View; label: string; icon: any; badge?: string }[] }[] = [
  {
    titulo: "Operación",
    items: [
      { id: "inicio", label: "Inicio", icon: LayoutDashboard },
      { id: "nueva", label: "Nueva campaña", icon: PlusCircle, badge: "+IA" },
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
    titulo: "Medición",
    items: [
      { id: "panel", label: "Centro de optimización", icon: Gauge, badge: "live" },
      { id: "contenidos", label: "Contenidos", icon: Images },
      { id: "calendario", label: "Calendario", icon: CalendarDays },
      { id: "gantt", label: "Carta Gantt", icon: GanttChartSquare },
      { id: "sentimiento", label: "Sentimiento", icon: MessageCircle },
      { id: "atribucion", label: "Atribución FTD", icon: Target },
      { id: "roster", label: "Roster", icon: UsersRound },
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
    <aside className="glass-rail flex h-full w-[244px] shrink-0 flex-col border-r border-line">
      {/* Marca de plataforma */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan font-display text-lg font-semibold text-content-inverted">
            Σ
          </span>
          <div className="leading-tight">
            <p className="font-display text-lg font-semibold text-content">Sigma</p>
            <p className="text-[11px] font-medium text-content-muted">by WK</p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-4 overflow-y-auto scroll-slim px-3">
        {GRUPOS.map((g) => (
          <div key={g.titulo}>
            <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-content-muted">
              {g.titulo}
            </p>
            <div className="space-y-0.5">
              {g.items.map((item) => {
                const active = view === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setView(item.id)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-white/10 text-content"
                        : "text-content-secondary hover:bg-white/5 hover:text-content"
                    )}
                  >
                    <Icon strokeWidth={active ? 2.2 : 1.75} className={cn("h-[18px] w-[18px]", active && "text-cyan")} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                          active ? "bg-white/10 text-cyan" : "bg-white/5 text-cyan"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Pie: organización + accesos */}
      <div className="space-y-1 p-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="glass glass-hover flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors focus-visible:focus-ring"
          >
            <BrandTile marca={marca} size={36} />
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-sm font-semibold text-content">{marca.nombre}</span>
              <span className="block truncate text-xs text-content-muted">Equipo Pro</span>
            </span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-content-muted" />
          </button>

          {open && (
            <div className="glass-strong absolute bottom-full left-0 right-0 z-40 mb-1.5 overflow-hidden rounded-xl shadow-xl">
              {marcas.map((m) => {
                const locked = !m.disponible; // demo: solo los clientes activos se pueden abrir
                return (
                  <button
                    key={m.id}
                    type="button"
                    disabled={locked}
                    onClick={() => {
                      if (!locked) {
                        setMarca(m);
                        setOpen(false);
                      }
                    }}
                    className={cn(
                      "flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors",
                      locked ? "cursor-not-allowed opacity-60" : "hover:bg-white/5"
                    )}
                  >
                    {locked ? (
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md" style={{ background: "var(--color-surface-muted)", color: "var(--color-content-muted)" }}>
                        <Lock className="h-3 w-3" />
                      </span>
                    ) : (
                      <BrandTile marca={m} size={28} />
                    )}
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block truncate text-[12.5px] font-semibold",
                          locked ? "text-content-muted" : "text-content"
                        )}
                      >
                        {locked ? "Datos confidenciales" : m.nombre}
                      </span>
                      <span className="block truncate text-[11px] text-content-muted">
                        {locked ? "cliente reservado · no disponible" : `${m.campañasActivas} campañas activas`}
                      </span>
                    </span>
                    {m.id === marca.id && !locked && <Check className="h-4 w-4 text-wine-700" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-content-secondary transition-colors hover:bg-white/5 hover:text-content"
        >
          <ShieldCheck className="h-[18px] w-[18px]" />
          Administración
        </button>

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-wine-700 transition-colors hover:bg-white/5"
        >
          <Sparkles className="h-[18px] w-[18px]" />
          Vista DEMO
        </button>

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-content-secondary transition-colors hover:bg-white/5 hover:text-negative"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
