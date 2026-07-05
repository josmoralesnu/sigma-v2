import { useState } from "react";
import { ChevronDown, Check, Megaphone } from "lucide-react";
import { campañas, type Campaña } from "../lib/data";

/* Selector de campaña para el header de las pantallas de medición.
   Lista las campañas de la marca activa (live binding `campañas`). */
const EST_CLS: Record<Campaña["estado"], string> = {
  "Activa": "bg-lime/12 text-lime ring-lime/25",
  "En estrategia": "bg-cyan/12 text-cyan ring-cyan/25",
  "Cerrada": "bg-[var(--sf-2)] text-ink-mute ring-[var(--ln-1)]",
  "Borrador": "bg-amber/12 text-amber ring-amber/25",
};

export function CampaignPicker({ value, onChange }: { value: string; onChange: (nombre: string, ventana: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex">
      <button onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--sf-1)] px-2.5 py-1 text-[13px] font-semibold text-ink ring-1 ring-[var(--ln-1)] transition hover:bg-[var(--hov)]">
        <Megaphone size={13} className="text-cyan" />
        <span className="max-w-[240px] truncate">{value}</span>
        <ChevronDown size={13} className={`text-ink-mute transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-50 mt-2 w-[320px] rounded-xl bg-[var(--modal)] p-1.5 shadow-2xl ring-1 ring-[var(--ln-1)]">
            <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-ink-mute">Campañas de la marca</div>
            {campañas.map((c) => (
              <button key={c.id} onClick={() => { onChange(c.nombre, c.ventana); setOpen(false); }}
                className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left transition hover:bg-[var(--hov)]">
                <span className="min-w-0">
                  <span className="block truncate text-[12.5px] font-semibold text-ink">{c.nombre}</span>
                  <span className="text-[11px] text-ink-mute">{c.ventana}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ring-1 ${EST_CLS[c.estado]}`}>{c.estado}</span>
                  {c.nombre === value && <Check size={14} className="text-cyan" />}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </span>
  );
}
