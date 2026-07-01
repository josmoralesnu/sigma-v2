import { useState } from "react";
import { motion } from "motion/react";
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Wrap, PageHeader } from "./parts";
import { calendarioMes, estadoToEvento, type Post, type EstadoEvento } from "./panel";
import { cliente } from "../lib/data";
import { useCentro } from "./store";
import { ContentModal, type ModalInit } from "./ContentModal";
import { DatosPruebaBadge } from "./confid";

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const EST_DOT: Record<EstadoEvento, string> = {
  publicado: "var(--color-lime)", programado: "var(--color-cyan)", revision: "var(--color-amber)",
};
const EST_RING: Record<EstadoEvento, string> = {
  publicado: "ring-lime/30 bg-lime/[0.07]", programado: "ring-cyan/30 bg-cyan/[0.07]", revision: "ring-amber/30 bg-amber/[0.07]",
};
const EST_LABEL: Record<EstadoEvento, string> = { publicado: "Publicado", programado: "Programado", revision: "En revisión" };

const iso = (dia: number) => `${calendarioMes.anio}-${String(calendarioMes.mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

export function Calendario() {
  const { posts } = useCentro();
  const [modal, setModal] = useState<ModalInit | null>(null);

  const { nombre, primerDiaSemana, dias } = calendarioMes;
  const offset = primerDiaSemana - 1;
  const celdas: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: dias }, (_, i) => i + 1)];
  while (celdas.length % 7 !== 0) celdas.push(null);

  const prefijo = `${calendarioMes.anio}-${String(calendarioMes.mes).padStart(2, "0")}`;
  const delMes = posts.filter((p) => p.fecha.startsWith(prefijo));
  const eventosDe = (d: number) =>
    delMes.filter((p) => parseInt(p.fecha.split("-")[2], 10) === d).sort((a, b) => a.hora.localeCompare(b.hora));
  const programadas = delMes.filter((p) => p.estado !== "Publicado").length;

  return (
    <Wrap>
      <PageHeader
        icon={<CalendarDays size={24} />}
        titulo="Calendario de publicaciones"
        subtitulo={<><span>{delMes.length} publicaciones · {programadas} programadas</span><span className="text-ink-mute">·</span><span>{cliente.marca}</span></>}
        right={
          <>
            <DatosPruebaBadge />
            <div className="glass flex items-center gap-1 rounded-xl p-1">
              <button className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft hover:bg-white/5"><ChevronLeft size={16} /></button>
              <span className="px-2 text-[13px] font-semibold text-ink">{nombre}</span>
              <button className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft hover:bg-white/5"><ChevronRight size={16} /></button>
            </div>
            <button onClick={() => setModal({ defaults: { estado: "Programado" } })} className="inline-flex items-center gap-2 rounded-xl bg-cyan px-3.5 py-2 text-[13px] font-bold text-content-inverted transition-opacity hover:opacity-90">
              <Plus size={15} /> Agendar
            </button>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-4 text-[11.5px] text-ink-soft">
        {(["publicado", "programado", "revision"] as EstadoEvento[]).map((e) => (
          <span key={e} className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: EST_DOT[e] }} /> {EST_LABEL[e]}</span>
        ))}
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        <div className="grid grid-cols-7 border-b border-line">
          {DIAS.map((d) => <div key={d} className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-ink-mute">{d}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {celdas.map((d, i) => {
            const evs = d ? eventosDe(d) : [];
            return (
              <div key={i} className={`group/cell relative min-h-[116px] border-b border-r border-line p-2 ${d ? "" : "bg-white/[0.015]"}`}>
                {d && (
                  <>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[12px] font-semibold text-ink-soft">{d}</span>
                      <button onClick={() => setModal({ defaults: { fecha: iso(d), estado: "Programado" } })}
                        title="Agendar este día"
                        className="grid h-5 w-5 place-items-center rounded-md text-ink-mute opacity-0 transition-opacity hover:bg-white/10 hover:text-cyan group-hover/cell:opacity-100">
                        <Plus size={13} />
                      </button>
                    </div>
                    <div className="space-y-1">
                      {evs.map((p: Post) => {
                        const e = estadoToEvento[p.estado];
                        return (
                          <motion.button key={p.id} onClick={() => setModal({ post: p })} layout
                            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.04 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className={`flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left ring-1 ${EST_RING[e]}`}
                            title={`${p.autor} · ${p.titulo} · ${p.plataforma} · ${p.hora}`}>
                            <span className="text-[12px] leading-none">{p.avatar}</span>
                            <span className="min-w-0 flex-1 truncate text-[10px] font-medium text-ink">{p.tipo}</span>
                            <span className="text-[9px] tabular-nums text-ink-mute">{p.hora}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {modal && <ContentModal init={modal} onClose={() => setModal(null)} />}
    </Wrap>
  );
}
