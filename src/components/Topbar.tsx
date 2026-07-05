import { Moon, Sun, Bell, ChevronDown, PlusCircle } from "lucide-react";
import type { View } from "./Sidebar";
import type { Marca } from "../lib/data";

const TITLES: Record<View, { title: string; desc: string }> = {
  inicio: { title: "Inicio", desc: "Panorama de la marca y sus campañas" },
  analisis: { title: "Análisis de marca", desc: "Salud, crisis y oportunidades de la marca" },
  nueva: { title: "Nueva campaña", desc: "Sigma arma el contexto contigo, paso a paso" },
  insights: { title: "Insights", desc: "De la reunión a hallazgos accionables" },
  cerebro: { title: "Cerebro", desc: "Generación de conceptos en vivo" },
  tendencias: { title: "Tendencias", desc: "Señales del rubro en tiempo real" },
  aprendizajes: { title: "Aprendizajes", desc: "Memoria de campañas pasadas" },
  campañas: { title: "Campañas", desc: "Todo el portafolio de la marca" },
  talento: { title: "Talento", desc: "Creadores por afinidad y mood" },
  reportes: { title: "Reportes", desc: "Resultados y performance" },
  panel: { title: "Centro de optimización", desc: "Rendimiento de la campaña en vivo" },
  contenidos: { title: "Contenidos", desc: "Galería de piezas y su performance" },
  calendario: { title: "Calendario", desc: "Publicaciones programadas y publicadas" },
  gantt: { title: "Carta Gantt", desc: "Fases y cadencia de la campaña" },
  sentimiento: { title: "Sentimiento", desc: "Análisis de comentarios de los posts" },
  atribucion: { title: "Conversiones", desc: "Registros/depósitos por link de contenido, bio y código promo" },
  organico: { title: "Orgánico", desc: "Alcance, engagement y crecimiento del contenido orgánico" },
  produccion: { title: "Producción", desc: "Aprobá o descartá las piezas creativas por medio" },
  roster: { title: "Roster", desc: "Influencers de la campaña y su pago" },
  "puig-inicio": { title: "Inicio · Puig", desc: "Análisis de marca y salud por submarca" },
  "puig-dashboard": { title: "Dashboard Puig", desc: "Vista de marca: rendimiento acumulado por submarca" },
  "puig-sentimiento": { title: "Análisis de sentimiento", desc: "Lectura macro de la conversación de marca" },
  "puig-marcas": { title: "Submarcas & campañas", desc: "Campañas por submarca, condensando el squad de microinfluencers" },
  "puig-campana": { title: "Panel de campaña", desc: "Resultados, contenidos y sentimiento de la campaña" },
  casting: { title: "Casting", desc: "Selecciona microinfluencers en tabla o modo tinder" },
  canjes: { title: "Canjes / Seeding", desc: "Status de envíos, estadísticas y mapa de destinos" },
};

export function Topbar({ view, marca, thinking, theme = "dark", onToggleTheme, onNueva }: { view: View; marca: Marca; thinking?: boolean; theme?: "dark" | "light"; onToggleTheme?: () => void; onNueva?: () => void }) {
  const meta = TITLES[view];
  return (
    <header className="glass-rail sticky top-0 z-20 flex h-[72px] items-center justify-between gap-4 border-b border-line px-6 backdrop-blur lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h1 className="truncate font-display text-[19px] font-semibold leading-tight text-content">{meta.title}</h1>
            {marca.id === "copec" ? (
              <span className="hidden items-center rounded-md border border-line bg-white px-1.5 py-1 sm:inline-flex" title="Copec">
                <img src="/copec-logo.svg" alt="Copec" className="h-3 w-auto" />
              </span>
            ) : marca.id === "betsson" ? (
              <span className="glass hidden items-center rounded-md px-2 py-1 sm:inline-flex" title="Betsson">
                <img src="/betsson-white.svg" alt="Betsson" className="h-3 w-auto" />
              </span>
            ) : marca.id === "estelarbet" ? (
              <span className="glass hidden items-center rounded-md px-2 py-1 sm:inline-flex" title="EstelarBet">
                <img src="/estelarbet-logo.png" alt="EstelarBet" className="h-3 w-auto" style={{ mixBlendMode: "screen" }} />
              </span>
            ) : marca.id === "puig" ? (
              <span className="hidden items-center rounded-md border border-black/5 bg-white px-1.5 py-1 sm:inline-flex" title="Puig">
                <img src="/puig-logo.svg" alt="Puig" className="h-5 w-auto" />
              </span>
            ) : (
              <span className="hidden items-center gap-1.5 rounded-md bg-[var(--sf-2)] px-1.5 py-0.5 text-[10px] font-medium text-content-muted sm:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-wine-600" />
                {marca.nombre}
              </span>
            )}
          </div>
          <p className="truncate text-[12px] text-content-muted">{meta.desc}</p>
        </div>

        {thinking && (
          <div className="glass hidden items-center gap-2 rounded-full px-3 py-1.5 md:inline-flex">
            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan think-dot" />
              <span className="h-1.5 w-1.5 rounded-full bg-cyan think-dot" style={{ animationDelay: "0.2s" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-cyan think-dot" style={{ animationDelay: "0.4s" }} />
            </span>
            <span className="font-mono text-[10px] font-medium text-cyan">cerebro pensando</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onNueva}
          className="mr-1 hidden items-center gap-1.5 rounded-xl bg-cyan px-3.5 py-2 text-[12.5px] font-semibold text-content-inverted transition-transform hover:scale-[1.02] focus-visible:focus-ring sm:inline-flex"
          title="Crear nueva campaña"
        >
          <PlusCircle className="h-[16px] w-[16px]" /> Nueva campaña
        </button>

        <button
          type="button"
          onClick={onToggleTheme}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-content-secondary transition-colors hover:bg-[var(--hov)] hover:text-content focus-visible:focus-ring"
          title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </button>

        <button
          type="button"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-content-secondary transition-colors hover:bg-[var(--hov)] hover:text-content focus-visible:focus-ring"
          aria-label="Notificaciones"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-wine-600 ring-2 ring-canvas" />
        </button>

        <div className="mx-1 h-6 w-px bg-line" />

        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-2 transition-colors hover:bg-[var(--hov)] focus-visible:focus-ring"
          >
            <span className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-amber-200 text-sm font-semibold text-amber-800 ring-2 ring-surface">
              JI
            </span>
            <span className="hidden text-right leading-tight sm:block">
              <span className="block text-sm font-semibold text-content">José Ignacio Morales</span>
              <span className="block text-xs capitalize text-content-muted">admin</span>
            </span>
            <ChevronDown className="h-4 w-4 text-content-muted" />
          </button>
        </div>
      </div>
    </header>
  );
}
