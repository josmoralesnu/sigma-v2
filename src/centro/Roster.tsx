import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users, Plus, Pencil, Trash2, X, BadgeCheck, Wallet, UserCheck, Receipt,
  ArrowUpDown, ArrowUp, ArrowDown,
} from "lucide-react";
import { Wrap, PageHeader, card, container, item } from "./parts";
import { pesos, pesosK, short, PLATAFORMAS, type RosterItem, type RosterEstado, type Plataforma } from "./panel";
import { tierOf, tierLabel } from "../lib/data";
import { useCentro } from "./store";

const ESTADOS: RosterEstado[] = ["Activo", "Prospecto", "Pausado"];
const EST_CLS: Record<RosterEstado, string> = {
  Activo: "bg-lime/12 text-lime ring-lime/25",
  Prospecto: "bg-cyan/12 text-cyan ring-cyan/25",
  Pausado: "bg-white/8 text-ink-mute ring-white/10",
};

const field = "w-full rounded-xl border border-white/12 bg-white/[0.05] px-3 py-2.5 text-[13px] text-ink outline-none transition-colors focus:border-cyan/60 focus:bg-white/[0.08]";
const lbl = "mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-ink-mute";

/* ---------------- Modal alta/edición ---------------- */
function RosterModal({ item, onClose }: { item?: RosterItem | null; onClose: () => void }) {
  const { addRoster, updateRoster } = useCentro();
  const editing = !!item;
  const [nombre, setNombre] = useState(item?.nombre ?? "");
  const [handle, setHandle] = useState(item?.handle ?? "@");
  const [avatar, setAvatar] = useState(item?.avatar ?? "⭐");
  const [plataforma, setPlataforma] = useState<Plataforma>(item?.plataforma ?? "TikTok");
  const [seguidores, setSeguidores] = useState<number>(item?.seguidores ?? 50000);
  const [fee, setFee] = useState<number>(item?.fee ?? 500000);
  const [estado, setEstado] = useState<RosterEstado>(item?.estado ?? "Prospecto");
  const valido = nombre.trim().length > 1 && handle.trim().length > 1;

  const guardar = () => {
    if (!valido) return;
    const payload = { nombre: nombre.trim(), handle: handle.trim(), avatar: avatar.trim() || "⭐", plataforma, seguidores: Number(seguidores) || 0, fee: Number(fee) || 0, estado };
    if (editing && item) updateRoster(item.id, payload);
    else addRoster(payload);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[120] grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="absolute inset-0 bg-black/72 backdrop-blur-md" onClick={onClose} />
        <motion.div initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl ring-1 ring-white/12 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]" style={{ background: "#101016" }}>
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h3 className="font-display text-[17px] font-bold text-ink">{editing ? "Editar influencer" : "Agregar influencer"}</h3>
            <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft hover:bg-white/10 hover:text-ink"><X size={17} /></button>
          </div>
          <div className="space-y-3.5 p-5">
            <div className="flex gap-3">
              <div>
                <label className={lbl}>Avatar</label>
                <input className={`${field} w-16 text-center text-[20px]`} value={avatar} onChange={(e) => setAvatar(e.target.value)} maxLength={2} />
              </div>
              <div className="flex-1">
                <label className={lbl}>Nombre</label>
                <input className={field} value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Nova Picks" autoFocus />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Handle</label>
                <input className={field} value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@usuario" />
              </div>
              <div>
                <label className={lbl}>Plataforma</label>
                <select className={field} value={plataforma} onChange={(e) => setPlataforma(e.target.value as Plataforma)}>
                  {PLATAFORMAS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Seguidores</label>
                <input type="number" className={field} value={seguidores} onChange={(e) => setSeguidores(Number(e.target.value))} />
                <p className="mt-1 text-[10.5px] text-ink-mute">{short(Number(seguidores) || 0)} · {tierLabel(tierOf(Number(seguidores) || 0))}</p>
              </div>
              <div>
                <label className={lbl}>Pago (CLP)</label>
                <input type="number" step={50000} className={field} value={fee} onChange={(e) => setFee(Number(e.target.value))} />
                <p className="mt-1 text-[10.5px] text-ink-mute">{pesos(Number(fee) || 0)}</p>
              </div>
            </div>
            <div>
              <label className={lbl}>Estado</label>
              <select className={field} value={estado} onChange={(e) => setEstado(e.target.value as RosterEstado)}>
                {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-line px-5 py-4">
            <button onClick={onClose} className="rounded-xl px-4 py-2 text-[13px] font-semibold text-ink-soft hover:bg-white/5">Cancelar</button>
            <button onClick={guardar} disabled={!valido} className="rounded-xl bg-cyan px-4 py-2 text-[13px] font-bold text-content-inverted transition-opacity enabled:hover:opacity-90 disabled:opacity-40">{editing ? "Guardar" : "Agregar"}</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ---------------- KPI mini ---------------- */
function Stat({ icon: Icon, label, valor }: { icon: any; label: string; valor: string }) {
  return (
    <motion.div variants={item} whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className={`${card} flex items-center gap-3 p-4`}>
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan/12 text-cyan ring-1 ring-cyan/20"><Icon size={18} /></div>
      <div className="leading-tight">
        <div className="font-display text-[20px] font-bold text-ink">{valor}</div>
        <div className="text-[11px] text-ink-mute">{label}</div>
      </div>
    </motion.div>
  );
}

/* ---------------- Pantalla ---------------- */
type SortKey = "seguidores" | "fee" | "nombre";
export function Roster() {
  const { roster, removeRoster } = useCentro();
  const [modal, setModal] = useState<{ item?: RosterItem | null } | null>(null);
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "fee", dir: "desc" });

  const sorted = [...roster].sort((a, b) => {
    let d = 0;
    if (sort.key === "nombre") d = a.nombre.localeCompare(b.nombre);
    else d = a[sort.key] - b[sort.key];
    return sort.dir === "asc" ? d : -d;
  });
  const onSort = (key: SortKey) => setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));

  const totalFee = roster.reduce((s, r) => s + r.fee, 0);
  const activos = roster.filter((r) => r.estado === "Activo").length;
  const ticket = roster.length ? Math.round(totalFee / roster.length) : 0;

  const Arrow = (key: SortKey) => (sort.key !== key ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown);

  return (
    <Wrap>
      <PageHeader
        icon={<Users size={24} />}
        titulo="Roster"
        subtitulo={<><span>{roster.length} creadores · {activos} activos</span><span className="text-ink-mute">·</span><span>inversión en talento {pesosK(totalFee)} CLP</span></>}
        right={
          <button onClick={() => setModal({})} className="inline-flex items-center gap-2 rounded-xl bg-cyan px-3.5 py-2 text-[13px] font-bold text-content-inverted transition-opacity hover:opacity-90">
            <Plus size={16} /> Agregar influencer
          </button>
        }
      />

      <motion.section variants={container} initial="hidden" animate="show" className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={Users} label="Creadores" valor={String(roster.length)} />
        <Stat icon={UserCheck} label="Activos" valor={String(activos)} />
        <Stat icon={Wallet} label="Inversión en talento" valor={pesosK(totalFee)} />
        <Stat icon={Receipt} label="Pago promedio" valor={pesosK(ticket)} />
      </motion.section>

      <div className={`${card} overflow-hidden`}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-[10.5px] font-medium uppercase tracking-wide text-ink-mute">
              <th className="px-5 py-3 text-left font-medium">
                <button onClick={() => onSort("nombre")} className={`inline-flex items-center gap-1 hover:text-ink ${sort.key === "nombre" ? "text-cyan" : ""}`}>Creador {(() => { const A = Arrow("nombre"); return <A size={11} className={sort.key === "nombre" ? "text-cyan" : "text-ink-mute/50"} />; })()}</button>
              </th>
              <th className="px-3 py-3 text-left font-medium">Plataforma</th>
              <th className="px-3 py-3 text-right font-medium">
                <button onClick={() => onSort("seguidores")} className={`inline-flex items-center gap-1 hover:text-ink ${sort.key === "seguidores" ? "text-cyan" : ""}`}>Seguidores {(() => { const A = Arrow("seguidores"); return <A size={11} className={sort.key === "seguidores" ? "text-cyan" : "text-ink-mute/50"} />; })()}</button>
              </th>
              <th className="px-3 py-3 text-right font-medium">
                <button onClick={() => onSort("fee")} className={`inline-flex items-center gap-1 hover:text-ink ${sort.key === "fee" ? "text-cyan" : ""}`}>Pago {(() => { const A = Arrow("fee"); return <A size={11} className={sort.key === "fee" ? "text-cyan" : "text-ink-mute/50"} />; })()}</button>
              </th>
              <th className="px-3 py-3 text-center font-medium">Estado</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <motion.tr layout key={r.id} transition={{ type: "spring", stiffness: 600, damping: 42 }} className="group border-t border-line hover:bg-white/[0.02]">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/5 text-[17px] ring-1 ring-white/10">{r.avatar}</div>
                    <div className="leading-tight">
                      <div className="flex items-center gap-1 text-[13px] font-semibold text-ink">{r.nombre}<BadgeCheck size={13} className="text-cyan" /></div>
                      <div className="text-[11px] text-ink-mute">{r.handle}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-[12.5px] text-ink-soft">{r.plataforma}</td>
                <td className="px-3 py-3 text-right text-[12.5px] tabular-nums text-ink-soft">{short(r.seguidores)} <span className="text-ink-mute">· {tierLabel(tierOf(r.seguidores))}</span></td>
                <td className="px-3 py-3 text-right text-[13px] font-semibold tabular-nums text-ink">{pesos(r.fee)}</td>
                <td className="px-3 py-3 text-center"><span className={`inline-flex rounded-md px-2 py-1 text-[10.5px] font-semibold ring-1 ${EST_CLS[r.estado]}`}>{r.estado}</span></td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button onClick={() => setModal({ item: r })} title="Editar" className="grid h-7 w-7 place-items-center rounded-lg text-ink-mute hover:bg-white/10 hover:text-ink"><Pencil size={13} /></button>
                    <button onClick={() => removeRoster(r.id)} title="Eliminar" className="grid h-7 w-7 place-items-center rounded-lg text-ink-mute hover:bg-white/10 hover:text-negative"><Trash2 size={13} /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {roster.length === 0 && (
          <div className="grid place-items-center py-16 text-center">
            <p className="text-[13px] text-ink-mute">Tu roster está vacío.</p>
            <button onClick={() => setModal({})} className="mt-3 inline-flex items-center gap-2 rounded-xl border border-line px-3.5 py-2 text-[13px] font-semibold text-ink-soft hover:bg-white/5"><Plus size={15} /> Agregar el primero</button>
          </div>
        )}
      </div>

      {modal && <RosterModal item={modal.item} onClose={() => setModal(null)} />}
    </Wrap>
  );
}
