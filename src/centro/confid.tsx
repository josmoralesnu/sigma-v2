import { createContext, useContext, type ReactNode } from "react";
import { Lock, EyeOff, FlaskConical } from "lucide-react";
import { cliente } from "../lib/data";

/* ============================================================
   Modo confidencial — para mostrar la plataforma sin exponer
   los resultados (FTD/alcance/engagement, influencers, etc.).
   Los valores van blureados salvo que se "revele". Vender el
   producto, no la data del cliente.

   Excepción: EstelarBet es la marca de DEMO / datos de prueba →
   no se censura; en vez del toggle confidencial muestra un badge
   "Datos de prueba".
   ============================================================ */
const RevealCtx = createContext(false);

/** ¿la marca activa es la de datos de prueba (EstelarBet)? */
export const esDatosPrueba = (): boolean => cliente.marca === "EstelarBet";

export function ConfProvider({ revealed, children }: { revealed: boolean; children: ReactNode }) {
  return <RevealCtx.Provider value={revealed}>{children}</RevealCtx.Provider>;
}

/** Envuelve un valor sensible: blureado (confidencial) salvo que el provider esté revelado
    o que la marca sea la de datos de prueba. */
export function Conf({ children, px = 6, className = "" }: { children: ReactNode; px?: number; className?: string }) {
  const revealed = useContext(RevealCtx) || esDatosPrueba();
  return (
    <span
      className={`inline-block transition-[filter] duration-300 ${revealed ? "" : "select-none"} ${className}`}
      style={revealed ? undefined : { filter: `blur(${px}px)` }}
      aria-hidden={!revealed}
      title={revealed ? undefined : "Dato confidencial"}
    >
      {children}
    </span>
  );
}

/** Badge estático "Datos de prueba" (solo se muestra en la marca de prueba). */
export function DatosPruebaBadge() {
  if (!esDatosPrueba()) return null;
  return (
    <span className="inline-flex items-center gap-2 rounded-xl bg-cyan/12 px-3 py-2 text-[12.5px] font-semibold text-cyan ring-1 ring-cyan/25">
      <FlaskConical size={14} /> Datos de prueba
    </span>
  );
}

export function ConfToggle({ revealed, onToggle }: { revealed: boolean; onToggle: () => void }) {
  // EstelarBet = datos de prueba: badge estático, sin censura.
  if (esDatosPrueba()) {
    return (
      <span className="inline-flex items-center gap-2 rounded-xl bg-cyan/12 px-3 py-2 text-[12.5px] font-semibold text-cyan ring-1 ring-cyan/25">
        <FlaskConical size={14} /> Datos de prueba
      </span>
    );
  }
  return (
    <button
      onClick={onToggle}
      title={revealed ? "Ocultar datos" : "Revelar datos"}
      className="glass glass-hover inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[12.5px] font-semibold text-ink-soft"
    >
      {revealed ? <EyeOff size={14} className="text-cyan" /> : <Lock size={14} className="text-cyan" />}
      {revealed ? "Ocultar" : "Datos confidenciales"}
    </button>
  );
}
