import type { ReactNode } from "react";

/* ---- variants de animación compartidos (motion/react) ---- */
export const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.04 } },
};
export const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 280, damping: 26 } },
};
export const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } },
};

/** Contenedor scrollable estándar de las pantallas de medición. */
export function Wrap({ children, max = "max-w-[1320px]" }: { children: ReactNode; max?: string }) {
  return (
    <div className="h-full overflow-y-auto px-8 py-7">
      <div className={`mx-auto ${max}`}>{children}</div>
    </div>
  );
}

/** Encabezado de pantalla con ícono, título, subtítulo y acciones a la derecha. */
export function PageHeader({
  icon, titulo, subtitulo, right,
}: { icon: ReactNode; titulo: string; subtitulo?: ReactNode; right?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-3.5">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan/15 text-cyan ring-1 ring-cyan/25">
          {icon}
        </div>
        <div>
          <h1 className="font-display text-[24px] font-bold leading-tight tracking-tight text-ink">{titulo}</h1>
          {subtitulo && <div className="mt-1 flex flex-wrap items-center gap-2.5 text-[13px] text-ink-soft">{subtitulo}</div>}
        </div>
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </header>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-cyan/12 px-2.5 py-1 text-[12px] font-semibold text-cyan ring-1 ring-cyan/20">
      {children}
    </span>
  );
}

export const card = "glass rounded-2xl";
