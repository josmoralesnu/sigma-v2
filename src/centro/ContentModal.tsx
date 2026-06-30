import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Upload, Play, Image as ImageIcon, Trash2, Link2, Sparkles } from "lucide-react";
import { useCentro } from "./store";
import {
  roster, fondoDe, detectFromUrl, TIPOS, PLATAFORMAS, ESTADOS,
  type Post, type TipoContenido, type Plataforma, type EstadoContenido,
} from "./panel";

export interface ModalInit {
  post?: Post | null;            // editar (si viene)
  defaults?: Partial<Post>;      // valores iniciales (p.ej. agendar → fecha/estado)
}

const field = "w-full rounded-xl border border-white/12 bg-white/[0.05] px-3 py-2.5 text-[13px] text-ink outline-none transition-colors focus:border-cyan/60 focus:bg-white/[0.08]";
const label = "mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-ink-mute";

export function ContentModal({ init, onClose }: { init: ModalInit; onClose: () => void }) {
  const { addPost, updatePost } = useCentro();
  const editing = !!init.post;
  const base: Partial<Post> = init.post ?? {};
  const d: Partial<Post> = init.defaults ?? {};

  const [link, setLink] = useState(base.url ?? "");
  const [detectado, setDetectado] = useState<string | null>(null);
  const [titulo, setTitulo] = useState(base.titulo ?? "");
  const [tipo, setTipo] = useState<TipoContenido>(base.tipo ?? d.tipo ?? "Reel");
  const [plataforma, setPlataforma] = useState<Plataforma>(base.plataforma ?? d.plataforma ?? "TikTok");
  const [autorIdx, setAutorIdx] = useState(() => {
    const h = base.handle ?? d.handle;
    const i = roster.findIndex((r) => r.handle === h);
    return i >= 0 ? i : 0;
  });
  const [fecha, setFecha] = useState(base.fecha ?? d.fecha ?? "2026-06-21");
  const [hora, setHora] = useState(base.hora ?? d.hora ?? "13:00");
  const [estado, setEstado] = useState<EstadoContenido>(base.estado ?? d.estado ?? "Programado");
  const [promo, setPromo] = useState<boolean>(base.promo ?? d.promo ?? false);
  const [img, setImg] = useState<string | undefined>(base.img);
  const fileRef = useRef<HTMLInputElement>(null);

  const autor = roster[autorIdx];
  const valido = titulo.trim().length > 1;

  const onLink = (v: string) => {
    setLink(v);
    const det = detectFromUrl(v);
    if (det.plataforma) setPlataforma(det.plataforma);
    if (det.tipo) setTipo(det.tipo);
    setDetectado(det.plataforma ? `Detectado: ${det.tipo ?? "post"} · ${det.plataforma}` : null);
  };

  const onFile = (f: File | undefined) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setImg(typeof reader.result === "string" ? reader.result : undefined);
    reader.readAsDataURL(f);
  };

  const guardar = () => {
    if (!valido) return;
    const payload = {
      tipo, titulo: titulo.trim(), autor: autor.nombre, handle: autor.handle, avatar: autor.avatar,
      plataforma, fecha, hora, estado, promo, img, url: link.trim() || undefined,
    };
    if (editing && init.post) updatePost(init.post.id, payload);
    else addPost({ ...payload, alcance: 0, impresiones: 0, er: 0, clics: 0, ftd: 0, guardados: 0 });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[120] grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="absolute inset-0 bg-black/72 backdrop-blur-md" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl ring-1 ring-white/12 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
          style={{ background: "#101016" }}
        >
          {/* header */}
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h3 className="font-display text-[17px] font-bold text-ink">{editing ? "Editar contenido" : "Subir contenido"}</h3>
            <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft hover:bg-white/10 hover:text-ink"><X size={17} /></button>
          </div>

          {/* link paste — auto-detección */}
          <div className="border-b border-line px-5 py-3.5">
            <label className={label}>Pegar link del post</label>
            <div className="flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.05] px-3 transition-colors focus-within:border-cyan/60">
              <Link2 size={15} className="shrink-0 text-ink-mute" />
              <input className="w-full bg-transparent py-2.5 text-[13px] text-ink outline-none placeholder:text-ink-mute" value={link} onChange={(e) => onLink(e.target.value)} placeholder="instagram.com/reel/… · tiktok.com/@… · youtube.com/…" />
              {detectado && <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md bg-cyan/15 px-2 py-0.5 text-[10.5px] font-semibold text-cyan"><Sparkles size={10} /> {detectado.replace("Detectado: ", "")}</span>}
            </div>
            <p className="mt-1.5 text-[10.5px] text-ink-mute">Pega el link y detectamos el tipo y la plataforma automáticamente.</p>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-[200px_1fr]">
            {/* preview + upload */}
            <div>
              <div className="relative grid h-44 place-items-center overflow-hidden rounded-xl ring-1 ring-white/10" style={img ? { backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: fondoDe(tipo) }}>
                <span className="absolute left-2.5 top-2.5 rounded-md bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur">{tipo}</span>
                {promo && <span className="absolute right-2.5 top-2.5 rounded-md bg-cyan/85 px-1.5 py-0.5 text-[9px] font-bold text-content-inverted">PROMO</span>}
                {!img && <div className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-content-inverted"><Play size={16} className="translate-x-px fill-current" /></div>}
                <span className="absolute bottom-2.5 left-2.5 text-[24px] drop-shadow">{autor.avatar}</span>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
              <div className="mt-2 flex gap-2">
                <button onClick={() => fileRef.current?.click()} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/12 bg-white/[0.05] py-2 text-[12px] font-semibold text-ink-soft hover:bg-white/[0.09]">
                  <Upload size={13} /> {img ? "Cambiar" : "Subir imagen"}
                </button>
                {img && <button onClick={() => setImg(undefined)} className="grid w-9 place-items-center rounded-lg border border-white/12 text-ink-mute hover:text-negative"><Trash2 size={14} /></button>}
              </div>
              <p className="mt-1.5 flex items-center gap-1 text-[10px] text-ink-mute"><ImageIcon size={10} /> opcional · se guarda en el navegador</p>
            </div>

            {/* form */}
            <div className="space-y-3.5">
              <div>
                <label className={label}>Título</label>
                <input className={field} value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: La previa estelar de hoy" autoFocus />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={label}>Tipo</label>
                  <select className={field} value={tipo} onChange={(e) => setTipo(e.target.value as TipoContenido)}>
                    {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={label}>Plataforma</label>
                  <select className={field} value={plataforma} onChange={(e) => setPlataforma(e.target.value as Plataforma)}>
                    {PLATAFORMAS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className={label}>Creador</label>
                <select className={field} value={autorIdx} onChange={(e) => setAutorIdx(Number(e.target.value))}>
                  {roster.map((r, i) => <option key={r.handle} value={i}>{r.avatar}  {r.nombre} · {r.handle}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={label}>Fecha</label>
                  <input type="date" className={field} value={fecha} onChange={(e) => setFecha(e.target.value)} />
                </div>
                <div>
                  <label className={label}>Hora</label>
                  <input type="time" className={field} value={hora} onChange={(e) => setHora(e.target.value)} />
                </div>
                <div>
                  <label className={label}>Estado</label>
                  <select className={field} value={estado} onChange={(e) => setEstado(e.target.value as EstadoContenido)}>
                    {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <button onClick={() => setPromo((v) => !v)} className="flex w-full items-center justify-between rounded-xl border border-white/12 bg-white/[0.05] px-3 py-2.5">
                <span className="text-[13px] font-medium text-ink-soft">Incluye código promocional / CTA registro</span>
                <span className={`relative h-5 w-9 rounded-full transition-colors ${promo ? "bg-cyan" : "bg-white/20"}`}>
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${promo ? "left-[18px]" : "left-0.5"}`} />
                </span>
              </button>
            </div>
          </div>

          {/* footer */}
          <div className="flex items-center justify-end gap-2 border-t border-line px-5 py-4">
            <button onClick={onClose} className="rounded-xl px-4 py-2 text-[13px] font-semibold text-ink-soft hover:bg-white/5">Cancelar</button>
            <button onClick={guardar} disabled={!valido} className="rounded-xl bg-cyan px-4 py-2 text-[13px] font-bold text-content-inverted transition-opacity enabled:hover:opacity-90 disabled:opacity-40">
              {editing ? "Guardar cambios" : "Crear contenido"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
