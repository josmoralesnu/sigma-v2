/* ============================================================
   Motor de presupuesto — la pieza que decide la mezcla
   Tarifas por categoría (1 reel + 2 historias), CLP.
   El cerebro recomienda perfiles según presupuesto y categoría.
   ============================================================ */
import {
  influencers, influencerById, fmtCLP, TIER_CONFIG, TIERS,
  type Influencer, type Concepto, type Tier,
} from "./data";

export interface FeeOpts {
  pieces?: number;       // nº de paquetes de contenido por creador (1 = 1 reel + 2 historias)
  imageRights?: boolean; // derecho a imagen → adicional configurable
}
// Adicional por derecho a imagen sobre el fee de contenido (editable).
export const IMAGE_RIGHTS_UPLIFT = 0.40;

// fee estimado del creador en CLP; null = celebrity (negociación 1:1, no estimable)
export function estFee(inf: Influencer, opts: FeeOpts = {}): number | null {
  const pack = TIER_CONFIG[inf.tier].pack;
  if (pack == null) return null;
  const pieces = opts.pieces ?? 1;
  const ir = opts.imageRights ? 1 + IMAGE_RIGHTS_UPLIFT : 1;
  return Math.round(pack * pieces * ir);
}

// alcance estimado (cuentas únicas) del paquete; piezas extra suman frecuencia, no tanto alcance
export function estReach(inf: Influencer, pieces = 1): number {
  const f = TIER_CONFIG[inf.tier].reach * (1 + 0.2 * (pieces - 1));
  return Math.round(inf.seguidores * f);
}

export function candidatos(c: Concepto): Influencer[] {
  const set = new Map<string, Influencer>();
  c.influencers.forEach((id) => {
    const i = influencerById(id);
    if (i) set.set(i.id, i);
  });
  influencers.filter((i) => i.arquetipo === c.arquetipo).forEach((i) => set.set(i.id, i));
  influencers
    .slice()
    .sort((a, b) => b.fit - a.fit)
    .forEach((i) => {
      if (set.size < 10) set.set(i.id, i);
    });
  return [...set.values()];
}

export function justificacion(inf: Influencer, c: Concepto): string {
  const eff = inf.engagement >= 6 ? "engagement alto a bajo costo" : inf.fit >= 88 ? "afinidad muy alta con la marca" : "buen balance alcance/credibilidad";
  return `${TIER_CONFIG[inf.tier].label} de ${inf.arquetipo}, ${eff}. Mood ${inf.mood}: calza con “${c.titulo}”.`;
}

export interface Elegido {
  inf: Influencer;
  fee: number;
  reach: number;
  just: string;
}
export interface Plan {
  elegidos: Elegido[];
  fuera: { inf: Influencer; fee: number }[];
  aCotizar: Influencer[]; // celebrity · negociación 1:1
  totalFee: number;
  restante: number;
  totalReach: number;
  erBlend: number;
  cpm: number;
  pruebaEst: number;
  porTier: Record<Tier, number>;        // nº de creadores por categoría
  inversionPorTier: Record<Tier, number>; // CLP invertido por categoría (para el donut)
  pieces: number;
  imageRights: boolean;
  recomendacion: string;
  tono: "ok" | "warn" | "good";
}

const emptyTierRecord = (): Record<Tier, number> =>
  Object.fromEntries(TIERS.map((t) => [t, 0])) as Record<Tier, number>;

export function planificar(c: Concepto, budget: number, opts: FeeOpts = {}): Plan {
  const pieces = opts.pieces ?? 1;
  const imageRights = opts.imageRights ?? false;

  const cand = candidatos(c).map((inf) => {
    const fee = estFee(inf, { pieces, imageRights });
    const reach = estReach(inf, pieces);
    const eff = fee && fee > 0 ? (reach * (inf.fit / 100)) / fee : 0;
    return { inf, fee, reach, eff };
  });

  const aCotizar = cand.filter((x) => x.fee == null).map((x) => x.inf);
  const priceable = cand.filter((x) => x.fee != null).sort((a, b) => b.eff - a.eff);

  const elegidos: Elegido[] = [];
  const fuera: { inf: Influencer; fee: number }[] = [];
  let spent = 0;
  let prueba = 0;
  for (const r of priceable) {
    const fee = r.fee as number;
    if (spent + fee <= budget) {
      elegidos.push({ inf: r.inf, fee, reach: r.reach, just: justificacion(r.inf, c) });
      spent += fee;
      prueba += r.reach * TIER_CONFIG[r.inf.tier].conv;
    } else {
      fuera.push({ inf: r.inf, fee });
    }
  }

  const totalReach = elegidos.reduce((s, e) => s + e.reach, 0);
  const erBlend = totalReach > 0 ? elegidos.reduce((s, e) => s + e.inf.engagement * e.reach, 0) / totalReach : 0;
  const cpm = totalReach > 0 ? (spent / totalReach) * 1000 : 0;

  const porTier = emptyTierRecord();
  const inversionPorTier = emptyTierRecord();
  elegidos.forEach((e) => { porTier[e.inf.tier] += 1; inversionPorTier[e.inf.tier] += e.fee; });

  // ---- recomendación dinámica ----
  let recomendacion = "";
  let tono: Plan["tono"] = "ok";
  const cheapestFuera = fuera.slice().sort((a, b) => a.fee - b.fee)[0];
  const tieneGrande = porTier.macro + porTier.mega > 0;
  const chicos = porTier.nano + porTier.micro + porTier.mid;

  if (elegidos.length === 0) {
    recomendacion = "Presupuesto insuficiente para activar un paquete. Sube el monto o parte con nano-influencers.";
    tono = "warn";
  } else if (!tieneGrande && chicos >= 3) {
    recomendacion = `Sigma reparte el presupuesto en ${chicos} nano/micro/mid de alto engagement: más prueba real, mejor credibilidad y menor CPM que un solo gran creador.`;
    tono = "good";
  } else if (tieneGrande && chicos >= 2) {
    recomendacion = `Mezcla balanceada: ${porTier.macro + porTier.mega} macro/mega para alcance bruto + ${chicos} perfiles chicos para credibilidad y conversión.`;
    tono = "good";
  } else if (cheapestFuera && budget - spent < cheapestFuera.fee) {
    recomendacion = `Te queda margen. Con ~${fmtCLP(cheapestFuera.fee - (budget - spent))} más sumas a ${cheapestFuera.inf.nombre.split(" ")[0]} (${TIER_CONFIG[cheapestFuera.inf.tier].label}) y amplías alcance.`;
    tono = "ok";
  } else {
    recomendacion = "Presupuesto holgado: cobertura completa del pool afín. Considera reservar ~15% para amplificación paga.";
    tono = "good";
  }
  if (aCotizar.length > 0 && tono !== "warn") {
    recomendacion += ` Hay ${aCotizar.length} perfil(es) celebrity disponibles bajo negociación 1:1 (no estimable automáticamente).`;
  }

  return {
    elegidos,
    fuera,
    aCotizar,
    totalFee: spent,
    restante: budget - spent,
    totalReach,
    erBlend: Math.round(erBlend * 10) / 10,
    cpm: Math.round(cpm),
    pruebaEst: Math.round(prueba),
    porTier,
    inversionPorTier,
    pieces,
    imageRights,
    recomendacion,
    tono,
  };
}

// Presupuestos en CLP (pesos chilenos)
export const PRESETS = [
  { label: "Chico", value: 8_000_000 },
  { label: "Medio", value: 18_000_000 },
  { label: "Estándar", value: 30_000_000 },
  { label: "Alto", value: 45_000_000 },
];
export const BUDGET_MIN = 5_000_000;
export const BUDGET_MAX = 50_000_000;
export const BUDGET_STEP = 1_000_000;
export const BUDGET_DEFAULT = 30_000_000;
