import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, ClipboardPaste, FileSpreadsheet, Upload, Download, Check, AlertTriangle, RefreshCw, Plus,
} from "lucide-react";
import { useCentro } from "./store";
import { short, pesosK, FUENTES, type Atribucion, type FuenteTipo } from "./panel";

/* ============================================================
   Importación masiva de FTD — el operador suele entregar la data
   en un Excel. Acepta: pegar (copiar rango desde Excel → TSV),
   subir .xlsx (SheetJS, carga diferida) o .csv. Detecta columnas
   por encabezado, hace match por destino (link/código) y muestra
   un preview (actualiza / nueva / error) antes de aplicar.
   ============================================================ */

type Field = "destino" | "nombre" | "tipo" | "referencia" | "clics" | "registros" | "ftd" | "deposito";
type Mapa = Record<Field, number>;
const METRICAS: Field[] = ["clics", "registros", "ftd", "deposito"];

const norm = (s: unknown) => String(s ?? "").trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const keyOf = (s: unknown) => norm(s).replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/+$/, "");
const num = (v: unknown) => { const n = parseInt(String(v ?? "").replace(/[^\d-]/g, ""), 10); return Number.isFinite(n) ? n : 0; };

const SYN: Record<Field, string[]> = {
  destino: ["destino", "link", "url", "codigo", "code", "tracking", "enlace"],
  nombre: ["influencer", "creador", "nombre", "autor", "talento"],
  tipo: ["tipo", "canal", "fuente"],
  referencia: ["referencia", "contenido", "detalle", "campana", "pieza"],
  clics: ["clics", "clicks", "clic", "click"],
  registros: ["registros", "registro", "signups", "sign ups", "altas", "leads"],
  ftd: ["ftd", "ftds", "depositantes", "primer deposito", "primeros depositos", "first deposit", "first time deposit", "1er deposito"],
  deposito: ["deposito", "monto", "clp", "importe", "ingreso", "gmv", "valor"],
};

function detectMap(headers: string[]): Mapa {
  const h = headers.map(norm);
  const find = (keys: string[]) => {
    for (let i = 0; i < h.length; i++) if (keys.includes(h[i])) return i;
    for (let i = 0; i < h.length; i++) if (keys.some((k) => h[i].includes(k))) return i;
    return -1;
  };
  const m: Mapa = { destino: find(SYN.destino), nombre: find(SYN.nombre), tipo: find(SYN.tipo), referencia: find(SYN.referencia), clics: find(SYN.clics), registros: find(SYN.registros), ftd: find(SYN.ftd), deposito: find(SYN.deposito) };
  if (m.deposito === m.ftd) m.deposito = -1; // "primer depósito" no debe robar la columna de monto
  return m;
}

interface Fila { destino: string; metrics: Partial<Record<Field, number>>; match: Atribucion | null; nombre: string; tipoRaw: string; referencia: string; }
interface Parsed { headers: string[]; map: Mapa; metricCols: Field[]; rows: Fila[]; fatal?: string; }

function parseDelimited(text: string): string[][] {
  const first = text.split(/\r?\n/)[0] ?? "";
  const delim = first.includes("\t") ? "\t" : (first.match(/;/g)?.length ?? 0) > (first.match(/,/g)?.length ?? 0) ? ";" : ",";
  const rows: string[][] = []; let row: string[] = [], cur = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch; }
    else if (ch === '"') q = true;
    else if (ch === delim) { row.push(cur); cur = ""; }
    else if (ch === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; }
    else if (ch !== "\r") cur += ch;
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

function buildPreview(grid: any[][], atribuciones: Atribucion[]): Parsed {
  const empty: Parsed = { headers: [], map: {} as Mapa, metricCols: [], rows: [] };
  if (!grid.length) return { ...empty, fatal: "El archivo está vacío." };
  const headers = grid[0].map((c) => String(c ?? ""));
  const map = detectMap(headers);
  if (map.destino < 0) return { ...empty, headers, map, fatal: "No encontramos la columna de destino (link o código). Revisa los encabezados." };
  const metricCols = METRICAS.filter((k) => map[k] >= 0);
  if (!metricCols.length) return { ...empty, headers, map, fatal: "No encontramos columnas de métrica (clics, registros, FTD o depósito)." };
  const byKey = new Map(atribuciones.map((a) => [keyOf(a.destino), a]));
  const rows: Fila[] = [];
  for (let r = 1; r < grid.length; r++) {
    const cells = grid[r];
    const destino = String(cells[map.destino] ?? "").trim();
    if (!destino) continue;
    const metrics: Partial<Record<Field, number>> = {};
    metricCols.forEach((k) => (metrics[k] = num(cells[map[k]])));
    rows.push({
      destino, metrics, match: byKey.get(keyOf(destino)) ?? null,
      nombre: map.nombre >= 0 ? String(cells[map.nombre] ?? "").trim() : "",
      tipoRaw: map.tipo >= 0 ? String(cells[map.tipo] ?? "").trim() : "",
      referencia: map.referencia >= 0 ? String(cells[map.referencia] ?? "").trim() : "",
    });
  }
  return { headers, map, metricCols, rows };
}

const inferTipo = (f: Fila): FuenteTipo => {
  const t = norm(f.tipoRaw);
  const hit = FUENTES.find((x) => norm(x) === t || t.includes(norm(x)));
  if (hit) return hit;
  return !f.destino.includes("/") && !f.destino.includes(".") ? "Código" : "Bio";
};
const nombreDe = (d: string) => {
  const seg = d.replace(/^https?:\/\//, "").split("/").pop() || d;
  return seg.replace(/[-_.]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).trim() || d;
};

const PLANTILLA = `destino,influencer,tipo,clics,registros,ftd,deposito
estelar.bet/previa-hoy,La Previa Estelar,Contenido,18600,2480,498,8960000
estelar.bet/cometa,Cometa FC,Bio,16100,2010,402,7240000
PREVIA,La Previa Estelar,Código,0,1840,372,6900000`;

const EJEMPLO = `destino\tinfluencer\ttipo\tclics\tregistros\tftd\tdeposito
estelar.bet/slots-live\tEstrella Slots\tContenido\t31200\t3260\t690\t15100000
estelar.bet/previa-hoy\tLa Previa Estelar\tContenido\t19400\t2590\t521\t9380000
estelar.bet/cometa\tCometa FC\tBio\t16800\t2110\t418\t7510000
PREVIA\tLa Previa Estelar\tCódigo\t0\t1990\t402\t7420000
estelar.bet/astro-tipster\tAstro Tipster\tBio\t5400\t720\t168\t2640000`;

const ETIQUETA: Record<Field, string> = { destino: "Destino", nombre: "Influencer", tipo: "Tipo", referencia: "Referencia", clics: "Clics", registros: "Registros", ftd: "FTD", deposito: "Depósito" };

export function ImportModal({ onClose, onDone }: { onClose: () => void; onDone: (msg: string) => void }) {
  const { atribuciones, addAtrib, updateAtrib } = useCentro();
  const [tab, setTab] = useState<"pegar" | "archivo">("pegar");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [parsed, setParsed] = useState<Parsed | null>(null);
  const [crearNuevas, setCrearNuevas] = useState(true);
  const [cargando, setCargando] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onText = (v: string) => { setText(v); setFileName(""); setParsed(v.trim() ? buildPreview(parseDelimited(v), atribuciones) : null); };

  const onFile = async (f?: File) => {
    if (!f) return;
    setFileName(f.name); setText(""); setCargando(true);
    try {
      let grid: any[][];
      if (/\.xlsx?$/i.test(f.name)) {
        const XLSX = await import("xlsx");
        const wb = XLSX.read(await f.arrayBuffer(), { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        grid = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: "" }) as any[][];
      } else {
        grid = parseDelimited(await f.text());
      }
      setParsed(buildPreview(grid, atribuciones));
    } catch {
      setParsed({ headers: [], map: {} as Mapa, metricCols: [], rows: [], fatal: "No pudimos leer el archivo. Probá con .xlsx o .csv." });
    } finally { setCargando(false); }
  };

  const descargarPlantilla = () => {
    const blob = new Blob([PLANTILLA], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "plantilla-ftd-estelarbet.csv";
    a.click(); URL.revokeObjectURL(a.href);
  };

  const updates = parsed?.rows.filter((r) => r.match).length ?? 0;
  const nuevas = parsed?.rows.filter((r) => !r.match).length ?? 0;
  const aImportar = updates + (crearNuevas ? nuevas : 0);

  const aplicar = () => {
    if (!parsed || parsed.fatal) return;
    let upd = 0, cre = 0;
    parsed.rows.forEach((row) => {
      const patch: Partial<Atribucion> = {};
      parsed.metricCols.forEach((k) => ((patch as any)[k] = row.metrics[k] ?? 0));
      if (row.match) { updateAtrib(row.match.id, patch); upd++; }
      else if (crearNuevas) {
        const tipo = inferTipo(row);
        addAtrib({
          tipo, nombre: row.nombre || nombreDe(row.destino),
          handle: "@" + keyOf(row.destino).split("/").pop()!.replace(/[^a-z0-9]/g, "").slice(0, 16),
          avatar: "🎯",
          referencia: row.referencia || (tipo === "Código" ? "Código promo" : tipo === "Bio" ? "Link de bio" : "Importado"),
          destino: row.destino,
          clics: row.metrics.clics ?? 0, registros: row.metrics.registros ?? 0, ftd: row.metrics.ftd ?? 0, deposito: row.metrics.deposito ?? 0,
          activo: true,
        });
        cre++;
      }
    });
    onDone(`Importación lista · ${upd} ${upd === 1 ? "fuente actualizada" : "fuentes actualizadas"}${cre ? ` · ${cre} ${cre === 1 ? "nueva" : "nuevas"}` : ""}`);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[120] grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="absolute inset-0 bg-black/72 backdrop-blur-md" onClick={onClose} />
        <motion.div initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="relative z-10 flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl ring-1 ring-white/12 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]" style={{ background: "#101016" }}>
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan/12 text-cyan ring-1 ring-cyan/20"><FileSpreadsheet size={16} /></span>
              <h3 className="font-display text-[17px] font-bold text-ink">Importar FTD masivo</h3>
            </div>
            <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft hover:bg-white/10 hover:text-ink"><X size={17} /></button>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
            {/* tabs */}
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
                {([["pegar", "Pegar desde Excel", ClipboardPaste], ["archivo", "Subir archivo", Upload]] as const).map(([id, txt, Icon]) => (
                  <button key={id} onClick={() => setTab(id)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${tab === id ? "bg-cyan/15 text-cyan" : "text-ink-mute hover:text-ink-soft"}`}>
                    <Icon size={14} /> {txt}
                  </button>
                ))}
              </div>
              <button onClick={descargarPlantilla} className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-ink-soft hover:text-cyan"><Download size={13} /> Plantilla CSV</button>
            </div>

            {tab === "pegar" ? (
              <div>
                <textarea value={text} onChange={(e) => onText(e.target.value)} rows={5}
                  placeholder={"Copia el rango desde Excel (Ctrl/Cmd+C) y pégalo aquí.\nPrimera fila = encabezados (destino, clics, registros, ftd, deposito…)"}
                  className="w-full resize-none rounded-xl border border-white/12 bg-white/[0.05] px-3 py-2.5 font-mono text-[12px] text-ink outline-none transition-colors focus:border-cyan/60 focus:bg-white/[0.08] placeholder:text-ink-mute/70" />
                <button onClick={() => onText(EJEMPLO)} className="mt-1.5 text-[11.5px] font-semibold text-ink-mute hover:text-cyan">Cargar datos de ejemplo →</button>
              </div>
            ) : (
              <div>
                <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
                <button onClick={() => fileRef.current?.click()}
                  className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.03] py-7 text-ink-soft transition-colors hover:border-cyan/45 hover:bg-white/[0.05]">
                  <FileSpreadsheet size={26} className="text-cyan" />
                  <span className="text-[13px] font-semibold text-ink">{fileName || "Elegir archivo .xlsx o .csv"}</span>
                  <span className="text-[11px] text-ink-mute">{cargando ? "Leyendo…" : "Arrastrá o hacé clic para subir el Excel que te entregaron"}</span>
                </button>
              </div>
            )}

            {/* error fatal */}
            {parsed?.fatal && (
              <div className="flex items-start gap-2 rounded-xl bg-negative/10 px-3.5 py-3 text-[12.5px] text-negative ring-1 ring-negative/25">
                <AlertTriangle size={15} className="mt-0.5 shrink-0" /> <span>{parsed.fatal}</span>
              </div>
            )}

            {/* detección de columnas + preview */}
            {parsed && !parsed.fatal && (
              <>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-mute">Columnas detectadas:</span>
                  {(["destino", ...parsed.metricCols] as Field[]).map((f) => (
                    <span key={f} className="inline-flex items-center gap-1 rounded-md bg-lime/12 px-2 py-0.5 text-[11px] font-medium text-lime ring-1 ring-lime/20">
                      <Check size={10} /> {ETIQUETA[f]}{parsed.headers[parsed.map[f]] ? ` · ${parsed.headers[parsed.map[f]]}` : ""}
                    </span>
                  ))}
                  {(["clics", "registros", "ftd", "deposito"] as Field[]).filter((f) => parsed.map[f] < 0).map((f) => (
                    <span key={f} className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 text-[11px] font-medium text-ink-mute ring-1 ring-white/10">— {ETIQUETA[f]}</span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[12.5px]">
                  <span className="text-ink-soft">{parsed.rows.length} filas</span>
                  <span className="inline-flex items-center gap-1 text-cyan"><RefreshCw size={12} /> {updates} actualizan</span>
                  <span className="inline-flex items-center gap-1 text-lime"><Plus size={12} /> {nuevas} nuevas</span>
                </div>

                <div className="overflow-hidden rounded-xl ring-1 ring-white/10">
                  <table className="w-full border-collapse text-[12px]">
                    <thead>
                      <tr className="bg-white/[0.03] text-[10px] font-medium uppercase tracking-wide text-ink-mute">
                        <th className="px-3 py-2 text-left font-medium">Estado</th>
                        <th className="px-3 py-2 text-left font-medium">Destino</th>
                        {parsed.metricCols.map((k) => <th key={k} className="px-3 py-2 text-right font-medium">{ETIQUETA[k]}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {parsed.rows.slice(0, 7).map((r, i) => (
                        <tr key={i} className="border-t border-line/70">
                          <td className="whitespace-nowrap px-3 py-1.5">
                            {r.match
                              ? <span className="inline-flex items-center gap-1 text-cyan"><RefreshCw size={11} /> actualiza</span>
                              : crearNuevas
                                ? <span className="inline-flex items-center gap-1 text-lime"><Plus size={11} /> nueva · {inferTipo(r)}</span>
                                : <span className="inline-flex items-center gap-1 text-ink-mute"><AlertTriangle size={11} /> sin fuente</span>}
                          </td>
                          <td className="max-w-[200px] truncate px-3 py-1.5 text-ink">
                            {r.match ? <span className="text-ink">{r.match.nombre}</span> : <span className="text-ink-soft">{r.nombre || nombreDe(r.destino)}</span>}
                            <span className="ml-1 text-ink-mute">· {r.destino}</span>
                          </td>
                          {parsed.metricCols.map((k) => (
                            <td key={k} className="px-3 py-1.5 text-right tabular-nums text-ink-soft">{k === "deposito" ? pesosK(r.metrics[k] ?? 0) : short(r.metrics[k] ?? 0)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsed.rows.length > 7 && <div className="bg-white/[0.02] px-3 py-1.5 text-center text-[11px] text-ink-mute">y {parsed.rows.length - 7} filas más…</div>}
                </div>

                {nuevas > 0 && (
                  <button onClick={() => setCrearNuevas((v) => !v)} className="flex w-full items-center justify-between rounded-xl border border-white/12 bg-white/[0.05] px-3 py-2.5">
                    <span className="text-[12.5px] font-medium text-ink-soft">Crear las {nuevas} fuentes nuevas (las que no hacen match)</span>
                    <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${crearNuevas ? "bg-cyan" : "bg-white/20"}`}>
                      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${crearNuevas ? "left-[18px]" : "left-0.5"}`} />
                    </span>
                  </button>
                )}
              </>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-line px-5 py-4">
            <span className="text-[11.5px] text-ink-mute">El match se hace por el link o código de cada fila.</span>
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="rounded-xl px-4 py-2 text-[13px] font-semibold text-ink-soft hover:bg-white/5">Cancelar</button>
              <button onClick={aplicar} disabled={!parsed || !!parsed.fatal || aImportar === 0}
                className="rounded-xl bg-cyan px-4 py-2 text-[13px] font-bold text-content-inverted transition-opacity enabled:hover:opacity-90 disabled:opacity-40">
                Importar {aImportar > 0 ? `${aImportar} ${aImportar === 1 ? "fila" : "filas"}` : ""}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
