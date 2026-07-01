/* ============================================================
   SIGMA v2 — Centro de optimización (medición de campaña)
   Multi-cliente: COPEC (energía/App, sin FTD), BETSSON y
   ESTELARBET (apuestas, con FTD = primer depósito).
   La data es por marca y se reasigna con setPanelData(id)
   (ES module live bindings, igual que lib/data.ts). Inversión
   en CLP. El estado funcional vive en el store (store.tsx).
   ============================================================ */

/* ---------------- Helpers de formato ---------------- */
export const pesos = (n: number): string => "$" + Math.round(n).toLocaleString("es-CL");
export const pesosK = (n: number): string => {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toLocaleString("es-CL", { maximumFractionDigits: 1 }) + "M";
  if (n >= 1_000) return "$" + Math.round(n / 1000).toLocaleString("es-CL") + "K";
  return "$" + Math.round(n).toLocaleString("es-CL");
};
export const short = (n: number): string => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return Math.round(n / 1000) + "K";
  return String(n);
};
export const pct = (n: number, d: number): string =>
  d <= 0 ? "—" : (100 * n / d).toFixed(1).replace(/\.0$/, "") + "%";

/* dominio base del link trackeado (por marca) */
export let linkBase = "estelar.bet";
export const slugLink = (handle: string): string =>
  linkBase + "/" + handle.replace(/^@/, "").split(".")[0].replace(/[^a-z0-9]/gi, "").toLowerCase();
export const sugerirCodigo = (handle: string): string =>
  handle.replace(/^@/, "").replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase();

/* ---------------- Tipos ---------------- */
export interface Kpi { id: string; label: string; valor: string; delta: string; dir: "up" | "down"; sub: string; }
export interface PasoEmbudo { id: string; label: string; valor: string; pct: string }
export type Calidad = "Excelente" | "Muy bueno" | "Bueno" | "Regular";
export interface CreadorRow {
  nombre: string; handle: string; avatar: string; plataforma: string;
  alcance: number; er: number; clics: number; ftd: number; costo: number; calidad: Calidad;
}
export type TipoContenido = "Reel" | "Video" | "Carrusel" | "Historia" | "Live" | "Post";
export type EstadoContenido = "Publicado" | "Programado" | "En revisión";
export type Plataforma = "TikTok" | "Instagram" | "YouTube" | "Twitch" | "X";
export interface Post {
  id: string; tipo: TipoContenido; titulo: string; autor: string; handle: string; avatar: string;
  plataforma: Plataforma; fecha: string; hora: string; estado: EstadoContenido; promo: boolean;
  alcance: number; impresiones: number; er: number; clics: number; ftd: number; guardados: number;
  img?: string; url?: string;
}
export const TIPOS: TipoContenido[] = ["Reel", "Video", "Carrusel", "Historia", "Live", "Post"];
export const PLATAFORMAS: Plataforma[] = ["TikTok", "Instagram", "YouTube", "Twitch", "X"];
export const ESTADOS: EstadoContenido[] = ["Publicado", "Programado", "En revisión"];

/* placeholder del thumbnail — se tiñe con el acento de la marca activa (var CSS) */
export const TIPO_FONDO: Record<TipoContenido, string> = {
  Reel: "linear-gradient(135deg,var(--color-cyan),#0b0b0e)",
  Video: "linear-gradient(135deg,var(--color-cyan-deep),#0b0b0e)",
  Carrusel: "linear-gradient(160deg,var(--color-cyan),#141019)",
  Historia: "linear-gradient(135deg,var(--color-violet),#0b0b0e)",
  Live: "linear-gradient(135deg,var(--color-cyan-deep),#100b14)",
  Post: "linear-gradient(135deg,var(--color-cyan),#101016)",
};
export const fondoDe = (tipo: TipoContenido): string => TIPO_FONDO[tipo] ?? TIPO_FONDO.Reel;

export function detectFromUrl(url: string): { plataforma?: Plataforma; tipo?: TipoContenido } {
  const u = url.toLowerCase();
  if (!/https?:\/\/|\.(com|tv|be)/.test(u)) return {};
  if (u.includes("tiktok.")) return { plataforma: "TikTok", tipo: "Reel" };
  if (u.includes("x.com") || u.includes("twitter.")) return { plataforma: "X", tipo: "Post" };
  if (u.includes("twitch.tv")) return { plataforma: "Twitch", tipo: "Live" };
  if (u.includes("youtube.") || u.includes("youtu.be")) return { plataforma: "YouTube", tipo: u.includes("/shorts/") ? "Reel" : "Video" };
  if (u.includes("instagram.")) {
    if (u.includes("/reel") || u.includes("/reels")) return { plataforma: "Instagram", tipo: "Reel" };
    if (u.includes("/stories/")) return { plataforma: "Instagram", tipo: "Historia" };
    if (u.includes("/tv/")) return { plataforma: "Instagram", tipo: "Video" };
    if (u.includes("/p/")) return { plataforma: "Instagram", tipo: "Carrusel" };
    return { plataforma: "Instagram" };
  }
  return {};
}

export type RosterEstado = "Activo" | "Prospecto" | "Pausado";
export interface RosterItem {
  id: string; nombre: string; handle: string; avatar: string; plataforma: Plataforma;
  seguidores: number; fee: number; estado: RosterEstado;
}

/* Calendario (grilla operativa del mes, compartida) */
export const calendarioMes = { nombre: "Junio 2026", anio: 2026, mes: 6, primerDiaSemana: 1, dias: 30 };
export type EstadoEvento = "publicado" | "programado" | "revision";
export const estadoToEvento: Record<EstadoContenido, EstadoEvento> = {
  "Publicado": "publicado", "Programado": "programado", "En revisión": "revision",
};

/* Carta Gantt — grilla compartida; fases/hitos por marca */
export type AcentoGantt = "cyan" | "violet" | "lime" | "amber" | "rose" | "coral";
export const ACENTOS_GANTT: AcentoGantt[] = ["cyan", "violet", "lime", "amber", "rose", "coral"];
export interface TareaGantt { id: string; fase: string; responsable: string; inicio: number; fin: number; progreso: number; acento: AcentoGantt; }
export interface HitoGantt { id: string; dia: number; label: string }
export const ganttInicio = "2026-06-01";
export const ganttDias = 49;
export const ganttSemanas = ["Sem 1 · Jun", "Sem 2 · Jun", "Sem 3 · Jun", "Sem 4 · Jun", "Sem 5 · Jul", "Sem 6 · Jul", "Sem 7 · Jul"];
export const ganttFecha = (idx: number): string => {
  const base = new Date(2026, 5, 1); base.setDate(base.getDate() + idx);
  return `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}-${String(base.getDate()).padStart(2, "0")}`;
};
export const ganttIdx = (iso: string): number => {
  const [y, m, d] = iso.split("-").map(Number);
  return Math.round((new Date(y, m - 1, d).getTime() - new Date(2026, 5, 1).getTime()) / 86400000);
};

/* Sentimiento */
export interface TemaSent { tema: string; menciones: number; sent: number; dir: "up" | "down" }
export type SentLabel = "positivo" | "neutro" | "negativo";
export interface Comentario { autor: string; texto: string; sent: SentLabel; post: string; plataforma: string; likes: number }

/* Atribución de FTD (solo apuestas) */
export type FuenteTipo = "Contenido" | "Bio" | "Código";
export const FUENTES: FuenteTipo[] = ["Contenido", "Bio", "Código"];
export interface Atribucion {
  id: string; tipo: FuenteTipo; nombre: string; handle: string; avatar: string;
  referencia: string; destino: string; clics: number; registros: number; ftd: number; deposito: number; activo: boolean;
}

/* Panel de marca (Copec): foco awareness / EMV / ROI en vez de embudo FTD */
export interface BrandPanel {
  campania: { nombre: string; bajada: string; badges: string[]; roi: string; roiLabel: string; nota: string };
  kpis: { id: string; label: string; valor: string; delta: string; dir: "up" | "down"; sub: string }[];
  chart: { label: string; fechas: string[]; puntos: number[]; unidad: string };
  topCreators: { nombre: string; handle: string; avatar: string; alcance: number; er: number; emv: number; badge: string }[];
  goal: { label: string; objetivo: string; actual: string; pct: number };
}

/* Grillas orgánicas — medición del contenido orgánico (no pago):
   alcance/engagement orgánico vs. pago, saves/shares, crecimiento de
   seguidores atribuible a la campaña. Se deriva de la data de la marca. */
export interface OrganicoData {
  totalAlcance: number;
  kpis: { id: string; label: string; valor: string; delta: string; dir: "up" | "down"; sub: string }[];
  split: { organico: number; pago: number };              // % share del reach
  saves: { guardados: number; compartidos: number; comentarios: number; nuevos: number };
  plataformas: { plataforma: string; alcance: number; er: number; share: number }[];
  curva: { fechas: string[]; puntos: number[] };          // seguidores ganados acumulados
  piezas: { id: string; titulo: string; autor: string; avatar: string; plataforma: string; tipo: TipoContenido; alcance: number; guardados: number; compartidos: number; er: number }[];
  fuentes: OrgFuente[];                                    // páginas contratadas vs. propio de la marca
  serie: { fechas: string[]; paginas: number[]; propio: number[] };  // análisis temporal (alcance semanal por fuente)
  insightIA: string[];                                     // insights redactados para "Sigma explica"
}
export interface OrgFuente {
  key: "paginas" | "propio";
  label: string; desc: string;
  alcance: number; er: number; guardados: number; piezas: number; share: number;
  ejemplos: { nombre: string; handle: string; avatar: string; alcance: number; er: number }[];
}

/* Piezas creativas — aprobación estilo deck (Tinder) por medio.
   Cada pieza es una idea/diseño que se aprueba, descarta o pide cambios. */
export type Medio = "RRSS" | "OOH" | "Prensa" | "Video";
export const MEDIOS: Medio[] = ["RRSS", "OOH", "Prensa", "Video"];
export const MEDIO_LABEL: Record<Medio, string> = {
  RRSS: "Gráficas RRSS", OOH: "Vía pública", Prensa: "Prensa / Print", Video: "Video",
};
export type EstadoPieza = "Pendiente" | "Aprobado" | "Cambios" | "Descartado";
export const ESTADOS_PIEZA: EstadoPieza[] = ["Pendiente", "Aprobado", "Cambios", "Descartado"];
export interface ComentarioRev { autor: string; texto: string; fecha: string }
export interface Pieza {
  id: string; titulo: string; medio: Medio; formato: string; plataforma?: Plataforma;
  autor: string; avatar: string; version: number; estado: EstadoPieza; img?: string;
  descripcion?: string; comentarios: ComentarioRev[]; fecha: string; generadaIA?: boolean;
}
/* gradiente del thumbnail de la pieza según el medio (se tiñe con el acento de marca) */
export const MEDIO_FONDO: Record<Medio, string> = {
  RRSS: "linear-gradient(135deg,var(--color-cyan),#0b0b0e)",
  OOH: "linear-gradient(135deg,var(--color-violet),#101016)",
  Prensa: "linear-gradient(160deg,#2a2a33,#0b0b0e)",
  Video: "linear-gradient(135deg,var(--color-cyan-deep),#100b14)",
};

/* Vocabulario por marca (FTD vs activación, copys del panel) */
export interface Vocab {
  betting: boolean;
  conv: string;                 // etiqueta corta de la conversión final (col/tabs)
  embudoTitulo: string;
  conversionTotalLabel: string;
  topLabel: string;             // "top 3 por FTD"
  promoLabel: string;           // toggle del modal de contenido
  footerTag: string;
  panelInsight: { cuerpo: string; impactos: string[] };
}

interface PanelDataset {
  ventana: string;
  vocab: Vocab;
  kpis: Kpi[];
  embudo: PasoEmbudo[];
  conectores: { label: string; valor: string }[];
  conversionTotal: string;
  creadores: CreadorRow[];
  roster: { nombre: string; handle: string; avatar: string }[];
  seedPosts: Post[];
  seedRoster: RosterItem[];
  seedTareas: TareaGantt[];
  seedHitos: HitoGantt[];
  sentimiento: { score: number; tendencia: number; totalComentarios: number; positivo: number; neutro: number; negativo: number };
  temas: TemaSent[];
  comentarios: Comentario[];
  alertaSent: { tema: string; detalle: string };
  recomendaciones: { texto: string; prioridad: "Alta" | "Media" }[];
  seedAtribuciones: Atribucion[];
  ftdUniverso: number;
  linkBase: string;
  brandPanel?: BrandPanel; // Copec: dashboard de awareness en vez del embudo FTD
}

/* ============================================================
   COPEC — energía / App Copec / Pronto / Voltex (sin FTD)
   Conversión final = Activación Copec Pay (1er pago con la App)
   ============================================================ */
const COPEC_PANEL: PanelDataset = {
  ventana: "Copec en Ruta · Jun–Jul",
  linkBase: "copec.cl/app",
  vocab: {
    betting: false,
    conv: "Activ.",
    embudoTitulo: "Embudo de conversión: del influencer a la App",
    conversionTotalLabel: "Conversión total alcance → activación",
    topLabel: "top 3 por activaciones",
    promoLabel: "Incluye CTA a la App / beneficio Copec Pay",
    footerTag: "Optimiza. Escala. Conecta la ruta.",
    panelInsight: {
      cuerpo: "Los contenidos de creadores de viaje con demo real de la App (pago + beneficios) y engagement sobre 6% generan 2.1x más activaciones que el promedio de la campaña.",
      impactos: ["+3.200 activaciones adicionales", "−$420 costo por activación"],
    },
  },
  kpis: [
    { id: "inversion", label: "Inversión", valor: "$24,8M", delta: "9.4%", dir: "up", sub: "de $32M · CLP" },
    { id: "impresiones", label: "Impresiones", valor: "12,4M", delta: "18.6%", dir: "up", sub: "frecuencia 2.1x" },
    { id: "engagement", label: "Engagement rate", valor: "5.8%", delta: "0.7 pp", dir: "up", sub: "vs. semana anterior" },
    { id: "clics", label: "Clics al link", valor: "214.500", delta: "21.3%", dir: "up", sub: "CTR 1.72%" },
    { id: "registros", label: "Registros App", valor: "41.200", delta: "26.1%", dir: "up", sub: "descargas + alta" },
    { id: "ftd", label: "Activaciones Copec Pay", valor: "14.880", delta: "23.8%", dir: "up", sub: "1er pago con la App" },
    { id: "costo", label: "Costo por activación", valor: "$1.667", delta: "-8.9%", dir: "down", sub: "CPA en baja" },
  ],
  embudo: [
    { id: "impresiones", label: "Impresiones", valor: "12.480.000", pct: "100%" },
    { id: "clics", label: "Clics", valor: "214.500", pct: "1.72%" },
    { id: "registros", label: "Registros App", valor: "41.200", pct: "19.2%" },
    { id: "ftd", label: "Activaciones", valor: "14.880", pct: "36.1%" },
  ],
  conectores: [
    { label: "CTR", valor: "1.72%" },
    { label: "Conversión a registro", valor: "19.2%" },
    { label: "Conversión a activación", valor: "36.1%" },
  ],
  conversionTotal: "0.12%",
  creadores: [
    { nombre: "Rodrigo “Pelao” Soto", handle: "@rutachile", avatar: "🟠", plataforma: "YouTube", alcance: 240000, er: 6.6, clics: 12400, ftd: 1280, costo: 1490, calidad: "Excelente" },
    { nombre: "Cami & Beto", handle: "@familiaenruta", avatar: "🟡", plataforma: "Instagram", alcance: 180000, er: 7.4, clics: 9800, ftd: 1120, costo: 1380, calidad: "Excelente" },
    { nombre: "Seba Torres", handle: "@sebaev", avatar: "⚡", plataforma: "YouTube", alcance: 130000, er: 5.7, clics: 7100, ftd: 690, costo: 1720, calidad: "Muy bueno" },
    { nombre: "Dani Pérez", handle: "@piquefuera", avatar: "🍔", plataforma: "TikTok", alcance: 165000, er: 5.5, clics: 8300, ftd: 740, costo: 1660, calidad: "Muy bueno" },
    { nombre: "Nico Fuentes", handle: "@0800motor", avatar: "🏁", plataforma: "Instagram", alcance: 210000, er: 5.1, clics: 9600, ftd: 612, costo: 2010, calidad: "Bueno" },
    { nombre: "Chely Schneider", handle: "@chelyschneider", avatar: "🌸", plataforma: "Instagram", alcance: 620000, er: 4.1, clics: 14200, ftd: 588, costo: 2480, calidad: "Regular" },
  ],
  roster: [
    { nombre: "Rodrigo “Pelao” Soto", handle: "@rutachile", avatar: "🟠" },
    { nombre: "Cami & Beto", handle: "@familiaenruta", avatar: "🟡" },
    { nombre: "Dani Pérez", handle: "@piquefuera", avatar: "🍔" },
    { nombre: "Seba Torres", handle: "@sebaev", avatar: "⚡" },
    { nombre: "Nico Fuentes", handle: "@0800motor", avatar: "🏁" },
    { nombre: "Chely Schneider", handle: "@chelyschneider", avatar: "🌸" },
    { nombre: "Vale & el sur", handle: "@sur.en.auto", avatar: "🟤" },
    { nombre: "Pau Rutera", handle: "@rutera.pau", avatar: "🏔️" },
    { nombre: "Dani EV", handle: "@evchile.dani", avatar: "🔌" },
    { nombre: "Javi en Carretera", handle: "@javi.encarretera", avatar: "🍟" },
  ],
  seedPosts: [
    { id: "cp1", tipo: "Video", titulo: "Mi ruta al sur en 60s: cada parada es Copec", autor: "Rodrigo “Pelao” Soto", handle: "@rutachile", avatar: "🟠", plataforma: "YouTube", fecha: "2026-06-11", hora: "12:00", estado: "Publicado", promo: true, alcance: 240000, impresiones: 540000, er: 6.6, clics: 12400, ftd: 1280, guardados: 4200 },
    { id: "cp2", tipo: "Reel", titulo: "Cosas que no sabías que hace la App Copec", autor: "Seba Torres", handle: "@sebaev", avatar: "⚡", plataforma: "Instagram", fecha: "2026-06-12", hora: "18:30", estado: "Publicado", promo: true, alcance: 130000, impresiones: 300000, er: 5.7, clics: 7100, ftd: 690, guardados: 3100 },
    { id: "cp3", tipo: "Reel", titulo: "Arma tu combo Pronto perfecto para la ruta", autor: "Dani Pérez", handle: "@piquefuera", avatar: "🍔", plataforma: "TikTok", fecha: "2026-06-13", hora: "13:00", estado: "Publicado", promo: false, alcance: 165000, impresiones: 360000, er: 5.5, clics: 8300, ftd: 740, guardados: 2600 },
    { id: "cp4", tipo: "Carrusel", titulo: "Checklist de viaje: la App como copiloto", autor: "Cami & Beto", handle: "@familiaenruta", avatar: "🟡", plataforma: "Instagram", fecha: "2026-06-14", hora: "19:00", estado: "Publicado", promo: true, alcance: 180000, impresiones: 410000, er: 7.4, clics: 9800, ftd: 1120, guardados: 5400 },
    { id: "cp5", tipo: "Video", titulo: "Crucé Chile en auto eléctrico solo con Voltex", autor: "Seba Torres", handle: "@sebaev", avatar: "⚡", plataforma: "YouTube", fecha: "2026-06-16", hora: "20:30", estado: "Publicado", promo: false, alcance: 96000, impresiones: 210000, er: 6.2, clics: 5400, ftd: 410, guardados: 2200 },
    { id: "cp6", tipo: "Reel", titulo: "POV: el papá que solo para en Copec", autor: "Nico Fuentes", handle: "@0800motor", avatar: "🏁", plataforma: "Instagram", fecha: "2026-06-17", hora: "13:00", estado: "Publicado", promo: false, alcance: 210000, impresiones: 480000, er: 5.1, clics: 9600, ftd: 612, guardados: 3000 },
    { id: "cpx", tipo: "Post", titulo: "Hilo: 7 cosas que no sabías que hace tu App Copec", autor: "Copec", handle: "@copec", avatar: "🟠", plataforma: "X", fecha: "2026-06-19", hora: "09:30", estado: "Publicado", promo: false, alcance: 88000, impresiones: 240000, er: 3.2, clics: 4100, ftd: 320, guardados: 900 },
    { id: "cp7", tipo: "Reel", titulo: "Una semana pagando todo con la App Copec", autor: "Chely Schneider", handle: "@chelyschneider", avatar: "🌸", plataforma: "Instagram", fecha: "2026-06-18", hora: "16:00", estado: "Programado", promo: true, alcance: 0, impresiones: 0, er: 0, clics: 0, ftd: 0, guardados: 0 },
    { id: "cp8", tipo: "Video", titulo: "Mi parada favorita entre Santiago y el sur", autor: "Vale & el sur", handle: "@sur.en.auto", avatar: "🟤", plataforma: "YouTube", fecha: "2026-06-20", hora: "11:00", estado: "Programado", promo: false, alcance: 0, impresiones: 0, er: 0, clics: 0, ftd: 0, guardados: 0 },
    { id: "cp9", tipo: "Historia", titulo: "Beneficios App de la semana · canjea en Pronto", autor: "Javi en Carretera", handle: "@javi.encarretera", avatar: "🍟", plataforma: "Instagram", fecha: "2026-06-22", hora: "10:00", estado: "En revisión", promo: true, alcance: 0, impresiones: 0, er: 0, clics: 0, ftd: 0, guardados: 0 },
    { id: "cp10", tipo: "Reel", titulo: "Carga y anda: probando un punto Voltex", autor: "Dani EV", handle: "@evchile.dani", avatar: "🔌", plataforma: "TikTok", fecha: "2026-06-25", hora: "19:00", estado: "Programado", promo: false, alcance: 0, impresiones: 0, er: 0, clics: 0, ftd: 0, guardados: 0 },
    { id: "cp11", tipo: "Reel", titulo: "El alto que salvó las vacaciones", autor: "Pau Rutera", handle: "@rutera.pau", avatar: "🏔️", plataforma: "TikTok", fecha: "2026-06-28", hora: "20:00", estado: "Programado", promo: true, alcance: 0, impresiones: 0, er: 0, clics: 0, ftd: 0, guardados: 0 },
  ],
  seedRoster: [
    { id: "cr1", nombre: "Rodrigo “Pelao” Soto", handle: "@rutachile", avatar: "🟠", plataforma: "YouTube", seguidores: 240000, fee: 1_800_000, estado: "Activo" },
    { id: "cr2", nombre: "Cami & Beto", handle: "@familiaenruta", avatar: "🟡", plataforma: "Instagram", seguidores: 180000, fee: 1_500_000, estado: "Activo" },
    { id: "cr3", nombre: "Chely Schneider", handle: "@chelyschneider", avatar: "🌸", plataforma: "Instagram", seguidores: 620000, fee: 2_600_000, estado: "Activo" },
    { id: "cr4", nombre: "Nico Fuentes", handle: "@0800motor", avatar: "🏁", plataforma: "Instagram", seguidores: 210000, fee: 1_400_000, estado: "Activo" },
    { id: "cr5", nombre: "Seba Torres", handle: "@sebaev", avatar: "⚡", plataforma: "YouTube", seguidores: 130000, fee: 1_200_000, estado: "Activo" },
    { id: "cr6", nombre: "Dani Pérez", handle: "@piquefuera", avatar: "🍔", plataforma: "TikTok", seguidores: 165000, fee: 1_100_000, estado: "Activo" },
    { id: "cr7", nombre: "Javi en Carretera", handle: "@javi.encarretera", avatar: "🍟", plataforma: "Instagram", seguidores: 68000, fee: 520_000, estado: "Prospecto" },
    { id: "cr8", nombre: "Pau Rutera", handle: "@rutera.pau", avatar: "🏔️", plataforma: "TikTok", seguidores: 21000, fee: 380_000, estado: "Activo" },
    { id: "cr9", nombre: "Dani EV", handle: "@evchile.dani", avatar: "🔌", plataforma: "TikTok", seguidores: 14500, fee: 300_000, estado: "Prospecto" },
    { id: "cr10", nombre: "Vale & el sur", handle: "@sur.en.auto", avatar: "🟤", plataforma: "YouTube", seguidores: 58000, fee: 450_000, estado: "Pausado" },
  ],
  seedTareas: [
    { id: "cg1", fase: "Estrategia & casting de creadores", responsable: "Sigma + W&K", inicio: 0, fin: 10, progreso: 100, acento: "cyan" },
    { id: "cg2", fase: "Producción de contenido", responsable: "Estudio + creadores", inicio: 7, fin: 26, progreso: 64, acento: "violet" },
    { id: "cg3", fase: "Ruta 5 · roadtrip de verano", responsable: "Pelao Soto · Vale & el sur", inicio: 10, fin: 30, progreso: 48, acento: "coral" },
    { id: "cg4", fase: "App Copec · pago + beneficios", responsable: "Seba · Chely · Nico", inicio: 12, fin: 38, progreso: 36, acento: "amber" },
    { id: "cg5", fase: "Voltex · electromovilidad", responsable: "Dani EV · Seba Torres", inicio: 24, fin: 42, progreso: 0, acento: "rose" },
    { id: "cg6", fase: "Always-on · Pronto de carretera", responsable: "Pool foodie", inicio: 0, fin: 49, progreso: 30, acento: "lime" },
    { id: "cg7", fase: "Reporte & aprendizajes", responsable: "Sigma", inicio: 44, fin: 49, progreso: 0, acento: "cyan" },
  ],
  seedHitos: [
    { id: "ch1", dia: 10, label: "Sale el roadtrip" },
    { id: "ch2", dia: 24, label: "Push App" },
    { id: "ch3", dia: 38, label: "Voltex on" },
    { id: "ch4", dia: 47, label: "Cierre" },
  ],
  sentimiento: { score: 71, tendencia: 6, totalComentarios: 12840, positivo: 62, neutro: 28, negativo: 10 },
  temas: [
    { tema: "Ruta 5 / viajes", menciones: 3920, sent: 80, dir: "up" },
    { tema: "App Copec / pago", menciones: 3480, sent: 68, dir: "up" },
    { tema: "Pronto / snacks", menciones: 2510, sent: 78, dir: "up" },
    { tema: "Voltex / eléctricos", menciones: 1640, sent: 74, dir: "up" },
    { tema: "Precios bencina", menciones: 1980, sent: 41, dir: "down" },
    { tema: "Beneficios / canjes", menciones: 1310, sent: 70, dir: "up" },
  ],
  comentarios: [
    { autor: "@cami_dlt", texto: "Buenísimo el tip de pagar con la App, me ahorré la fila en el viaje al sur 🙌", sent: "positivo", post: "Cosas que no sabías que hace la App", plataforma: "Instagram", likes: 286 },
    { autor: "@elpipe23", texto: "El combo Pronto para la carretera es real, lo probé y la salva", sent: "positivo", post: "Arma tu combo Pronto", plataforma: "TikTok", likes: 174 },
    { autor: "@seba.ev", texto: "Por fin alguien muestra que se puede viajar en eléctrico con Voltex", sent: "positivo", post: "Crucé Chile en auto eléctrico", plataforma: "YouTube", likes: 240 },
    { autor: "@jorgevr", texto: "Cómodo el pago, pero la bencina igual está cara igual que todos", sent: "neutro", post: "Una semana pagando con la App", plataforma: "Instagram", likes: 96 },
    { autor: "@nico_ssj", texto: "La App me cobró un beneficio que no apareció, alguien sabe cómo reclamo?", sent: "negativo", post: "Beneficios App de la semana", plataforma: "Instagram", likes: 71 },
    { autor: "@marite_8", texto: "Me gusta que muestren paradas reales y no puro comercial", sent: "positivo", post: "Mi ruta al sur en 60s", plataforma: "YouTube", likes: 167 },
  ],
  alertaSent: {
    tema: "Precios bencina",
    detalle: "Sube la mención negativa de precios en los hilos de ruta. Recomendado: enfocar el mensaje en el beneficio de la App (ahorro + puntos) y derivar el reclamo de canjes a soporte en los comentarios de @familiaenruta.",
  },
  recomendaciones: [
    { texto: "Escalar a creadores de viaje con ER > 6% y CPA bajo (Pelao Soto, Cami & Beto).", prioridad: "Alta" },
    { texto: "Replicar el formato “demo real de la App” — top en activaciones.", prioridad: "Alta" },
    { texto: "Responder el hilo de canjes para frenar el sentimiento negativo.", prioridad: "Alta" },
    { texto: "Sumar contenido Voltex en rutas largas (territorio en alza, poca competencia).", prioridad: "Media" },
    { texto: "Recordar el #ad declarado en todas las piezas (aprendizaje caso SERNAC).", prioridad: "Media" },
  ],
  seedAtribuciones: [],
  ftdUniverso: 0,
  brandPanel: {
    campania: {
      nombre: "Copec en Ruta · Verano",
      bajada: "Energía, viajes y App. Una campaña hecha para acompañar a los chilenos en la ruta con creadores auténticos que viven la marca.",
      badges: ["UGC", "Awareness", "App Copec"],
      roi: "4.8x", roiLabel: "ROI (EMV)", nota: "Excelente",
    },
    kpis: [
      { id: "alcance", label: "Alcance", valor: "3,1M", delta: "34.5%", dir: "up", sub: "vs. período anterior" },
      { id: "impresiones", label: "Impresiones", valor: "12,4M", delta: "18.6%", dir: "up", sub: "vs. período anterior" },
      { id: "engagement", label: "Engagement rate", valor: "5.8%", delta: "1.2 pp", dir: "up", sub: "vs. período anterior" },
      { id: "clics", label: "Clics", valor: "214.500", delta: "21.3%", dir: "up", sub: "vs. período anterior" },
      { id: "conversiones", label: "Activaciones App", valor: "14.880", delta: "23.8%", dir: "up", sub: "1er pago con la App" },
      { id: "roi", label: "ROI (EMV)", valor: "4.8x", delta: "2.1x", dir: "up", sub: "valor de medios ganados" },
    ],
    chart: {
      label: "Alcance acumulado",
      fechas: ["02 jun", "09 jun", "16 jun", "23 jun", "30 jun", "07 jul"],
      puntos: [420000, 760000, 1180000, 1720000, 2380000, 3100000],
      unidad: "personas",
    },
    topCreators: [
      { nombre: "Rodrigo “Pelao” Soto", handle: "@rutachile", avatar: "🟠", alcance: 240000, er: 6.6, emv: 18400000, badge: "Top 1" },
      { nombre: "Cami & Beto", handle: "@familiaenruta", avatar: "🟡", alcance: 180000, er: 7.4, emv: 15200000, badge: "Top 2" },
      { nombre: "Chely Schneider", handle: "@chelyschneider", avatar: "🌸", alcance: 620000, er: 4.1, emv: 12800000, badge: "Top 3" },
    ],
    goal: { label: "Objetivo de ROI", objetivo: "4.0x", actual: "4.8x", pct: 100 },
  },
};

/* ============================================================
   BETSSON — apuestas / Mundial / Chilevisión (con FTD)
   ============================================================ */
const BETSSON_PANEL: PanelDataset = {
  ventana: "Mundial 2026 · Jun–Jul",
  linkBase: "betsson.cl",
  vocab: {
    betting: true,
    conv: "FTD",
    embudoTitulo: "Embudo de conversión: del influencer al FTD",
    conversionTotalLabel: "Conversión total alcance → FTD",
    topLabel: "top 3 por FTD",
    promoLabel: "Incluye código promocional / CTA registro",
    footerTag: "Optimiza. Escala. Juega responsable.",
    panelInsight: {
      cuerpo: "Los Reels con pick argumentado y engagement rate sobre 6% generan 2.3x más FTD que el promedio de la campaña.",
      impactos: ["+1.620 FTD adicionales", "−$580 costo por FTD"],
    },
  },
  kpis: [
    { id: "inversion", label: "Inversión", valor: "$34,2M", delta: "12.4%", dir: "up", sub: "de $48M · CLP" },
    { id: "impresiones", label: "Impresiones", valor: "10,9M", delta: "24.6%", dir: "up", sub: "frecuencia 2.4x" },
    { id: "engagement", label: "Engagement rate", valor: "6.2%", delta: "1.0 pp", dir: "up", sub: "vs. semana anterior" },
    { id: "clics", label: "Clics al link", valor: "208.700", delta: "26.8%", dir: "up", sub: "CTR 1.91%" },
    { id: "registros", label: "Registros", valor: "24.380", delta: "31.2%", dir: "up", sub: "cuentas nuevas" },
    { id: "ftd", label: "FTD · 1er depósito", valor: "7.420", delta: "28.1%", dir: "up", sub: "conversión 30.4%" },
    { id: "costo", label: "Costo por FTD", valor: "$4.610", delta: "-12.6%", dir: "down", sub: "CPA en baja" },
  ],
  embudo: [
    { id: "impresiones", label: "Impresiones", valor: "10.905.000", pct: "100%" },
    { id: "clics", label: "Clics", valor: "208.700", pct: "1.91%" },
    { id: "registros", label: "Registros", valor: "24.380", pct: "11.68%" },
    { id: "ftd", label: "FTD", valor: "7.420", pct: "30.4%" },
  ],
  conectores: [
    { label: "CTR", valor: "1.91%" },
    { label: "Conversión a registro", valor: "11.68%" },
    { label: "Conversión a FTD", valor: "30.4%" },
  ],
  conversionTotal: "0.07%",
  creadores: [
    { nombre: "La Previa CL", handle: "@laprevia.cl", avatar: "⚽", plataforma: "TikTok", alcance: 540000, er: 5.7, clics: 19800, ftd: 612, costo: 4380, calidad: "Excelente" },
    { nombre: "Picks con Data", handle: "@pickscondata", avatar: "📊", plataforma: "Instagram", alcance: 96000, er: 4.6, clics: 9200, ftd: 408, costo: 3720, calidad: "Excelente" },
    { nombre: "Clan Rojo", handle: "@clanrojo", avatar: "🟥", plataforma: "TikTok", alcance: 920000, er: 6.4, clics: 26400, ftd: 690, costo: 4960, calidad: "Muy bueno" },
    { nombre: "Tincho Apuestas", handle: "@tincho.apuesta", avatar: "💸", plataforma: "Instagram", alcance: 26000, er: 7.2, clics: 6100, ftd: 248, costo: 3540, calidad: "Muy bueno" },
    { nombre: "Mati Stream", handle: "@matistream", avatar: "🎰", plataforma: "Twitch", alcance: 1250000, er: 4.8, clics: 31200, ftd: 718, costo: 6020, calidad: "Bueno" },
    { nombre: "Mundial Total", handle: "@mundial.total", avatar: "⚽", plataforma: "YouTube", alcance: 38000, er: 6.6, clics: 5400, ftd: 168, costo: 5240, calidad: "Regular" },
  ],
  roster: [
    { nombre: "Clan Rojo", handle: "@clanrojo", avatar: "🟥" },
    { nombre: "La Previa CL", handle: "@laprevia.cl", avatar: "⚽" },
    { nombre: "Picks con Data", handle: "@pickscondata", avatar: "📊" },
    { nombre: "Tincho Apuestas", handle: "@tincho.apuesta", avatar: "💸" },
    { nombre: "Mati Stream", handle: "@matistream", avatar: "🎰" },
    { nombre: "El Relator Meme", handle: "@relatormeme", avatar: "🎙️" },
    { nombre: "Profe Táctico", handle: "@profe.tactico", avatar: "🎯" },
    { nombre: "Mundial Total", handle: "@mundial.total", avatar: "⚽" },
    { nombre: "Nacho Picks", handle: "@nacho.picks", avatar: "📈" },
    { nombre: "Barra del Sur", handle: "@barra.delsur", avatar: "🥁" },
  ],
  seedPosts: [
    { id: "bp1", tipo: "Reel", titulo: "La previa del partidazo: mi pick y la cuota", autor: "La Previa CL", handle: "@laprevia.cl", avatar: "⚽", plataforma: "TikTok", fecha: "2026-06-11", hora: "13:00", estado: "Publicado", promo: true, alcance: 540000, impresiones: 1180000, er: 5.7, clics: 19800, ftd: 612, guardados: 7800 },
    { id: "bp2", tipo: "Video", titulo: "Te explico la letra chica de los bonos", autor: "Picks con Data", handle: "@pickscondata", avatar: "📊", plataforma: "Instagram", fecha: "2026-06-12", hora: "18:30", estado: "Publicado", promo: true, alcance: 96000, impresiones: 205000, er: 4.6, clics: 9200, ftd: 408, guardados: 5200 },
    { id: "bp3", tipo: "Live", titulo: "Slots con tope: jugando con límite a la vista", autor: "Mati Stream", handle: "@matistream", avatar: "🎰", plataforma: "Twitch", fecha: "2026-06-13", hora: "21:00", estado: "Publicado", promo: true, alcance: 1250000, impresiones: 2100000, er: 4.8, clics: 31200, ftd: 718, guardados: 12400 },
    { id: "bp4", tipo: "Reel", titulo: "El once ideal… y la apuesta ideal de la fecha", autor: "Clan Rojo", handle: "@clanrojo", avatar: "🟥", plataforma: "TikTok", fecha: "2026-06-14", hora: "13:00", estado: "Publicado", promo: true, alcance: 920000, impresiones: 1950000, er: 6.4, clics: 26400, ftd: 690, guardados: 9100 },
    { id: "bp5", tipo: "Carrusel", titulo: "Mi pick de la fecha y por qué (con argumento)", autor: "Tincho Apuestas", handle: "@tincho.apuesta", avatar: "💸", plataforma: "Instagram", fecha: "2026-06-15", hora: "19:00", estado: "Publicado", promo: false, alcance: 26000, impresiones: 58000, er: 7.2, clics: 6100, ftd: 248, guardados: 2900 },
    { id: "bp6", tipo: "Video", titulo: "Reaccionando a la cuota más loca de la fecha", autor: "El Relator Meme", handle: "@relatormeme", avatar: "🎙️", plataforma: "YouTube", fecha: "2026-06-16", hora: "20:30", estado: "Publicado", promo: true, alcance: 320000, impresiones: 720000, er: 6.0, clics: 14600, ftd: 372, guardados: 5100 },
    { id: "bpx", tipo: "Post", titulo: "Cuotas en vivo del partido de hoy 🧵 #Mundial", autor: "Betsson Chile", handle: "@betssoncl", avatar: "🟧", plataforma: "X", fecha: "2026-06-18", hora: "17:45", estado: "Publicado", promo: true, alcance: 410000, impresiones: 980000, er: 4.1, clics: 18200, ftd: 466, guardados: 3400 },
    { id: "bp7", tipo: "Reel", titulo: "Cómo pongo mis límites antes de apostar", autor: "Profe Táctico", handle: "@profe.tactico", avatar: "🎯", plataforma: "TikTok", fecha: "2026-06-17", hora: "12:00", estado: "Programado", promo: false, alcance: 0, impresiones: 0, er: 0, clics: 0, ftd: 0, guardados: 0 },
    { id: "bp8", tipo: "Carrusel", titulo: "Comparo cuotas reales del mismo partido", autor: "Picks con Data", handle: "@pickscondata", avatar: "📊", plataforma: "Instagram", fecha: "2026-06-19", hora: "18:00", estado: "Programado", promo: true, alcance: 0, impresiones: 0, er: 0, clics: 0, ftd: 0, guardados: 0 },
    { id: "bp9", tipo: "Historia", titulo: "Reto $5.000 toda la fecha · juego responsable", autor: "Nacho Picks", handle: "@nacho.picks", avatar: "📈", plataforma: "Instagram", fecha: "2026-06-20", hora: "16:00", estado: "En revisión", promo: false, alcance: 0, impresiones: 0, er: 0, clics: 0, ftd: 0, guardados: 0 },
    { id: "bp10", tipo: "Live", titulo: "La comunidad elige el próximo juego", autor: "Mati Stream", handle: "@matistream", avatar: "🎰", plataforma: "Twitch", fecha: "2026-06-22", hora: "21:00", estado: "Programado", promo: true, alcance: 0, impresiones: 0, er: 0, clics: 0, ftd: 0, guardados: 0 },
    { id: "bp11", tipo: "Reel", titulo: "Datos locos antes del partido del día", autor: "Mundial Total", handle: "@mundial.total", avatar: "⚽", plataforma: "TikTok", fecha: "2026-06-25", hora: "13:00", estado: "Programado", promo: false, alcance: 0, impresiones: 0, er: 0, clics: 0, ftd: 0, guardados: 0 },
    { id: "bp12", tipo: "Reel", titulo: "La previa con la barra: el grito de gol", autor: "Barra del Sur", handle: "@barra.delsur", avatar: "🥁", plataforma: "TikTok", fecha: "2026-06-28", hora: "20:00", estado: "Programado", promo: true, alcance: 0, impresiones: 0, er: 0, clics: 0, ftd: 0, guardados: 0 },
  ],
  seedRoster: [
    { id: "br1", nombre: "Clan Rojo", handle: "@clanrojo", avatar: "🟥", plataforma: "TikTok", seguidores: 920000, fee: 3_200_000, estado: "Activo" },
    { id: "br2", nombre: "La Previa CL", handle: "@laprevia.cl", avatar: "⚽", plataforma: "TikTok", seguidores: 540000, fee: 2_400_000, estado: "Activo" },
    { id: "br3", nombre: "Mati Stream", handle: "@matistream", avatar: "🎰", plataforma: "Twitch", seguidores: 1250000, fee: 4_600_000, estado: "Prospecto" },
    { id: "br4", nombre: "El Relator Meme", handle: "@relatormeme", avatar: "🎙️", plataforma: "YouTube", seguidores: 320000, fee: 1_700_000, estado: "Activo" },
    { id: "br5", nombre: "Picks con Data", handle: "@pickscondata", avatar: "📊", plataforma: "Instagram", seguidores: 96000, fee: 1_100_000, estado: "Activo" },
    { id: "br6", nombre: "Profe Táctico", handle: "@profe.tactico", avatar: "🎯", plataforma: "TikTok", seguidores: 64000, fee: 560_000, estado: "Activo" },
    { id: "br7", nombre: "Mundial Total", handle: "@mundial.total", avatar: "⚽", plataforma: "YouTube", seguidores: 38000, fee: 420_000, estado: "Activo" },
    { id: "br8", nombre: "Tincho Apuestas", handle: "@tincho.apuesta", avatar: "💸", plataforma: "Instagram", seguidores: 26000, fee: 360_000, estado: "Activo" },
    { id: "br9", nombre: "Barra del Sur", handle: "@barra.delsur", avatar: "🥁", plataforma: "TikTok", seguidores: 12800, fee: 280_000, estado: "Pausado" },
    { id: "br10", nombre: "Nacho Picks", handle: "@nacho.picks", avatar: "📈", plataforma: "Instagram", seguidores: 8700, fee: 200_000, estado: "Prospecto" },
  ],
  seedTareas: [
    { id: "bg1", fase: "Estrategia & casting de creadores", responsable: "Sigma + W&K", inicio: 0, fin: 10, progreso: 100, acento: "cyan" },
    { id: "bg2", fase: "Producción de contenido", responsable: "Estudio + creadores", inicio: 7, fin: 24, progreso: 72, acento: "violet" },
    { id: "bg3", fase: "Previa del Mundial · Chilevisión", responsable: "La Previa CL · Clan Rojo", inicio: 10, fin: 18, progreso: 88, acento: "coral" },
    { id: "bg4", fase: "Fase de grupos", responsable: "Pool futbolero", inicio: 10, fin: 28, progreso: 46, acento: "amber" },
    { id: "bg5", fase: "Eliminatorias", responsable: "Pool futbolero + casino", inicio: 28, fin: 41, progreso: 0, acento: "rose" },
    { id: "bg6", fase: "Final + cierre de campaña", responsable: "Todos", inicio: 41, fin: 48, progreso: 0, acento: "cyan" },
    { id: "bg7", fase: "Always-on · juego responsable", responsable: "Picks con Data · Profe Táctico", inicio: 0, fin: 49, progreso: 38, acento: "lime" },
    { id: "bg8", fase: "Reporte & aprendizajes", responsable: "Sigma", inicio: 44, fin: 49, progreso: 0, acento: "violet" },
  ],
  seedHitos: [
    { id: "bh1", dia: 10, label: "Arranca el Mundial" },
    { id: "bh2", dia: 28, label: "Octavos" },
    { id: "bh3", dia: 41, label: "Semifinales" },
    { id: "bh4", dia: 47, label: "Final" },
  ],
  sentimiento: { score: 72, tendencia: 8, totalComentarios: 15120, positivo: 64, neutro: 25, negativo: 11 },
  temas: [
    { tema: "Cuotas y valor", menciones: 4120, sent: 78, dir: "up" },
    { tema: "Juego responsable", menciones: 2980, sent: 85, dir: "up" },
    { tema: "Mundial / partidos", menciones: 4760, sent: 75, dir: "up" },
    { tema: "Chilevisión / pantalla", menciones: 2240, sent: 79, dir: "up" },
    { tema: "App y registro", menciones: 1820, sent: 61, dir: "up" },
    { tema: "Retiros / pagos", menciones: 1560, sent: 44, dir: "down" },
  ],
  comentarios: [
    { autor: "@cami_dlt", texto: "Por fin una marca que explica las cuotas en vez de venderte humo 🙌", sent: "positivo", post: "Te explico la letra chica", plataforma: "Instagram", likes: 312 },
    { autor: "@elpipe23", texto: "Me registré por el link de la previa, la cuota estaba mejor que en Betano", sent: "positivo", post: "La previa del partidazo", plataforma: "TikTok", likes: 188 },
    { autor: "@jorgevr", texto: "Bueno que hablen de poner límites, ojalá todas hicieran eso", sent: "positivo", post: "Cómo pongo mis límites", plataforma: "TikTok", likes: 240 },
    { autor: "@andrea.m", texto: "El stream estuvo entretenido pero igual da nervio el tema del casino", sent: "neutro", post: "Slots con tope", plataforma: "Twitch", likes: 54 },
    { autor: "@nico_ssj", texto: "Alguien sabe cuánto demora el retiro? llevo 2 días esperando 😤", sent: "negativo", post: "Mi pick de la fecha", plataforma: "Instagram", likes: 96 },
    { autor: "@thekoke", texto: "jajaja la cuota imposible me mató, pero igual juego responsable cabros", sent: "positivo", post: "Reaccionando a la cuota", plataforma: "YouTube", likes: 410 },
  ],
  alertaSent: {
    tema: "Retiros / pagos",
    detalle: "Subió la mención negativa sobre demoras en retiros tras el partido del 15-jun. Recomendado: responder con FAQ y derivar a soporte en los hilos de @tincho.apuesta y @nacho.picks.",
  },
  recomendaciones: [
    { texto: "Escalar inversión en creadores con ER > 6% y CPA bajo (La Previa CL, Tincho).", prioridad: "Alta" },
    { texto: "Replicar el formato “te explico la letra chica” — top en registros.", prioridad: "Alta" },
    { texto: "Responder el hilo de retiros para frenar el sentimiento negativo.", prioridad: "Alta" },
    { texto: "Activar lives de casino en días sin partido (menos competencia).", prioridad: "Media" },
    { texto: "Capitalizar la pantalla de Chilevisión en la previa de cada partido.", prioridad: "Media" },
  ],
  seedAtribuciones: [
    { id: "ba1", tipo: "Contenido", nombre: "La Previa CL", handle: "@laprevia.cl", avatar: "⚽", referencia: "La previa del partidazo", destino: "betsson.cl/previa-cl", clics: 19800, registros: 2540, ftd: 612, deposito: 11_020_000, activo: true },
    { id: "ba2", tipo: "Contenido", nombre: "Mati Stream", handle: "@matistream", avatar: "🎰", referencia: "Slots con tope (live)", destino: "betsson.cl/slots-live", clics: 31200, registros: 3360, ftd: 718, deposito: 15_780_000, activo: true },
    { id: "ba3", tipo: "Bio", nombre: "Clan Rojo", handle: "@clanrojo", avatar: "🟥", referencia: "Link de bio", destino: "betsson.cl/clanrojo", clics: 26400, registros: 3010, ftd: 690, deposito: 12_420_000, activo: true },
    { id: "ba4", tipo: "Bio", nombre: "El Relator Meme", handle: "@relatormeme", avatar: "🎙️", referencia: "Link de bio", destino: "betsson.cl/relator", clics: 14600, registros: 1680, ftd: 372, deposito: 6_690_000, activo: true },
    { id: "ba5", tipo: "Código", nombre: "La Previa CL", handle: "@laprevia.cl", avatar: "⚽", referencia: "Código promo", destino: "PREVIA", clics: 0, registros: 1920, ftd: 388, deposito: 7_180_000, activo: true },
    { id: "ba6", tipo: "Código", nombre: "Picks con Data", handle: "@pickscondata", avatar: "📊", referencia: "Código promo", destino: "DATA", clics: 0, registros: 980, ftd: 244, deposito: 4_510_000, activo: true },
  ],
  ftdUniverso: 7420,
};

/* ============================================================
   ESTELARBET — apuestas / retador del Mundial (con FTD)
   ============================================================ */
const ESTELARBET_PANEL: PanelDataset = {
  ventana: "Mundial 2026 · Jun–Jul",
  linkBase: "estelar.bet",
  vocab: {
    betting: true,
    conv: "FTD",
    embudoTitulo: "Embudo de conversión: del influencer al FTD",
    conversionTotalLabel: "Conversión total alcance → FTD",
    topLabel: "top 3 por FTD",
    promoLabel: "Incluye código promocional / CTA registro",
    footerTag: "Optimiza. Escala. Juega responsable.",
    panelInsight: {
      cuerpo: "Los Reels con código promocional y engagement rate sobre 6% generan 2.3x más FTD que el promedio de la campaña.",
      impactos: ["+1.480 FTD adicionales", "−$640 costo por FTD"],
    },
  },
  kpis: [
    { id: "inversion", label: "Inversión", valor: "$28,6M", delta: "11.8%", dir: "up", sub: "de $40M · CLP" },
    { id: "impresiones", label: "Impresiones", valor: "8,71M", delta: "22.1%", dir: "up", sub: "frecuencia 2.3x" },
    { id: "engagement", label: "Engagement rate", valor: "6.6%", delta: "0.9 pp", dir: "up", sub: "vs. semana anterior" },
    { id: "clics", label: "Clics al link", valor: "171.400", delta: "24.0%", dir: "up", sub: "CTR 1.97%" },
    { id: "registros", label: "Registros", valor: "19.860", delta: "29.3%", dir: "up", sub: "cuentas nuevas" },
    { id: "ftd", label: "FTD · 1er depósito", valor: "5.940", delta: "26.5%", dir: "up", sub: "conversión 29.9%" },
    { id: "costo", label: "Costo por FTD", valor: "$4.815", delta: "-11.1%", dir: "down", sub: "CPA en baja" },
  ],
  embudo: [
    { id: "impresiones", label: "Impresiones", valor: "8.715.600", pct: "100%" },
    { id: "clics", label: "Clics", valor: "171.400", pct: "1.97%" },
    { id: "registros", label: "Registros", valor: "19.860", pct: "11.59%" },
    { id: "ftd", label: "FTD", valor: "5.940", pct: "29.9%" },
  ],
  conectores: [
    { label: "CTR", valor: "1.97%" },
    { label: "Conversión a registro", valor: "11.59%" },
    { label: "Conversión a FTD", valor: "29.9%" },
  ],
  conversionTotal: "0.07%",
  creadores: [
    { nombre: "La Previa Estelar", handle: "@laprevia.estelar", avatar: "⭐", plataforma: "TikTok", alcance: 540000, er: 6.0, clics: 18600, ftd: 498, costo: 4640, calidad: "Excelente" },
    { nombre: "Nova Picks", handle: "@novapicks", avatar: "🔭", plataforma: "Instagram", alcance: 96000, er: 5.2, clics: 8700, ftd: 372, costo: 3910, calidad: "Excelente" },
    { nombre: "Cometa FC", handle: "@cometafc", avatar: "☄️", plataforma: "TikTok", alcance: 410000, er: 5.3, clics: 16100, ftd: 402, costo: 4880, calidad: "Muy bueno" },
    { nombre: "Meteoro Apuestas", handle: "@meteoro.apuesta", avatar: "💫", plataforma: "Instagram", alcance: 27000, er: 7.4, clics: 6600, ftd: 221, costo: 3720, calidad: "Muy bueno" },
    { nombre: "Estrella Slots", handle: "@estrellaslots", avatar: "🎰", plataforma: "Twitch", alcance: 1150000, er: 4.7, clics: 29800, ftd: 652, costo: 6120, calidad: "Bueno" },
    { nombre: "Constelación FC", handle: "@constelacionfc", avatar: "🌌", plataforma: "YouTube", alcance: 72000, er: 5.6, clics: 7100, ftd: 198, costo: 5340, calidad: "Regular" },
  ],
  roster: [
    { nombre: "La Previa Estelar", handle: "@laprevia.estelar", avatar: "⭐" },
    { nombre: "Nova Picks", handle: "@novapicks", avatar: "🔭" },
    { nombre: "Cometa FC", handle: "@cometafc", avatar: "☄️" },
    { nombre: "Estrella Slots", handle: "@estrellaslots", avatar: "🎰" },
    { nombre: "Meteoro Apuestas", handle: "@meteoro.apuesta", avatar: "💫" },
    { nombre: "Profe de Cuotas", handle: "@profedecuotas", avatar: "🎯" },
    { nombre: "El Relator Cósmico", handle: "@relatorcosmico", avatar: "🎙️" },
    { nombre: "Constelación FC", handle: "@constelacionfc", avatar: "🌌" },
    { nombre: "Astro Tipster", handle: "@astrotipster", avatar: "📈" },
    { nombre: "Barra Estelar", handle: "@barraestelar", avatar: "🥁" },
  ],
  seedPosts: [
    { id: "es5", tipo: "Reel", titulo: "Jugada con cabeza: así pongo mis límites", autor: "Profe de Cuotas", handle: "@profedecuotas", avatar: "🎯", plataforma: "TikTok", fecha: "2026-06-11", hora: "12:00", estado: "Publicado", promo: false, alcance: 48000, impresiones: 108000, er: 5.0, clics: 4600, ftd: 158, guardados: 2700 },
    { id: "es2", tipo: "Video", titulo: "Cuotas que brillan: te explico la letra chica", autor: "Nova Picks", handle: "@novapicks", avatar: "🔭", plataforma: "Instagram", fecha: "2026-06-12", hora: "18:30", estado: "Publicado", promo: true, alcance: 96000, impresiones: 205000, er: 5.2, clics: 8700, ftd: 372, guardados: 5900 },
    { id: "es4", tipo: "Live", titulo: "Casino bajo las estrellas: la barra elige el juego", autor: "Estrella Slots", handle: "@estrellaslots", avatar: "🎰", plataforma: "Twitch", fecha: "2026-06-13", hora: "21:00", estado: "Publicado", promo: true, alcance: 1150000, impresiones: 1950000, er: 4.7, clics: 29800, ftd: 652, guardados: 11800 },
    { id: "es1", tipo: "Reel", titulo: "La previa estelar de hoy 🔥", autor: "La Previa Estelar", handle: "@laprevia.estelar", avatar: "⭐", plataforma: "TikTok", fecha: "2026-06-14", hora: "13:00", estado: "Publicado", promo: true, alcance: 540000, impresiones: 1180000, er: 6.0, clics: 18600, ftd: 498, guardados: 8100 },
    { id: "es3", tipo: "Carrusel", titulo: "Mi combinada del Mundial (con argumento)", autor: "Meteoro Apuestas", handle: "@meteoro.apuesta", avatar: "💫", plataforma: "Instagram", fecha: "2026-06-15", hora: "19:00", estado: "Publicado", promo: false, alcance: 27000, impresiones: 60000, er: 7.4, clics: 6600, ftd: 221, guardados: 3000 },
    { id: "es6", tipo: "Video", titulo: "Reaccionando a la cuota más loca de la fecha", autor: "El Relator Cósmico", handle: "@relatorcosmico", avatar: "🎙️", plataforma: "YouTube", fecha: "2026-06-16", hora: "20:30", estado: "Publicado", promo: true, alcance: 305000, impresiones: 690000, er: 6.1, clics: 14200, ftd: 388, guardados: 5300 },
    { id: "esx", tipo: "Post", titulo: "Cuotas estelares del partido de hoy 🌟🧵 #Mundial", autor: "EstelarBet", handle: "@estelarbet", avatar: "⭐", plataforma: "X", fecha: "2026-06-18", hora: "17:45", estado: "Publicado", promo: true, alcance: 360000, impresiones: 820000, er: 4.3, clics: 15400, ftd: 410, guardados: 3100 },
    { id: "es7", tipo: "Reel", titulo: "El once ideal… y la jugada estelar de la fecha", autor: "Cometa FC", handle: "@cometafc", avatar: "☄️", plataforma: "TikTok", fecha: "2026-06-17", hora: "13:00", estado: "Publicado", promo: true, alcance: 410000, impresiones: 910000, er: 5.3, clics: 16100, ftd: 402, guardados: 6000 },
    { id: "es8", tipo: "Reel", titulo: "La previa del partidazo de hoy", autor: "La Previa Estelar", handle: "@laprevia.estelar", avatar: "⭐", plataforma: "TikTok", fecha: "2026-06-18", hora: "13:00", estado: "Programado", promo: true, alcance: 0, impresiones: 0, er: 0, clics: 0, ftd: 0, guardados: 0 },
    { id: "es9", tipo: "Carrusel", titulo: "Bono vs. cuota potenciada: qué conviene", autor: "Nova Picks", handle: "@novapicks", avatar: "🔭", plataforma: "Instagram", fecha: "2026-06-19", hora: "18:00", estado: "Programado", promo: true, alcance: 0, impresiones: 0, er: 0, clics: 0, ftd: 0, guardados: 0 },
    { id: "es10", tipo: "Historia", titulo: "Reto $5.000 toda la fecha · juego responsable", autor: "Astro Tipster", handle: "@astrotipster", avatar: "📈", plataforma: "Instagram", fecha: "2026-06-20", hora: "16:00", estado: "En revisión", promo: false, alcance: 0, impresiones: 0, er: 0, clics: 0, ftd: 0, guardados: 0 },
    { id: "es11", tipo: "Live", titulo: "Slots con tope: jugando con límite a la vista", autor: "Estrella Slots", handle: "@estrellaslots", avatar: "🎰", plataforma: "Twitch", fecha: "2026-06-22", hora: "21:00", estado: "Programado", promo: true, alcance: 0, impresiones: 0, er: 0, clics: 0, ftd: 0, guardados: 0 },
    { id: "es12", tipo: "Reel", titulo: "Predicciones de la fecha con la comunidad", autor: "Constelación FC", handle: "@constelacionfc", avatar: "🌌", plataforma: "TikTok", fecha: "2026-06-24", hora: "13:00", estado: "Programado", promo: false, alcance: 0, impresiones: 0, er: 0, clics: 0, ftd: 0, guardados: 0 },
    { id: "es13", tipo: "Video", titulo: "El post-partido: qué pasó con mi jugada", autor: "Cometa FC", handle: "@cometafc", avatar: "☄️", plataforma: "YouTube", fecha: "2026-06-25", hora: "19:00", estado: "Programado", promo: false, alcance: 0, impresiones: 0, er: 0, clics: 0, ftd: 0, guardados: 0 },
    { id: "es14", tipo: "Reel", titulo: "Datos locos antes del partido del día", autor: "Barra Estelar", handle: "@barraestelar", avatar: "🥁", plataforma: "TikTok", fecha: "2026-06-28", hora: "20:00", estado: "Programado", promo: true, alcance: 0, impresiones: 0, er: 0, clics: 0, ftd: 0, guardados: 0 },
  ],
  seedRoster: [
    { id: "r1", nombre: "La Previa Estelar", handle: "@laprevia.estelar", avatar: "⭐", plataforma: "TikTok", seguidores: 540000, fee: 2_500_000, estado: "Activo" },
    { id: "r2", nombre: "Cometa FC", handle: "@cometafc", avatar: "☄️", plataforma: "TikTok", seguidores: 410000, fee: 2_200_000, estado: "Activo" },
    { id: "r3", nombre: "El Relator Cósmico", handle: "@relatorcosmico", avatar: "🎙️", plataforma: "YouTube", seguidores: 305000, fee: 1_900_000, estado: "Activo" },
    { id: "r4", nombre: "Estrella Slots", handle: "@estrellaslots", avatar: "🎰", plataforma: "Twitch", seguidores: 1150000, fee: 4_500_000, estado: "Prospecto" },
    { id: "r5", nombre: "Nova Picks", handle: "@novapicks", avatar: "🔭", plataforma: "Instagram", seguidores: 96000, fee: 1_200_000, estado: "Activo" },
    { id: "r6", nombre: "Constelación FC", handle: "@constelacionfc", avatar: "🌌", plataforma: "YouTube", seguidores: 72000, fee: 480_000, estado: "Activo" },
    { id: "r7", nombre: "Profe de Cuotas", handle: "@profedecuotas", avatar: "🎯", plataforma: "TikTok", seguidores: 48000, fee: 450_000, estado: "Activo" },
    { id: "r8", nombre: "Meteoro Apuestas", handle: "@meteoro.apuesta", avatar: "💫", plataforma: "Instagram", seguidores: 27000, fee: 350_000, estado: "Activo" },
    { id: "r9", nombre: "Barra Estelar", handle: "@barraestelar", avatar: "🥁", plataforma: "TikTok", seguidores: 24000, fee: 320_000, estado: "Pausado" },
    { id: "r10", nombre: "Astro Tipster", handle: "@astrotipster", avatar: "📈", plataforma: "Instagram", seguidores: 8400, fee: 200_000, estado: "Prospecto" },
  ],
  seedTareas: [
    { id: "g1", fase: "Estrategia & casting de creadores", responsable: "Sigma + W&K", inicio: 0, fin: 10, progreso: 100, acento: "cyan" },
    { id: "g2", fase: "Producción de contenido", responsable: "Estudio + creadores", inicio: 7, fin: 24, progreso: 70, acento: "violet" },
    { id: "g3", fase: "Teaser / previa del Mundial", responsable: "La Previa Estelar · Cometa FC", inicio: 10, fin: 18, progreso: 86, acento: "coral" },
    { id: "g4", fase: "Fase de grupos", responsable: "Pool futbolero", inicio: 10, fin: 28, progreso: 44, acento: "amber" },
    { id: "g5", fase: "Eliminatorias", responsable: "Pool futbolero + casino", inicio: 28, fin: 41, progreso: 0, acento: "rose" },
    { id: "g6", fase: "Final + cierre de campaña", responsable: "Todos", inicio: 41, fin: 48, progreso: 0, acento: "cyan" },
    { id: "g7", fase: "Always-on · juego responsable", responsable: "Nova Picks · Profe de Cuotas", inicio: 0, fin: 49, progreso: 36, acento: "lime" },
    { id: "g8", fase: "Reporte & aprendizajes", responsable: "Sigma", inicio: 44, fin: 49, progreso: 0, acento: "violet" },
  ],
  seedHitos: [
    { id: "h1", dia: 10, label: "Arranca el Mundial" },
    { id: "h2", dia: 28, label: "Octavos" },
    { id: "h3", dia: 41, label: "Semifinales" },
    { id: "h4", dia: 47, label: "Final" },
  ],
  sentimiento: { score: 74, tendencia: 9, totalComentarios: 16240, positivo: 66, neutro: 24, negativo: 10 },
  temas: [
    { tema: "Cuotas y valor", menciones: 4380, sent: 80, dir: "up" },
    { tema: "Juego responsable", menciones: 3120, sent: 86, dir: "up" },
    { tema: "Mundial / partidos", menciones: 4920, sent: 76, dir: "up" },
    { tema: "Creadores de barrio", menciones: 2580, sent: 82, dir: "up" },
    { tema: "App y registro", menciones: 1940, sent: 63, dir: "up" },
    { tema: "Retiros / pagos", menciones: 1490, sent: 46, dir: "down" },
  ],
  comentarios: [
    { autor: "@cami_dlt", texto: "Por fin una marca que explica las cuotas en vez de venderte humo 🙌", sent: "positivo", post: "Cuotas que brillan…", plataforma: "Instagram", likes: 312 },
    { autor: "@elpipe23", texto: "Me registré por el link de la previa, la cuota estaba mejor que en Betano la verdad", sent: "positivo", post: "La previa estelar de hoy", plataforma: "TikTok", likes: 188 },
    { autor: "@jorgevr", texto: "Buena que hablen de poner límites, ojalá todas hicieran eso", sent: "positivo", post: "Jugada con cabeza…", plataforma: "TikTok", likes: 240 },
    { autor: "@andrea.m", texto: "El stream estuvo entretenido pero igual da nervio el tema del casino", sent: "neutro", post: "Casino bajo las estrellas…", plataforma: "Twitch", likes: 54 },
    { autor: "@nico_ssj", texto: "Alguien sabe cuánto demora el retiro? llevo 2 días esperando 😤", sent: "negativo", post: "Mi combinada del Mundial", plataforma: "Instagram", likes: 96 },
    { autor: "@valen.32", texto: "El bono tenía letra chica igual, rollover altísimo", sent: "negativo", post: "Bono vs. cuota potenciada", plataforma: "Instagram", likes: 71 },
    { autor: "@thekoke", texto: "jajaja el reto de la jugada imposible me mató, pero igual juego responsable cabros", sent: "positivo", post: "Reaccionando a la cuota…", plataforma: "YouTube", likes: 410 },
    { autor: "@marite_8", texto: "Me gusta que muestren cuando pierden también, se siente más honesto", sent: "positivo", post: "Mi combinada del Mundial", plataforma: "Instagram", likes: 167 },
  ],
  alertaSent: {
    tema: "Retiros / pagos",
    detalle: "Subió 12% la mención negativa sobre demoras en retiros tras el partido del 15-jun. Recomendado: responder con FAQ y derivar a soporte en los hilos de @meteoro.apuesta y @astrotipster.",
  },
  recomendaciones: [
    { texto: "Escalar inversión en creadores con ER > 6% y CPA bajo (La Previa Estelar, Meteoro).", prioridad: "Alta" },
    { texto: "Replicar el formato “te explico la letra chica” — top en registros.", prioridad: "Alta" },
    { texto: "Responder el hilo de retiros para frenar el sentimiento negativo.", prioridad: "Alta" },
    { texto: "Programar lives de casino en días sin partido (menos competencia).", prioridad: "Media" },
    { texto: "Probar historias con encuesta de pronóstico antes de cada fecha.", prioridad: "Media" },
  ],
  seedAtribuciones: [
    { id: "a1", tipo: "Contenido", nombre: "La Previa Estelar", handle: "@laprevia.estelar", avatar: "⭐", referencia: "La previa estelar de hoy", destino: "estelar.bet/previa-hoy", clics: 18600, registros: 2480, ftd: 498, deposito: 8_960_000, activo: true },
    { id: "a2", tipo: "Contenido", nombre: "Estrella Slots", handle: "@estrellaslots", avatar: "🎰", referencia: "Casino bajo las estrellas (live)", destino: "estelar.bet/slots-live", clics: 29800, registros: 3120, ftd: 652, deposito: 14_300_000, activo: true },
    { id: "a3", tipo: "Contenido", nombre: "Nova Picks", handle: "@novapicks", avatar: "🔭", referencia: "Cuotas que brillan", destino: "estelar.bet/novapicks-cuotas", clics: 8700, registros: 1290, ftd: 372, deposito: 6_700_000, activo: true },
    { id: "a4", tipo: "Contenido", nombre: "Meteoro Apuestas", handle: "@meteoro.apuesta", avatar: "💫", referencia: "Historia · combinada del Mundial", destino: "estelar.bet/meteoro-combi", clics: 6600, registros: 980, ftd: 221, deposito: 3_540_000, activo: true },
    { id: "a5", tipo: "Bio", nombre: "Cometa FC", handle: "@cometafc", avatar: "☄️", referencia: "Link de bio", destino: "estelar.bet/cometa", clics: 16100, registros: 2010, ftd: 402, deposito: 7_240_000, activo: true },
    { id: "a6", tipo: "Bio", nombre: "El Relator Cósmico", handle: "@relatorcosmico", avatar: "🎙️", referencia: "Link de bio", destino: "estelar.bet/relator", clics: 14200, registros: 1620, ftd: 388, deposito: 6_980_000, activo: true },
    { id: "a7", tipo: "Bio", nombre: "Profe de Cuotas", handle: "@profedecuotas", avatar: "🎯", referencia: "Link de bio", destino: "estelar.bet/profe", clics: 4600, registros: 540, ftd: 158, deposito: 2_210_000, activo: true },
    { id: "a8", tipo: "Código", nombre: "La Previa Estelar", handle: "@laprevia.estelar", avatar: "⭐", referencia: "Código promo", destino: "PREVIA", clics: 0, registros: 1840, ftd: 372, deposito: 6_900_000, activo: true },
    { id: "a9", tipo: "Código", nombre: "Estrella Slots", handle: "@estrellaslots", avatar: "🎰", referencia: "Código promo", destino: "ESTELAR", clics: 0, registros: 1120, ftd: 264, deposito: 5_010_000, activo: true },
    { id: "a10", tipo: "Código", nombre: "Nova Picks", handle: "@novapicks", avatar: "🔭", referencia: "Código promo", destino: "NOVA", clics: 0, registros: 760, ftd: 188, deposito: 3_390_000, activo: false },
  ],
  ftdUniverso: 5940,
};

/* ---------------- Live bindings + setter ---------------- */
const DATASETS: Record<string, PanelDataset> = {
  copec: COPEC_PANEL, betsson: BETSSON_PANEL, estelarbet: ESTELARBET_PANEL,
};

export let ventana = ESTELARBET_PANEL.ventana;
export let vocab = ESTELARBET_PANEL.vocab;
export let kpis = ESTELARBET_PANEL.kpis;
export let embudo = ESTELARBET_PANEL.embudo;
export let conectores = ESTELARBET_PANEL.conectores;
export let conversionTotal = ESTELARBET_PANEL.conversionTotal;
export let creadores = ESTELARBET_PANEL.creadores;
export let roster = ESTELARBET_PANEL.roster;
export let seedPosts = ESTELARBET_PANEL.seedPosts;
export let seedRoster = ESTELARBET_PANEL.seedRoster;
export let seedTareas = ESTELARBET_PANEL.seedTareas;
export let seedHitos = ESTELARBET_PANEL.seedHitos;
export let sentimiento = ESTELARBET_PANEL.sentimiento;
export let temas = ESTELARBET_PANEL.temas;
export let comentarios = ESTELARBET_PANEL.comentarios;
export let alertaSent = ESTELARBET_PANEL.alertaSent;
export let recomendaciones = ESTELARBET_PANEL.recomendaciones;
export let seedAtribuciones = ESTELARBET_PANEL.seedAtribuciones;
export let ftdUniverso = ESTELARBET_PANEL.ftdUniverso;
export let brandPanel: BrandPanel | null = ESTELARBET_PANEL.brandPanel ?? null;

/** reasigna toda la data de medición a la marca activa */
export function setPanelData(id: string): void {
  const d = DATASETS[id] ?? ESTELARBET_PANEL;
  ventana = d.ventana; vocab = d.vocab; kpis = d.kpis; embudo = d.embudo;
  conectores = d.conectores; conversionTotal = d.conversionTotal; creadores = d.creadores;
  roster = d.roster; seedPosts = d.seedPosts; seedRoster = d.seedRoster;
  seedTareas = d.seedTareas; seedHitos = d.seedHitos; sentimiento = d.sentimiento;
  temas = d.temas; comentarios = d.comentarios; alertaSent = d.alertaSent;
  recomendaciones = d.recomendaciones; seedAtribuciones = d.seedAtribuciones;
  ftdUniverso = d.ftdUniverso; linkBase = d.linkBase; brandPanel = d.brandPanel ?? null;
  organico = buildOrganico(d);
  seedPiezas = buildPiezas(d, id);
}

/* creativos SVG de prueba (solo EstelarBet) en public/piezas/ */
export const PIEZA_TEST_IMGS = ["/piezas/e1.svg", "/piezas/e2.svg", "/piezas/e3.svg", "/piezas/e4.svg", "/piezas/e5.svg", "/piezas/e6.svg"];

/* ---------------- Piezas creativas (seed por marca, deck de aprobación) ---------------- */
function buildPiezas(d: PanelDataset, brandId = ""): Pieza[] {
  const cre = d.creadores;
  const av = (i: number): string => cre[i % cre.length]?.avatar ?? "🎨";
  const aut = (i: number): string => cre[i % cre.length]?.nombre ?? "Estudio creativo";
  const C = (autor: string, ...txts: string[]): ComentarioRev[] =>
    txts.map((texto) => ({ autor, texto, fecha: "2026-06-17" }));
  const base: Pieza[] = [
    { id: "pz1", titulo: "Gráfica hero de lanzamiento", medio: "RRSS", formato: "Post", plataforma: "Instagram", autor: aut(0), avatar: av(0), version: 2, estado: "Pendiente", fecha: "2026-06-18", descripcion: "Pieza principal del feed, claim grande sobre fondo de marca.", comentarios: C("Dirección de arte", "Subir el contraste del claim.") },
    { id: "pz2", titulo: "Reel teaser 15s", medio: "RRSS", formato: "Reel", plataforma: "TikTok", autor: aut(1), avatar: av(1), version: 1, estado: "Pendiente", fecha: "2026-06-18", descripcion: "Corte rápido con gancho en el primer segundo.", comentarios: [] },
    { id: "pz3", titulo: "Carrusel ‘cómo funciona’", medio: "RRSS", formato: "Carrusel", plataforma: "Instagram", autor: aut(2), avatar: av(2), version: 1, estado: "Pendiente", fecha: "2026-06-19", descripcion: "5 láminas explicando el beneficio principal.", comentarios: [] },
    { id: "pz4", titulo: "Historia ‘cuenta regresiva’", medio: "RRSS", formato: "Historia", plataforma: "Instagram", autor: aut(3), avatar: av(3), version: 1, estado: "Aprobado", fecha: "2026-06-15", descripcion: "Sticker de cuenta regresiva al lanzamiento.", comentarios: C("Cuentas", "Aprobada, va a calendario.") },
    { id: "pz5", titulo: "Valla en ruta principal", medio: "OOH", formato: "Valla", autor: aut(0), avatar: av(0), version: 3, estado: "Pendiente", fecha: "2026-06-16", descripcion: "Lectura a 3 segundos: logo + claim + acción.", comentarios: C("Medios", "Validar legibilidad a distancia.") },
    { id: "pz6", titulo: "Paleta urbana centro", medio: "OOH", formato: "Paleta", autor: aut(1), avatar: av(1), version: 1, estado: "Cambios", fecha: "2026-06-16", descripcion: "Versión vertical para mobiliario urbano.", comentarios: C("Dirección de arte", "Falta versión nocturna del arte.") },
    { id: "pz7", titulo: "Aviso prensa dominical", medio: "Prensa", formato: "Aviso", autor: aut(2), avatar: av(2), version: 2, estado: "Pendiente", fecha: "2026-06-14", descripcion: "Página completa, diario de circulación nacional.", comentarios: [] },
    { id: "pz8", titulo: "Doble página revista", medio: "Prensa", formato: "Doble página", autor: aut(3), avatar: av(3), version: 1, estado: "Descartado", fecha: "2026-06-13", descripcion: "Pieza editorial, descartada por costo.", comentarios: C("Cuentas", "Fuera de presupuesto este ciclo.") },
    { id: "pz9", titulo: "Spot 20s para campaña", medio: "Video", formato: "Spot 20s", autor: aut(0), avatar: av(0), version: 2, estado: "Pendiente", fecha: "2026-06-17", descripcion: "Versión hero para YouTube y TV conectada.", comentarios: C("Dirección de arte", "Ajustar el cierre con el logo más tiempo.") },
    { id: "pz10", titulo: "Bumper 6s", medio: "Video", formato: "Bumper 6s", autor: aut(1), avatar: av(1), version: 1, estado: "Pendiente", fecha: "2026-06-17", descripcion: "Corte ultracorto, solo claim + marca.", comentarios: [] },
  ];
  // EstelarBet (marca de prueba): asignar creativos SVG de test a cada pieza
  return brandId === "estelarbet"
    ? base.map((p, i) => ({ ...p, img: PIEZA_TEST_IMGS[i % PIEZA_TEST_IMGS.length] }))
    : base;
}
export let seedPiezas: Pieza[] = buildPiezas(ESTELARBET_PANEL, "estelarbet");

/* ---------------- Grillas orgánicas (derivado por marca) ---------------- */
function buildOrganico(d: PanelDataset): OrganicoData {
  const cre = d.creadores;
  const totalAlcance = cre.reduce((s, c) => s + c.alcance, 0) || 1;
  const erProm = cre.reduce((s, c) => s + c.er * c.alcance, 0) / totalAlcance;

  // posts orgánicos = los que no son media pago (promo:false)
  const orgPosts = d.seedPosts.filter((p) => !p.promo);
  const fuente = orgPosts.length ? orgPosts : d.seedPosts;
  const guardados = fuente.reduce((s, p) => s + p.guardados, 0) || Math.round(totalAlcance * 0.011);
  const compartidos = Math.round(guardados * 0.62);
  const comentarios = Math.round(guardados * 0.47);
  const nuevos = Math.round(d.seedRoster.reduce((s, r) => s + r.seguidores, 0) * 0.013) || 12400;

  // alcance orgánico por plataforma (agregado de creadores)
  const byPlat = new Map<string, { alcance: number; erW: number }>();
  for (const c of cre) {
    const e = byPlat.get(c.plataforma) ?? { alcance: 0, erW: 0 };
    e.alcance += c.alcance; e.erW += c.er * c.alcance;
    byPlat.set(c.plataforma, e);
  }
  const plataformas = [...byPlat.entries()]
    .map(([plataforma, e]) => ({
      plataforma, alcance: e.alcance, er: +(e.erW / (e.alcance || 1)).toFixed(1),
      share: Math.round((e.alcance / totalAlcance) * 100),
    }))
    .sort((a, b) => b.alcance - a.alcance);

  // seguidores ganados, acumulado a lo largo de la ventana
  const fechas = ["1 Jun", "8 Jun", "15 Jun", "22 Jun", "29 Jun", "6 Jul", "13 Jul"];
  const acumulado = [0.05, 0.14, 0.27, 0.46, 0.68, 0.87, 1];
  const curva = { fechas, puntos: acumulado.map((p) => Math.round(nuevos * p)) };

  // top piezas orgánicas por alcance
  const piezas = fuente
    .slice()
    .sort((a, b) => b.alcance - a.alcance)
    .slice(0, 6)
    .map((p) => ({
      id: p.id, titulo: p.titulo, autor: p.autor, avatar: p.avatar,
      plataforma: p.plataforma, tipo: p.tipo, alcance: p.alcance,
      guardados: p.guardados, compartidos: Math.round(p.guardados * 0.6), er: p.er,
    }));

  const kpis = [
    { id: "alcance", label: "Alcance orgánico", valor: short(totalAlcance), delta: "+18,4%", dir: "up" as const, sub: "vs. período anterior" },
    { id: "engagement", label: "Engagement orgánico", valor: erProm.toFixed(1).replace(".", ",") + "%", delta: "+1,2 pts", dir: "up" as const, sub: "tasa media ponderada" },
    { id: "saves", label: "Saves + Shares", valor: short(guardados + compartidos), delta: "+24,1%", dir: "up" as const, sub: "señales de valor" },
    { id: "seguidores", label: "Seguidores ganados", valor: "+" + short(nuevos), delta: "+9,7%", dir: "up" as const, sub: "atribuible a la campaña" },
  ];

  // ---- Fuente del orgánico: páginas contratadas vs. contenido propio ----
  const sorted = [...cre].sort((a, b) => b.alcance - a.alcance);
  const ej = (c: CreadorRow) => ({ nombre: c.nombre, handle: c.handle, avatar: c.avatar, alcance: c.alcance, er: c.er });
  const pShare = 0.62;
  const pAlc = Math.round(totalAlcance * pShare);
  const oAlc = totalAlcance - pAlc;
  const pEr = +(erProm * 0.82).toFixed(1);
  const oEr = +(erProm * 1.42).toFixed(1);
  const pGuard = Math.round(guardados * 0.55);
  const oGuard = guardados - pGuard;
  const nP = Math.max(1, Math.round(fuente.length * 0.6));
  const fuentes: OrgFuente[] = [
    { key: "paginas", label: "Páginas contratadas", desc: "Cuentas y páginas que publican contenido con tu marca", alcance: pAlc, er: pEr, guardados: pGuard, piezas: nP, share: Math.round(pShare * 100), ejemplos: sorted.slice(0, 3).map(ej) },
    { key: "propio", label: "Contenido propio", desc: "Canal propio de la marca y creadores exclusivos", alcance: oAlc, er: oEr, guardados: oGuard, piezas: Math.max(1, fuente.length - nP), share: 100 - Math.round(pShare * 100), ejemplos: sorted.slice(3, 5).map(ej) },
  ];

  // ---- Análisis temporal: alcance semanal por fuente ----
  const wk = [0.62, 0.71, 0.83, 1.0, 1.24, 1.48, 1.72];
  const wkNorm = wk.reduce((s, x) => s + x, 0);
  const serie = {
    fechas,
    paginas: wk.map((x) => Math.round((pAlc * x) / wkNorm)),
    propio: wk.map((x) => Math.round((oAlc * x) / wkNorm)),
  };
  const semIni = serie.paginas[0] + serie.propio[0];
  const semFin = serie.paginas[serie.paginas.length - 1] + serie.propio[serie.propio.length - 1];
  const pSharePct = Math.round(pShare * 100);

  const insightIA = [
    `El ${pSharePct}% del alcance orgánico proviene de **páginas contratadas**; tu **contenido propio** pesa ${100 - pSharePct}% pero engancha ${(oEr / pEr).toFixed(1)}× más (ER ${oEr}% vs. ${pEr}%).`,
    `El orgánico pasó de ${short(semIni)} a ${short(semFin)} de alcance semanal; la aceleración arranca en la semana 4, coincidiendo con la fase alta de la campaña.`,
    `Las páginas aportan volumen (${short(pAlc)} de alcance), pero el contenido propio concentra los guardados de mayor intención: ${short(oGuard)} saves con menos piezas.`,
    `Recomendación: mantené las páginas para el reach de cabecera y reforzá 2–3 piezas **propias** en la semana pico — es donde el ER propio multiplica el valor ganado.`,
  ];

  return {
    totalAlcance, kpis,
    split: { organico: 64, pago: 36 },
    saves: { guardados, compartidos, comentarios, nuevos },
    plataformas, curva, piezas, fuentes, serie, insightIA,
  };
}

export let organico: OrganicoData = buildOrganico(ESTELARBET_PANEL);
