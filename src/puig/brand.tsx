import type { CSSProperties } from "react";
import { submarcaById } from "./pdata";

/* Re-tinta una vista con el color de la submarca (sobre-escribe --color-cyan y afines,
   igual que .brand-* del index.css). Úsalo en un contenedor que envuelva la vista. */
export function tintVars(tint: string): CSSProperties {
  return { ["--color-cyan" as any]: tint, ["--color-cyan-deep" as any]: tint, ["--color-wine-600" as any]: tint, ["--color-wine-700" as any]: tint };
}

/* Logo de submarca sobre chip claro (los wordmarks son negros → se leen sobre blanco).
   Uniforma tamaños con una "placa" de logo de dimensiones fijas + object-contain. */
export function SubLogo({ id, w = 104, h = 34, className = "" }: { id: string; w?: number; h?: number; className?: string }) {
  const s = submarcaById(id);
  if (!s)
    return <span className={className} style={{ width: w, height: h }} />;
  return (
    <span
      className={"flex shrink-0 items-center justify-center rounded-lg border border-black/5 bg-white shadow-sm " + className}
      style={{ width: w, height: h }}
      title={s.nombre}
    >
      <img src={s.logo} alt={s.nombre} className="object-contain" style={{ maxWidth: w - 12, maxHeight: h - 10 }} />
    </span>
  );
}

/* Monograma cuadrado de submarca (para spots chicos donde no cabe el wordmark). */
export function SubTile({ id, size = 40, className = "" }: { id: string; size?: number; className?: string }) {
  const s = submarcaById(id);
  if (!s) return null;
  return (
    <span
      className={"grid shrink-0 place-items-center rounded-xl border border-black/5 bg-white shadow-sm " + className}
      style={{ width: size, height: size }}
      title={s.nombre}
    >
      <img src={s.logo} alt={s.nombre} className="object-contain" style={{ maxWidth: size - 8, maxHeight: size - 12 }} />
    </span>
  );
}

/* Logo Puig oficial (2024) sobre placa clara — para hero/dashboard. */
export function PuigLogo({ h = 56, className = "" }: { h?: number; className?: string }) {
  return (
    <span className={"grid place-items-center rounded-2xl border border-black/5 bg-white shadow-sm " + className} style={{ width: h, height: h }}>
      <img src="/puig-logo.svg" alt="Puig" className="object-contain" style={{ maxWidth: h - 14, maxHeight: h - 12 }} />
    </span>
  );
}
