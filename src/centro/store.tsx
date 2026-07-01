import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  seedPosts, seedRoster, seedTareas, seedHitos, seedAtribuciones, seedPiezas,
  type Post, type RosterItem, type TareaGantt, type HitoGantt, type Atribucion,
  type Pieza, type ComentarioRev,
} from "./panel";

/* ============================================================
   Estado funcional del Centro de optimización.
   Fuentes únicas (contenidos, roster, gantt) con persistencia
   en localStorage. Sin backend.
   ============================================================ */

/* claves por marca: cada cliente persiste su propia medición */
const keys = (brand: string) => ({
  posts: `sigma.centro.posts.v2.${brand}`,
  roster: `sigma.centro.roster.v1.${brand}`,
  ganttT: `sigma.centro.gantt.v1.${brand}.t`,
  ganttH: `sigma.centro.gantt.v1.${brand}.h`,
  atrib: `sigma.centro.atrib.v1.${brand}`,
  piezas: `sigma.centro.piezas.v2.${brand}`,
});

interface CentroCtx {
  // contenidos
  posts: Post[];
  addPost: (p: Omit<Post, "id">) => void;
  updatePost: (id: string, patch: Partial<Post>) => void;
  removePost: (id: string) => void;
  // roster
  roster: RosterItem[];
  addRoster: (r: Omit<RosterItem, "id">) => void;
  updateRoster: (id: string, patch: Partial<RosterItem>) => void;
  removeRoster: (id: string) => void;
  // gantt
  tareas: TareaGantt[];
  addTarea: (t: Omit<TareaGantt, "id">) => void;
  updateTarea: (id: string, patch: Partial<TareaGantt>) => void;
  removeTarea: (id: string) => void;
  hitos: HitoGantt[];
  addHito: (h: Omit<HitoGantt, "id">) => void;
  removeHito: (id: string) => void;
  // atribución de FTD
  atribuciones: Atribucion[];
  addAtrib: (a: Omit<Atribucion, "id">) => void;
  updateAtrib: (id: string, patch: Partial<Atribucion>) => void;
  removeAtrib: (id: string) => void;
  // piezas creativas (aprobación)
  piezas: Pieza[];
  addPieza: (p: Omit<Pieza, "id">) => void;
  updatePieza: (id: string, patch: Partial<Pieza>) => void;
  removePieza: (id: string) => void;
  comentarPieza: (id: string, comentario: ComentarioRev) => void;
  reset: () => void;
}

const Ctx = createContext<CentroCtx | null>(null);

function load<T>(key: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) { const p = JSON.parse(raw); if (Array.isArray(p)) return p as T[]; }
  } catch { /* corrupt */ }
  return seed;
}

const uid = (): string =>
  "u" + Math.round(performance.now() * 1000).toString(36) + Math.floor(Math.random() * 1e6).toString(36);

export function CentroProvider({ children, brandId = "estelarbet" }: { children: ReactNode; brandId?: string }) {
  const K = keys(brandId);
  const [posts, setPosts] = useState<Post[]>(() => load(K.posts, seedPosts));
  const [roster, setRoster] = useState<RosterItem[]>(() => load(K.roster, seedRoster));
  const [tareas, setTareas] = useState<TareaGantt[]>(() => load(K.ganttT, seedTareas));
  const [hitos, setHitos] = useState<HitoGantt[]>(() => load(K.ganttH, seedHitos));
  const [atribuciones, setAtrib] = useState<Atribucion[]>(() => load(K.atrib, seedAtribuciones));
  const [piezas, setPiezas] = useState<Pieza[]>(() => load(K.piezas, seedPiezas));

  useEffect(() => { try { localStorage.setItem(K.posts, JSON.stringify(posts)); } catch { /* */ } }, [posts]);
  useEffect(() => { try { localStorage.setItem(K.roster, JSON.stringify(roster)); } catch { /* */ } }, [roster]);
  useEffect(() => { try { localStorage.setItem(K.ganttT, JSON.stringify(tareas)); } catch { /* */ } }, [tareas]);
  useEffect(() => { try { localStorage.setItem(K.ganttH, JSON.stringify(hitos)); } catch { /* */ } }, [hitos]);
  useEffect(() => { try { localStorage.setItem(K.atrib, JSON.stringify(atribuciones)); } catch { /* */ } }, [atribuciones]);
  useEffect(() => { try { localStorage.setItem(K.piezas, JSON.stringify(piezas)); } catch { /* */ } }, [piezas]);

  const value = useMemo<CentroCtx>(() => ({
    posts,
    addPost: (p) => setPosts((c) => [{ ...p, id: uid() }, ...c]),
    updatePost: (id, patch) => setPosts((c) => c.map((x) => (x.id === id ? { ...x, ...patch } : x))),
    removePost: (id) => setPosts((c) => c.filter((x) => x.id !== id)),

    roster,
    addRoster: (r) => setRoster((c) => [{ ...r, id: uid() }, ...c]),
    updateRoster: (id, patch) => setRoster((c) => c.map((x) => (x.id === id ? { ...x, ...patch } : x))),
    removeRoster: (id) => setRoster((c) => c.filter((x) => x.id !== id)),

    tareas,
    addTarea: (t) => setTareas((c) => [...c, { ...t, id: uid() }]),
    updateTarea: (id, patch) => setTareas((c) => c.map((x) => (x.id === id ? { ...x, ...patch } : x))),
    removeTarea: (id) => setTareas((c) => c.filter((x) => x.id !== id)),
    hitos,
    addHito: (h) => setHitos((c) => [...c, { ...h, id: uid() }]),
    removeHito: (id) => setHitos((c) => c.filter((x) => x.id !== id)),

    atribuciones,
    addAtrib: (a) => setAtrib((c) => [{ ...a, id: uid() }, ...c]),
    updateAtrib: (id, patch) => setAtrib((c) => c.map((x) => (x.id === id ? { ...x, ...patch } : x))),
    removeAtrib: (id) => setAtrib((c) => c.filter((x) => x.id !== id)),

    piezas,
    addPieza: (p) => setPiezas((c) => [{ ...p, id: uid() }, ...c]),
    updatePieza: (id, patch) => setPiezas((c) => c.map((x) => (x.id === id ? { ...x, ...patch } : x))),
    removePieza: (id) => setPiezas((c) => c.filter((x) => x.id !== id)),
    comentarPieza: (id, comentario) =>
      setPiezas((c) => c.map((x) => (x.id === id ? { ...x, comentarios: [...x.comentarios, comentario] } : x))),

    reset: () => {
      try { Object.values(K).forEach((k) => localStorage.removeItem(k)); } catch { /* */ }
      setPosts(seedPosts); setRoster(seedRoster); setTareas(seedTareas); setHitos(seedHitos); setAtrib(seedAtribuciones); setPiezas(seedPiezas);
    },
  }), [posts, roster, tareas, hitos, atribuciones, piezas]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCentro(): CentroCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCentro debe usarse dentro de <CentroProvider>");
  return ctx;
}
