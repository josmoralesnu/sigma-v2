import { acentoHex, type Marca } from "../lib/data";

/* Marca visual del cliente (logos oficiales en /public).
   - Copec: /copec-logo.svg (rojo) sobre chip blanco
   - Betsson: /betsson-orange.svg (naranja) y monograma "b" naranja para el tile
   - resto: glyph en su acento */

export function BrandTile({ marca, size = 36, className = "" }: { marca: Marca; size?: number; className?: string }) {
  const base = "flex shrink-0 items-center justify-center overflow-hidden " + className;
  const dims = { width: size, height: size, borderRadius: size >= 32 ? 10 : 8 } as React.CSSProperties;

  if (marca.id === "copec")
    return (
      <span className={base + " border border-[var(--ln-1)] bg-white"} style={{ ...dims, paddingInline: size * 0.16 }}>
        <img src="/copec-logo.svg" alt="Copec" className="w-full" />
      </span>
    );
  if (marca.id === "betsson")
    return (
      <span className={base + " font-extrabold lowercase"} style={{ ...dims, background: "#ff6600", color: "#0a0a0c", fontSize: size * 0.52 }}>
        b
      </span>
    );
  if (marca.id === "estelarbet")
    return (
      <span className={base} style={dims}>
        <img src="/estelarbet-iso.jpg" alt="EstelarBet" className="h-full w-full object-cover" />
      </span>
    );
  if (marca.id === "puig")
    return (
      <span className={base + " font-display font-bold"} style={{ ...dims, background: "#141210", color: "#c9a24b", fontSize: size * 0.5, letterSpacing: "-0.02em" }}>
        P
      </span>
    );
  return (
    <span className={base + " font-semibold"} style={{ ...dims, background: `${acentoHex[marca.acento]}24`, color: acentoHex[marca.acento], fontSize: size * 0.4 }}>
      {marca.glyph}
    </span>
  );
}

export function BrandLockup({ marca, className = "" }: { marca: Marca; className?: string }) {
  if (marca.id === "copec")
    return (
      <span className={"inline-flex items-center rounded-xl border border-[var(--ln-1)] bg-white px-3 py-2 shadow-sm " + className}>
        <img src="/copec-logo.svg" alt="Copec" className="h-[18px] w-auto" />
      </span>
    );
  if (marca.id === "betsson")
    return (
      <span className={"glass inline-flex items-center rounded-xl px-3.5 py-2.5 " + className}>
        <img src="/betsson-orange.svg" alt="Betsson" className="h-[15px] w-auto" />
      </span>
    );
  if (marca.id === "estelarbet")
    return (
      <span className={"inline-flex items-center gap-2.5 " + className}>
        <span className="grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-lg">
          <img src="/estelarbet-iso.jpg" alt="" className="h-full w-full object-cover" />
        </span>
        {/* wordmark blanco-sobre-negro: screen elimina el negro sobre fondos oscuros */}
        <img src="/estelarbet-logo.png" alt="EstelarBet" className="h-[15px] w-auto" style={{ mixBlendMode: "screen" }} />
      </span>
    );
  if (marca.id === "puig")
    return (
      <span className={"inline-flex items-center gap-2.5 " + className}>
        <span className="grid h-7 w-7 place-items-center rounded-lg font-display text-[15px] font-bold" style={{ background: "#141210", color: "#c9a24b" }}>P</span>
        <span className="font-display text-[19px] font-bold uppercase tracking-[0.22em] text-content">Puig</span>
      </span>
    );
  return (
    <span className={"inline-flex items-center gap-2 " + className}>
      <span className="grid h-7 w-7 place-items-center rounded-lg text-[14px] font-bold" style={{ background: `${acentoHex[marca.acento]}24`, color: acentoHex[marca.acento] }}>
        {marca.glyph}
      </span>
      <span className="font-display text-[18px] font-extrabold tracking-tight text-content">{marca.nombre}</span>
    </span>
  );
}
