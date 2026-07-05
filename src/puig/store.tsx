import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { pcampañas, candidatosDe } from "./pdata";

/* Flujo de casting agencia ↔ cliente:
   La agencia propone perfiles → el cliente selecciona → "envía su selección"
   → la agencia la confirma → los confirmados quedan en la campaña. */
export type CastingEstado = "borrador" | "enviado" | "confirmado";
export interface CampCasting {
  seleccion: string[];       // ids que el cliente va marcando
  estado: CastingEstado;
  confirmados: string[];     // ids finalmente en campaña (tras confirmar la agencia)
}
type CastingMap = Record<string, CampCasting>;

const KEY = "puig.casting.v3";

function seed(): CastingMap {
  const m: CastingMap = {};
  for (const c of pcampañas) {
    const cand = candidatosDe(c.id).map((x) => x.id);
    if (c.estado === "En casting") {
      // en curso: el cliente ya marcó algunos, aún no envía
      m[c.id] = { seleccion: cand.slice(0, Math.min(c.seleccionados, cand.length)), estado: "borrador", confirmados: [] };
    } else {
      // activas: squad ya confirmado
      const conf = cand.slice(0, Math.min(8, cand.length));
      m[c.id] = { seleccion: conf, estado: "confirmado", confirmados: conf };
    }
  }
  return m;
}

function load(): CastingMap {
  try {
    const r = localStorage.getItem(KEY);
    if (r) return { ...seed(), ...JSON.parse(r) };
  } catch { /* noop */ }
  return seed();
}

interface Ctx {
  get: (campId: string) => CampCasting;
  toggle: (campId: string, infId: string) => void;
  enviar: (campId: string) => void;
  confirmar: (campId: string) => void;
  reabrir: (campId: string) => void;
}
const PuigCtx = createContext<Ctx | null>(null);

export function PuigProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<CastingMap>(load);

  const ensure = (m: CastingMap, id: string): CampCasting =>
    m[id] ?? { seleccion: [], estado: "borrador", confirmados: [] };

  const get = useCallback((campId: string) => ensure(map, campId), [map]);

  const toggle = useCallback((campId: string, infId: string) => {
    setMap((m) => {
      const cur = ensure(m, campId);
      if (cur.estado !== "borrador") return m; // bloqueado tras enviar
      const has = cur.seleccion.includes(infId);
      const seleccion = has ? cur.seleccion.filter((x) => x !== infId) : [...cur.seleccion, infId];
      const next = { ...m, [campId]: { ...cur, seleccion } };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* noop */ }
      return next;
    });
  }, []);

  const enviar = useCallback((campId: string) => {
    setMap((m) => {
      const cur = ensure(m, campId);
      if (cur.seleccion.length === 0) return m;
      const next = { ...m, [campId]: { ...cur, estado: "enviado" as CastingEstado } };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* noop */ }
      return next;
    });
  }, []);

  const confirmar = useCallback((campId: string) => {
    setMap((m) => {
      const cur = ensure(m, campId);
      const next = { ...m, [campId]: { ...cur, estado: "confirmado" as CastingEstado, confirmados: [...cur.seleccion] } };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* noop */ }
      return next;
    });
  }, []);

  const reabrir = useCallback((campId: string) => {
    setMap((m) => {
      const cur = ensure(m, campId);
      const next = { ...m, [campId]: { ...cur, estado: "borrador" as CastingEstado } };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* noop */ }
      return next;
    });
  }, []);

  return <PuigCtx.Provider value={{ get, toggle, enviar, confirmar, reabrir }}>{children}</PuigCtx.Provider>;
}

export function usePuig() {
  const c = useContext(PuigCtx);
  if (!c) throw new Error("usePuig fuera de PuigProvider");
  return c;
}
