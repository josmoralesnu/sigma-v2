import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  seedPosts, seedRoster, seedTareas, seedHitos, seedAtribuciones,
  type Post, type RosterItem, type TareaGantt, type HitoGantt, type Atribucion,
} from "./panel";

/* ============================================================
   Estado funcional del Centro de optimización.
   Fuentes únicas (contenidos, roster, gantt) con persistencia
   en localStorage. Sin backend.
   ============================================================ */

const K_POSTS = "sigma.centro.posts.v2";
const K_ROSTER = "sigma.centro.roster.v1";
const K_GANTT = "sigma.centro.gantt.v1";
const K_ATRIB = "sigma.centro.atrib.v1";

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

export function CentroProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(() => load(K_POSTS, seedPosts));
  const [roster, setRoster] = useState<RosterItem[]>(() => load(K_ROSTER, seedRoster));
  const [tareas, setTareas] = useState<TareaGantt[]>(() => load(K_GANTT + ".t", seedTareas));
  const [hitos, setHitos] = useState<HitoGantt[]>(() => load(K_GANTT + ".h", seedHitos));
  const [atribuciones, setAtrib] = useState<Atribucion[]>(() => load(K_ATRIB, seedAtribuciones));

  useEffect(() => { try { localStorage.setItem(K_POSTS, JSON.stringify(posts)); } catch { /* */ } }, [posts]);
  useEffect(() => { try { localStorage.setItem(K_ROSTER, JSON.stringify(roster)); } catch { /* */ } }, [roster]);
  useEffect(() => { try { localStorage.setItem(K_GANTT + ".t", JSON.stringify(tareas)); } catch { /* */ } }, [tareas]);
  useEffect(() => { try { localStorage.setItem(K_GANTT + ".h", JSON.stringify(hitos)); } catch { /* */ } }, [hitos]);
  useEffect(() => { try { localStorage.setItem(K_ATRIB, JSON.stringify(atribuciones)); } catch { /* */ } }, [atribuciones]);

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

    reset: () => {
      try { [K_POSTS, K_ROSTER, K_GANTT + ".t", K_GANTT + ".h", K_ATRIB].forEach((k) => localStorage.removeItem(k)); } catch { /* */ }
      setPosts(seedPosts); setRoster(seedRoster); setTareas(seedTareas); setHitos(seedHitos); setAtrib(seedAtribuciones);
    },
  }), [posts, roster, tareas, hitos, atribuciones]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCentro(): CentroCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCentro debe usarse dentro de <CentroProvider>");
  return ctx;
}
