/* ============================================================
   SIGMA v2 — datos del demo (multi-cliente)
   Clientes en demo: COPEC (energía) y BETSSON (apuestas).
   El switch de marca reasigna los datasets vía setBrandData() —
   las pantallas leen siempre la marca activa (ES module live bindings).
   Métricas de talento = estimaciones para planificación.
   ============================================================ */

export type Acento = "cyan" | "violet" | "lime" | "amber" | "rose" | "coral";
/* paleta editorial cálida — "cyan"/"violet" conservan su clave pero ahora son vino/oro */
export const acentoHex: Record<Acento, string> = {
  cyan: "#cf4d6b",   // vino (primario)
  violet: "#c79a52", // oro (secundario)
  lime: "#86b04a",
  amber: "#d99a4e",
  rose: "#e06a86",
  coral: "#d57a52",
};

/* ---------- Marcas (switcher) ---------- */
export interface Marca {
  id: string;
  nombre: string;
  rubro: string;
  glyph: string;
  acento: Acento;
  campañasActivas: number;
  disponible?: boolean; // cliente activo en el demo (no censurado)
}
export const marcas: Marca[] = [
  { id: "estelarbet", nombre: "EstelarBet", rubro: "Apuestas deportivas · Casino online", glyph: "★", acento: "violet", campañasActivas: 3, disponible: true },
  { id: "copec", nombre: "Copec", rubro: "Energía · Estaciones · App", glyph: "⬢", acento: "cyan", campañasActivas: 3, disponible: true },
  { id: "betsson", nombre: "Betsson", rubro: "Apuestas deportivas · Casino", glyph: "◆", acento: "lime", campañasActivas: 3, disponible: true },
  { id: "halsa", nombre: "Hälsa", rubro: "Bebida funcional · Kombucha", glyph: "◍", acento: "violet", campañasActivas: 2 },
  { id: "lume", nombre: "Lumé", rubro: "Skincare · Beauty", glyph: "✦", acento: "rose", campañasActivas: 1 },
];

/* ---------- Tipos compartidos ---------- */
export interface Campaña {
  id: string;
  nombre: string;
  marca: string;
  estado: "Activa" | "En estrategia" | "Cerrada" | "Borrador";
  progreso: number;
  alcance: string;
  ventana: string;
}
export interface Competidor {
  id: string;
  nombre: string;
  sov: number;
  territorio: string;
  tono: string;
  amenaza: "alta" | "media" | "baja";
}
export interface AnalisisMarca {
  sentimiento: number;
  tendenciaSentimiento: number;
  sov: number;
  seguidoresIG: number;
  liderazgo: string;
  comunidadExtra: string; // glosa del KPI de comunidad (ej. "vs. 126K Shell")
  kpiLider: { label: string; value: string; extra: string }; // KPI de liderazgo propio de la marca
  crisis: { titulo: string; detalle: string; severidad: "alta" | "media" | "baja" };
  fortalezas: string[];
  amenazas: string[];
  jugadaDestacada?: { tag: string; titulo: string; detalle: string }; // hallazgo resaltado (opcional)
}
export interface FuenteAnalisis {
  id: string;
  titulo: string;
  fuente: string;
  tipo: "Prensa" | "Caso" | "Ranking" | "Regulatorio" | "Social listening" | "Data propia";
  fecha: string;
  url: string;
}
export interface Oportunidad {
  id: string;
  titulo: string;
  detalle: string;
  territorio: string;
  acento: Acento;
  impacto: "alto" | "medio";
}
export interface Tendencia {
  id: string;
  nombre: string;
  plataforma: string;
  momentum: number;
  volumen: string;
}
export interface Aprendizaje {
  id: string;
  titulo: string;
  detalle: string;
  fuente: string;
}

/* ---------- Talento (tiers · estimaciones) ---------- */
export type Tier = "nano" | "micro" | "mid" | "macro" | "mega" | "celebrity";
export type Arquetipo = "viajes" | "comedia" | "foodie" | "familia" | "motor" | "tech" | "lifestyle";

export interface TierInfo {
  label: string;
  min: number;
  max: number;
  pack: number | null;
  er: number;
  reach: number;
  conv: number;
  color: Acento;
}
export const TIERS: Tier[] = ["nano", "micro", "mid", "macro", "mega", "celebrity"];
export const TIER_CONFIG: Record<Tier, TierInfo> = {
  nano:      { label: "Nano",      min: 2_000,   max: 10_000,   pack: 200_000,   er: 7.5, reach: 1.40, conv: 0.040, color: "lime" },
  micro:     { label: "Micro",     min: 10_000,  max: 30_000,   pack: 350_000,   er: 5.5, reach: 1.10, conv: 0.030, color: "cyan" },
  mid:       { label: "Mid",       min: 30_000,  max: 80_000,   pack: 450_000,   er: 4.2, reach: 0.95, conv: 0.022, color: "violet" },
  macro:     { label: "Macro",     min: 80_000,  max: 300_000,  pack: 1_200_000, er: 2.8, reach: 0.80, conv: 0.015, color: "amber" },
  mega:      { label: "Mega",      min: 300_000, max: 800_000,  pack: 2_500_000, er: 1.9, reach: 0.65, conv: 0.010, color: "coral" },
  celebrity: { label: "Celebrity", min: 800_000, max: Infinity, pack: null,      er: 1.3, reach: 0.50, conv: 0.008, color: "rose" },
};
export function tierOf(seguidores: number): Tier {
  for (const t of TIERS) { const c = TIER_CONFIG[t]; if (seguidores >= c.min && seguidores < c.max) return t; }
  return "celebrity";
}
export const tierLabel = (t: Tier) => TIER_CONFIG[t].label;
export function tierRango(t: Tier): string {
  const c = TIER_CONFIG[t];
  const lo = c.min >= 1000 ? c.min / 1000 + "K" : String(c.min);
  return c.max === Infinity ? `${lo}+` : `${lo}–${c.max / 1000}K`;
}
export interface Influencer {
  id: string;
  nombre: string;
  handle: string;
  tier: Tier;
  arquetipo: Arquetipo;
  mood: string;
  seguidores: number;
  engagement: number;
  fit: number;
  ciudad: string;
  avatar: string;
}
const tiered = (arr: Omit<Influencer, "tier">[]): Influencer[] => arr.map((i) => ({ ...i, tier: tierOf(i.seguidores) }));

/* ---------- Conceptos generativos ---------- */
export type Nivel = 1 | 2 | 3;
export interface Concepto {
  id: string;
  titulo: string;
  territorio: string;
  mood: string;
  arquetipo: Arquetipo;
  acento: Acento;
  nivel: Nivel;
  rationale: string;
  ideasContenido: string[];
  tendencias: string[];
  aprendizaje: string;
  influencers: string[];
  confianza: number;
  alcance: number;
  engagement: number;
  cpm: number;
  riesgo: "Bajo" | "Medio" | "Alto";
}
export interface Variantes {
  titulos: string[];
  rationales: string[];
  ideasPool: string[];
}

export interface InsightReunion { id: string; texto: string; tag: string }
export interface Actividad { t: string; txt: string; color: string }

interface BrandDataset {
  cliente: {
    marca: string; campania: string; categoria: string; mercado: string;
    objetivo: string; presupuesto: string; ventana: string;
  };
  competidores: Competidor[];
  analisis: AnalisisMarca;
  oportunidades: Oportunidad[];
  fuentesAnalisis: FuenteAnalisis[];
  tendencias: Tendencia[];
  aprendizajes: Aprendizaje[];
  influencers: Influencer[];
  conceptos: Concepto[];
  conceptoVariantes: Record<string, Variantes>;
  insightsReunion: InsightReunion[];
  pasosCompetencia: string[];
  pasosBrief: string[];
  pasosTranscripcion: string[];
  actividadSeed: Actividad[];
  campañas: Campaña[];
  transcript: string;                                   // minuta de reunión (pantalla Insights)
  contextoItems: string[];                              // ítems del nodo "Ingesta + Insights" del Cerebro
  espacioBlanco: { titulo: string; detalle: string };   // insight de competencia (NewCampaign)
  guiarPlaceholders: { idea: string; territorio: string }; // placeholders del modal "Guiar al cerebro"
  objetivoDefault: string;                              // objetivo precargado del brief (NewCampaign)
  refLinks: string[];                                   // links de referencia (NewCampaign importar)
  briefDefault: string;                                 // texto precargado del brief (NewCampaign)
  kpiPrincipal: string;                                 // KPI principal del brief (NewCampaign)
}

/* ============================================================
   CLIENTE A — COPEC (energía · estaciones · app)
   Research: caso Copec Pay, batalla Ruta 5, Voltex, SERNAC, Favikon.
   ============================================================ */
const COPEC: BrandDataset = {
  cliente: {
    marca: "Copec",
    campania: "Copec en Ruta · Verano",
    categoria: "Estaciones de servicio · App Copec · Pronto",
    mercado: "Chile",
    objetivo: "Defender el liderazgo en la Ruta 5 e impulsar el uso de la App Copec en temporada de viajes",
    presupuesto: "CLP 30M",
    ventana: "Temporada alta · Dic–Feb",
  },
  competidores: [
    { id: "k1", nombre: "Shell · upa!", sov: 26, territorio: "“La que rinde más” · ataque directo a Copec", tono: "Retador, comparativo", amenaza: "alta" },
    { id: "k2", nombre: "Aramco", sov: 24, territorio: "Ruta 5 · “Pit Stop” rápido", tono: "Eficiente, expansivo", amenaza: "alta" },
    { id: "k3", nombre: "Oxxo", sov: 12, territorio: "Tienda de conveniencia", tono: "Promocional, masivo", amenaza: "media" },
  ],
  analisis: {
    sentimiento: 54,
    tendenciaSentimiento: -8,
    sov: 41,
    seguidoresIG: 248_000,
    liderazgo: "81 estaciones en la Ruta 5 · líder",
    comunidadExtra: "vs. 126K Shell",
    kpiLider: { label: "Ruta 5", value: "81", extra: "estaciones · líder" },
    crisis: {
      titulo: "Crisis reputacional en curso",
      detalle:
        "Sube la percepción de “la bencina más cara” y persiste el ruido por el caso de transparencia (SERNAC). Shell capitaliza posicionándose como “la que rinde más” — un golpe directo al diferencial precio/valor de Copec.",
      severidad: "alta",
    },
    fortalezas: [
      "Red más densa del país y liderazgo histórico en la Ruta 5",
      "Ecosistema propio: App Copec, Pronto y Voltex",
      "Mayor comunidad social del rubro (248K IG vs. 126K Shell)",
    ],
    amenazas: [
      "Shell ataca el valor percibido con el claim “rinde más”",
      "Aramco crece agresivo en la Ruta 5 con “Pit Stop”",
      "Sensibilidad pública por precios y por transparencia (#ad)",
    ],
  },
  fuentesAnalisis: [
    { id: "f1", titulo: "Batalla por la Ruta 5: Copec vs. Aramco y el “Pit Stop”", fuente: "Emol · Economía", tipo: "Prensa", fecha: "May 2026", url: "https://www.emol.com/" },
    { id: "f2", titulo: "Copec Pay: campaña con creadores en libertad creativa (9.5M, +170%)", fuente: "Adinfluence", tipo: "Caso", fecha: "2025", url: "#" },
    { id: "f3", titulo: "Ranking de creadores de contenido en Chile", fuente: "Favikon", tipo: "Ranking", fecha: "Abr 2026", url: "https://www.favikon.com/" },
    { id: "f4", titulo: "Declaración obligatoria de publicidad de influencers (#ad)", fuente: "SERNAC", tipo: "Regulatorio", fecha: "2024", url: "https://www.sernac.cl/" },
    { id: "f5", titulo: "Sentimiento, share of voice y claim “rinde más” de Shell", fuente: "Social listening · ventana 90 días", tipo: "Social listening", fecha: "Jun 2026", url: "#" },
    { id: "f6", titulo: "Red Voltex y tráfico en estaciones (+50% en verano)", fuente: "Data interna Copec", tipo: "Data propia", fecha: "2026", url: "#" },
  ],
  oportunidades: [
    { id: "o1", titulo: "Recuperar el valor percibido", detalle: "Responder al claim de Shell demostrando rendimiento y beneficios reales (App, Pronto) en vez de competir solo por precio.", territorio: "Valor / beneficios", acento: "cyan", impacto: "alto" },
    { id: "o2", titulo: "Dueños de la Ruta 5 en verano", detalle: "Capitalizar el liderazgo en carretera justo cuando el tráfico sube +50%, antes de que Aramco gane terreno.", territorio: "Viajes / Ruta 5", acento: "lime", impacto: "alto" },
    { id: "o3", titulo: "Liderar la electromovilidad", detalle: "Posicionar Voltex como la respuesta a la ansiedad del auto eléctrico: un territorio que la competencia no ocupa.", territorio: "Electromovilidad", acento: "coral", impacto: "medio" },
    { id: "o4", titulo: "Transparencia como ventaja", detalle: "Convertir el aprendizaje del caso SERNAC en un sello de honestidad: la marca que sí muestra todo claro.", territorio: "Confianza / honestidad", acento: "violet", impacto: "medio" },
  ],
  tendencias: [
    { id: "t1", nombre: "Roadtrip Ruta 5 / verano", plataforma: "TikTok", momentum: 118, volumen: "2.7M/sem" },
    { id: "t2", nombre: "Electromovilidad / autos eléctricos", plataforma: "TikTok·IG", momentum: 84, volumen: "1.4M/sem" },
    { id: "t3", nombre: "Apps de beneficios y cuponeo", plataforma: "TikTok", momentum: 63, volumen: "900K/sem" },
    { id: "t4", nombre: "Snack de carretera / “Pronto run”", plataforma: "Reels", momentum: 47, volumen: "1.2M/sem" },
    { id: "t5", nombre: "Transparencia en publicidad (#ad)", plataforma: "TikTok·X", momentum: 52, volumen: "640K/sem" },
    { id: "t6", nombre: "Pet-friendly en la ruta", plataforma: "Reels", momentum: 29, volumen: "510K/sem" },
  ],
  aprendizajes: [
    { id: "a1", titulo: "Libertad creativa > brief rígido", detalle: "La campaña Copec Pay con creadores en libertad creativa llegó a 9.5M (170% sobre la meta), CPA $3.4.", fuente: "Caso Copec Pay · verano" },
    { id: "a2", titulo: "Transparencia obligatoria", detalle: "Tras el caso SERNAC, todo contenido de influencer debe declararse como publicidad y dejar claro el rol de marca.", fuente: "Compliance · caso SERNAC" },
    { id: "a3", titulo: "Verano = +50% de transacciones", detalle: "El tráfico en estaciones sube hasta 50% en temporada de viajes; conviene concentrar la pauta ahí.", fuente: "Data de tráfico Copec" },
    { id: "a4", titulo: "Lo relatable convierte barato", detalle: "Creadores de humor cercano lograron el menor CPE histórico en IGC.", fuente: "Benchmark IGC" },
  ],
  influencers: tiered([
    { id: "i1", nombre: "Ignacia Antonia", handle: "@ignaciaantonia", arquetipo: "comedia", mood: "irreverente", seguidores: 9_800_000, engagement: 3.2, fit: 84, ciudad: "Santiago", avatar: "🟣" },
    { id: "i2", nombre: "Mike Milfort", handle: "@mike_milfort", arquetipo: "comedia", mood: "absurdo · viral", seguidores: 3_400_000, engagement: 6.1, fit: 90, ciudad: "Santiago", avatar: "🔵" },
    { id: "i3", nombre: "Cristóbal", handle: "@cristobal", arquetipo: "comedia", mood: "relatable", seguidores: 3_600_000, engagement: 5.4, fit: 86, ciudad: "Santiago", avatar: "🟢" },
    { id: "i5", nombre: "Fernanda Villalobos", handle: "@katteyes", arquetipo: "lifestyle", mood: "aspiracional", seguidores: 4_500_000, engagement: 3.0, fit: 80, ciudad: "Santiago", avatar: "💗" },
    { id: "i4", nombre: "Luis Miranda", handle: "@luismirandacl", arquetipo: "comedia", mood: "stand-up", seguidores: 480_000, engagement: 5.4, fit: 82, ciudad: "Santiago", avatar: "🔴" },
    { id: "i6", nombre: "Chely Schneider", handle: "@chelyschneider", arquetipo: "lifestyle", mood: "cercano", seguidores: 620_000, engagement: 4.1, fit: 81, ciudad: "Santiago", avatar: "🌸" },
    { id: "i7", nombre: "Rodrigo “Pelao” Soto", handle: "@rutachile", arquetipo: "viajes", mood: "aventurero", seguidores: 240_000, engagement: 3.4, fit: 92, ciudad: "Pucón", avatar: "🟠" },
    { id: "i9", nombre: "Cami & Beto", handle: "@familiaenruta", arquetipo: "familia", mood: "cálido", seguidores: 180_000, engagement: 3.6, fit: 89, ciudad: "La Serena", avatar: "🟡" },
    { id: "i10", nombre: "Dani Pérez", handle: "@piquefuera", arquetipo: "foodie", mood: "cercano", seguidores: 165_000, engagement: 3.5, fit: 85, ciudad: "Santiago", avatar: "🍔" },
    { id: "i11", nombre: "Seba Torres", handle: "@sebaev", arquetipo: "tech", mood: "innovador", seguidores: 130_000, engagement: 3.7, fit: 87, ciudad: "Santiago", avatar: "⚡" },
    { id: "i12", nombre: "Nico Fuentes", handle: "@0800motor", arquetipo: "motor", mood: "entusiasta", seguidores: 210_000, engagement: 3.1, fit: 83, ciudad: "Rancagua", avatar: "🏁" },
    { id: "i8", nombre: "Vale & el sur", handle: "@sur.en.auto", arquetipo: "viajes", mood: "cálido", seguidores: 58_000, engagement: 4.6, fit: 88, ciudad: "Valdivia", avatar: "🟤" },
    { id: "i18", nombre: "Tomás Andes", handle: "@tomas.alvolante", arquetipo: "motor", mood: "entusiasta", seguidores: 46_000, engagement: 4.6, fit: 84, ciudad: "Rancagua", avatar: "🚙" },
    { id: "i19", nombre: "Javi en Carretera", handle: "@javi.encarretera", arquetipo: "foodie", mood: "antojo", seguidores: 68_000, engagement: 4.4, fit: 85, ciudad: "Talca", avatar: "🍟" },
    { id: "i15", nombre: "Dani EV", handle: "@evchile.dani", arquetipo: "tech", mood: "didáctico", seguidores: 14_500, engagement: 6.2, fit: 88, ciudad: "Santiago", avatar: "🔌" },
    { id: "i16", nombre: "Pau Rutera", handle: "@rutera.pau", arquetipo: "viajes", mood: "aventurero", seguidores: 21_000, engagement: 6.8, fit: 90, ciudad: "Pucón", avatar: "🏔️" },
    { id: "i17", nombre: "Caro & familia", handle: "@viajes.encautela", arquetipo: "familia", mood: "cálido", seguidores: 27_000, engagement: 7.1, fit: 87, ciudad: "La Serena", avatar: "👨‍👩‍👧" },
    { id: "i13", nombre: "Vale Norte", handle: "@norte.alvolante", arquetipo: "viajes", mood: "cálido", seguidores: 6_400, engagement: 9.4, fit: 86, ciudad: "Antofagasta", avatar: "🚐" },
    { id: "i14", nombre: "Antojo Express", handle: "@antojos.deruta", arquetipo: "foodie", mood: "cercano", seguidores: 8_900, engagement: 8.7, fit: 83, ciudad: "Santiago", avatar: "🌮" },
  ]),
  conceptos: [
    { id: "x1", titulo: "El roadtrip no para", territorio: "Viajes · Ruta 5", mood: "aventurero · cálido", arquetipo: "viajes", acento: "cyan", nivel: 1, rationale: "El verano es de la carretera y Copec ya es dueño de la Ruta 5. Creadores de viaje muestran sus paradas Copec como parte natural del panorama: cargar, picar en Pronto y pagar con la App sin perder el viaje.", ideasContenido: ["“Mi ruta al sur en 60s”: cada parada es una estación Copec", "Checklist de viaje: la App Copec como copiloto", "Time-lapse Santiago→sur con paradas marcadas"], tendencias: ["t1", "t4"], aprendizaje: "a3", influencers: ["i7", "i8", "i9"], confianza: 90, alcance: 1_900_000, engagement: 8.6, cpm: 4.4, riesgo: "Bajo" },
    { id: "x2", titulo: "Paga sin bajarte del auto", territorio: "App Copec · Pago digital", mood: "práctico · cercano", arquetipo: "lifestyle", acento: "violet", nivel: 1, rationale: "El objetivo es uso de la App, no solo bencina. Creadores muestran el beneficio real (pagar y juntar beneficios desde el celular) en clave útil y sin sonar a comercial corporativo.", ideasContenido: ["“Cosas que no sabías que hace la App Copec”", "Reto: una semana pagando todo con la App", "Antes/después: la fila vs. pagar desde el auto"], tendencias: ["t3"], aprendizaje: "a1", influencers: ["i3", "i6", "i4"], confianza: 84, alcance: 2_600_000, engagement: 5.6, cpm: 3.6, riesgo: "Bajo" },
    { id: "x3", titulo: "El kit Pronto de carretera", territorio: "Foodie · Pronto", mood: "cercano · antojo", arquetipo: "foodie", acento: "amber", nivel: 1, rationale: "La parada también se elige por la comida. Foodies arman su “kit de carretera” en Pronto, demostrando que la mejor parada es la que tiene mejor antojo (y Copec App para pagarlo).", ideasContenido: ["“Arma tu combo Pronto perfecto para la ruta”", "Ranking honesto de snacks de carretera", "Receta express con lo que compras en Pronto"], tendencias: ["t4"], aprendizaje: "a4", influencers: ["i10", "i8"], confianza: 76, alcance: 720_000, engagement: 8.1, cpm: 5.2, riesgo: "Bajo" },
    { id: "x4", titulo: "Mi familia en la ruta", territorio: "Familia · humor cotidiano", mood: "relatable · cálido", arquetipo: "familia", acento: "lime", nivel: 2, rationale: "El viaje familiar es un clásico chileno lleno de comedia. Copec aparece como el alto que salva el viaje: baño, café, snack y la app que evita el drama de la fila.", ideasContenido: ["Sketch: “los 5 tipos de pasajero en un viaje familiar”", "POV: el papá que solo para en Copec", "El alto que salvó las vacaciones (con branding en 3s)"], tendencias: ["t1"], aprendizaje: "a4", influencers: ["i9", "i3"], confianza: 83, alcance: 2_100_000, engagement: 7.4, cpm: 3.9, riesgo: "Medio" },
    { id: "x5", titulo: "Carga y anda", territorio: "Electromovilidad · Voltex", mood: "innovador · futuro", arquetipo: "tech", acento: "coral", nivel: 2, rationale: "Posicionar a Copec como el que ya resolvió la ansiedad del auto eléctrico: la red Voltex de norte a sur. Creadores tech/motor hacen el primer viaje 100% eléctrico cargando en la ruta.", ideasContenido: ["“Crucé Chile en auto eléctrico solo con Voltex”", "Mito vs. dato: ¿se puede viajar en EV en Chile?", "Cuánto cuesta y cuánto demora cargar en la ruta"], tendencias: ["t2"], aprendizaje: "a3", influencers: ["i11", "i12"], confianza: 78, alcance: 980_000, engagement: 7.4, cpm: 4.8, riesgo: "Medio" },
    { id: "x6", titulo: "El reto de la ruta", territorio: "Cultura web · reto viral", mood: "irreverente · viral", arquetipo: "comedia", acento: "rose", nivel: 3, rationale: "Replicar la fórmula que ya funcionó: libertad creativa total a creadores virales para inventar un reto/serie meme-able alrededor de la ruta. Alto riesgo/alto retorno, con disclaimers de publicidad bien resueltos.", ideasContenido: ["Reto “la parada perfecta” con coreografía duetable", "Falso documental: “la cofradía de los que solo paran en Copec”", "Serie absurda: un viaje narrado como épica"], tendencias: ["t1", "t5"], aprendizaje: "a1", influencers: ["i2", "i1", "i4"], confianza: 70, alcance: 6_200_000, engagement: 5.1, cpm: 2.6, riesgo: "Alto" },
  ],
  conceptoVariantes: {
    x1: { titulos: ["El roadtrip no para", "La ruta es de Copec", "Tu copiloto en la carretera"], rationales: ["El verano es de la carretera y Copec ya es dueño de la Ruta 5. Creadores de viaje muestran sus paradas Copec como parte natural del panorama: cargar, picar en Pronto y pagar con la App sin perder el viaje.", "Frente a Aramco creciendo en la ruta, reforzamos lo que Copec ya tiene: la red más densa. El mensaje es simple: vayas donde vayas, Copec está en el camino.", "Convertimos cada viaje de verano en contenido: el creador no “publicita”, documenta su ruta real y Copec aparece donde siempre estuvo."], ideasPool: ["“Mi ruta al sur en 60s”: cada parada es una estación Copec", "Checklist de viaje: la App Copec como copiloto", "Time-lapse Santiago→sur con paradas marcadas", "“La mejor parada de la ruta” según cada creador", "Mapa de paradas imperdibles entre Santiago y el sur", "Lo que no puede faltar en un roadtrip chileno"] },
    x2: { titulos: ["Paga sin bajarte del auto", "La App que se maneja sola", "Menos fila, más ruta"], rationales: ["El objetivo es uso de la App, no solo bencina. Creadores muestran el beneficio real (pagar y juntar beneficios desde el celular) en clave útil y sin sonar a comercial corporativo.", "Demostración honesta de utilidad: el creador resuelve un problema real (la fila, el efectivo) y la App queda como el héroe silencioso del viaje.", "Convertimos una función transaccional en contenido: el foco es la tranquilidad y la rapidez, no las features."], ideasPool: ["“Cosas que no sabías que hace la App Copec”", "Reto: una semana pagando todo con la App", "Antes/después: la fila vs. pagar desde el auto", "Mi suegra usando la App por primera vez", "Beneficios que estabas dejando pasar", "POV: nunca más andar con efectivo en la ruta"] },
    x3: { titulos: ["El kit Pronto de carretera", "La parada se elige por el antojo", "Combo ruta perfecto"], rationales: ["La parada también se elige por la comida. Foodies arman su “kit de carretera” en Pronto, demostrando que la mejor parada es la que tiene mejor antojo (y Copec App para pagarlo).", "Pronto deja de ser “la tienda de la bencinera” y se vuelve destino: el creador la trata como una despensa de viaje con personalidad.", "El antojo manda en la ruta. Mostramos a Pronto ganando la batalla del snack frente a Oxxo y upa! con producto real."], ideasPool: ["“Arma tu combo Pronto perfecto para la ruta”", "Ranking honesto de snacks de carretera", "Receta express con lo que compras en Pronto", "Cata a ciegas de snacks de viaje", "El desayuno de ruta por menos de lo que crees", "Lo que pido siempre en Pronto"] },
    x4: { titulos: ["Mi familia en la ruta", "El alto que salva el viaje", "Viajar en familia es un deporte"], rationales: ["El viaje familiar es un clásico chileno lleno de comedia. Copec aparece como el alto que salva el viaje: baño, café, snack y la app que evita el drama de la fila.", "Lo relatable convierte: convertimos el caos de viajar en familia en comedia, con Copec como el momento de paz del trayecto.", "El humor cotidiano genera el mayor share. La marca entra temprano (primeros 3s) para no perder recall."], ideasPool: ["Sketch: “los 5 tipos de pasajero en un viaje familiar”", "POV: el papá que solo para en Copec", "El alto que salvó las vacaciones (con branding en 3s)", "Las frases que todo niño dice en la carretera", "Empacar el auto: expectativa vs. realidad", "El playlist de ruta que une (o divide) a la familia"] },
    x5: { titulos: ["Carga y anda", "Chile en eléctrico, sin ansiedad", "La ruta también es eléctrica"], rationales: ["Posicionar a Copec como el que ya resolvió la ansiedad del auto eléctrico: la red Voltex de norte a sur. Creadores tech/motor hacen el primer viaje 100% eléctrico cargando en la ruta.", "La objeción #1 del EV es “no llego”. La derribamos en vivo: un viaje real cargando solo en Voltex, con datos de tiempo y costo.", "Hacemos del futuro algo concreto y cercano: Copec no habla de electromovilidad, la demuestra en la carretera."], ideasPool: ["“Crucé Chile en auto eléctrico solo con Voltex”", "Mito vs. dato: ¿se puede viajar en EV en Chile?", "Cuánto cuesta y cuánto demora cargar en la ruta", "Día 1 con auto eléctrico: lo bueno y lo incómodo", "Mapa de cargadores Voltex de norte a sur", "Respondiendo sus dudas sobre autos eléctricos"] },
    x6: { titulos: ["El reto de la ruta", "La cofradía de la ruta", "Un viaje, una épica"], rationales: ["Replicar la fórmula que ya funcionó: libertad creativa total a creadores virales para inventar un reto/serie meme-able alrededor de la ruta. Alto riesgo/alto retorno, con disclaimers de publicidad bien resueltos.", "Apostamos a un código cultural propio: un gesto o reto tan específico que la gente lo duetea y lo hace suyo.", "Menos guion, más creador: confiamos en el talento (como en Copec Pay) para que la marca se vuelva conversación, no aviso."], ideasPool: ["Reto “la parada perfecta” con coreografía duetable", "Falso documental: “la cofradía de los que solo paran en Copec”", "Serie absurda: un viaje narrado como épica", "POV: eres el GPS y solo recomiendas Copec", "El trend del “sonido de la ruta”", "Trailer épico para un viaje cualquiera"] },
  },
  insightsReunion: [
    { id: "r1", texto: "Quieren defender el liderazgo en la Ruta 5; Aramco está creciendo rápido y preocupa.", tag: "posicionamiento" },
    { id: "r2", texto: "El foco real es que la gente use la App Copec en el viaje (pago + beneficios), no solo cargar bencina.", tag: "objetivo" },
    { id: "r3", texto: "Temen sonar corporativos; admiran lo que logró la campaña con libertad creativa.", tag: "tono" },
    { id: "r4", texto: "Hay sensibilidad con transparencia tras el tema SERNAC: todo debe ir declarado como publicidad.", tag: "riesgo" },
    { id: "r5", texto: "El verano concentra el tráfico; quieren estar donde la gente planifica sus viajes.", tag: "timing" },
    { id: "r6", texto: "Les inquieta el “rinde más” de Shell y la percepción de precio; sienten que la marca está golpeada.", tag: "crisis" },
  ],
  pasosCompetencia: [
    "Rastreando la conversación del rubro (90 días)…",
    "Mapeando a Aramco, Shell/upa! y Oxxo…",
    "Midiendo share of voice y territorios…",
    "Detectando a Aramco creciendo agresivo en la Ruta 5…",
    "Buscando el espacio en blanco para Copec…",
  ],
  pasosBrief: [
    "Leyendo el brief de campaña…",
    "Extrayendo objetivos, tono y restricciones…",
    "Cruzando con casos previos de Copec (Pay, Voltex)…",
    "Alineando KPIs con la temporada de viajes…",
  ],
  pasosTranscripcion: [
    "Transcribiendo la reunión…",
    "Detectando hablantes y temas…",
    "Extrayendo insights y frases clave del cliente…",
    "Marcando sensibilidades (transparencia / SERNAC)…",
    "Priorizando por impacto en la estrategia…",
  ],
  actividadSeed: [
    { t: "hace 2 min", txt: "Cerebro detectó el claim de Shell “rinde más” como amenaza directa", color: "rose" },
    { t: "hace 21 min", txt: "Análisis de competencia: Aramco creciendo en la Ruta 5", color: "amber" },
    { t: "hace 1 h", txt: "Insight de reunión: el foco es uso de la App Copec, no solo bencina", color: "violet" },
    { t: "ayer", txt: "Aprendizaje añadido: “libertad creativa > brief rígido” (caso Copec Pay)", color: "cyan" },
  ],
  campañas: [
    { id: "c1", nombre: "Copec en Ruta · Verano", marca: "Copec", estado: "En estrategia", progreso: 58, alcance: "—", ventana: "Dic–Feb" },
    { id: "c2", nombre: "App Copec · Beneficios", marca: "Copec", estado: "Activa", progreso: 82, alcance: "9.5M", ventana: "Q2 2026" },
    { id: "c3", nombre: "Copec Voltex · Electromovilidad", marca: "Copec", estado: "Activa", progreso: 64, alcance: "2.1M", ventana: "Q1 2026" },
    { id: "c4", nombre: "Pronto · Snack de carretera", marca: "Copec", estado: "Borrador", progreso: 10, alcance: "—", ventana: "Verano 2027" },
  ],
  transcript: `[00:04] Cliente (Copec): nos preocupa Aramco, está creciendo muy rápido en la Ruta 5 con sus "Pit Stop". No podemos descuidar el verano.
[02:30] Agencia: ¿el foco es bencina o la App?
[02:41] Cliente: el foco real es que usen la App Copec en el viaje — pagar, juntar beneficios. No solo cargar.
[08:15] Cliente: y por favor, nada de sonar corporativos. Lo que funcionó fue darle libertad creativa a los creadores.
[15:00] Cliente: el verano concentra el tráfico, ahí queremos estar, donde la gente planifica el viaje.
[21:10] Cliente: ojo con la transparencia. Después del tema con el SERNAC, todo tiene que ir marcado como publicidad.`,
  contextoItems: ["Brief Copec", "Reunión", "6 tendencias", "Aprendizajes"],
  espacioBlanco: {
    titulo: "Espacio en blanco para Copec",
    detalle: "Nadie ocupa el territorio “rendimiento real + beneficios de la App” frente al claim “rinde más” de Shell. Copec puede atacar ahí con utilidad y datos —no precio— apalancando App, Pronto y Voltex.",
  },
  guiarPlaceholders: { idea: "Ej: La parada secreta de la Ruta 5", territorio: "Ej: Viajes · Ruta 5" },
  objetivoDefault: "Liderazgo Ruta 5 + uso App",
  refLinks: ["tiktok.com/@mike_milfort/video/…", "instagram.com/reel/aramco-pitstop…"],
  briefDefault: `Campaña "Copec en Ruta · Verano". Objetivo: defender el liderazgo en la Ruta 5 frente a Aramco e impulsar el uso de la App Copec (pago + beneficios) durante la temporada de viajes. Tono cercano y con humor, evitando sonar corporativo. Importante: todo contenido de creadores debe ir declarado como publicidad (aprendizaje caso SERNAC). Aprovechar Pronto y Voltex como diferenciales.`,
  kpiPrincipal: "Alcance + uso de App",
};

/* ============================================================
   CLIENTE B — BETSSON (apuestas deportivas · casino online)
   Contexto CL: discusión de la ley de apuestas online, presión por
   juego responsable, sponsoreo de fútbol y guerra de cuotas/promos.
   Competidores: Coolbet, Betano, bet365, Rojabet.
   ============================================================ */
const BETSSON: BrandDataset = {
  cliente: {
    marca: "Betsson",
    campania: "Betsson · Vivamos el Mundial",
    categoria: "Apuestas deportivas · Casino online · App",
    mercado: "Chile",
    objetivo: "Crecer registros y primera apuesta durante el Mundial, apalancando la alianza con Chilevisión (canal oficial) y diferenciándose por juego responsable y mejores cuotas",
    presupuesto: "CLP 45M",
    ventana: "Mundial 2026 · Jun–Jul",
  },
  competidores: [
    { id: "k1", nombre: "Coolbet", sov: 28, territorio: "Cuotas transparentes · comunidad de apostadores", tono: "Cercano, data-driven", amenaza: "alta" },
    { id: "k2", nombre: "Betano", sov: 24, territorio: "Auspiciador oficial FIFA del Mundial · fútbol + cash out", tono: "Masivo, futbolero", amenaza: "alta" },
    { id: "k3", nombre: "bet365", sov: 18, territorio: "“La app que todos conocen” · global", tono: "Funcional, omnipresente", amenaza: "media" },
    { id: "k4", nombre: "Rojabet", sov: 11, territorio: "Promos locales agresivas · casino", tono: "Promocional, ruidoso", amenaza: "media" },
  ],
  analisis: {
    sentimiento: 46,
    tendenciaSentimiento: -6,
    sov: 22,
    seguidoresIG: 94_000,
    liderazgo: "Marca global con licencia · sponsor de fútbol",
    comunidadExtra: "+12% en el Mundial",
    kpiLider: { label: "Mundial", value: "CHV", extra: "aliado del canal oficial" },
    crisis: {
      titulo: "Categoría bajo escrutinio",
      detalle:
        "La discusión de la ley de apuestas online y casos de ludopatía elevan el escrutinio sobre todo el rubro. Betano capitaliza su rol de auspiciador oficial FIFA del Mundial y la guerra de promos de Coolbet erosiona el valor de marca — pero Betsson contrasta con su alianza con Chilevisión (la pantalla local del Mundial) y su foco en juego responsable.",
      severidad: "alta",
    },
    jugadaDestacada: {
      tag: "Jugada destacada · Mundial 2026",
      titulo: "Aliados de Chilevisión, el canal oficial del Mundial en Chile",
      detalle:
        "Betano es el auspiciador oficial FIFA del Mundial, pero Betsson se aseguró la pantalla local: la alianza con Chilevisión —el canal que transmite el Mundial en Chile— pone a la marca en cada partido del Mundial. Aunque Chile no clasificó, los chilenos igual viven el torneo, y ahí se concentra la audiencia y la conversión. Una jugada inteligente que compensa el sponsoreo global de Betano con relevancia y cercanía local.",
    },
    fortalezas: [
      "Alianza con Chilevisión, canal oficial del Mundial en Chile (presencia en cada partido del torneo)",
      "Marca global con licencia y trayectoria (confianza vs. operadores nuevos)",
      "Juego responsable como diferencial creíble del rubro",
    ],
    amenazas: [
      "Betano es el auspiciador oficial FIFA del Mundial (exposición global masiva)",
      "Coolbet y Betano agresivos en cuotas potenciadas y promos",
      "Escrutinio regulatorio y mediático sobre publicidad de apuestas",
    ],
  },
  fuentesAnalisis: [
    { id: "f1", titulo: "Tramitación de la ley de apuestas online en Chile", fuente: "La Tercera · Pulso", tipo: "Regulatorio", fecha: "Abr 2026", url: "https://www.latercera.com/" },
    { id: "f2", titulo: "Guerra de cuotas y promos entre Coolbet, Betano y Betsson", fuente: "Social listening · ventana 90 días", tipo: "Social listening", fecha: "Jun 2026", url: "#" },
    { id: "f3", titulo: "Ranking de creadores y streamers de fútbol/casino en Chile", fuente: "Favikon", tipo: "Ranking", fecha: "Abr 2026", url: "https://www.favikon.com/" },
    { id: "f4", titulo: "Juego responsable y prevención de ludopatía (guías del rubro)", fuente: "SENDA / autorregulación", tipo: "Regulatorio", fecha: "2025", url: "#" },
    { id: "f5", titulo: "Caso: registros impulsados por picks de creadores (+140%)", fuente: "Benchmark de adquisición", tipo: "Caso", fecha: "2025", url: "#" },
    { id: "f6", titulo: "Tráfico y conversión durante los partidos del Mundial", fuente: "Data interna Betsson", tipo: "Data propia", fecha: "2026", url: "#" },
  ],
  oportunidades: [
    { id: "o1", titulo: "Juego responsable como sello", detalle: "Apropiarse del territorio que el rubro evita: la marca que apuesta por jugar con cabeza. Convierte el escrutinio regulatorio en confianza y diferencia frente a operadores ruidosos.", territorio: "Confianza / responsabilidad", acento: "cyan", impacto: "alto" },
    { id: "o2", titulo: "Dueños del Mundial con Chilevisión", detalle: "Capitalizar la alianza con Chilevisión —canal oficial del Mundial en Chile— para estar en cada partido del torneo con creadores futboleros. Aunque Chile no juega, el interés por el Mundial sigue alto; hay que ganar esa conversación antes que Betano (auspiciador FIFA).", territorio: "Fútbol / Mundial", acento: "lime", impacto: "alto" },
    { id: "o3", titulo: "Mejores cuotas, sin letra chica", detalle: "Responder a la guerra de promos con transparencia: explicar las cuotas y condiciones claro, en vez de competir solo con bonos agresivos.", territorio: "Valor / transparencia", acento: "amber", impacto: "medio" },
    { id: "o4", titulo: "Casino con la comunidad en vivo", detalle: "Activar streamers de casino en Twitch/Kick con sesiones en vivo responsables: un territorio de alta afinidad que fideliza más allá del fútbol.", territorio: "Casino / streamers", acento: "coral", impacto: "medio" },
  ],
  tendencias: [
    { id: "t1", nombre: "Mundial 2026", plataforma: "TikTok", momentum: 124, volumen: "3.1M/sem" },
    { id: "t2", nombre: "Picks y cuotas de fútbol", plataforma: "TikTok·X", momentum: 78, volumen: "1.1M/sem" },
    { id: "t3", nombre: "Casino streamers / slots en vivo", plataforma: "Twitch·Kick", momentum: 69, volumen: "820K/sem" },
    { id: "t4", nombre: "Juego responsable / #apuestaconcabeza", plataforma: "TikTok·X", momentum: 44, volumen: "380K/sem" },
    { id: "t5", nombre: "Cash out en vivo", plataforma: "Reels", momentum: 51, volumen: "540K/sem" },
    { id: "t6", nombre: "Registro express / apps de apuestas", plataforma: "TikTok", momentum: 38, volumen: "460K/sem" },
  ],
  aprendizajes: [
    { id: "a1", titulo: "Juego responsable es obligatorio", detalle: "Todo contenido debe incluir disclaimers de juego responsable (+18, jugar con cabeza); es requisito legal y protege la marca del escrutinio.", fuente: "Compliance · autorregulación" },
    { id: "a2", titulo: "Los picks de creadores convierten", detalle: "Las recomendaciones de tipsters con argumento (no solo cuota) lograron el mayor ratio de registro→primera apuesta.", fuente: "Benchmark de adquisición" },
    { id: "a3", titulo: "El fútbol concentra la conversión", detalle: "El tráfico y las primeras apuestas se disparan en las horas previas y durante los partidos del Mundial; conviene concentrar la pauta ahí.", fuente: "Data de tráfico Betsson" },
    { id: "a4", titulo: "Cuotas potenciadas = gancho de adquisición", detalle: "Las cuotas potenciadas explicadas con transparencia superan a los bonos genéricos en costo por registro.", fuente: "Benchmark CPA" },
  ],
  influencers: tiered([
    { id: "bi1", nombre: "Mati Stream", handle: "@matistream", arquetipo: "lifestyle", mood: "showman · casino", seguidores: 1_250_000, engagement: 4.8, fit: 88, ciudad: "Santiago", avatar: "🎰" },
    { id: "bi2", nombre: "Clan Rojo", handle: "@clanrojo", arquetipo: "comedia", mood: "hincha · meme", seguidores: 920_000, engagement: 6.4, fit: 91, ciudad: "Santiago", avatar: "🟥" },
    { id: "bi3", nombre: "La Previa CL", handle: "@laprevia.cl", arquetipo: "comedia", mood: "futbolero · irreverente", seguidores: 540_000, engagement: 5.7, fit: 90, ciudad: "Santiago", avatar: "⚽" },
    { id: "bi4", nombre: "Hinchas Unidos", handle: "@hinchasunidos", arquetipo: "comedia", mood: "barra · épico", seguidores: 410_000, engagement: 5.1, fit: 86, ciudad: "Valparaíso", avatar: "🔵" },
    { id: "bi5", nombre: "Dani Juega", handle: "@danijuega", arquetipo: "lifestyle", mood: "casino · cercano", seguidores: 175_000, engagement: 4.3, fit: 84, ciudad: "Santiago", avatar: "🎮" },
    { id: "bi6", nombre: "Picks con Data", handle: "@pickscondata", arquetipo: "tech", mood: "analítico · serio", seguidores: 96_000, engagement: 4.6, fit: 92, ciudad: "Santiago", avatar: "📊" },
    { id: "bi7", nombre: "El Relator Meme", handle: "@relatormeme", arquetipo: "comedia", mood: "absurdo · viral", seguidores: 320_000, engagement: 6.0, fit: 87, ciudad: "Concepción", avatar: "🎙️" },
    { id: "bi8", nombre: "Profe Táctico", handle: "@profe.tactico", arquetipo: "tech", mood: "didáctico", seguidores: 64_000, engagement: 4.9, fit: 89, ciudad: "Santiago", avatar: "🎯" },
    { id: "bi9", nombre: "Cata Gamer", handle: "@cata.gamer", arquetipo: "lifestyle", mood: "gamer · twitch", seguidores: 48_000, engagement: 6.3, fit: 83, ciudad: "Santiago", avatar: "🕹️" },
    { id: "bi10", nombre: "Tincho Apuestas", handle: "@tincho.apuesta", arquetipo: "tech", mood: "tipster · relatable", seguidores: 26_000, engagement: 7.2, fit: 88, ciudad: "Rancagua", avatar: "💸" },
    { id: "bi11", nombre: "Kdabra Slots", handle: "@kdabra.slots", arquetipo: "lifestyle", mood: "casino · hype", seguidores: 18_500, engagement: 6.9, fit: 82, ciudad: "Viña del Mar", avatar: "🎲" },
    { id: "bi12", nombre: "Mundial Total", handle: "@mundial.total", arquetipo: "comedia", mood: "futbolero · data", seguidores: 38_000, engagement: 6.6, fit: 90, ciudad: "Santiago", avatar: "⚽" },
    { id: "bi13", nombre: "Nacho Picks", handle: "@nacho.picks", arquetipo: "tech", mood: "tipster · joven", seguidores: 8_700, engagement: 8.9, fit: 85, ciudad: "Temuco", avatar: "📈" },
    { id: "bi14", nombre: "Barra del Sur", handle: "@barra.delsur", arquetipo: "comedia", mood: "hincha · cálido", seguidores: 12_800, engagement: 8.1, fit: 84, ciudad: "Valdivia", avatar: "🥁" },
  ]),
  conceptos: [
    { id: "b1", titulo: "Apuesta con cabeza", territorio: "Juego responsable", mood: "honesto · cercano", arquetipo: "tech", acento: "cyan", nivel: 1, rationale: "El rubro evita hablar de responsabilidad; Betsson se apropia del territorio. Creadores muestran cómo poner límites, leer las cuotas y jugar por diversión — la marca que apuesta por jugar con cabeza, no por la euforia.", ideasContenido: ["“Cómo pongo mis límites antes de apostar”", "Mitos del apostador novato (y qué hacer en serio)", "Checklist: apostar por diversión, no por desesperación"], tendencias: ["t4", "t2"], aprendizaje: "a1", influencers: ["bi6", "bi8", "bi10"], confianza: 88, alcance: 1_100_000, engagement: 5.4, cpm: 4.1, riesgo: "Bajo" },
    { id: "b2", titulo: "La previa es Betsson", territorio: "Fútbol · Mundial", mood: "futbolero · épico", arquetipo: "comedia", acento: "violet", nivel: 1, rationale: "El Mundial concentra toda la conversación, y aunque Chile no clasificó los chilenos igual lo viven. Creadores futboleros hacen la previa de cada partido con su pronóstico y su cuota Betsson — la marca se vuelve parte del ritual del hincha, no un aviso.", ideasContenido: ["“La previa”: pronóstico + cuota del partido del día", "Reacciones en vivo con cash out en el minuto clave", "El once ideal del Mundial… y la apuesta ideal de la fecha"], tendencias: ["t1", "t5"], aprendizaje: "a3", influencers: ["bi2", "bi3", "bi12"], confianza: 86, alcance: 3_200_000, engagement: 6.1, cpm: 3.4, riesgo: "Medio" },
    { id: "b3", titulo: "Cuotas sin letra chica", territorio: "Valor · transparencia", mood: "claro · directo", arquetipo: "tech", acento: "amber", nivel: 1, rationale: "Frente a la guerra de promos confusas, Betsson explica. Creadores comparan cuotas reales y desarman la “letra chica” de los bonos: la marca que te trata como adulto y te muestra todo claro.", ideasContenido: ["“Te explico la letra chica de los bonos de apuestas”", "Comparo cuotas reales del mismo partido", "Lo que nadie te dice antes de tu primer depósito"], tendencias: ["t2", "t6"], aprendizaje: "a4", influencers: ["bi6", "bi10", "bi8"], confianza: 80, alcance: 860_000, engagement: 5.0, cpm: 4.6, riesgo: "Bajo" },
    { id: "b4", titulo: "Casino en vivo con la comunidad", territorio: "Casino · streamers", mood: "hype · comunidad", arquetipo: "lifestyle", acento: "coral", nivel: 2, rationale: "Activar streamers de casino en Twitch/Kick con sesiones en vivo y responsables. La comunidad juega junto al creador, con límites visibles en pantalla: entretención fuerte sin perder el sello responsable.", ideasContenido: ["Sesión en vivo: la comunidad elige el próximo juego", "“Slots con tope”: jugando con límite a la vista", "Highlights de la semana en casino en vivo"], tendencias: ["t3", "t5"], aprendizaje: "a2", influencers: ["bi1", "bi5", "bi9"], confianza: 76, alcance: 1_400_000, engagement: 6.8, cpm: 5.1, riesgo: "Medio" },
    { id: "b5", titulo: "El pick del barrio", territorio: "Tipsters · relatable", mood: "cercano · honesto", arquetipo: "comedia", acento: "lime", nivel: 2, rationale: "El pick de la persona común convierte más que el del experto. Micro-creadores comparten su apuesta de la fecha con argumento y honestidad (también cuando pierden): la marca acompaña, no promete ganar.", ideasContenido: ["“Mi pick de la fecha y por qué” (con argumento)", "Cuando el pick falla: cómo lo tomo con humor", "Reto: $5.000 toda la fecha, juego responsable"], tendencias: ["t2", "t4"], aprendizaje: "a2", influencers: ["bi10", "bi13", "bi14"], confianza: 82, alcance: 720_000, engagement: 7.6, cpm: 3.8, riesgo: "Medio" },
    { id: "b6", titulo: "El reto de la cuota imposible", territorio: "Cultura web · reto viral", mood: "irreverente · viral", arquetipo: "comedia", acento: "rose", nivel: 3, rationale: "Libertad creativa total a creadores virales para inventar un reto meme-able alrededor de una combinada “imposible”. Alto riesgo/alto retorno, con disclaimers de juego responsable bien resueltos y sin promesa de ganancia.", ideasContenido: ["Reto “la combinada imposible” narrada como épica", "Falso documental: “la cofradía de los que apuestan al Mundial”", "Serie absurda: reaccionando a la cuota más loca de la semana"], tendencias: ["t1", "t3"], aprendizaje: "a1", influencers: ["bi2", "bi7", "bi3"], confianza: 70, alcance: 4_800_000, engagement: 5.3, cpm: 2.8, riesgo: "Alto" },
  ],
  conceptoVariantes: {
    b1: { titulos: ["Apuesta con cabeza", "Jugar bien es jugar con límites", "El control también es parte del juego"], rationales: ["El rubro evita hablar de responsabilidad; Betsson se apropia del territorio. Creadores muestran cómo poner límites, leer las cuotas y jugar por diversión — la marca que apuesta por jugar con cabeza, no por la euforia.", "Convertimos el escrutinio regulatorio en confianza: mientras otros gritan promos, Betsson enseña a jugar sano y queda como el operador adulto del rubro.", "El juego responsable como contenido útil, no como disclaimer al final: el creador lo hace parte natural de su rutina de apuesta."], ideasPool: ["“Cómo pongo mis límites antes de apostar”", "Mitos del apostador novato (y qué hacer en serio)", "Checklist: apostar por diversión, no por desesperación", "Las señales de que hay que parar", "Configura tus límites en la app en 60s", "Por qué apuesto poco y disfruto más"] },
    b2: { titulos: ["La previa es Betsson", "Vivamos el Mundial", "El ritual del hincha"], rationales: ["El Mundial concentra toda la conversación, y aunque Chile no clasificó los chilenos igual lo viven. Creadores futboleros hacen la previa de cada partido con su pronóstico y su cuota Betsson — la marca se vuelve parte del ritual del hincha, no un aviso.", "Frente a Betano peleando el fútbol, nos metemos en el minuto a minuto: estar donde se vive el partido, no donde se vende.", "El hincha no quiere un aviso, quiere conversación: el creador comenta, se emociona y la marca acompaña la épica del Mundial."], ideasPool: ["“La previa”: pronóstico + cuota del partido del día", "Reacciones en vivo con cash out en el minuto clave", "El once ideal del Mundial… y la apuesta ideal de la fecha", "Predicciones de la fecha con la comunidad", "El post-partido: qué pasó con mi apuesta", "Datos locos antes del partido del día"] },
    b3: { titulos: ["Cuotas sin letra chica", "Te explico el bono de verdad", "Apuestas para adultos"], rationales: ["Frente a la guerra de promos confusas, Betsson explica. Creadores comparan cuotas reales y desarman la “letra chica” de los bonos: la marca que te trata como adulto y te muestra todo claro.", "Transparencia como ataque: mientras Rojabet y Coolbet gritan bonos, Betsson gana confianza explicando las condiciones reales.", "Educación financiera del apostador: el creador enseña a leer una cuota y a no caer en la promesa fácil."], ideasPool: ["“Te explico la letra chica de los bonos de apuestas”", "Comparo cuotas reales del mismo partido", "Lo que nadie te dice antes de tu primer depósito", "Cómo leo una cuota en 30 segundos", "Bono vs. cuota potenciada: qué conviene", "Las preguntas que deberías hacer antes de apostar"] },
    b4: { titulos: ["Casino en vivo con la comunidad", "Slots con la barra", "Juega conmigo, con límite"], rationales: ["Activar streamers de casino en Twitch/Kick con sesiones en vivo y responsables. La comunidad juega junto al creador, con límites visibles en pantalla: entretención fuerte sin perder el sello responsable.", "El casino se vive en comunidad: el stream convierte una sesión solitaria en un evento compartido, siempre con el tope a la vista.", "Entretención sin culpa: mostramos el casino como espectáculo responsable, con el creador modelando buen comportamiento."], ideasPool: ["Sesión en vivo: la comunidad elige el próximo juego", "“Slots con tope”: jugando con límite a la vista", "Highlights de la semana en casino en vivo", "Reaccionando a las mejores jugadas de la comunidad", "Tour por los juegos nuevos del mes", "El reto del presupuesto: una hora, un límite"] },
    b5: { titulos: ["El pick del barrio", "Mi apuesta de la fecha", "Tipsters de verdad"], rationales: ["El pick de la persona común convierte más que el del experto. Micro-creadores comparten su apuesta de la fecha con argumento y honestidad (también cuando pierden): la marca acompaña, no promete ganar.", "La honestidad es el gancho: mostrar también las apuestas perdidas genera más confianza (y registros) que prometer ganancias.", "Lo relatable convierte barato: el tipster de barrio se siente alcanzable y su pick se vuelve conversación de grupo."], ideasPool: ["“Mi pick de la fecha y por qué” (con argumento)", "Cuando el pick falla: cómo lo tomo con humor", "Reto: $5.000 toda la fecha, juego responsable", "Mi historial honesto del mes", "Cómo armo una combinada que tenga sentido", "Respondiendo los picks que me mandan"] },
    b6: { titulos: ["El reto de la cuota imposible", "La cofradía del Mundial", "Una fecha, una épica"], rationales: ["Libertad creativa total a creadores virales para inventar un reto meme-able alrededor de una combinada “imposible”. Alto riesgo/alto retorno, con disclaimers de juego responsable bien resueltos y sin promesa de ganancia.", "Apostamos a un código cultural propio: un reto tan específico que la gente lo duetea y lo hace suyo, siempre con el sello responsable.", "Menos guion, más creador: confiamos en el talento para que la marca se vuelva conversación de la fecha, no aviso."], ideasPool: ["Reto “la combinada imposible” narrada como épica", "Falso documental: “la cofradía de los que apuestan al Mundial”", "Serie absurda: reaccionando a la cuota más loca de la semana", "POV: eres el que siempre arma la combinada del grupo", "El trend del “grito de gol” con cash out", "Trailer épico para una fecha cualquiera"] },
  },
  insightsReunion: [
    { id: "r1", texto: "Quieren diferenciarse de Coolbet y Betano sin entrar a la guerra de bonos; sienten que banaliza la marca.", tag: "posicionamiento" },
    { id: "r2", texto: "El foco real es crecer registros y primera apuesta durante el Mundial, no solo awareness.", tag: "objetivo" },
    { id: "r3", texto: "Mucha sensibilidad con juego responsable: todo debe ir con disclaimers (+18) y sin prometer ganancias.", tag: "riesgo" },
    { id: "r4", texto: "Creen que los picks de creadores con argumento convierten más que la pura promo de cuota.", tag: "tono" },
    { id: "r5", texto: "Los partidos del Mundial por Chilevisión son el momento de oro: quieren estar en la previa y el minuto a minuto.", tag: "timing" },
    { id: "r6", texto: "Les preocupa el escrutinio regulatorio y mediático; quieren que la marca se vea seria y confiable.", tag: "crisis" },
  ],
  pasosCompetencia: [
    "Rastreando la conversación del rubro apuestas (90 días)…",
    "Mapeando a Coolbet, Betano, bet365 y Rojabet…",
    "Midiendo share of voice y guerra de cuotas/promos…",
    "Detectando a Betano creciendo en el fútbol…",
    "Buscando el espacio en blanco para Betsson (responsabilidad)…",
  ],
  pasosBrief: [
    "Leyendo el brief de campaña…",
    "Extrayendo objetivos, tono y restricciones de juego responsable…",
    "Cruzando con benchmarks de adquisición (registro→apuesta)…",
    "Alineando KPIs con el calendario del Mundial…",
  ],
  pasosTranscripcion: [
    "Transcribiendo la reunión…",
    "Detectando hablantes y temas…",
    "Extrayendo insights y frases clave del cliente…",
    "Marcando sensibilidades (juego responsable / +18)…",
    "Priorizando por impacto en registros y conversión…",
  ],
  actividadSeed: [
    { t: "hace 2 min", txt: "Jugada detectada: la alianza con Chilevisión (canal oficial del Mundial) supera en relevancia local al sponsoreo FIFA de Betano", color: "amber" },
    { t: "hace 18 min", txt: "Cerebro detectó a Betano subiendo SOV en fútbol como auspiciador oficial del Mundial", color: "rose" },
    { t: "hace 1 h", txt: "Insight de reunión: el foco es registro→primera apuesta, con juego responsable", color: "violet" },
    { t: "ayer", txt: "Aprendizaje añadido: “los picks de creadores convierten registros” (benchmark CPA)", color: "cyan" },
  ],
  campañas: [
    { id: "bc1", nombre: "Betsson · Vivamos el Mundial", marca: "Betsson", estado: "En estrategia", progreso: 52, alcance: "—", ventana: "Jun–Jul" },
    { id: "bc2", nombre: "Casino · Slots en vivo", marca: "Betsson", estado: "Activa", progreso: 76, alcance: "1.4M", ventana: "Q2 2026" },
    { id: "bc3", nombre: "App Betsson · Registro express", marca: "Betsson", estado: "Activa", progreso: 61, alcance: "2.0M", ventana: "Q1 2026" },
    { id: "bc4", nombre: "Juego Responsable · Always-on", marca: "Betsson", estado: "Borrador", progreso: 12, alcance: "—", ventana: "2026" },
  ],
  transcript: `[00:04] Cliente (Betsson): nos preocupa Betano, está creciendo muy rápido en fútbol y es el auspiciador oficial del Mundial. No podemos descuidar el Mundial.
[02:30] Agencia: ¿el foco es awareness o registros?
[02:41] Cliente: registros y primera apuesta. Queremos crecer la base, no solo que nos conozcan.
[06:10] Cliente: nuestra carta es Chilevisión: transmiten el Mundial en Chile y somos aliados. Aunque Chile no clasificó, la gente igual va a ver el torneo ahí — hay que exprimir esa pantalla en cada partido.
[08:15] Cliente: y por favor, todo con juego responsable. Nada de prometer ganancias, todo +18 y declarado.
[15:00] Cliente: creemos que los picks de creadores con argumento convierten más que la pura promo de cuota.
[21:10] Cliente: el momento clave son los partidos del Mundial: queremos estar en la previa y en el minuto a minuto.`,
  contextoItems: ["Brief Betsson", "Reunión", "6 tendencias", "Aprendizajes"],
  espacioBlanco: {
    titulo: "Espacio en blanco para Betsson",
    detalle: "Nadie ocupa el territorio “juego responsable + cuotas claras” frente a la guerra de promos de Coolbet y Betano. Betsson puede atacar ahí con confianza y transparencia —no bonos— apalancando licencia, fútbol y juego responsable.",
  },
  guiarPlaceholders: { idea: "Ej: La previa del Mundial con cuotas claras", territorio: "Ej: Fútbol · Mundial" },
  objetivoDefault: "Registros + primera apuesta en el Mundial",
  refLinks: ["tiktok.com/@laprevia.cl/video/…", "instagram.com/reel/betano-mundial…"],
  briefDefault: `Campaña "Betsson · Vivamos el Mundial". Objetivo: crecer registros y primera apuesta durante el Mundial, apalancando la alianza con Chilevisión (canal oficial del Mundial en Chile) frente al sponsoreo FIFA de Betano. Aunque Chile no clasificó, los chilenos igual siguen el torneo por Chilevisión. Tono futbolero y cercano, siempre con juego responsable (+18, sin prometer ganancias). Importante: todo contenido de creadores debe ir declarado como publicidad. Diferenciales: cuotas claras y la pantalla local del Mundial.`,
  kpiPrincipal: "Registros + primera apuesta",
};

/* ============================================================
   CLIENTE C — ESTELARBET (apuestas deportivas · casino online)
   Retador chileno frente a Betano (sponsor FIFA) y Betsson
   (aliado de Chilevisión). Carta: cercanía local + creadores de
   barrio + "cuotas estelares" potenciadas, con juego responsable.
   ============================================================ */
const ESTELARBET: BrandDataset = {
  cliente: {
    marca: "EstelarBet",
    campania: "EstelarBet · Jugada Estelar Mundial",
    categoria: "Apuestas deportivas · Casino online · App",
    mercado: "Chile",
    objetivo: "Crecer registros y primera apuesta durante el Mundial como el operador retador más cercano: creadores de barrio, cuotas potenciadas (“estelares”) y juego responsable, frente a los sponsors grandes (Betano FIFA, Betsson Chilevisión)",
    presupuesto: "CLP 40M",
    ventana: "Mundial 2026 · Jun–Jul",
  },
  competidores: [
    { id: "k1", nombre: "Betano", sov: 27, territorio: "Auspiciador oficial FIFA del Mundial · fútbol + cash out", tono: "Masivo, futbolero", amenaza: "alta" },
    { id: "k2", nombre: "Betsson", sov: 22, territorio: "Aliado de Chilevisión (pantalla del Mundial) · juego responsable", tono: "Global, confiable", amenaza: "alta" },
    { id: "k3", nombre: "Coolbet", sov: 19, territorio: "Cuotas transparentes · comunidad de apostadores", tono: "Cercano, data-driven", amenaza: "media" },
    { id: "k4", nombre: "bet365", sov: 15, territorio: "“La app que todos conocen” · global", tono: "Funcional, omnipresente", amenaza: "media" },
  ],
  analisis: {
    sentimiento: 54,
    tendenciaSentimiento: 5,
    sov: 14,
    seguidoresIG: 62_000,
    liderazgo: "Retador ágil · cuotas potenciadas y cercanía local",
    comunidadExtra: "+22% en el Mundial",
    kpiLider: { label: "Cuotas", value: "+8%", extra: "potenciadas vs. promedio del rubro" },
    crisis: {
      titulo: "Categoría bajo escrutinio",
      detalle:
        "La discusión de la ley de apuestas online y los casos de ludopatía elevan el escrutinio sobre todo el rubro. Los grandes pelean con presupuesto (Betano es sponsor FIFA, Betsson aliado de Chilevisión); EstelarBet, como retador, no puede ganar por volumen de pauta sino por cercanía: creadores de barrio, cuotas claras y un sello creíble de juego responsable.",
      severidad: "alta",
    },
    jugadaDestacada: {
      tag: "Jugada destacada · Mundial 2026",
      titulo: "El sponsor del barrio, no el del estadio FIFA",
      detalle:
        "Mientras Betano compra la pantalla global y Betsson la del canal oficial, EstelarBet compra cercanía: activa a tipsters y barras locales que ya son la previa de su grupo. La marca no llega como aviso sino como el amigo que tiene la mejor cuota. Es una jugada de retador —más barata y más creíble— que convierte interés del Mundial en registros sin competir por GRPs.",
    },
    fortalezas: [
      "Agilidad de retador: cuotas potenciadas (“estelares”) y promos rápidas sin la burocracia de los grandes",
      "Cercanía con creadores locales de fútbol y casino (mejor costo por registro)",
      "Juego responsable como sello creíble y diferenciador del rubro",
    ],
    amenazas: [
      "Betano es el auspiciador oficial FIFA del Mundial (exposición global masiva)",
      "Betsson capitaliza la alianza con Chilevisión (la pantalla local del Mundial)",
      "Menor awareness de marca y escrutinio regulatorio sobre la publicidad de apuestas",
    ],
  },
  fuentesAnalisis: [
    { id: "f1", titulo: "Tramitación de la ley de apuestas online en Chile", fuente: "La Tercera · Pulso", tipo: "Regulatorio", fecha: "Abr 2026", url: "https://www.latercera.com/" },
    { id: "f2", titulo: "Share of voice de operadores de apuestas en Chile (90 días)", fuente: "Social listening", tipo: "Social listening", fecha: "Jun 2026", url: "#" },
    { id: "f3", titulo: "Ranking de creadores y streamers de fútbol/casino en Chile", fuente: "Favikon", tipo: "Ranking", fecha: "Abr 2026", url: "https://www.favikon.com/" },
    { id: "f4", titulo: "Juego responsable y prevención de ludopatía (guías del rubro)", fuente: "SENDA / autorregulación", tipo: "Regulatorio", fecha: "2025", url: "#" },
    { id: "f5", titulo: "Caso: registros impulsados por picks de micro-creadores (+160%)", fuente: "Benchmark de adquisición", tipo: "Caso", fecha: "2025", url: "#" },
    { id: "f6", titulo: "Tráfico y conversión durante los partidos del Mundial", fuente: "Data interna EstelarBet", tipo: "Data propia", fecha: "2026", url: "#" },
  ],
  oportunidades: [
    { id: "o1", titulo: "El retador cercano", detalle: "Apropiarse de la cercanía que los grandes no tienen: creadores de barrio y tipsters relatables que ya son la previa de su grupo. Convierte interés del Mundial en registros a bajo costo, sin pelear por GRPs.", territorio: "Cercanía / comunidad", acento: "violet", impacto: "alto" },
    { id: "o2", titulo: "Cuotas estelares, sin letra chica", detalle: "Hacer de las cuotas potenciadas un contenido educativo y transparente: explicar el valor real frente a los bonos confusos de la competencia.", territorio: "Valor / transparencia", acento: "amber", impacto: "alto" },
    { id: "o3", titulo: "Juego responsable como sello", detalle: "Tomar el territorio que el rubro evita: jugar con cabeza. Diferencia creíble que protege a la marca del escrutinio regulatorio.", territorio: "Confianza / responsabilidad", acento: "cyan", impacto: "medio" },
    { id: "o4", titulo: "Casino con la comunidad en vivo", detalle: "Activar streamers de casino en Twitch/Kick con sesiones responsables: alta afinidad y fidelización más allá del fútbol.", territorio: "Casino / streamers", acento: "coral", impacto: "medio" },
  ],
  tendencias: [
    { id: "t1", nombre: "Mundial 2026", plataforma: "TikTok", momentum: 124, volumen: "3.1M/sem" },
    { id: "t2", nombre: "Picks y cuotas de fútbol", plataforma: "TikTok·X", momentum: 81, volumen: "1.2M/sem" },
    { id: "t3", nombre: "Casino streamers / slots en vivo", plataforma: "Twitch·Kick", momentum: 67, volumen: "800K/sem" },
    { id: "t4", nombre: "Juego responsable / #apuestaconcabeza", plataforma: "TikTok·X", momentum: 49, volumen: "410K/sem" },
    { id: "t5", nombre: "Cash out en vivo", plataforma: "Reels", momentum: 53, volumen: "560K/sem" },
    { id: "t6", nombre: "Registro express / apps de apuestas", plataforma: "TikTok", momentum: 41, volumen: "480K/sem" },
  ],
  aprendizajes: [
    { id: "a1", titulo: "Juego responsable es obligatorio", detalle: "Todo contenido debe incluir disclaimers de juego responsable (+18, jugar con cabeza); es requisito legal y protege la marca.", fuente: "Compliance · autorregulación" },
    { id: "a2", titulo: "Los micro-creadores convierten barato", detalle: "Los tipsters relatables con argumento (no solo cuota) lograron el mejor costo por registro→primera apuesta.", fuente: "Benchmark de adquisición" },
    { id: "a3", titulo: "El fútbol concentra la conversión", detalle: "El tráfico y las primeras apuestas se disparan en las horas previas y durante los partidos del Mundial.", fuente: "Data de tráfico EstelarBet" },
    { id: "a4", titulo: "Cuotas potenciadas = gancho de adquisición", detalle: "Las cuotas potenciadas explicadas con transparencia superan a los bonos genéricos en costo por registro.", fuente: "Benchmark CPA" },
  ],
  influencers: tiered([
    { id: "ei1", nombre: "Nova Picks", handle: "@novapicks", arquetipo: "tech", mood: "analítico · tipster", seguidores: 58_000, engagement: 5.2, fit: 92, ciudad: "Santiago", avatar: "🔭" },
    { id: "ei2", nombre: "La Previa Estelar", handle: "@laprevia.estelar", arquetipo: "comedia", mood: "futbolero · irreverente", seguidores: 540_000, engagement: 5.9, fit: 91, ciudad: "Santiago", avatar: "⭐" },
    { id: "ei3", nombre: "Cometa FC", handle: "@cometafc", arquetipo: "comedia", mood: "hincha · épico", seguidores: 410_000, engagement: 5.3, fit: 88, ciudad: "Valparaíso", avatar: "☄️" },
    { id: "ei4", nombre: "Estrella Slots", handle: "@estrellaslots", arquetipo: "lifestyle", mood: "showman · casino", seguidores: 1_150_000, engagement: 4.7, fit: 86, ciudad: "Santiago", avatar: "🎰" },
    { id: "ei5", nombre: "Galaxia Gamer", handle: "@galaxiagamer", arquetipo: "lifestyle", mood: "gamer · twitch", seguidores: 165_000, engagement: 4.4, fit: 83, ciudad: "Santiago", avatar: "🕹️" },
    { id: "ei6", nombre: "Picks Sin Filtro", handle: "@pickssinfiltro", arquetipo: "tech", mood: "analítico · honesto", seguidores: 96_000, engagement: 4.8, fit: 90, ciudad: "Concepción", avatar: "📊" },
    { id: "ei7", nombre: "El Relator Cósmico", handle: "@relatorcosmico", arquetipo: "comedia", mood: "absurdo · viral", seguidores: 305_000, engagement: 6.1, fit: 87, ciudad: "Santiago", avatar: "🎙️" },
    { id: "ei8", nombre: "Profe de Cuotas", handle: "@profedecuotas", arquetipo: "tech", mood: "didáctico", seguidores: 48_000, engagement: 5.0, fit: 89, ciudad: "Santiago", avatar: "🎯" },
    { id: "ei9", nombre: "Astro Tipster", handle: "@astrotipster", arquetipo: "tech", mood: "tipster · joven", seguidores: 8_400, engagement: 9.1, fit: 85, ciudad: "Temuco", avatar: "📈" },
    { id: "ei10", nombre: "Barra Estelar", handle: "@barraestelar", arquetipo: "comedia", mood: "hincha · cálido", seguidores: 24_000, engagement: 7.8, fit: 84, ciudad: "Valdivia", avatar: "🥁" },
    { id: "ei11", nombre: "Meteoro Apuestas", handle: "@meteoro.apuesta", arquetipo: "comedia", mood: "tipster · relatable", seguidores: 27_000, engagement: 7.4, fit: 88, ciudad: "Rancagua", avatar: "💫" },
    { id: "ei12", nombre: "Constelación FC", handle: "@constelacionfc", arquetipo: "comedia", mood: "futbolero · data", seguidores: 72_000, engagement: 5.6, fit: 90, ciudad: "Santiago", avatar: "🌌" },
    { id: "ei13", nombre: "Luna Casino", handle: "@lunacasino", arquetipo: "lifestyle", mood: "casino · hype", seguidores: 16_500, engagement: 6.9, fit: 82, ciudad: "Viña del Mar", avatar: "🌙" },
    { id: "ei14", nombre: "Órbita Deportiva", handle: "@orbitadeportiva", arquetipo: "comedia", mood: "futbolero · cercano", seguidores: 12_000, engagement: 8.2, fit: 84, ciudad: "Antofagasta", avatar: "🛰️" },
  ]),
  conceptos: [
    { id: "e1", titulo: "Jugada con cabeza", territorio: "Juego responsable", mood: "honesto · cercano", arquetipo: "tech", acento: "cyan", nivel: 1, rationale: "El rubro evita hablar de responsabilidad; EstelarBet se apropia del territorio. Creadores muestran cómo poner límites, leer las cuotas y jugar por diversión — la marca que apuesta por jugar con cabeza, no por la euforia.", ideasContenido: ["“Cómo pongo mis límites antes de apostar”", "Mitos del apostador novato (y qué hacer en serio)", "Checklist: apostar por diversión, no por desesperación"], tendencias: ["t4", "t2"], aprendizaje: "a1", influencers: ["ei1", "ei8", "ei11"], confianza: 88, alcance: 980_000, engagement: 5.5, cpm: 4.0, riesgo: "Bajo" },
    { id: "e2", titulo: "La previa estelar", territorio: "Fútbol · Mundial", mood: "futbolero · épico", arquetipo: "comedia", acento: "violet", nivel: 1, rationale: "El Mundial concentra la conversación; aunque Chile no clasificó, igual se vive. Creadores de barrio hacen la previa de cada partido con su pronóstico y su cuota EstelarBet — la marca se vuelve parte del ritual del grupo, no un aviso comprado.", ideasContenido: ["“La previa estelar”: pronóstico + cuota del partido del día", "Reacciones en vivo con cash out en el minuto clave", "El once ideal del Mundial… y la jugada estelar de la fecha"], tendencias: ["t1", "t5"], aprendizaje: "a3", influencers: ["ei2", "ei3", "ei12"], confianza: 85, alcance: 2_900_000, engagement: 6.0, cpm: 3.5, riesgo: "Medio" },
    { id: "e3", titulo: "Cuotas que brillan, sin letra chica", territorio: "Valor · transparencia", mood: "claro · directo", arquetipo: "tech", acento: "amber", nivel: 1, rationale: "Frente a la guerra de promos confusas, EstelarBet explica. Creadores comparan cuotas reales y desarman la “letra chica” de los bonos: la marca que te trata como adulto y te muestra el valor estelar claro.", ideasContenido: ["“Te explico la letra chica de los bonos de apuestas”", "Comparo cuotas reales del mismo partido", "Qué es una cuota potenciada y cuándo conviene"], tendencias: ["t2", "t6"], aprendizaje: "a4", influencers: ["ei1", "ei6", "ei8"], confianza: 81, alcance: 820_000, engagement: 5.1, cpm: 4.4, riesgo: "Bajo" },
    { id: "e4", titulo: "Casino bajo las estrellas", territorio: "Casino · streamers", mood: "hype · comunidad", arquetipo: "lifestyle", acento: "coral", nivel: 2, rationale: "Activar streamers de casino en Twitch/Kick con sesiones en vivo y responsables. La comunidad juega junto al creador, con límites visibles en pantalla: entretención fuerte sin perder el sello responsable.", ideasContenido: ["Sesión en vivo: la comunidad elige el próximo juego", "“Slots con tope”: jugando con límite a la vista", "Highlights de la semana en casino en vivo"], tendencias: ["t3", "t5"], aprendizaje: "a2", influencers: ["ei4", "ei5", "ei13"], confianza: 76, alcance: 1_300_000, engagement: 6.7, cpm: 5.0, riesgo: "Medio" },
    { id: "e5", titulo: "El pick de tu barrio", territorio: "Tipsters · relatable", mood: "cercano · honesto", arquetipo: "comedia", acento: "lime", nivel: 2, rationale: "El pick de la persona común convierte más que el del experto. Micro-creadores comparten su apuesta de la fecha con argumento y honestidad (también cuando pierden): la marca acompaña, no promete ganar.", ideasContenido: ["“Mi pick de la fecha y por qué” (con argumento)", "Cuando el pick falla: cómo lo tomo con humor", "Reto: $5.000 toda la fecha, juego responsable"], tendencias: ["t2", "t4"], aprendizaje: "a2", influencers: ["ei11", "ei9", "ei10"], confianza: 83, alcance: 680_000, engagement: 7.7, cpm: 3.6, riesgo: "Medio" },
    { id: "e6", titulo: "El reto de la jugada imposible", territorio: "Cultura web · reto viral", mood: "irreverente · viral", arquetipo: "comedia", acento: "rose", nivel: 3, rationale: "Libertad creativa total a creadores virales para inventar un reto meme-able alrededor de una combinada “imposible”. Alto riesgo/alto retorno, con disclaimers de juego responsable bien resueltos y sin promesa de ganancia.", ideasContenido: ["Reto “la jugada imposible” narrada como épica", "Falso documental: “la cofradía del Mundial”", "Serie absurda: reaccionando a la cuota más loca de la semana"], tendencias: ["t1", "t3"], aprendizaje: "a1", influencers: ["ei2", "ei7", "ei3"], confianza: 70, alcance: 4_400_000, engagement: 5.4, cpm: 2.9, riesgo: "Alto" },
  ],
  conceptoVariantes: {
    e1: { titulos: ["Jugada con cabeza", "Jugar bien es jugar con límites", "El control también es parte del juego"], rationales: ["El rubro evita hablar de responsabilidad; EstelarBet se apropia del territorio. Creadores muestran cómo poner límites, leer las cuotas y jugar por diversión.", "Convertimos el escrutinio regulatorio en confianza: mientras otros gritan promos, EstelarBet enseña a jugar sano y queda como el operador adulto.", "El juego responsable como contenido útil, no como disclaimer al final: el creador lo hace parte natural de su rutina."], ideasPool: ["“Cómo pongo mis límites antes de apostar”", "Mitos del apostador novato (y qué hacer en serio)", "Checklist: apostar por diversión, no por desesperación", "Las señales de que hay que parar", "Configura tus límites en la app en 60s", "Por qué apuesto poco y disfruto más"] },
    e2: { titulos: ["La previa estelar", "Vivamos el Mundial de barrio", "El ritual del grupo"], rationales: ["El Mundial concentra la conversación; los creadores de barrio hacen la previa con su pronóstico y su cuota EstelarBet — la marca se vuelve parte del ritual del grupo.", "Frente a los sponsors grandes, nos metemos en el minuto a minuto: estar donde se vive el partido, no donde se compra la pantalla.", "El hincha no quiere un aviso, quiere conversación: el creador comenta y la marca acompaña la épica."], ideasPool: ["“La previa estelar”: pronóstico + cuota del partido del día", "Reacciones en vivo con cash out en el minuto clave", "El once ideal del Mundial… y la jugada estelar de la fecha", "Predicciones de la fecha con la comunidad", "El post-partido: qué pasó con mi jugada", "Datos locos antes del partido del día"] },
    e3: { titulos: ["Cuotas que brillan, sin letra chica", "Te explico el bono de verdad", "Apuestas para adultos"], rationales: ["Frente a la guerra de promos confusas, EstelarBet explica. Creadores comparan cuotas reales y desarman la “letra chica” de los bonos.", "Transparencia como ataque: mientras otros gritan bonos, EstelarBet gana confianza explicando las condiciones reales.", "Educación del apostador: el creador enseña a leer una cuota y a no caer en la promesa fácil."], ideasPool: ["“Te explico la letra chica de los bonos de apuestas”", "Comparo cuotas reales del mismo partido", "Qué es una cuota potenciada y cuándo conviene", "Cómo leo una cuota en 30 segundos", "Bono vs. cuota potenciada: qué conviene", "Las preguntas que deberías hacer antes de apostar"] },
    e4: { titulos: ["Casino bajo las estrellas", "Slots con la barra", "Juega conmigo, con límite"], rationales: ["Activar streamers de casino en vivo y responsables. La comunidad juega junto al creador, con límites visibles en pantalla.", "El casino se vive en comunidad: el stream convierte una sesión solitaria en un evento compartido, siempre con el tope a la vista.", "Entretención sin culpa: mostramos el casino como espectáculo responsable, con el creador modelando buen comportamiento."], ideasPool: ["Sesión en vivo: la comunidad elige el próximo juego", "“Slots con tope”: jugando con límite a la vista", "Highlights de la semana en casino en vivo", "Reaccionando a las mejores jugadas de la comunidad", "Tour por los juegos nuevos del mes", "El reto del presupuesto: una hora, un límite"] },
    e5: { titulos: ["El pick de tu barrio", "Mi jugada de la fecha", "Tipsters de verdad"], rationales: ["El pick de la persona común convierte más que el del experto. Micro-creadores comparten su apuesta con argumento y honestidad (también cuando pierden).", "La honestidad es el gancho: mostrar también las apuestas perdidas genera más confianza (y registros) que prometer ganancias.", "Lo relatable convierte barato: el tipster de barrio se siente alcanzable y su pick se vuelve conversación de grupo."], ideasPool: ["“Mi pick de la fecha y por qué” (con argumento)", "Cuando el pick falla: cómo lo tomo con humor", "Reto: $5.000 toda la fecha, juego responsable", "Mi historial honesto del mes", "Cómo armo una combinada que tenga sentido", "Respondiendo los picks que me mandan"] },
    e6: { titulos: ["El reto de la jugada imposible", "La cofradía del Mundial", "Una fecha, una épica"], rationales: ["Libertad creativa total a creadores virales para inventar un reto meme-able alrededor de una combinada “imposible”, con disclaimers bien resueltos.", "Apostamos a un código cultural propio: un reto tan específico que la gente lo duetea y lo hace suyo, siempre con el sello responsable.", "Menos guion, más creador: confiamos en el talento para que la marca se vuelva conversación de la fecha."], ideasPool: ["Reto “la jugada imposible” narrada como épica", "Falso documental: “la cofradía del Mundial”", "Serie absurda: reaccionando a la cuota más loca de la semana", "POV: eres el que siempre arma la combinada del grupo", "El trend del “grito de gol” con cash out", "Trailer épico para una fecha cualquiera"] },
  },
  insightsReunion: [
    { id: "r1", texto: "Como retador, no pueden ganar por pauta: la apuesta es cercanía con creadores de barrio.", tag: "posicionamiento" },
    { id: "r2", texto: "El foco real es crecer registros y primera apuesta durante el Mundial, no solo awareness.", tag: "objetivo" },
    { id: "r3", texto: "Mucha sensibilidad con juego responsable: todo con disclaimers (+18) y sin prometer ganancias.", tag: "riesgo" },
    { id: "r4", texto: "Creen que las cuotas potenciadas (“estelares”) explicadas claro convierten más que el bono genérico.", tag: "tono" },
    { id: "r5", texto: "Los partidos del Mundial son el momento de oro: quieren estar en la previa y el minuto a minuto.", tag: "timing" },
    { id: "r6", texto: "Les preocupa el menor awareness frente a Betano y Betsson; la marca debe verse seria y cercana a la vez.", tag: "crisis" },
  ],
  pasosCompetencia: [
    "Rastreando la conversación del rubro apuestas (90 días)…",
    "Mapeando a Betano, Betsson, Coolbet y bet365…",
    "Midiendo share of voice y la pelea por el fútbol del Mundial…",
    "Detectando a los grandes copando la pauta paga…",
    "Buscando el espacio del retador para EstelarBet (cercanía local)…",
  ],
  pasosBrief: [
    "Leyendo el brief de campaña…",
    "Extrayendo objetivos, tono y restricciones de juego responsable…",
    "Cruzando con benchmarks de adquisición (registro→apuesta)…",
    "Alineando KPIs con el calendario del Mundial…",
  ],
  pasosTranscripcion: [
    "Transcribiendo la reunión…",
    "Detectando hablantes y temas…",
    "Extrayendo insights y frases clave del cliente…",
    "Marcando sensibilidades (juego responsable / +18)…",
    "Priorizando por impacto en registros y conversión…",
  ],
  actividadSeed: [
    { t: "hace 3 min", txt: "Jugada detectada: los creadores de barrio rinden mejor costo por registro que la pauta de los sponsors grandes", color: "violet" },
    { t: "hace 21 min", txt: "Cerebro detectó a Betano y Betsson copando el SOV de fútbol del Mundial", color: "rose" },
    { t: "hace 1 h", txt: "Insight de reunión: el foco es registro→primera apuesta con cuotas estelares", color: "amber" },
    { t: "ayer", txt: "Aprendizaje añadido: “los micro-creadores convierten barato” (benchmark CPA)", color: "cyan" },
  ],
  campañas: [
    { id: "ec1", nombre: "EstelarBet · Jugada Estelar Mundial", marca: "EstelarBet", estado: "En estrategia", progreso: 54, alcance: "—", ventana: "Jun–Jul" },
    { id: "ec2", nombre: "Casino · Bajo las estrellas en vivo", marca: "EstelarBet", estado: "Activa", progreso: 73, alcance: "1.3M", ventana: "Q2 2026" },
    { id: "ec3", nombre: "App EstelarBet · Registro express", marca: "EstelarBet", estado: "Activa", progreso: 58, alcance: "1.8M", ventana: "Q1 2026" },
    { id: "ec4", nombre: "Juego Responsable · Always-on", marca: "EstelarBet", estado: "Borrador", progreso: 12, alcance: "—", ventana: "2026" },
  ],
  transcript: `[00:05] Cliente (EstelarBet): somos el retador. Betano es sponsor FIFA y Betsson está con Chilevisión; nosotros no podemos pelear por pauta.
[02:20] Agencia: ¿el foco es awareness o registros?
[02:34] Cliente: registros y primera apuesta. Queremos crecer la base aprovechando el Mundial.
[06:00] Cliente: nuestra carta es la cercanía: creadores de barrio, tipsters que ya son la previa de su grupo. Ahí ganamos costo por registro.
[08:30] Cliente: y todo con juego responsable. Nada de prometer ganancias, +18 y declarado como publicidad.
[14:40] Cliente: las cuotas potenciadas “estelares” explicadas claro convierten más que el bono confuso.
[20:50] Cliente: el momento clave son los partidos del Mundial: queremos estar en la previa y el minuto a minuto.`,
  contextoItems: ["Brief EstelarBet", "Reunión", "6 tendencias", "Aprendizajes"],
  espacioBlanco: {
    titulo: "Espacio en blanco para EstelarBet",
    detalle: "Los grandes compran la pantalla del Mundial (Betano FIFA, Betsson Chilevisión) pero nadie ocupa la cercanía: el creador de barrio que es la previa real del grupo. EstelarBet puede atacar ahí con cuotas estelares claras y juego responsable, ganando costo por registro sin competir por GRPs.",
  },
  guiarPlaceholders: { idea: "Ej: La previa del barrio con cuotas estelares", territorio: "Ej: Fútbol · Mundial" },
  objetivoDefault: "Registros + primera apuesta en el Mundial",
  refLinks: ["tiktok.com/@laprevia.estelar/video/…", "instagram.com/reel/cometafc-mundial…"],
  briefDefault: `Campaña "EstelarBet · Jugada Estelar Mundial". Objetivo: crecer registros y primera apuesta durante el Mundial como el operador retador más cercano, frente a Betano (sponsor FIFA) y Betsson (aliado de Chilevisión). Carta: creadores de barrio y tipsters relatables + cuotas potenciadas ("estelares") explicadas con transparencia. Aunque Chile no clasificó, los chilenos igual siguen el torneo. Tono futbolero y cercano, siempre con juego responsable (+18, sin prometer ganancias). Todo contenido de creadores debe ir declarado como publicidad.`,
  kpiPrincipal: "Registros + primera apuesta",
};

/* ============================================================
   Registro de datasets + bindings activos (live bindings)
   ============================================================ */
export const DATASETS: Record<string, BrandDataset> = { copec: COPEC, betsson: BETSSON, estelarbet: ESTELARBET };

export let cliente = COPEC.cliente;
export let competidores = COPEC.competidores;
export let analisis = COPEC.analisis;
export let oportunidades = COPEC.oportunidades;
export let fuentesAnalisis = COPEC.fuentesAnalisis;
export let tendencias = COPEC.tendencias;
export let aprendizajes = COPEC.aprendizajes;
export let influencers = COPEC.influencers;
export let conceptos = COPEC.conceptos;
export let conceptoVariantes = COPEC.conceptoVariantes;
export let insightsReunion = COPEC.insightsReunion;
export let pasosCompetencia = COPEC.pasosCompetencia;
export let pasosBrief = COPEC.pasosBrief;
export let pasosTranscripcion = COPEC.pasosTranscripcion;
export let actividadSeed = COPEC.actividadSeed;
export let campañas = COPEC.campañas;
export let transcript = COPEC.transcript;
export let contextoItems = COPEC.contextoItems;
export let espacioBlanco = COPEC.espacioBlanco;
export let guiarPlaceholders = COPEC.guiarPlaceholders;
export let objetivoDefault = COPEC.objetivoDefault;
export let refLinks = COPEC.refLinks;
export let briefDefault = COPEC.briefDefault;
export let kpiPrincipal = COPEC.kpiPrincipal;

/* acento de marca (hex) para piezas que no usan tokens CSS, p. ej. el cerebro 3D */
const BRAND_ACCENT: Record<string, string> = { copec: "#1f7aed", betsson: "#ff6a00", estelarbet: "#5b6cff" };
export let accentHex = BRAND_ACCENT.copec;

/* Cambia el cliente activo — las pantallas se remontan (key={marca.id}) y releen estos bindings. */
export function setBrandData(id: string) {
  const d = DATASETS[id] ?? COPEC;
  accentHex = BRAND_ACCENT[id] ?? BRAND_ACCENT.copec;
  cliente = d.cliente;
  competidores = d.competidores;
  analisis = d.analisis;
  oportunidades = d.oportunidades;
  fuentesAnalisis = d.fuentesAnalisis;
  tendencias = d.tendencias;
  aprendizajes = d.aprendizajes;
  influencers = d.influencers;
  conceptos = d.conceptos;
  conceptoVariantes = d.conceptoVariantes;
  insightsReunion = d.insightsReunion;
  pasosCompetencia = d.pasosCompetencia;
  pasosBrief = d.pasosBrief;
  pasosTranscripcion = d.pasosTranscripcion;
  actividadSeed = d.actividadSeed;
  campañas = d.campañas;
  transcript = d.transcript;
  contextoItems = d.contextoItems;
  espacioBlanco = d.espacioBlanco;
  guiarPlaceholders = d.guiarPlaceholders;
  objetivoDefault = d.objetivoDefault;
  refLinks = d.refLinks;
  briefDefault = d.briefDefault;
  kpiPrincipal = d.kpiPrincipal;
}

/* helpers que leen la marca activa */
export const conceptosPorNivel = (nivel: Nivel) => conceptos.filter((c) => c.nivel <= nivel);
export const tendenciaById = (id: string) => tendencias.find((t) => t.id === id);
export const aprendizajeById = (id: string) => aprendizajes.find((a) => a.id === id);
export const influencerById = (id: string) => influencers.find((i) => i.id === id);

/* pasos genéricos (no dependen de marca) */
export const pasosConcepto = [
  "Sintetizando ingesta + insights…",
  "Explorando territorios creativos…",
  "Cruzando tendencias en alza…",
  "Recuperando aprendizajes de campañas pasadas…",
  "Agrupando arquetipos y moods de creadores…",
  "Redactando rationales e ideas de contenido…",
  "Proyectando alcance, engagement y riesgo…",
];

/* ---------- helpers de formato ---------- */
export function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1) + "M";
  if (n >= 1_000) return Math.round(n / 1000) + "K";
  return String(n);
}
export function fmtCLP(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return m.toLocaleString("es-CL", { maximumFractionDigits: m < 100 ? 1 : 0 }) + "M";
  }
  if (n >= 1_000) return Math.round(n / 1000).toLocaleString("es-CL") + "K";
  return Math.round(n).toLocaleString("es-CL");
}
export const NIVEL_LABEL: Record<Nivel, string> = { 1: "Seguro", 2: "Audaz", 3: "Atrevido" };
export const arquetipoLabel: Record<Arquetipo, string> = {
  viajes: "Viajeros",
  comedia: "Comediantes",
  foodie: "Foodies",
  familia: "Familia",
  motor: "Motor / autos",
  tech: "Tech / EV",
  lifestyle: "Lifestyle",
};
