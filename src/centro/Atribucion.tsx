import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Target, Plus, Pencil, Trash2, X, Link2, Tag, Images, MousePointerClick,
  UserPlus, Trophy, Wallet, Copy, Check, ArrowUpDown, ArrowUp, ArrowDown, FileSpreadsheet, Sparkles,
} from "lucide-react";
import { ImportModal } from "./AtribImport";
import { Wrap, PageHeader, card, container, item } from "./parts";
import {
  pesos, pesosK, short, pct, slugLink, sugerirCodigo,
  roster as rosterFijo, FUENTES, ftdUniverso,
  type Atribucion, type FuenteTipo, type Post,
} from "./panel";
import { cliente } from "../lib/data";
import { useCentro } from "./store";

/* metadatos visuales por tipo de fuente */
const TIPO_META: Record<FuenteTipo, { icon: any; cls: string; bar: string; chip: string; desc: string }> = {
  Contenido: { icon: Images, cls: "text-cyan", bar: "bg-cyan", chip: "bg-cyan/12 text-cyan ring-cyan/25", desc: "Link trackeado en un post / historia puntual" },
  Bio: { icon: Link2, cls: "text-lime", bar: "bg-lime", chip: "bg-lime/12 text-lime ring-lime/25", desc: "Link en la bio del influencer (siempre activo)" },
  Código: { icon: Tag, cls: "text-amber", bar: "bg-amber", chip: "bg-amber/12 text-amber ring-amber/25", desc: "Código promo que el usuario tipea al registrarse" },
};

const field = "w-full rounded-xl border border-white/12 bg-white/[0.05] px-3 py-2.5 text-[13px] text-ink outline-none transition-colors focus:border-cyan/60 focus:bg-white/[0.08]";
const lbl = "mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-ink-mute";

/* ---------------- Chip de destino con copiar ---------------- */
function DestinoChip({ tipo, destino }: { tipo: FuenteTipo; destino: string }) {
  const [copiado, setCopiado] = useState(false);
  const copiar = () => {
    try { navigator.clipboard?.writeText(destino); } catch { /* */ }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1400);
  };
  const cod = tipo === "Código";
  return (
    <button onClick={copiar} title="Copiar"
      className="group/cp inline-flex max-w-full items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[11.5px] font-medium text-ink-soft transition-colors hover:border-cyan/40 hover:text-ink">
      {cod ? <Tag size={11} className="shrink-0 text-amber" /> : <Link2 size={11} className="shrink-0 text-cyan" />}
      <span className={`truncate ${cod ? "font-mono tracking-wide" : ""}`}>{destino}</span>
      {copiado ? <Check size={11} className="shrink-0 text-lime" /> : <Copy size={11} className="shrink-0 text-ink-mute opacity-0 transition-opacity group-hover/cp:opacity-100" />}
    </button>
  );
}

/* ---------------- Modal alta/edición ---------------- */
function AtribModal({ item, onClose }: { item?: Atribucion | null; onClose: () => void }) {
  const { addAtrib, updateAtrib, posts } = useCentro();
  const editing = !!item;
  const [tipo, setTipo] = useState<FuenteTipo>(item?.tipo ?? "Contenido");
  const [nombre, setNombre] = useState(item?.nombre ?? "");
  const [handle, setHandle] = useState(item?.handle ?? "");
  const [avatar, setAvatar] = useState(item?.avatar ?? "⭐");
  const [referencia, setReferencia] = useState(item?.referencia ?? "");
  const [destino, setDestino] = useState(item?.destino ?? "");
  const [clics, setClics] = useState<number>(item?.clics ?? 0);
  const [registros, setRegistros] = useState<number>(item?.registros ?? 0);
  const [ftd, setFtd] = useState<number>(item?.ftd ?? 0);
  const [deposito, setDeposito] = useState<number>(item?.deposito ?? 0);
  const [activo, setActivo] = useState<boolean>(item?.activo ?? true);

  const esCodigo = tipo === "Código";

  // al elegir tipo nuevo, sugiere referencia/destino acordes (sin pisar lo ya escrito en edición)
  const cambiarTipo = (t: FuenteTipo) => {
    setTipo(t);
    if (t === "Bio") { setReferencia("Link de bio"); if (handle) setDestino(slugLink(handle)); }
    else if (t === "Código") { setReferencia("Código promo"); if (handle) setDestino(sugerirCodigo(handle)); }
    else { setReferencia(""); if (handle) setDestino(slugLink(handle)); }
  };

  // elegir contenido (tipo Contenido) → autocompleta dueño + referencia + destino
  const elegirPost = (id: string) => {
    const p = posts.find((x) => x.id === id);
    if (!p) return;
    setNombre(p.autor); setHandle(p.handle); setAvatar(p.avatar);
    setReferencia(p.titulo);
    setDestino(slugLink(p.handle) + "-" + p.tipo.toLowerCase());
  };
  // elegir influencer (tipo Bio/Código)
  const elegirInfluencer = (h: string) => {
    const r = rosterFijo.find((x) => x.handle === h);
    if (!r) return;
    setNombre(r.nombre); setHandle(r.handle); setAvatar(r.avatar);
    setDestino(esCodigo ? sugerirCodigo(r.handle) : slugLink(r.handle));
  };

  const valido = nombre.trim().length > 1 && destino.trim().length > 1;
  const guardar = () => {
    if (!valido) return;
    const payload = {
      tipo, nombre: nombre.trim(), handle: handle.trim() || "@", avatar: avatar.trim() || "⭐",
      referencia: referencia.trim() || (esCodigo ? "Código promo" : tipo === "Bio" ? "Link de bio" : "Contenido"),
      destino: destino.trim(), clics: esCodigo ? 0 : Number(clics) || 0,
      registros: Number(registros) || 0, ftd: Number(ftd) || 0, deposito: Number(deposito) || 0, activo,
    };
    if (editing && item) updateAtrib(item.id, payload);
    else addAtrib(payload);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[120] grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="absolute inset-0 bg-black/72 backdrop-blur-md" onClick={onClose} />
        <motion.div initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl ring-1 ring-white/12 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]" style={{ background: "#101016" }}>
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h3 className="font-display text-[17px] font-bold text-ink">{editing ? "Editar fuente de FTD" : "Nueva fuente de FTD"}</h3>
            <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft hover:bg-white/10 hover:text-ink"><X size={17} /></button>
          </div>

          <div className="space-y-4 p-5">
            {/* tipo segmentado */}
            <div>
              <label className={lbl}>Tipo de atribución</label>
              <div className="grid grid-cols-3 gap-2">
                {FUENTES.map((t) => {
                  const M = TIPO_META[t]; const Icon = M.icon; const on = tipo === t;
                  return (
                    <button key={t} onClick={() => cambiarTipo(t)}
                      className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-[12px] font-semibold transition-colors ${on ? "border-cyan/50 bg-cyan/10 text-ink" : "border-white/10 bg-white/[0.03] text-ink-mute hover:bg-white/[0.06]"}`}>
                      <Icon size={16} className={on ? M.cls : ""} /> {t}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 text-[10.5px] text-ink-mute">{TIPO_META[tipo].desc}</p>
            </div>

            {/* selector de fuente */}
            {tipo === "Contenido" ? (
              <div>
                <label className={lbl}>Contenido asociado</label>
                <select className={field} defaultValue="" onChange={(e) => elegirPost(e.target.value)}>
                  <option value="" disabled>Elegir un post / historia…</option>
                  {posts.map((p: Post) => <option key={p.id} value={p.id}>{p.avatar}  {p.titulo} · {p.autor}</option>)}
                </select>
              </div>
            ) : (
              <div>
                <label className={lbl}>Influencer</label>
                <select className={field} defaultValue={handle || ""} onChange={(e) => elegirInfluencer(e.target.value)}>
                  <option value="" disabled>Elegir influencer…</option>
                  {rosterFijo.map((r) => <option key={r.handle} value={r.handle}>{r.avatar}  {r.nombre} · {r.handle}</option>)}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Referencia</label>
                <input className={field} value={referencia} onChange={(e) => setReferencia(e.target.value)} placeholder={esCodigo ? "Código promo" : tipo === "Bio" ? "Link de bio" : "Nombre del contenido"} />
              </div>
              <div>
                <label className={lbl}>{esCodigo ? "Código" : "Link trackeado"}</label>
                <input className={`${field} ${esCodigo ? "font-mono uppercase" : ""}`} value={destino} onChange={(e) => setDestino(esCodigo ? e.target.value.toUpperCase() : e.target.value)} placeholder={esCodigo ? "PREVIA50" : "estelar.bet/…"} />
              </div>
            </div>

            {/* métricas */}
            <div className={`grid gap-3 ${esCodigo ? "grid-cols-3" : "grid-cols-4"}`}>
              {!esCodigo && (
                <div>
                  <label className={lbl}>Clics</label>
                  <input type="number" className={field} value={clics} onChange={(e) => setClics(Number(e.target.value))} />
                </div>
              )}
              <div>
                <label className={lbl}>Registros</label>
                <input type="number" className={field} value={registros} onChange={(e) => setRegistros(Number(e.target.value))} />
              </div>
              <div>
                <label className={lbl}>FTD</label>
                <input type="number" className={field} value={ftd} onChange={(e) => setFtd(Number(e.target.value))} />
              </div>
              <div>
                <label className={lbl}>Depósito</label>
                <input type="number" step={100000} className={field} value={deposito} onChange={(e) => setDeposito(Number(e.target.value))} />
              </div>
            </div>
            <p className="-mt-1.5 text-[10.5px] text-ink-mute">
              {pesos(Number(deposito) || 0)} CLP · ticket {ftd > 0 ? pesos(Math.round((Number(deposito) || 0) / ftd)) : "—"} · conv. registro→FTD {pct(Number(ftd) || 0, Number(registros) || 0)}
            </p>

            <button onClick={() => setActivo((v) => !v)} className="flex w-full items-center justify-between rounded-xl border border-white/12 bg-white/[0.05] px-3 py-2.5">
              <span className="text-[13px] font-medium text-ink-soft">Fuente activa</span>
              <span className={`relative h-5 w-9 rounded-full transition-colors ${activo ? "bg-cyan" : "bg-white/20"}`}>
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${activo ? "left-[18px]" : "left-0.5"}`} />
              </span>
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-line px-5 py-4">
            <button onClick={onClose} className="rounded-xl px-4 py-2 text-[13px] font-semibold text-ink-soft hover:bg-white/5">Cancelar</button>
            <button onClick={guardar} disabled={!valido} className="rounded-xl bg-cyan px-4 py-2 text-[13px] font-bold text-content-inverted transition-opacity enabled:hover:opacity-90 disabled:opacity-40">{editing ? "Guardar" : "Agregar fuente"}</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ---------------- KPI mini ---------------- */
function Stat({ icon: Icon, label, valor, sub }: { icon: any; label: string; valor: string; sub?: string }) {
  return (
    <motion.div variants={item} whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className={`${card} flex items-center gap-3 p-4`}>
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan/12 text-cyan ring-1 ring-cyan/20"><Icon size={18} /></div>
      <div className="min-w-0 leading-tight">
        <div className="font-display text-[20px] font-bold text-ink">{valor}</div>
        <div className="truncate text-[11px] text-ink-mute">{sub ?? label}</div>
      </div>
    </motion.div>
  );
}

/* ---------------- Desglose por tipo ---------------- */
function TipoCard({ tipo, ftd, share }: { tipo: FuenteTipo; ftd: number; share: number }) {
  const M = TIPO_META[tipo]; const Icon = M.icon;
  return (
    <motion.div variants={item} className={`${card} p-4`}>
      <div className="mb-2 flex items-center justify-between">
        <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ${M.chip}`}><Icon size={12} /> {tipo}</span>
        <span className="text-[11px] tabular-nums text-ink-mute">{share.toFixed(0)}%</span>
      </div>
      <div className="font-display text-[22px] font-bold tabular-nums text-ink">{short(ftd)} <span className="text-[12px] font-medium text-ink-mute">FTD</span></div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
        <motion.div className={`h-full rounded-full ${M.bar}`} initial={{ width: 0 }} animate={{ width: `${share}%` }} transition={{ duration: 0.7, ease: "easeOut" }} />
      </div>
    </motion.div>
  );
}

/* ---------------- Pantalla ---------------- */
type SortKey = "clics" | "registros" | "ftd" | "deposito";
export function Atribucion() {
  const { atribuciones, removeAtrib } = useCentro();
  const [modal, setModal] = useState<{ item?: Atribucion | null } | null>(null);
  const [importar, setImportar] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<"Todas" | FuenteTipo>("Todas");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "ftd", dir: "desc" });

  useEffect(() => { if (!banner) return; const t = setTimeout(() => setBanner(null), 5000); return () => clearTimeout(t); }, [banner]);

  const tot = useMemo(() => {
    const ftd = atribuciones.reduce((s, a) => s + a.ftd, 0);
    const deposito = atribuciones.reduce((s, a) => s + a.deposito, 0);
    const registros = atribuciones.reduce((s, a) => s + a.registros, 0);
    const porTipo = (t: FuenteTipo) => atribuciones.filter((a) => a.tipo === t).reduce((s, a) => s + a.ftd, 0);
    return { ftd, deposito, registros, ticket: ftd ? Math.round(deposito / ftd) : 0, porTipo };
  }, [atribuciones]);

  const lista = useMemo(() => {
    const f = filtro === "Todas" ? atribuciones : atribuciones.filter((a) => a.tipo === filtro);
    return [...f].sort((a, b) => (sort.dir === "asc" ? a[sort.key] - b[sort.key] : b[sort.key] - a[sort.key]));
  }, [atribuciones, filtro, sort]);

  const onSort = (key: SortKey) => setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));
  const Arrow = (key: SortKey) => (sort.key !== key ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown);
  const th = (key: SortKey, txt: string) => (
    <button onClick={() => onSort(key)} className={`ml-auto inline-flex items-center gap-1 hover:text-ink ${sort.key === key ? "text-cyan" : ""}`}>
      {txt} {(() => { const A = Arrow(key); return <A size={11} className={sort.key === key ? "text-cyan" : "text-ink-mute/50"} />; })()}
    </button>
  );

  return (
    <Wrap>
      <PageHeader
        icon={<Target size={24} />}
        titulo="Atribución de FTD"
        subtitulo={<><span>{atribuciones.length} fuentes · {short(tot.ftd)} FTD atribuidos</span><span className="text-ink-mute">·</span><span>{cliente.marca}</span></>}
        right={
          <>
            <button onClick={() => setImportar(true)} className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-3.5 py-2 text-[13px] font-semibold text-ink-soft transition-colors hover:bg-white/[0.08] hover:text-ink">
              <FileSpreadsheet size={15} /> Importar Excel
            </button>
            <button onClick={() => setModal({})} className="inline-flex items-center gap-2 rounded-xl bg-cyan px-3.5 py-2 text-[13px] font-bold text-content-inverted transition-opacity hover:opacity-90">
              <Plus size={16} /> Nueva fuente
            </button>
          </>
        }
      />

      <AnimatePresence>
        {banner && (
          <motion.div initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -8, height: 0 }}
            className="mb-4 flex items-center gap-2.5 rounded-xl bg-lime/10 px-4 py-3 text-[13px] font-medium text-lime ring-1 ring-lime/25">
            <Sparkles size={15} /> {banner}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.section variants={container} initial="hidden" animate="show" className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={Trophy} label="FTD atribuido" valor={short(tot.ftd)} sub="FTD con fuente directa" />
        <Stat icon={Target} label="% del total" valor={pct(tot.ftd, ftdUniverso)} sub={`de ${short(ftdUniverso)} FTD de campaña`} />
        <Stat icon={Wallet} label="Depósito atribuido" valor={pesosK(tot.deposito)} sub="1er depósito · CLP" />
        <Stat icon={UserPlus} label="Ticket promedio" valor={pesos(tot.ticket)} sub="depósito por FTD" />
      </motion.section>

      <motion.section variants={container} initial="hidden" animate="show" className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {FUENTES.map((t) => <TipoCard key={t} tipo={t} ftd={tot.porTipo(t)} share={tot.ftd ? (tot.porTipo(t) / tot.ftd) * 100 : 0} />)}
      </motion.section>

      <div className="mb-4 flex flex-wrap gap-2">
        {(["Todas", ...FUENTES] as const).map((f) => (
          <button key={f} onClick={() => setFiltro(f)}
            className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold ring-1 transition-colors ${filtro === f ? "bg-cyan/15 text-cyan ring-cyan/30" : "bg-white/[0.03] text-ink-soft ring-white/10 hover:bg-white/[0.06]"}`}>{f}</button>
        ))}
      </div>

      <div className={`${card} overflow-hidden`}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-[10.5px] font-medium uppercase tracking-wide text-ink-mute">
              <th className="px-5 py-3 text-left font-medium">Fuente</th>
              <th className="px-3 py-3 text-left font-medium">Destino</th>
              <th className="px-3 py-3 text-right font-medium">{th("clics", "Clics")}</th>
              <th className="px-3 py-3 text-right font-medium">{th("registros", "Registros")}</th>
              <th className="px-3 py-3 text-right font-medium">{th("ftd", "FTD")}</th>
              <th className="px-3 py-3 text-right font-medium">{th("deposito", "Depósito")}</th>
              <th className="px-3 py-3 text-right font-medium">Ticket</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {lista.map((a) => {
                const M = TIPO_META[a.tipo]; const Icon = M.icon;
                const ticket = a.ftd ? Math.round(a.deposito / a.ftd) : 0;
                return (
                  <motion.tr layout key={a.id} initial={{ opacity: 0 }} animate={{ opacity: a.activo ? 1 : 0.5 }} exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 600, damping: 42 }} className="group border-t border-line hover:bg-white/[0.02]">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/5 text-[16px] ring-1 ring-white/10">{a.avatar}</div>
                        <div className="min-w-0 leading-tight">
                          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                            {a.nombre}
                            {!a.activo && <span className="rounded bg-white/8 px-1 py-0.5 text-[9px] font-semibold text-ink-mute">pausada</span>}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-ink-mute">
                            <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9.5px] font-semibold ring-1 ${M.chip}`}><Icon size={9} /> {a.tipo}</span>
                            <span className="truncate">{a.referencia}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3"><DestinoChip tipo={a.tipo} destino={a.destino} /></td>
                    <td className="px-3 py-3 text-right text-[12.5px] tabular-nums text-ink-soft">{a.tipo === "Código" ? <span className="text-ink-mute">—</span> : short(a.clics)}</td>
                    <td className="px-3 py-3 text-right text-[12.5px] tabular-nums text-ink-soft">{short(a.registros)}</td>
                    <td className="px-3 py-3 text-right text-[13px] font-bold tabular-nums text-ink">{a.ftd.toLocaleString("es-CL")}</td>
                    <td className="px-3 py-3 text-right text-[12.5px] font-semibold tabular-nums text-ink-soft">{pesosK(a.deposito)}</td>
                    <td className="px-3 py-3 text-right text-[12px] tabular-nums text-ink-mute">{ticket ? pesos(ticket) : "—"}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button onClick={() => setModal({ item: a })} title="Editar" className="grid h-7 w-7 place-items-center rounded-lg text-ink-mute hover:bg-white/10 hover:text-ink"><Pencil size={13} /></button>
                        <button onClick={() => removeAtrib(a.id)} title="Eliminar" className="grid h-7 w-7 place-items-center rounded-lg text-ink-mute hover:bg-white/10 hover:text-negative"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
        {lista.length === 0 && (
          <div className="grid place-items-center py-16 text-center">
            <p className="text-[13px] text-ink-mute">Sin fuentes de atribución para ese filtro.</p>
            <button onClick={() => setModal({})} className="mt-3 inline-flex items-center gap-2 rounded-xl border border-line px-3.5 py-2 text-[13px] font-semibold text-ink-soft hover:bg-white/5"><Plus size={15} /> Agregar la primera</button>
          </div>
        )}
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-ink-mute">
        <MousePointerClick size={12} className="text-cyan" /> Cada fuente trackea su propio embudo (clics → registros → FTD). Los códigos se atribuyen al registro, sin clic previo.
      </p>

      {modal && <AtribModal item={modal.item} onClose={() => setModal(null)} />}
      {importar && <ImportModal onClose={() => setImportar(false)} onDone={setBanner} />}
    </Wrap>
  );
}
