import { Cpu, Search, Command } from "lucide-react";
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
};

export function Topbar({ view, marca, thinking }: { view: View; marca: Marca; thinking?: boolean }) {
  const meta = TITLES[view];
  return (
    <header className="relative z-20 flex h-16 shrink-0 items-center gap-5 border-b border-line bg-graphite/40 px-6 backdrop-blur-xl">
      <div className="min-w-0">
        <div className="mb-0.5 flex items-center gap-1.5 font-mono text-[10px] text-ink-mute">
          <span>{marca.nombre}</span>
          <span>/</span>
          <span className="text-ink-soft">{meta.title}</span>
        </div>
        <h1 className="font-display text-[17px] font-bold leading-none tracking-tight text-ink">{meta.title}</h1>
      </div>

      {thinking && (
        <div className="flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1.5">
          <span className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan think-dot" />
            <span className="h-1.5 w-1.5 rounded-full bg-cyan think-dot" style={{ animationDelay: "0.2s" }} />
            <span className="h-1.5 w-1.5 rounded-full bg-cyan think-dot" style={{ animationDelay: "0.4s" }} />
          </span>
          <span className="font-mono text-[10px] text-cyan">cerebro pensando</span>
        </div>
      )}

      <div className="flex-1" />

      <div className="hidden items-center gap-2 rounded-lg border border-line bg-surface/60 px-3 py-2 text-[12px] text-ink-mute md:flex">
        <Search size={13} />
        <span>Preguntar a Sigma…</span>
        <kbd className="ml-3 flex items-center gap-0.5 rounded border border-line bg-void/60 px-1.5 py-0.5 font-mono text-[10px]">
          <Command size={9} />K
        </kbd>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-violet/30 bg-violet/10 px-3 py-2">
        <Cpu size={13} className="text-violet" />
        <span className="font-mono text-[11px] font-medium text-violet">sigma-core · v4</span>
      </div>
    </header>
  );
}
