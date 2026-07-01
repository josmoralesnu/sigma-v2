import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Images, Play, Bookmark, Eye, MousePointerClick, Trophy, CheckCircle2, Clock, Search,
  Plus, Pencil, Trash2,
} from "lucide-react";
import { Wrap, PageHeader, container, item } from "./parts";
import { short, vocab, type Post, type EstadoContenido } from "./panel";
import { Thumb } from "./Thumb";
import { cliente } from "../lib/data";
import { useCentro } from "./store";
import { ContentModal, type ModalInit } from "./ContentModal";
import { platMeta } from "./plataformas";
import { DatosPruebaBadge } from "./confid";

const ESTADO: Record<EstadoContenido, { cls: string; icon: any }> = {
  "Publicado": { cls: "bg-lime/12 text-lime ring-lime/25", icon: CheckCircle2 },
  "Programado": { cls: "bg-cyan/12 text-cyan ring-cyan/25", icon: Clock },
  "En revisión": { cls: "bg-amber/12 text-amber ring-amber/25", icon: Clock },
};
const FILTROS = ["Todos", "Reel", "Video", "Carrusel", "Live", "Historia", "Post"] as const;

function fmtFecha(iso: string): string {
  const [, m, d] = iso.split("-");
  const meses = ["", "ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${parseInt(d, 10)} ${meses[parseInt(m, 10)]}`;
}

function Metric({ icon: Icon, label, v }: { icon: any; label: string; v: string }) {
  return (
    <div className="text-center">
      <Icon size={13} className="mx-auto mb-1 text-ink-mute" />
      <div className="text-[12px] font-bold tabular-nums text-ink">{v}</div>
      <div className="text-[8.5px] uppercase tracking-wide text-ink-mute">{label}</div>
    </div>
  );
}

function PostCard({ p, onEdit, onDelete }: { p: Post; onEdit: () => void; onDelete: () => void }) {
  const est = ESTADO[p.estado];
  const EstIcon = est.icon;
  const publicado = p.estado === "Publicado";
  return (
    <div className="glass group overflow-hidden rounded-2xl">
      <div className="relative grid h-40 place-items-center overflow-hidden">
        <Thumb img={p.img} tipo={p.tipo} />
        <span className="absolute left-3 top-3 z-10 rounded-md bg-black/45 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur">{p.tipo}</span>
        {p.promo && <span className="absolute right-3 top-3 z-10 rounded-md bg-cyan/85 px-1.5 py-0.5 text-[9px] font-bold text-content-inverted">PROMO</span>}
        <div className="relative z-10 grid h-12 w-12 place-items-center rounded-full bg-white/90 text-content-inverted transition-transform group-hover:scale-110">
          <Play size={18} className="translate-x-px fill-current" />
        </div>
        <span className="absolute bottom-3 left-3 z-10 text-[26px] drop-shadow">{p.avatar}</span>
        <span className={`absolute bottom-3 right-3 z-10 inline-flex items-center gap-1 rounded-md bg-black/50 px-2 py-0.5 text-[10px] font-semibold backdrop-blur ${platMeta(p.plataforma).text}`}>{p.plataforma}</span>

        {/* acciones (hover) */}
        <div className="absolute right-2 top-9 z-10 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button onClick={onEdit} title="Editar" className="grid h-7 w-7 place-items-center rounded-lg bg-black/55 text-white backdrop-blur hover:bg-black/75"><Pencil size={13} /></button>
          <button onClick={onDelete} title="Eliminar" className="grid h-7 w-7 place-items-center rounded-lg bg-black/55 text-white backdrop-blur hover:bg-negative/80"><Trash2 size={13} /></button>
        </div>
      </div>

      <div className="p-4">
        <div className="text-[13.5px] font-semibold leading-snug text-ink">{p.titulo}</div>
        <div className="mb-3 mt-1 flex items-center gap-2 text-[11px] text-ink-mute">
          <span className="text-[14px]">{p.avatar}</span>{p.autor} · {p.handle}
        </div>

        <div className="mb-3 flex items-center justify-between">
          <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10.5px] font-semibold ring-1 ${est.cls}`}>
            <EstIcon size={11} /> {p.estado}
          </span>
          <span className="text-[11px] text-ink-mute">{fmtFecha(p.fecha)} · {p.hora}</span>
        </div>

        {publicado ? (
          <div className="grid grid-cols-4 gap-2 border-t border-line pt-3">
            <Metric icon={Eye} label="Alcance" v={short(p.alcance)} />
            <Metric icon={MousePointerClick} label="Clics" v={short(p.clics)} />
            <Metric icon={Trophy} label={vocab.conv} v={String(p.ftd)} />
            <Metric icon={Bookmark} label="Guard." v={short(p.guardados)} />
          </div>
        ) : (
          <div className="flex items-center gap-2 border-t border-line pt-3 text-[11.5px] text-ink-mute">
            <Clock size={13} className="text-cyan" /> Métricas disponibles tras la publicación
          </div>
        )}
      </div>
    </div>
  );
}

export function Contenidos() {
  const { posts, removePost } = useCentro();
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]>("Todos");
  const [q, setQ] = useState("");
  const [modal, setModal] = useState<ModalInit | null>(null);

  const lista = posts.filter((p) =>
    (filtro === "Todos" || p.tipo === filtro) &&
    (q === "" || p.titulo.toLowerCase().includes(q.toLowerCase()) || p.autor.toLowerCase().includes(q.toLowerCase()))
  );
  const publicados = posts.filter((p) => p.estado === "Publicado").length;

  return (
    <Wrap>
      <PageHeader
        icon={<Images size={24} />}
        titulo="Contenidos"
        subtitulo={<><span>{publicados} publicados · {posts.length - publicados} en pipeline</span><span className="text-ink-mute">·</span><span>{cliente.campania}</span></>}
        right={
          <>
            <DatosPruebaBadge />
            <div className="glass flex items-center gap-2 rounded-xl px-3 py-2">
              <Search size={15} className="text-ink-mute" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar…" className="w-36 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-mute" />
            </div>
            <button onClick={() => setModal({})} className="inline-flex items-center gap-2 rounded-xl bg-cyan px-3.5 py-2 text-[13px] font-bold text-content-inverted transition-opacity hover:opacity-90">
              <Plus size={16} /> Subir contenido
            </button>
          </>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <button key={f} onClick={() => setFiltro(f)}
            className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold ring-1 transition-colors ${
              filtro === f ? "bg-cyan/15 text-cyan ring-cyan/30" : "bg-white/[0.03] text-ink-soft ring-white/10 hover:bg-white/[0.06]"
            }`}>{f}</button>
        ))}
      </div>

      <motion.div layout variants={container} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {lista.map((p) => (
            <motion.div key={p.id} layout variants={item} exit={{ opacity: 0, scale: 0.9 }} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 350, damping: 26 }}>
              <PostCard p={p} onEdit={() => setModal({ post: p })} onDelete={() => removePost(p.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {lista.length === 0 && (
        <div className="grid place-items-center py-20 text-center">
          <p className="text-[13px] text-ink-mute">Sin contenidos para ese filtro.</p>
          <button onClick={() => setModal({})} className="mt-3 inline-flex items-center gap-2 rounded-xl border border-line px-3.5 py-2 text-[13px] font-semibold text-ink-soft hover:bg-white/5"><Plus size={15} /> Subir el primero</button>
        </div>
      )}

      {modal && <ContentModal init={modal} onClose={() => setModal(null)} />}
    </Wrap>
  );
}
