/* ============================================================
   SIGMA v2 — Centro de optimización (medición de campaña)
   Demo: EstelarBet · Jugada Estelar Mundial — influencer
   marketing orientado a registros y FTD (primer depósito).
   Inversión en CLP (pesos). Data mock + estado funcional
   (los contenidos viven en el store, ver store.tsx).
   ============================================================ */

/** Pesos chilenos con separador de miles: 32400000 -> "$32.400.000" */
export const pesos = (n: number): string => "$" + Math.round(n).toLocaleString("es-CL");
/** CLP compacto: 32400000 -> "$32,4M" */
export const pesosK = (n: number): string => {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toLocaleString("es-CL", { maximumFractionDigits: 1 }) + "M";
  if (n >= 1_000) return "$" + Math.round(n / 1000).toLocaleString("es-CL") + "K";
  return "$" + Math.round(n).toLocaleString("es-CL");
};

/** alcance/clics compactos: 540000 -> "540K" */
export const short = (n: number): string => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return Math.round(n / 1000) + "K";
  return String(n);
};

export const ventana = "Mundial 2026 · Jun–Jul";

/* ---------------- KPIs ---------------- */
export interface Kpi {
  id: string; label: string; valor: string; delta: string; dir: "up" | "down"; sub: string;
}
/* Orden de embudo: inversión → impresiones … → FTD → costo (sin "alcance") */
export const kpis: Kpi[] = [
  { id: "inversion", label: "Inversión", valor: "$28,6M", delta: "11.8%", dir: "up", sub: "de $40M · CLP" },
  { id: "impresiones", label: "Impresiones", valor: "8,71M", delta: "22.1%", dir: "up", sub: "frecuencia 2.3x" },
  { id: "engagement", label: "Engagement rate", valor: "6.6%", delta: "0.9 pp", dir: "up", sub: "vs. semana anterior" },
  { id: "clics", label: "Clics al link", valor: "171.400", delta: "24.0%", dir: "up", sub: "CTR 1.97%" },
  { id: "registros", label: "Registros", valor: "19.860", delta: "29.3%", dir: "up", sub: "cuentas nuevas" },
  { id: "ftd", label: "FTD · 1er depósito", valor: "5.940", delta: "26.5%", dir: "up", sub: "conversión 29.9%" },
  { id: "costo", label: "Costo por FTD", valor: "$4.815", delta: "-11.1%", dir: "down", sub: "CPA en baja" },
];

/* ---------------- Embudo (impresiones → FTD) ---------------- */
export interface PasoEmbudo { id: string; label: string; valor: string; pct: string }
export const embudo: PasoEmbudo[] = [
  { id: "impresiones", label: "Impresiones", valor: "8.715.600", pct: "100%" },
  { id: "clics", label: "Clics", valor: "171.400", pct: "1.97%" },
  { id: "registros", label: "Registros", valor: "19.860", pct: "11.59%" },
  { id: "ftd", label: "FTD", valor: "5.940", pct: "29.9%" },
];
export const conectores = [
  { label: "CTR", valor: "1.97%" },
  { label: "Conversión a registro", valor: "11.59%" },
  { label: "Conversión a FTD", valor: "29.9%" },
];
export const conversionTotal = "0.07%";

/* ---------------- Creadores (ranking) ---------------- */
export type Calidad = "Excelente" | "Muy bueno" | "Bueno" | "Regular";
export interface CreadorRow {
  nombre: string; handle: string; avatar: string; plataforma: string;
  alcance: number; er: number; clics: number; ftd: number; costo: number; calidad: Calidad;
}
export const creadores: CreadorRow[] = [
  { nombre: "La Previa Estelar", handle: "@laprevia.estelar", avatar: "⭐", plataforma: "TikTok", alcance: 540000, er: 6.0, clics: 18600, ftd: 498, costo: 4640, calidad: "Excelente" },
  { nombre: "Nova Picks", handle: "@novapicks", avatar: "🔭", plataforma: "Instagram", alcance: 96000, er: 5.2, clics: 8700, ftd: 372, costo: 3910, calidad: "Excelente" },
  { nombre: "Cometa FC", handle: "@cometafc", avatar: "☄️", plataforma: "TikTok", alcance: 410000, er: 5.3, clics: 16100, ftd: 402, costo: 4880, calidad: "Muy bueno" },
  { nombre: "Meteoro Apuestas", handle: "@meteoro.apuesta", avatar: "💫", plataforma: "Instagram", alcance: 27000, er: 7.4, clics: 6600, ftd: 221, costo: 3720, calidad: "Muy bueno" },
  { nombre: "Estrella Slots", handle: "@estrellaslots", avatar: "🎰", plataforma: "Twitch", alcance: 1150000, er: 4.7, clics: 29800, ftd: 652, costo: 6120, calidad: "Bueno" },
  { nombre: "Constelación FC", handle: "@constelacionfc", avatar: "🌌", plataforma: "YouTube", alcance: 72000, er: 5.6, clics: 7100, ftd: 198, costo: 5340, calidad: "Regular" },
];

/* ---------------- Contenidos (fuente única: gallery + calendario) ---------------- */
export type TipoContenido = "Reel" | "Video" | "Carrusel" | "Historia" | "Live";
export type EstadoContenido = "Publicado" | "Programado" | "En revisión";
export type Plataforma = "TikTok" | "Instagram" | "YouTube" | "Twitch";

export interface Post {
  id: string;
  tipo: TipoContenido;
  titulo: string;
  autor: string;
  handle: string;
  avatar: string;
  plataforma: Plataforma;
  fecha: string;   // ISO "2026-06-14"
  hora: string;    // "13:00"
  estado: EstadoContenido;
  promo: boolean;  // incluye código promocional / CTA registro
  alcance: number;
  impresiones: number;
  er: number;
  clics: number;
  ftd: number;
  guardados: number;
  img?: string;    // dataURL de la imagen subida (opcional)
  url?: string;    // link del post (Instagram / TikTok / YouTube …)
}

export const TIPOS: TipoContenido[] = ["Reel", "Video", "Carrusel", "Historia", "Live"];
export const PLATAFORMAS: Plataforma[] = ["TikTok", "Instagram", "YouTube", "Twitch"];
export const ESTADOS: EstadoContenido[] = ["Publicado", "Programado", "En revisión"];

/** gradiente del thumbnail según el tipo (cuando no hay imagen subida) */
export const TIPO_FONDO: Record<TipoContenido, string> = {
  Reel: "linear-gradient(135deg,#3a45e0,#0a0a0c)",
  Video: "linear-gradient(135deg,#1e3a8a,#0a0a0c)",
  Carrusel: "linear-gradient(135deg,#5b21b6,#0a0a0c)",
  Historia: "linear-gradient(135deg,#854d0e,#0a0a0c)",
  Live: "linear-gradient(135deg,#6d28d9,#0a0a0c)",
};
export const fondoDe = (tipo: TipoContenido): string => TIPO_FONDO[tipo] ?? TIPO_FONDO.Reel;

/** Detecta plataforma + tipo de post a partir de un link de Instagram/TikTok/YouTube/Twitch */
export function detectFromUrl(url: string): { plataforma?: Plataforma; tipo?: TipoContenido } {
  const u = url.toLowerCase();
  if (!/https?:\/\/|\.(com|tv|be)/.test(u)) return {};
  if (u.includes("tiktok.")) return { plataforma: "TikTok", tipo: "Reel" };
  if (u.includes("twitch.tv")) return { plataforma: "Twitch", tipo: "Live" };
  if (u.includes("youtube.") || u.includes("youtu.be")) return { plataforma: "YouTube", tipo: u.includes("/shorts/") ? "Reel" : "Video" };
  if (u.includes("instagram.")) {
    if (u.includes("/reel") || u.includes("/reels")) return { plataforma: "Instagram", tipo: "Reel" };
    if (u.includes("/stories/")) return { plataforma: "Instagram", tipo: "Historia" };
    if (u.includes("/tv/")) return { plataforma: "Instagram", tipo: "Video" };
    if (u.includes("/p/")) return { plataforma: "Instagram", tipo: "Carrusel" }; // post estático / carrusel
    return { plataforma: "Instagram" };
  }
  return {};
}

/** roster de creadores para los formularios (subir/agendar) */
export const roster: { nombre: string; handle: string; avatar: string }[] = [
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
];

/** Semilla de contenidos (Junio 2026). El store la usa como estado inicial. */
export const seedPosts: Post[] = [
  { id: "es5", tipo: "Reel", titulo: "Jugada con cabeza: así pongo mis límites", autor: "Profe de Cuotas", handle: "@profedecuotas", avatar: "🎯", plataforma: "TikTok", fecha: "2026-06-11", hora: "12:00", estado: "Publicado", promo: false, alcance: 48000, impresiones: 108000, er: 5.0, clics: 4600, ftd: 158, guardados: 2700 },
  { id: "es2", tipo: "Video", titulo: "Cuotas que brillan: te explico la letra chica", autor: "Nova Picks", handle: "@novapicks", avatar: "🔭", plataforma: "Instagram", fecha: "2026-06-12", hora: "18:30", estado: "Publicado", promo: true, alcance: 96000, impresiones: 205000, er: 5.2, clics: 8700, ftd: 372, guardados: 5900 },
  { id: "es4", tipo: "Live", titulo: "Casino bajo las estrellas: la barra elige el juego", autor: "Estrella Slots", handle: "@estrellaslots", avatar: "🎰", plataforma: "Twitch", fecha: "2026-06-13", hora: "21:00", estado: "Publicado", promo: true, alcance: 1150000, impresiones: 1950000, er: 4.7, clics: 29800, ftd: 652, guardados: 11800 },
  { id: "es1", tipo: "Reel", titulo: "La previa estelar de hoy 🔥", autor: "La Previa Estelar", handle: "@laprevia.estelar", avatar: "⭐", plataforma: "TikTok", fecha: "2026-06-14", hora: "13:00", estado: "Publicado", promo: true, alcance: 540000, impresiones: 1180000, er: 6.0, clics: 18600, ftd: 498, guardados: 8100 },
  { id: "es3", tipo: "Carrusel", titulo: "Mi combinada del Mundial (con argumento)", autor: "Meteoro Apuestas", handle: "@meteoro.apuesta", avatar: "💫", plataforma: "Instagram", fecha: "2026-06-15", hora: "19:00", estado: "Publicado", promo: false, alcance: 27000, impresiones: 60000, er: 7.4, clics: 6600, ftd: 221, guardados: 3000 },
  { id: "es6", tipo: "Video", titulo: "Reaccionando a la cuota más loca de la fecha", autor: "El Relator Cósmico", handle: "@relatorcosmico", avatar: "🎙️", plataforma: "YouTube", fecha: "2026-06-16", hora: "20:30", estado: "Publicado", promo: true, alcance: 305000, impresiones: 690000, er: 6.1, clics: 14200, ftd: 388, guardados: 5300 },
  { id: "es7", tipo: "Reel", titulo: "El once ideal… y la jugada estelar de la fecha", autor: "Cometa FC", handle: "@cometafc", avatar: "☄️", plataforma: "TikTok", fecha: "2026-06-17", hora: "13:00", estado: "Publicado", promo: true, alcance: 410000, impresiones: 910000, er: 5.3, clics: 16100, ftd: 402, guardados: 6000 },
  { id: "es8", tipo: "Reel", titulo: "La previa del partidazo de hoy", autor: "La Previa Estelar", handle: "@laprevia.estelar", avatar: "⭐", plataforma: "TikTok", fecha: "2026-06-18", hora: "13:00", estado: "Programado", promo: true, alcance: 0, impresiones: 0, er: 0, clics: 0, ftd: 0, guardados: 0 },
  { id: "es9", tipo: "Carrusel", titulo: "Bono vs. cuota potenciada: qué conviene", autor: "Nova Picks", handle: "@novapicks", avatar: "🔭", plataforma: "Instagram", fecha: "2026-06-19", hora: "18:00", estado: "Programado", promo: true, alcance: 0, impresiones: 0, er: 0, clics: 0, ftd: 0, guardados: 0 },
  { id: "es10", tipo: "Historia", titulo: "Reto $5.000 toda la fecha · juego responsable", autor: "Astro Tipster", handle: "@astrotipster", avatar: "📈", plataforma: "Instagram", fecha: "2026-06-20", hora: "16:00", estado: "En revisión", promo: false, alcance: 0, impresiones: 0, er: 0, clics: 0, ftd: 0, guardados: 0 },
  { id: "es11", tipo: "Live", titulo: "Slots con tope: jugando con límite a la vista", autor: "Estrella Slots", handle: "@estrellaslots", avatar: "🎰", plataforma: "Twitch", fecha: "2026-06-22", hora: "21:00", estado: "Programado", promo: true, alcance: 0, impresiones: 0, er: 0, clics: 0, ftd: 0, guardados: 0 },
  { id: "es12", tipo: "Reel", titulo: "Predicciones de la fecha con la comunidad", autor: "Constelación FC", handle: "@constelacionfc", avatar: "🌌", plataforma: "TikTok", fecha: "2026-06-24", hora: "13:00", estado: "Programado", promo: false, alcance: 0, impresiones: 0, er: 0, clics: 0, ftd: 0, guardados: 0 },
  { id: "es13", tipo: "Video", titulo: "El post-partido: qué pasó con mi jugada", autor: "Cometa FC", handle: "@cometafc", avatar: "☄️", plataforma: "YouTube", fecha: "2026-06-25", hora: "19:00", estado: "Programado", promo: false, alcance: 0, impresiones: 0, er: 0, clics: 0, ftd: 0, guardados: 0 },
  { id: "es14", tipo: "Reel", titulo: "Datos locos antes del partido del día", autor: "Barra Estelar", handle: "@barraestelar", avatar: "🥁", plataforma: "TikTok", fecha: "2026-06-28", hora: "20:00", estado: "Programado", promo: true, alcance: 0, impresiones: 0, er: 0, clics: 0, ftd: 0, guardados: 0 },
];

/* ---------------- Roster de influencers (con pago) ---------------- */
export type RosterEstado = "Activo" | "Prospecto" | "Pausado";
export interface RosterItem {
  id: string;
  nombre: string;
  handle: string;
  avatar: string;
  plataforma: Plataforma;
  seguidores: number;
  fee: number;        // pago por campaña/paquete en CLP
  estado: RosterEstado;
}
export const seedRoster: RosterItem[] = [
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
];

/* ---------------- Atribución de FTD (tracking por fuente) ----------------
   El FTD (primer depósito) se puede atribuir por tres vías distintas:
   · Contenido → cada post/historia lleva su link trackeado (desempeño puntual)
   · Bio       → el link en la bio del influencer (always-on, no es un post)
   · Código    → un código promo que el usuario tipea al registrarse
   Fuente única en el store (ver store.tsx). */
export type FuenteTipo = "Contenido" | "Bio" | "Código";
export const FUENTES: FuenteTipo[] = ["Contenido", "Bio", "Código"];
export interface Atribucion {
  id: string;
  tipo: FuenteTipo;
  nombre: string;       // influencer dueño de la fuente
  handle: string;
  avatar: string;
  referencia: string;   // contenido asociado · "Link de bio" · nombre del código
  destino: string;      // URL trackeada (estelar.bet/…) o el código (PREVIA50)
  clics: number;        // 0 para códigos (se tipean, no se clickean)
  registros: number;
  ftd: number;
  deposito: number;     // CLP depositado (1er depósito acumulado por esta fuente)
  activo: boolean;
}
/** % con 1 decimal (n sobre d); "—" si no aplica */
export const pct = (n: number, d: number): string =>
  d <= 0 ? "—" : (100 * n / d).toFixed(1).replace(/\.0$/, "") + "%";
/** slug de link trackeado a partir del handle: "@laprevia.estelar" → "estelar.bet/laprevia" */
export const slugLink = (handle: string): string =>
  "estelar.bet/" + handle.replace(/^@/, "").split(".")[0].replace(/[^a-z0-9]/gi, "").toLowerCase();
/** sugerencia de código promo: "@novapicks" → "NOVA" */
export const sugerirCodigo = (handle: string): string =>
  handle.replace(/^@/, "").replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase();

export const seedAtribuciones: Atribucion[] = [
  // Contenido — link trackeado en un post/historia puntual
  { id: "a1", tipo: "Contenido", nombre: "La Previa Estelar", handle: "@laprevia.estelar", avatar: "⭐", referencia: "La previa estelar de hoy", destino: "estelar.bet/previa-hoy", clics: 18600, registros: 2480, ftd: 498, deposito: 8_960_000, activo: true },
  { id: "a2", tipo: "Contenido", nombre: "Estrella Slots", handle: "@estrellaslots", avatar: "🎰", referencia: "Casino bajo las estrellas (live)", destino: "estelar.bet/slots-live", clics: 29800, registros: 3120, ftd: 652, deposito: 14_300_000, activo: true },
  { id: "a3", tipo: "Contenido", nombre: "Nova Picks", handle: "@novapicks", avatar: "🔭", referencia: "Cuotas que brillan", destino: "estelar.bet/novapicks-cuotas", clics: 8700, registros: 1290, ftd: 372, deposito: 6_700_000, activo: true },
  { id: "a4", tipo: "Contenido", nombre: "Meteoro Apuestas", handle: "@meteoro.apuesta", avatar: "💫", referencia: "Historia · combinada del Mundial", destino: "estelar.bet/meteoro-combi", clics: 6600, registros: 980, ftd: 221, deposito: 3_540_000, activo: true },
  // Bio — link en la bio del influencer (always-on)
  { id: "a5", tipo: "Bio", nombre: "Cometa FC", handle: "@cometafc", avatar: "☄️", referencia: "Link de bio", destino: "estelar.bet/cometa", clics: 16100, registros: 2010, ftd: 402, deposito: 7_240_000, activo: true },
  { id: "a6", tipo: "Bio", nombre: "El Relator Cósmico", handle: "@relatorcosmico", avatar: "🎙️", referencia: "Link de bio", destino: "estelar.bet/relator", clics: 14200, registros: 1620, ftd: 388, deposito: 6_980_000, activo: true },
  { id: "a7", tipo: "Bio", nombre: "Profe de Cuotas", handle: "@profedecuotas", avatar: "🎯", referencia: "Link de bio", destino: "estelar.bet/profe", clics: 4600, registros: 540, ftd: 158, deposito: 2_210_000, activo: true },
  // Código — el usuario lo tipea al registrarse
  { id: "a8", tipo: "Código", nombre: "La Previa Estelar", handle: "@laprevia.estelar", avatar: "⭐", referencia: "Código promo", destino: "PREVIA", clics: 0, registros: 1840, ftd: 372, deposito: 6_900_000, activo: true },
  { id: "a9", tipo: "Código", nombre: "Estrella Slots", handle: "@estrellaslots", avatar: "🎰", referencia: "Código promo", destino: "ESTELAR", clics: 0, registros: 1120, ftd: 264, deposito: 5_010_000, activo: true },
  { id: "a10", tipo: "Código", nombre: "Nova Picks", handle: "@novapicks", avatar: "🔭", referencia: "Código promo", destino: "NOVA", clics: 0, registros: 760, ftd: 188, deposito: 3_390_000, activo: false },
];
/** universo de FTD de la campaña (para calcular % atribuido directo) */
export const ftdUniverso = 5940;

/* ---------------- Calendario (meta del mes) ---------------- */
export const calendarioMes = { nombre: "Junio 2026", anio: 2026, mes: 6, primerDiaSemana: 1, dias: 30 }; // 1-jun = lunes
export type EstadoEvento = "publicado" | "programado" | "revision";
export const estadoToEvento: Record<EstadoContenido, EstadoEvento> = {
  "Publicado": "publicado", "Programado": "programado", "En revisión": "revision",
};

/* ---------------- Carta Gantt (editable, fuente en el store) ---------------- */
export type AcentoGantt = "cyan" | "violet" | "lime" | "amber" | "rose" | "coral";
export const ACENTOS_GANTT: AcentoGantt[] = ["cyan", "violet", "lime", "amber", "rose", "coral"];
export interface TareaGantt {
  id: string; fase: string; responsable: string; inicio: number; fin: number; progreso: number; acento: AcentoGantt;
}
export interface HitoGantt { id: string; dia: number; label: string }
export const ganttInicio = "2026-06-01";
export const ganttDias = 49; // 1 jun → 19 jul
export const ganttSemanas = ["Sem 1 · Jun", "Sem 2 · Jun", "Sem 3 · Jun", "Sem 4 · Jun", "Sem 5 · Jul", "Sem 6 · Jul", "Sem 7 · Jul"];
/** índice de día (0-based desde ganttInicio) ↔ fecha ISO, para los inputs date del editor */
export const ganttFecha = (idx: number): string => {
  const base = new Date(2026, 5, 1); // 1-jun-2026 local
  base.setDate(base.getDate() + idx);
  return `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}-${String(base.getDate()).padStart(2, "0")}`;
};
export const ganttIdx = (iso: string): number => {
  const [y, m, d] = iso.split("-").map(Number);
  const base = new Date(2026, 5, 1);
  const dt = new Date(y, m - 1, d);
  return Math.round((dt.getTime() - base.getTime()) / 86400000);
};
export const seedTareas: TareaGantt[] = [
  { id: "g1", fase: "Estrategia & casting de creadores", responsable: "Sigma + W&K", inicio: 0, fin: 10, progreso: 100, acento: "cyan" },
  { id: "g2", fase: "Producción de contenido", responsable: "Estudio + creadores", inicio: 7, fin: 24, progreso: 70, acento: "violet" },
  { id: "g3", fase: "Teaser / previa del Mundial", responsable: "La Previa Estelar · Cometa FC", inicio: 10, fin: 18, progreso: 86, acento: "coral" },
  { id: "g4", fase: "Fase de grupos", responsable: "Pool futbolero", inicio: 10, fin: 28, progreso: 44, acento: "amber" },
  { id: "g5", fase: "Eliminatorias", responsable: "Pool futbolero + casino", inicio: 28, fin: 41, progreso: 0, acento: "rose" },
  { id: "g6", fase: "Final + cierre de campaña", responsable: "Todos", inicio: 41, fin: 48, progreso: 0, acento: "cyan" },
  { id: "g7", fase: "Always-on · juego responsable", responsable: "Nova Picks · Profe de Cuotas", inicio: 0, fin: 49, progreso: 36, acento: "lime" },
  { id: "g8", fase: "Reporte & aprendizajes", responsable: "Sigma", inicio: 44, fin: 49, progreso: 0, acento: "violet" },
];
export const seedHitos: HitoGantt[] = [
  { id: "h1", dia: 10, label: "Arranca el Mundial" },
  { id: "h2", dia: 28, label: "Octavos" },
  { id: "h3", dia: 41, label: "Semifinales" },
  { id: "h4", dia: 47, label: "Final" },
];

/* ---------------- Análisis de sentimiento ---------------- */
export const sentimiento = {
  score: 74, tendencia: 9, totalComentarios: 16240,
  positivo: 66, neutro: 24, negativo: 10,
};
export interface TemaSent { tema: string; menciones: number; sent: number; dir: "up" | "down" }
export const temas: TemaSent[] = [
  { tema: "Cuotas y valor", menciones: 4380, sent: 80, dir: "up" },
  { tema: "Juego responsable", menciones: 3120, sent: 86, dir: "up" },
  { tema: "Mundial / partidos", menciones: 4920, sent: 76, dir: "up" },
  { tema: "Creadores de barrio", menciones: 2580, sent: 82, dir: "up" },
  { tema: "App y registro", menciones: 1940, sent: 63, dir: "up" },
  { tema: "Retiros / pagos", menciones: 1490, sent: 46, dir: "down" },
];
export type SentLabel = "positivo" | "neutro" | "negativo";
export interface Comentario { autor: string; texto: string; sent: SentLabel; post: string; plataforma: string; likes: number }
export const comentarios: Comentario[] = [
  { autor: "@cami_dlt", texto: "Por fin una marca que explica las cuotas en vez de venderte humo 🙌", sent: "positivo", post: "Cuotas que brillan…", plataforma: "Instagram", likes: 312 },
  { autor: "@elpipe23", texto: "Me registré por el link de la previa, la cuota estaba mejor que en Betano la verdad", sent: "positivo", post: "La previa estelar de hoy", plataforma: "TikTok", likes: 188 },
  { autor: "@jorgevr", texto: "Buena que hablen de poner límites, ojalá todas hicieran eso", sent: "positivo", post: "Jugada con cabeza…", plataforma: "TikTok", likes: 240 },
  { autor: "@andrea.m", texto: "El stream estuvo entretenido pero igual da nervio el tema del casino", sent: "neutro", post: "Casino bajo las estrellas…", plataforma: "Twitch", likes: 54 },
  { autor: "@nico_ssj", texto: "Alguien sabe cuánto demora el retiro? llevo 2 días esperando 😤", sent: "negativo", post: "Mi combinada del Mundial", plataforma: "Instagram", likes: 96 },
  { autor: "@valen.32", texto: "El bono tenía letra chica igual, rollover altísimo", sent: "negativo", post: "Bono vs. cuota potenciada", plataforma: "Instagram", likes: 71 },
  { autor: "@thekoke", texto: "jajaja el reto de la jugada imposible me mató, pero igual juego responsable cabros", sent: "positivo", post: "Reaccionando a la cuota…", plataforma: "YouTube", likes: 410 },
  { autor: "@marite_8", texto: "Me gusta que muestren cuando pierden también, se siente más honesto", sent: "positivo", post: "Mi combinada del Mundial", plataforma: "Instagram", likes: 167 },
];
export const alertaSent = {
  tema: "Retiros / pagos",
  detalle: "Subió 12% la mención negativa sobre demoras en retiros tras el partido del 15-jun. Recomendado: responder con FAQ y derivar a soporte en los hilos de @meteoro.apuesta y @astrotipster.",
};

/* ---------------- Recomendaciones ---------------- */
export const recomendaciones: { texto: string; prioridad: "Alta" | "Media" }[] = [
  { texto: "Escalar inversión en creadores con ER > 6% y CPA bajo (La Previa Estelar, Meteoro).", prioridad: "Alta" },
  { texto: "Replicar el formato “te explico la letra chica” — top en registros.", prioridad: "Alta" },
  { texto: "Responder el hilo de retiros para frenar el sentimiento negativo.", prioridad: "Alta" },
  { texto: "Programar lives de casino en días sin partido (menos competencia).", prioridad: "Media" },
  { texto: "Probar historias con encuesta de pronóstico antes de cada fecha.", prioridad: "Media" },
];
