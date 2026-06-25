/* ============================================================
   SIGMA v2 — datos del demo (aterrizados en research real)
   Marca en foco: COPEC — campaña "Copec en Ruta · Verano"
   Fuentes: caso Copec Pay (Adinfluence), batalla Ruta 5 (Emol),
   Copec Voltex, caso SERNAC, ranking creadores CL (Favikon).
   Las métricas de talento son estimaciones para planificación.
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
}
export const marcas: Marca[] = [
  { id: "copec", nombre: "Copec", rubro: "Energía · Estaciones · App", glyph: "⬢", acento: "cyan", campañasActivas: 3 },
  { id: "halsa", nombre: "Hälsa", rubro: "Bebida funcional · Kombucha", glyph: "◍", acento: "violet", campañasActivas: 2 },
  { id: "lume", nombre: "Lumé", rubro: "Skincare · Beauty", glyph: "✦", acento: "rose", campañasActivas: 1 },
  { id: "aro", nombre: "Aro", rubro: "Moda · Sneakers", glyph: "▲", acento: "coral", campañasActivas: 3 },
];

/* ---------- Campañas ---------- */
export interface Campaña {
  id: string;
  nombre: string;
  marca: string;
  estado: "Activa" | "En estrategia" | "Cerrada" | "Borrador";
  progreso: number;
  alcance: string;
  ventana: string;
}
export const campañas: Campaña[] = [
  { id: "c1", nombre: "Copec en Ruta · Verano", marca: "Copec", estado: "En estrategia", progreso: 58, alcance: "—", ventana: "Dic–Feb" },
  { id: "c2", nombre: "App Copec · Beneficios", marca: "Copec", estado: "Activa", progreso: 82, alcance: "9.5M", ventana: "Q2 2026" },
  { id: "c3", nombre: "Copec Voltex · Electromovilidad", marca: "Copec", estado: "Activa", progreso: 64, alcance: "2.1M", ventana: "Q1 2026" },
  { id: "c4", nombre: "Pronto · Snack de carretera", marca: "Copec", estado: "Borrador", progreso: 10, alcance: "—", ventana: "Verano 2027" },
  { id: "c5", nombre: "Lumé Sérum Noche", marca: "Lumé", estado: "Activa", progreso: 72, alcance: "1.8M", ventana: "Q2 2026" },
];

/* ---------- Campaña en foco ---------- */
export const cliente = {
  marca: "Copec",
  campania: "Copec en Ruta · Verano",
  categoria: "Estaciones de servicio · App Copec · Pronto",
  mercado: "Chile",
  objetivo: "Defender el liderazgo en la Ruta 5 e impulsar el uso de la App Copec en temporada de viajes",
  presupuesto: "CLP 30M",
  ventana: "Temporada alta · Dic–Feb",
};

/* ---------- Competidores (research real) ---------- */
export interface Competidor {
  id: string;
  nombre: string;
  sov: number;
  territorio: string;
  tono: string;
  amenaza: "alta" | "media" | "baja";
}
export const competidores: Competidor[] = [
  { id: "k1", nombre: "Shell · upa!", sov: 26, territorio: "“La que rinde más” · ataque directo a Copec", tono: "Retador, comparativo", amenaza: "alta" },
  { id: "k2", nombre: "Aramco", sov: 24, territorio: "Ruta 5 · “Pit Stop” rápido", tono: "Eficiente, expansivo", amenaza: "alta" },
  { id: "k3", nombre: "Oxxo", sov: 12, territorio: "Tienda de conveniencia", tono: "Promocional, masivo", amenaza: "media" },
];

/* ---------- Análisis de marca (salud + crisis) ---------- */
export const analisisCopec = {
  sentimiento: 54, // % de conversación positiva
  tendenciaSentimiento: -8, // variación vs. mes anterior
  sov: 41,
  seguidoresIG: 248_000,
  liderazgo: "81 estaciones en la Ruta 5 · líder",
  crisis: {
    titulo: "Crisis reputacional en curso",
    detalle:
      "Sube la percepción de “la bencina más cara” y persiste el ruido por el caso de transparencia (SERNAC). Shell capitaliza posicionándose como “la que rinde más” — un golpe directo al diferencial precio/valor de Copec.",
    severidad: "alta" as const,
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
};

/* Fuentes del análisis — trazabilidad de research (de dónde salió cada lectura) */
export interface FuenteAnalisis {
  id: string;
  titulo: string;
  fuente: string;
  tipo: "Prensa" | "Caso" | "Ranking" | "Regulatorio" | "Social listening" | "Data propia";
  fecha: string;
  url: string;
}
export const fuentesAnalisis: FuenteAnalisis[] = [
  { id: "f1", titulo: "Batalla por la Ruta 5: Copec vs. Aramco y el “Pit Stop”", fuente: "Emol · Economía", tipo: "Prensa", fecha: "May 2026", url: "https://www.emol.com/" },
  { id: "f2", titulo: "Copec Pay: campaña con creadores en libertad creativa (9.5M, +170%)", fuente: "Adinfluence", tipo: "Caso", fecha: "2025", url: "#" },
  { id: "f3", titulo: "Ranking de creadores de contenido en Chile", fuente: "Favikon", tipo: "Ranking", fecha: "Abr 2026", url: "https://www.favikon.com/" },
  { id: "f4", titulo: "Declaración obligatoria de publicidad de influencers (#ad)", fuente: "SERNAC", tipo: "Regulatorio", fecha: "2024", url: "https://www.sernac.cl/" },
  { id: "f5", titulo: "Sentimiento, share of voice y claim “rinde más” de Shell", fuente: "Social listening · ventana 90 días", tipo: "Social listening", fecha: "Jun 2026", url: "#" },
  { id: "f6", titulo: "Red Voltex y tráfico en estaciones (+50% en verano)", fuente: "Data interna Copec", tipo: "Data propia", fecha: "2026", url: "#" },
];

export interface Oportunidad {
  id: string;
  titulo: string;
  detalle: string;
  territorio: string;
  acento: Acento;
  impacto: "alto" | "medio";
}
export const oportunidades: Oportunidad[] = [
  { id: "o1", titulo: "Recuperar el valor percibido", detalle: "Responder al claim de Shell demostrando rendimiento y beneficios reales (App, Pronto) en vez de competir solo por precio.", territorio: "Valor / beneficios", acento: "cyan", impacto: "alto" },
  { id: "o2", titulo: "Dueños de la Ruta 5 en verano", detalle: "Capitalizar el liderazgo en carretera justo cuando el tráfico sube +50%, antes de que Aramco gane terreno.", territorio: "Viajes / Ruta 5", acento: "lime", impacto: "alto" },
  { id: "o3", titulo: "Liderar la electromovilidad", detalle: "Posicionar Voltex como la respuesta a la ansiedad del auto eléctrico: un territorio que la competencia no ocupa.", territorio: "Electromovilidad", acento: "coral", impacto: "medio" },
  { id: "o4", titulo: "Transparencia como ventaja", detalle: "Convertir el aprendizaje del caso SERNAC en un sello de honestidad: la marca que sí muestra todo claro.", territorio: "Confianza / honestidad", acento: "violet", impacto: "medio" },
];

/* Actividad reciente (semilla; el sistema le suma campañas creadas) */
export const actividadSeed = [
  { t: "hace 2 min", txt: "Cerebro detectó el claim de Shell “rinde más” como amenaza directa", color: "rose" },
  { t: "hace 21 min", txt: "Análisis de competencia: Aramco creciendo en la Ruta 5", color: "amber" },
  { t: "hace 1 h", txt: "Insight de reunión: el foco es uso de la App Copec, no solo bencina", color: "violet" },
  { t: "ayer", txt: "Aprendizaje añadido: “libertad creativa > brief rígido” (caso Copec Pay)", color: "cyan" },
];

/* ---------- Tendencias ---------- */
export interface Tendencia {
  id: string;
  nombre: string;
  plataforma: string;
  momentum: number;
  volumen: string;
}
export const tendencias: Tendencia[] = [
  { id: "t1", nombre: "Roadtrip Ruta 5 / verano", plataforma: "TikTok", momentum: 118, volumen: "2.7M/sem" },
  { id: "t2", nombre: "Electromovilidad / autos eléctricos", plataforma: "TikTok·IG", momentum: 84, volumen: "1.4M/sem" },
  { id: "t3", nombre: "Apps de beneficios y cuponeo", plataforma: "TikTok", momentum: 63, volumen: "900K/sem" },
  { id: "t4", nombre: "Snack de carretera / “Pronto run”", plataforma: "Reels", momentum: 47, volumen: "1.2M/sem" },
  { id: "t5", nombre: "Transparencia en publicidad (#ad)", plataforma: "TikTok·X", momentum: 52, volumen: "640K/sem" },
  { id: "t6", nombre: "Pet-friendly en la ruta", plataforma: "Reels", momentum: 29, volumen: "510K/sem" },
];
export const tendenciaById = (id: string) => tendencias.find((t) => t.id === id);

/* ---------- Aprendizajes (casos reales Copec) ---------- */
export interface Aprendizaje {
  id: string;
  titulo: string;
  detalle: string;
  fuente: string;
}
export const aprendizajes: Aprendizaje[] = [
  { id: "a1", titulo: "Libertad creativa > brief rígido", detalle: "La campaña Copec Pay con creadores en libertad creativa llegó a 9.5M (170% sobre la meta), CPA $3.4.", fuente: "Caso Copec Pay · verano" },
  { id: "a2", titulo: "Transparencia obligatoria", detalle: "Tras el caso SERNAC, todo contenido de influencer debe declararse como publicidad y dejar claro el rol de marca.", fuente: "Compliance · caso SERNAC" },
  { id: "a3", titulo: "Verano = +50% de transacciones", detalle: "El tráfico en estaciones sube hasta 50% en temporada de viajes; conviene concentrar la pauta ahí.", fuente: "Data de tráfico Copec" },
  { id: "a4", titulo: "Lo relatable convierte barato", detalle: "Creadores de humor cercano lograron el menor CPE histórico en IGC.", fuente: "Benchmark IGC" },
];
export const aprendizajeById = (id: string) => aprendizajes.find((a) => a.id === id);

/* ---------- Influencers (creadores CL · estimaciones) ---------- */
/* Categorías por nº de seguidores con tarifa de paquete base (1 reel + 2 historias).
   PROVISIONAL para el demo — reemplazar con data real de creadores en el próximo paso. */
export type Tier = "nano" | "micro" | "mid" | "macro" | "mega" | "celebrity";
export type Arquetipo = "viajes" | "comedia" | "foodie" | "familia" | "motor" | "tech" | "lifestyle";

export interface TierInfo {
  label: string;
  min: number;          // seguidores (incl.)
  max: number;          // seguidores (excl.); celebrity = Infinity
  pack: number | null;  // CLP por paquete base (1 reel + 2 historias); null = negociación 1:1
  er: number;           // engagement rate referencial (%)
  reach: number;        // factor de alcance del paquete (× seguidores)
  conv: number;         // fracción del alcance que se vuelve "prueba"
  color: Acento;
}
export const TIERS: Tier[] = ["nano", "micro", "mid", "macro", "mega", "celebrity"];
/* Tarifas base por 1 reel + 2 historias (CLP). El derecho a imagen es un adicional configurable. */
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
/* rango de seguidores legible, ej. "30K–80K" */
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
/* tier derivado de los seguidores → siempre coherente con TIER_CONFIG */
export const influencers: Influencer[] = ([
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
  /* — añadidos para cubrir nano/micro/mid (demo) — */
  { id: "i18", nombre: "Tomás Andes", handle: "@tomas.alvolante", arquetipo: "motor", mood: "entusiasta", seguidores: 46_000, engagement: 4.6, fit: 84, ciudad: "Rancagua", avatar: "🚙" },
  { id: "i19", nombre: "Javi en Carretera", handle: "@javi.encarretera", arquetipo: "foodie", mood: "antojo", seguidores: 68_000, engagement: 4.4, fit: 85, ciudad: "Talca", avatar: "🍟" },
  { id: "i15", nombre: "Dani EV", handle: "@evchile.dani", arquetipo: "tech", mood: "didáctico", seguidores: 14_500, engagement: 6.2, fit: 88, ciudad: "Santiago", avatar: "🔌" },
  { id: "i16", nombre: "Pau Rutera", handle: "@rutera.pau", arquetipo: "viajes", mood: "aventurero", seguidores: 21_000, engagement: 6.8, fit: 90, ciudad: "Pucón", avatar: "🏔️" },
  { id: "i17", nombre: "Caro & familia", handle: "@viajes.encautela", arquetipo: "familia", mood: "cálido", seguidores: 27_000, engagement: 7.1, fit: 87, ciudad: "La Serena", avatar: "👨‍👩‍👧" },
  { id: "i13", nombre: "Vale Norte", handle: "@norte.alvolante", arquetipo: "viajes", mood: "cálido", seguidores: 6_400, engagement: 9.4, fit: 86, ciudad: "Antofagasta", avatar: "🚐" },
  { id: "i14", nombre: "Antojo Express", handle: "@antojos.deruta", arquetipo: "foodie", mood: "cercano", seguidores: 8_900, engagement: 8.7, fit: 83, ciudad: "Santiago", avatar: "🌮" },
] as Omit<Influencer, "tier">[]).map((i) => ({ ...i, tier: tierOf(i.seguidores) }));
export const influencerById = (id: string) => influencers.find((i) => i.id === id);

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

export const conceptos: Concepto[] = [
  {
    id: "x1",
    titulo: "El roadtrip no para",
    territorio: "Viajes · Ruta 5",
    mood: "aventurero · cálido",
    arquetipo: "viajes",
    acento: "cyan",
    nivel: 1,
    rationale: "El verano es de la carretera y Copec ya es dueño de la Ruta 5. Creadores de viaje muestran sus paradas Copec como parte natural del panorama: cargar, picar en Pronto y pagar con la App sin perder el viaje.",
    ideasContenido: [
      "“Mi ruta al sur en 60s”: cada parada es una estación Copec",
      "Checklist de viaje: la App Copec como copiloto",
      "Time-lapse Santiago→sur con paradas marcadas",
    ],
    tendencias: ["t1", "t4"],
    aprendizaje: "a3",
    influencers: ["i7", "i8", "i9"],
    confianza: 90,
    alcance: 1_900_000,
    engagement: 8.6,
    cpm: 4.4,
    riesgo: "Bajo",
  },
  {
    id: "x2",
    titulo: "Paga sin bajarte del auto",
    territorio: "App Copec · Pago digital",
    mood: "práctico · cercano",
    arquetipo: "lifestyle",
    acento: "violet",
    nivel: 1,
    rationale: "El objetivo es uso de la App, no solo bencina. Creadores muestran el beneficio real (pagar y juntar beneficios desde el celular) en clave útil y sin sonar a comercial corporativo.",
    ideasContenido: [
      "“Cosas que no sabías que hace la App Copec”",
      "Reto: una semana pagando todo con la App",
      "Antes/después: la fila vs. pagar desde el auto",
    ],
    tendencias: ["t3"],
    aprendizaje: "a1",
    influencers: ["i3", "i6", "i4"],
    confianza: 84,
    alcance: 2_600_000,
    engagement: 5.6,
    cpm: 3.6,
    riesgo: "Bajo",
  },
  {
    id: "x3",
    titulo: "El kit Pronto de carretera",
    territorio: "Foodie · Pronto",
    mood: "cercano · antojo",
    arquetipo: "foodie",
    acento: "amber",
    nivel: 1,
    rationale: "La parada también se elige por la comida. Foodies arman su “kit de carretera” en Pronto, demostrando que la mejor parada es la que tiene mejor antojo (y Copec App para pagarlo).",
    ideasContenido: [
      "“Arma tu combo Pronto perfecto para la ruta”",
      "Ranking honesto de snacks de carretera",
      "Receta express con lo que compras en Pronto",
    ],
    tendencias: ["t4"],
    aprendizaje: "a4",
    influencers: ["i10", "i8"],
    confianza: 76,
    alcance: 720_000,
    engagement: 8.1,
    cpm: 5.2,
    riesgo: "Bajo",
  },
  {
    id: "x4",
    titulo: "Mi familia en la ruta",
    territorio: "Familia · humor cotidiano",
    mood: "relatable · cálido",
    arquetipo: "familia",
    acento: "lime",
    nivel: 2,
    rationale: "El viaje familiar es un clásico chileno lleno de comedia. Copec aparece como el alto que salva el viaje: baño, café, snack y la app que evita el drama de la fila.",
    ideasContenido: [
      "Sketch: “los 5 tipos de pasajero en un viaje familiar”",
      "POV: el papá que solo para en Copec",
      "El alto que salvó las vacaciones (con branding en 3s)",
    ],
    tendencias: ["t1"],
    aprendizaje: "a4",
    influencers: ["i9", "i3"],
    confianza: 83,
    alcance: 2_100_000,
    engagement: 7.4,
    cpm: 3.9,
    riesgo: "Medio",
  },
  {
    id: "x5",
    titulo: "Carga y anda",
    territorio: "Electromovilidad · Voltex",
    mood: "innovador · futuro",
    arquetipo: "tech",
    acento: "coral",
    nivel: 2,
    rationale: "Posicionar a Copec como el que ya resolvió la ansiedad del auto eléctrico: la red Voltex de norte a sur. Creadores tech/motor hacen el primer viaje 100% eléctrico cargando en la ruta.",
    ideasContenido: [
      "“Crucé Chile en auto eléctrico solo con Voltex”",
      "Mito vs. dato: ¿se puede viajar en EV en Chile?",
      "Cuánto cuesta y cuánto demora cargar en la ruta",
    ],
    tendencias: ["t2"],
    aprendizaje: "a3",
    influencers: ["i11", "i12"],
    confianza: 78,
    alcance: 980_000,
    engagement: 7.4,
    cpm: 4.8,
    riesgo: "Medio",
  },
  {
    id: "x6",
    titulo: "El reto de la ruta",
    territorio: "Cultura web · reto viral",
    mood: "irreverente · viral",
    arquetipo: "comedia",
    acento: "rose",
    nivel: 3,
    rationale: "Replicar la fórmula que ya funcionó: libertad creativa total a creadores virales para inventar un reto/serie meme-able alrededor de la ruta. Alto riesgo/alto retorno, con disclaimers de publicidad bien resueltos.",
    ideasContenido: [
      "Reto “la parada perfecta” con coreografía duetable",
      "Falso documental: “la cofradía de los que solo paran en Copec”",
      "Serie absurda: un viaje narrado como épica",
    ],
    tendencias: ["t1", "t5"],
    aprendizaje: "a1",
    influencers: ["i2", "i1", "i4"],
    confianza: 70,
    alcance: 6_200_000,
    engagement: 5.1,
    cpm: 2.6,
    riesgo: "Alto",
  },
];
export const conceptosPorNivel = (nivel: Nivel) => conceptos.filter((c) => c.nivel <= nivel);

/* ---------- Variantes (regenerar por pieza) ---------- */
export interface Variantes {
  titulos: string[];
  rationales: string[];
  ideasPool: string[];
}
export const conceptoVariantes: Record<string, Variantes> = {
  x1: {
    titulos: ["El roadtrip no para", "La ruta es de Copec", "Tu copiloto en la carretera"],
    rationales: [
      "El verano es de la carretera y Copec ya es dueño de la Ruta 5. Creadores de viaje muestran sus paradas Copec como parte natural del panorama: cargar, picar en Pronto y pagar con la App sin perder el viaje.",
      "Frente a Aramco creciendo en la ruta, reforzamos lo que Copec ya tiene: la red más densa. El mensaje es simple: vayas donde vayas, Copec está en el camino.",
      "Convertimos cada viaje de verano en contenido: el creador no “publicita”, documenta su ruta real y Copec aparece donde siempre estuvo.",
    ],
    ideasPool: [
      "“Mi ruta al sur en 60s”: cada parada es una estación Copec",
      "Checklist de viaje: la App Copec como copiloto",
      "Time-lapse Santiago→sur con paradas marcadas",
      "“La mejor parada de la ruta” según cada creador",
      "Mapa de paradas imperdibles entre Santiago y el sur",
      "Lo que no puede faltar en un roadtrip chileno",
    ],
  },
  x2: {
    titulos: ["Paga sin bajarte del auto", "La App que se maneja sola", "Menos fila, más ruta"],
    rationales: [
      "El objetivo es uso de la App, no solo bencina. Creadores muestran el beneficio real (pagar y juntar beneficios desde el celular) en clave útil y sin sonar a comercial corporativo.",
      "Demostración honesta de utilidad: el creador resuelve un problema real (la fila, el efectivo) y la App queda como el héroe silencioso del viaje.",
      "Convertimos una función transaccional en contenido: el foco es la tranquilidad y la rapidez, no las features.",
    ],
    ideasPool: [
      "“Cosas que no sabías que hace la App Copec”",
      "Reto: una semana pagando todo con la App",
      "Antes/después: la fila vs. pagar desde el auto",
      "Mi suegra usando la App por primera vez",
      "Beneficios que estabas dejando pasar",
      "POV: nunca más andar con efectivo en la ruta",
    ],
  },
  x3: {
    titulos: ["El kit Pronto de carretera", "La parada se elige por el antojo", "Combo ruta perfecto"],
    rationales: [
      "La parada también se elige por la comida. Foodies arman su “kit de carretera” en Pronto, demostrando que la mejor parada es la que tiene mejor antojo (y Copec App para pagarlo).",
      "Pronto deja de ser “la tienda de la bencinera” y se vuelve destino: el creador la trata como una despensa de viaje con personalidad.",
      "El antojo manda en la ruta. Mostramos a Pronto ganando la batalla del snack frente a Oxxo y upa! con producto real.",
    ],
    ideasPool: [
      "“Arma tu combo Pronto perfecto para la ruta”",
      "Ranking honesto de snacks de carretera",
      "Receta express con lo que compras en Pronto",
      "Cata a ciegas de snacks de viaje",
      "El desayuno de ruta por menos de lo que crees",
      "Lo que pido siempre en Pronto",
    ],
  },
  x4: {
    titulos: ["Mi familia en la ruta", "El alto que salva el viaje", "Viajar en familia es un deporte"],
    rationales: [
      "El viaje familiar es un clásico chileno lleno de comedia. Copec aparece como el alto que salva el viaje: baño, café, snack y la app que evita el drama de la fila.",
      "Lo relatable convierte: convertimos el caos de viajar en familia en comedia, con Copec como el momento de paz del trayecto.",
      "El humor cotidiano genera el mayor share. La marca entra temprano (primeros 3s) para no perder recall.",
    ],
    ideasPool: [
      "Sketch: “los 5 tipos de pasajero en un viaje familiar”",
      "POV: el papá que solo para en Copec",
      "El alto que salvó las vacaciones (con branding en 3s)",
      "Las frases que todo niño dice en la carretera",
      "Empacar el auto: expectativa vs. realidad",
      "El playlist de ruta que une (o divide) a la familia",
    ],
  },
  x5: {
    titulos: ["Carga y anda", "Chile en eléctrico, sin ansiedad", "La ruta también es eléctrica"],
    rationales: [
      "Posicionar a Copec como el que ya resolvió la ansiedad del auto eléctrico: la red Voltex de norte a sur. Creadores tech/motor hacen el primer viaje 100% eléctrico cargando en la ruta.",
      "La objeción #1 del EV es “no llego”. La derribamos en vivo: un viaje real cargando solo en Voltex, con datos de tiempo y costo.",
      "Hacemos del futuro algo concreto y cercano: Copec no habla de electromovilidad, la demuestra en la carretera.",
    ],
    ideasPool: [
      "“Crucé Chile en auto eléctrico solo con Voltex”",
      "Mito vs. dato: ¿se puede viajar en EV en Chile?",
      "Cuánto cuesta y cuánto demora cargar en la ruta",
      "Día 1 con auto eléctrico: lo bueno y lo incómodo",
      "Mapa de cargadores Voltex de norte a sur",
      "Respondiendo sus dudas sobre autos eléctricos",
    ],
  },
  x6: {
    titulos: ["El reto de la ruta", "La cofradía de la ruta", "Un viaje, una épica"],
    rationales: [
      "Replicar la fórmula que ya funcionó: libertad creativa total a creadores virales para inventar un reto/serie meme-able alrededor de la ruta. Alto riesgo/alto retorno, con disclaimers de publicidad bien resueltos.",
      "Apostamos a un código cultural propio: un gesto o reto tan específico que la gente lo duetea y lo hace suyo.",
      "Menos guion, más creador: confiamos en el talento (como en Copec Pay) para que la marca se vuelva conversación, no aviso.",
    ],
    ideasPool: [
      "Reto “la parada perfecta” con coreografía duetable",
      "Falso documental: “la cofradía de los que solo paran en Copec”",
      "Serie absurda: un viaje narrado como épica",
      "POV: eres el GPS y solo recomiendas Copec",
      "El trend del “sonido de la ruta”",
      "Trailer épico para un viaje cualquiera",
    ],
  },
};

/* ---------- Cadenas de razonamiento ---------- */
export const pasosCompetencia = [
  "Rastreando la conversación del rubro (90 días)…",
  "Mapeando a Aramco, Shell/upa! y Oxxo…",
  "Midiendo share of voice y territorios…",
  "Detectando a Aramco creciendo agresivo en la Ruta 5…",
  "Buscando el espacio en blanco para Copec…",
];
export const pasosBrief = [
  "Leyendo el brief de campaña…",
  "Extrayendo objetivos, tono y restricciones…",
  "Cruzando con casos previos de Copec (Pay, Voltex)…",
  "Alineando KPIs con la temporada de viajes…",
];
export const pasosTranscripcion = [
  "Transcribiendo la reunión…",
  "Detectando hablantes y temas…",
  "Extrayendo insights y frases clave del cliente…",
  "Marcando sensibilidades (transparencia / SERNAC)…",
  "Priorizando por impacto en la estrategia…",
];
export const pasosConcepto = [
  "Sintetizando ingesta + insights…",
  "Explorando territorios creativos…",
  "Cruzando tendencias en alza…",
  "Recuperando aprendizajes de campañas pasadas…",
  "Agrupando arquetipos y moods de creadores…",
  "Redactando rationales e ideas de contenido…",
  "Proyectando alcance, engagement y riesgo…",
];

export const insightsReunion = [
  { id: "r1", texto: "Quieren defender el liderazgo en la Ruta 5; Aramco está creciendo rápido y preocupa.", tag: "posicionamiento" },
  { id: "r2", texto: "El foco real es que la gente use la App Copec en el viaje (pago + beneficios), no solo cargar bencina.", tag: "objetivo" },
  { id: "r3", texto: "Temen sonar corporativos; admiran lo que logró la campaña con libertad creativa.", tag: "tono" },
  { id: "r4", texto: "Hay sensibilidad con transparencia tras el tema SERNAC: todo debe ir declarado como publicidad.", tag: "riesgo" },
  { id: "r5", texto: "El verano concentra el tráfico; quieren estar donde la gente planifica sus viajes.", tag: "timing" },
  { id: "r6", texto: "Les inquieta el “rinde más” de Shell y la percepción de precio; sienten que la marca está golpeada.", tag: "crisis" },
];

/* ---------- helpers ---------- */
export function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1) + "M";
  if (n >= 1_000) return Math.round(n / 1000) + "K";
  return String(n);
}

/* dinero en pesos chilenos (CLP) — compacto: $30M, $14,9M, $850K */
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
