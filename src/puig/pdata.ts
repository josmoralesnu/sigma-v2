/* ============================================================
   PUIG — data del demo (multi-submarca, microinfluencers, canjes)
   Autocontenida: no depende de los live bindings de lib/data.ts.
   Todo es mock para el demo interno de Waller & Kluger.
   ============================================================ */

/* ---------- Submarcas ---------- */
export interface Submarca {
  id: string;
  nombre: string;
  linea: string;          // línea/producto insignia
  categoria: "Fragancia" | "Beauty";
  glyph: string;          // monograma (fallback)
  logo: string;           // logo oficial (sobre chip claro)
  tint: string;           // color de acento propio de la submarca (hex)
}
export const submarcas: Submarca[] = [
  { id: "ch",      nombre: "Carolina Herrera",   linea: "Good Girl · 212",        categoria: "Fragancia", glyph: "CH",  logo: "/sub-ch.png",      tint: "#c9a24b" },
  { id: "rabanne", nombre: "Rabanne",            linea: "1 Million · Phantom",    categoria: "Fragancia", glyph: "Rb",  logo: "/sub-rabanne.svg", tint: "#b07a3c" },
  { id: "jpg",     nombre: "Jean Paul Gaultier", linea: "Le Male · Scandal",      categoria: "Fragancia", glyph: "JPG", logo: "/sub-jpg.png",     tint: "#6f93c4" },
  { id: "ct",      nombre: "Charlotte Tilbury",  linea: "Pillow Talk · Magic Cream", categoria: "Beauty", glyph: "CT",  logo: "/sub-ct.png",      tint: "#d1859c" },
];
export const submarcaById = (id: string) => submarcas.find((s) => s.id === id);

/* ---------- Campañas (condensan muchos microinfluencers) ---------- */
export type CampañaEstado = "Activa" | "En casting" | "En envío" | "Cerrada";
export interface PCampaña {
  id: string;
  submarca: string;        // submarca.id
  nombre: string;
  producto: string;
  estado: CampañaEstado;
  microinfluencers: number;   // total del squad
  seleccionados: number;      // ya confirmados
  alcance: number;            // alcance agregado estimado
  engagement: number;         // ER promedio del squad
  contenidos: number;         // piezas producidas
  canjesEnviados: number;
  canjesTotal: number;
  ventana: string;
  progreso: number;           // 0-100
}
export const pcampañas: PCampaña[] = [
  { id: "cmp-ch1",  submarca: "ch",      nombre: "Good Girl · Squad Verano", producto: "Good Girl Blush EDP", estado: "Activa",    microinfluencers: 38, seleccionados: 38, alcance: 1_420_000, engagement: 6.8, contenidos: 96,  canjesEnviados: 34, canjesTotal: 38, ventana: "Ene–Abr", progreso: 72 },
  { id: "cmp-ch2",  submarca: "ch",      nombre: "212 VIP · Noche",          producto: "212 VIP Rosé",       estado: "En casting", microinfluencers: 24, seleccionados: 11, alcance: 0,         engagement: 0,   contenidos: 0,   canjesEnviados: 0,  canjesTotal: 24, ventana: "Mar–May", progreso: 22 },
  { id: "cmp-rb1",  submarca: "rabanne", nombre: "1 Million · Seeding masivo", producto: "1 Million Parfum",  estado: "En envío",  microinfluencers: 52, seleccionados: 52, alcance: 980_000,   engagement: 5.9, contenidos: 61,  canjesEnviados: 40, canjesTotal: 52, ventana: "Feb–Mar", progreso: 54 },
  { id: "cmp-rb2",  submarca: "rabanne", nombre: "Phantom · Gamers",         producto: "Phantom EDT",        estado: "Activa",    microinfluencers: 29, seleccionados: 29, alcance: 760_000,   engagement: 7.2, contenidos: 48,  canjesEnviados: 29, canjesTotal: 29, ventana: "Ene–Feb", progreso: 81 },
  { id: "cmp-jpg1", submarca: "jpg",     nombre: "Le Male · Icónico",        producto: "Le Male Elixir",     estado: "Activa",    microinfluencers: 21, seleccionados: 21, alcance: 540_000,   engagement: 6.1, contenidos: 33,  canjesEnviados: 19, canjesTotal: 21, ventana: "Ene–Mar", progreso: 64 },
  { id: "cmp-ct1",  submarca: "ct",      nombre: "Pillow Talk · Beauty Squad", producto: "Pillow Talk Lip Kit", estado: "Activa",  microinfluencers: 44, seleccionados: 44, alcance: 1_180_000, engagement: 7.6, contenidos: 112, canjesEnviados: 41, canjesTotal: 44, ventana: "Ene–Mar", progreso: 78 },
  { id: "cmp-ct2",  submarca: "ct",      nombre: "Magic Cream · Skincare",   producto: "Magic Cream 50ml",   estado: "En casting", microinfluencers: 30, seleccionados: 7,  alcance: 0,         engagement: 0,   contenidos: 0,   canjesEnviados: 0,  canjesTotal: 30, ventana: "Abr–Jun", progreso: 12 },
  // campañas pasadas (cerradas) — ocultas por defecto
  { id: "cmp-ch0",  submarca: "ch",      nombre: "212 VIP · Primavera",      producto: "212 VIP",           estado: "Cerrada",    microinfluencers: 30, seleccionados: 30, alcance: 1_050_000, engagement: 6.2, contenidos: 74,  canjesEnviados: 30, canjesTotal: 30, ventana: "Sep–Nov 25", progreso: 100 },
  { id: "cmp-rb0",  submarca: "rabanne", nombre: "Invictus · Relanzamiento", producto: "Invictus Parfum",   estado: "Cerrada",    microinfluencers: 36, seleccionados: 36, alcance: 820_000,   engagement: 5.4, contenidos: 58,  canjesEnviados: 36, canjesTotal: 36, ventana: "Oct–Dic 25", progreso: 100 },
];
export const campañasDeSubmarca = (id: string) => pcampañas.filter((c) => c.submarca === id);
/* una campaña está "abierta" si no está cerrada ni con despacho 100% completo */
export const campañaAbierta = (c: PCampaña) => c.estado !== "Cerrada" && !(c.canjesTotal > 0 && c.canjesEnviados >= c.canjesTotal);

/* ---------- Casting (pool de microinfluencers) ---------- */
export type Zona = "RM" | "Regiones";
export interface Casting {
  id: string;
  nombre: string;
  handle: string;
  avatar: string;          // emoji placeholder de foto de perfil
  fotoTint: string;        // color de fondo del avatar
  seguidores: number;
  engagement: number;      // %
  edadAudiencia: string;   // rango principal, ej "18–24"
  generoF: number;         // % audiencia femenina (0-100) → género principal se deriva
  categoria: string;       // vertical de contenido
  ciudad: string;
  region: string;
  zona: Zona;
  fit: number;             // % afinidad con la submarca
}
export const generoPrincipal = (c: Casting) =>
  c.generoF >= 50
    ? { label: "Mujeres", pct: c.generoF }
    : { label: "Hombres", pct: 100 - c.generoF };

export const castingPool: Casting[] = [
  { id: "p01", nombre: "Javiera Rojas",   handle: "@javi.beauty",     avatar: "💄", fotoTint: "#c9a24b", seguidores: 42_300, engagement: 6.4, edadAudiencia: "18–24", generoF: 88, categoria: "Beauty",     ciudad: "Santiago",     region: "Metropolitana", zona: "RM",        fit: 94 },
  { id: "p02", nombre: "Catalina Soto",   handle: "@cata.skincl",     avatar: "🧴", fotoTint: "#d1859c", seguidores: 28_100, engagement: 7.1, edadAudiencia: "25–34", generoF: 81, categoria: "Skincare",   ciudad: "Viña del Mar", region: "Valparaíso",    zona: "Regiones",  fit: 90 },
  { id: "p03", nombre: "Fernanda Díaz",   handle: "@fenya.perfumes",  avatar: "🌸", fotoTint: "#b07a3c", seguidores: 18_500, engagement: 8.3, edadAudiencia: "18–24", generoF: 74, categoria: "Fragancia",  ciudad: "Concepción",   region: "Biobío",        zona: "Regiones",  fit: 96 },
  { id: "p04", nombre: "Daniela Vera",    handle: "@dani.grwm",       avatar: "✨", fotoTint: "#c9a24b", seguidores: 63_000, engagement: 5.2, edadAudiencia: "18–24", generoF: 79, categoria: "GRWM",       ciudad: "Santiago",     region: "Metropolitana", zona: "RM",        fit: 88 },
  { id: "p05", nombre: "Trinidad Miranda",handle: "@trini.mua",       avatar: "🎨", fotoTint: "#d1859c", seguidores: 9_800,  engagement: 9.1, edadAudiencia: "25–34", generoF: 92, categoria: "Maquillaje",  ciudad: "La Serena",    region: "Coquimbo",      zona: "Regiones",  fit: 89 },
  { id: "p06", nombre: "Martín Herrera",  handle: "@tincho.fragances",avatar: "🧔", fotoTint: "#6f93c4", seguidores: 34_600, engagement: 5.8, edadAudiencia: "25–34", generoF: 22, categoria: "Fragancia M", ciudad: "Santiago",     region: "Metropolitana", zona: "RM",        fit: 87 },
  { id: "p07", nombre: "Antonia Fuentes", handle: "@anto.glow",       avatar: "💫", fotoTint: "#c9a24b", seguidores: 51_200, engagement: 6.0, edadAudiencia: "18–24", generoF: 85, categoria: "Beauty",     ciudad: "Temuco",       region: "Araucanía",     zona: "Regiones",  fit: 85 },
  { id: "p08", nombre: "Rocío Pino",      handle: "@rocio.makeup",    avatar: "💋", fotoTint: "#d1859c", seguidores: 7_400,  engagement: 10.2,edadAudiencia: "25–34", generoF: 90, categoria: "Maquillaje",  ciudad: "Rancagua",     region: "O'Higgins",     zona: "Regiones",  fit: 91 },
  { id: "p09", nombre: "Ignacio Bravo",   handle: "@nacho.scent",     avatar: "🧑", fotoTint: "#6f93c4", seguidores: 22_900, engagement: 6.7, edadAudiencia: "18–24", generoF: 31, categoria: "Fragancia M", ciudad: "Santiago",     region: "Metropolitana", zona: "RM",        fit: 83 },
  { id: "p10", nombre: "Valentina Cortés",handle: "@vale.cosmetics",  avatar: "🌷", fotoTint: "#c9a24b", seguidores: 39_800, engagement: 5.5, edadAudiencia: "25–34", generoF: 83, categoria: "Beauty",     ciudad: "Antofagasta",  region: "Antofagasta",   zona: "Regiones",  fit: 82 },
  { id: "p11", nombre: "Camila Reyes",    handle: "@cami.getready",   avatar: "🪞", fotoTint: "#d1859c", seguidores: 15_300, engagement: 8.0, edadAudiencia: "18–24", generoF: 87, categoria: "GRWM",       ciudad: "Providencia",  region: "Metropolitana", zona: "RM",        fit: 90 },
  { id: "p12", nombre: "Sofía Navarro",   handle: "@sofi.aroma",      avatar: "🌹", fotoTint: "#b07a3c", seguidores: 11_600, engagement: 8.9, edadAudiencia: "25–34", generoF: 78, categoria: "Fragancia",  ciudad: "Valdivia",     region: "Los Ríos",      zona: "Regiones",  fit: 88 },
  { id: "p13", nombre: "Josefa Lagos",    handle: "@jose.beautycl",   avatar: "🦋", fotoTint: "#c9a24b", seguidores: 47_000, engagement: 5.9, edadAudiencia: "18–24", generoF: 82, categoria: "Beauty",     ciudad: "Las Condes",   region: "Metropolitana", zona: "RM",        fit: 86 },
  { id: "p14", nombre: "Benjamín Rivas",  handle: "@benja.notes",     avatar: "🧢", fotoTint: "#6f93c4", seguidores: 26_400, engagement: 6.3, edadAudiencia: "18–24", generoF: 28, categoria: "Fragancia M", ciudad: "Puerto Montt", region: "Los Lagos",     zona: "Regiones",  fit: 84 },
  { id: "p15", nombre: "Isidora Peña",    handle: "@isi.skinroutine", avatar: "🧖", fotoTint: "#d1859c", seguidores: 8_900,  engagement: 9.7, edadAudiencia: "25–34", generoF: 88, categoria: "Skincare",   ciudad: "Ñuñoa",        region: "Metropolitana", zona: "RM",        fit: 92 },
  { id: "p16", nombre: "Florencia Muñoz", handle: "@flor.makeuplab",  avatar: "🌺", fotoTint: "#c9a24b", seguidores: 33_100, engagement: 6.6, edadAudiencia: "18–24", generoF: 84, categoria: "Maquillaje",  ciudad: "Iquique",      region: "Tarapacá",      zona: "Regiones",  fit: 81 },
];

/* ---------- Canjes / seeding (envíos de producto) ---------- */
export type EnvioEstado = "Pendiente" | "Preparando" | "Despachado" | "En tránsito" | "Entregado" | "Publicado";
export const ENVIO_FLOW: EnvioEstado[] = ["Pendiente", "Preparando", "Despachado", "En tránsito", "Entregado", "Publicado"];
export const ENVIO_META: Record<EnvioEstado, { tint: string; label: string }> = {
  "Pendiente":  { tint: "#8b8b93", label: "Pendiente" },
  "Preparando": { tint: "#c79a52", label: "Preparando" },
  "Despachado": { tint: "#d99a4e", label: "Despachado" },
  "En tránsito":{ tint: "#6f93c4", label: "En tránsito" },
  "Entregado":  { tint: "#86b04a", label: "Entregado" },
  "Publicado":  { tint: "#c9a24b", label: "Publicado ✦" },
};

export interface Canje {
  id: string;
  castingId: string;
  nombre: string;
  handle: string;
  avatar: string;
  fotoTint: string;
  submarca: string;   // submarca.id
  producto: string;
  estado: EnvioEstado;
  comuna: string;
  region: string;
  zona: Zona;
  courier: string;
  tracking: string;
  fecha: string;      // fecha de despacho / actualización
}
export const canjes: Canje[] = [
  { id: "e01", castingId: "p01", nombre: "Javiera Rojas",    handle: "@javi.beauty",    avatar: "💄", fotoTint: "#c9a24b", submarca: "ch",      producto: "Good Girl Blush EDP", estado: "Publicado",  comuna: "Providencia",  region: "Metropolitana", zona: "RM",       courier: "Blue Express", tracking: "BX-48213", fecha: "12 Feb" },
  { id: "e02", castingId: "p04", nombre: "Daniela Vera",     handle: "@dani.grwm",      avatar: "✨", fotoTint: "#c9a24b", submarca: "ch",      producto: "Good Girl Blush EDP", estado: "Entregado",  comuna: "Las Condes",   region: "Metropolitana", zona: "RM",       courier: "Blue Express", tracking: "BX-48219", fecha: "13 Feb" },
  { id: "e03", castingId: "p13", nombre: "Josefa Lagos",     handle: "@jose.beautycl",  avatar: "🦋", fotoTint: "#c9a24b", submarca: "ch",      producto: "212 VIP Rosé",        estado: "En tránsito",comuna: "Las Condes",   region: "Metropolitana", zona: "RM",       courier: "Chilexpress",  tracking: "CX-77104", fecha: "18 Feb" },
  { id: "e04", castingId: "p11", nombre: "Camila Reyes",     handle: "@cami.getready",  avatar: "🪞", fotoTint: "#d1859c", submarca: "ct",      producto: "Pillow Talk Lip Kit", estado: "Publicado",  comuna: "Providencia",  region: "Metropolitana", zona: "RM",       courier: "Blue Express", tracking: "BX-48301", fecha: "10 Feb" },
  { id: "e05", castingId: "p15", nombre: "Isidora Peña",     handle: "@isi.skinroutine",avatar: "🧖", fotoTint: "#d1859c", submarca: "ct",      producto: "Magic Cream 50ml",    estado: "Entregado",  comuna: "Ñuñoa",        region: "Metropolitana", zona: "RM",       courier: "Chilexpress",  tracking: "CX-77132", fecha: "14 Feb" },
  { id: "e06", castingId: "p06", nombre: "Martín Herrera",   handle: "@tincho.fragances",avatar:"🧔", fotoTint: "#6f93c4", submarca: "jpg",     producto: "Le Male Elixir",      estado: "Despachado", comuna: "Santiago",     region: "Metropolitana", zona: "RM",       courier: "Starken",      tracking: "ST-20544", fecha: "19 Feb" },
  { id: "e07", castingId: "p09", nombre: "Ignacio Bravo",    handle: "@nacho.scent",    avatar: "🧑", fotoTint: "#6f93c4", submarca: "rabanne", producto: "1 Million Parfum",    estado: "Preparando", comuna: "Maipú",        region: "Metropolitana", zona: "RM",       courier: "Starken",      tracking: "ST-20560", fecha: "20 Feb" },
  { id: "e08", castingId: "p02", nombre: "Catalina Soto",    handle: "@cata.skincl",    avatar: "🧴", fotoTint: "#d1859c", submarca: "ct",      producto: "Magic Cream 50ml",    estado: "Entregado",  comuna: "Viña del Mar", region: "Valparaíso",    zona: "Regiones", courier: "Chilexpress",  tracking: "CX-77201", fecha: "13 Feb" },
  { id: "e09", castingId: "p03", nombre: "Fernanda Díaz",    handle: "@fenya.perfumes", avatar: "🌸", fotoTint: "#b07a3c", submarca: "rabanne", producto: "1 Million Parfum",    estado: "En tránsito",comuna: "Concepción",   region: "Biobío",        zona: "Regiones", courier: "Starken",      tracking: "ST-20588", fecha: "18 Feb" },
  { id: "e10", castingId: "p05", nombre: "Trinidad Miranda", handle: "@trini.mua",      avatar: "🎨", fotoTint: "#d1859c", submarca: "ct",      producto: "Pillow Talk Lip Kit", estado: "Despachado", comuna: "La Serena",    region: "Coquimbo",      zona: "Regiones", courier: "Blue Express", tracking: "BX-48412", fecha: "19 Feb" },
  { id: "e11", castingId: "p07", nombre: "Antonia Fuentes",  handle: "@anto.glow",      avatar: "💫", fotoTint: "#c9a24b", submarca: "ch",      producto: "Good Girl Blush EDP", estado: "En tránsito",comuna: "Temuco",       region: "Araucanía",     zona: "Regiones", courier: "Starken",      tracking: "ST-20601", fecha: "18 Feb" },
  { id: "e12", castingId: "p08", nombre: "Rocío Pino",       handle: "@rocio.makeup",   avatar: "💋", fotoTint: "#d1859c", submarca: "ct",      producto: "Pillow Talk Lip Kit", estado: "Entregado",  comuna: "Rancagua",     region: "O'Higgins",     zona: "Regiones", courier: "Chilexpress",  tracking: "CX-77245", fecha: "12 Feb" },
  { id: "e13", castingId: "p10", nombre: "Valentina Cortés", handle: "@vale.cosmetics", avatar: "🌷", fotoTint: "#c9a24b", submarca: "rabanne", producto: "Phantom EDT",         estado: "Despachado", comuna: "Antofagasta",  region: "Antofagasta",   zona: "Regiones", courier: "Starken",      tracking: "ST-20633", fecha: "20 Feb" },
  { id: "e14", castingId: "p12", nombre: "Sofía Navarro",    handle: "@sofi.aroma",     avatar: "🌹", fotoTint: "#b07a3c", submarca: "rabanne", producto: "1 Million Parfum",    estado: "Preparando", comuna: "Valdivia",     region: "Los Ríos",      zona: "Regiones", courier: "Starken",      tracking: "ST-20641", fecha: "21 Feb" },
  { id: "e15", castingId: "p14", nombre: "Benjamín Rivas",   handle: "@benja.notes",    avatar: "🧢", fotoTint: "#6f93c4", submarca: "jpg",     producto: "Le Male Elixir",      estado: "Pendiente",  comuna: "Puerto Montt", region: "Los Lagos",     zona: "Regiones", courier: "—",            tracking: "—",        fecha: "—" },
  { id: "e16", castingId: "p16", nombre: "Florencia Muñoz",  handle: "@flor.makeuplab", avatar: "🌺", fotoTint: "#c9a24b", submarca: "ch",      producto: "Good Girl Blush EDP", estado: "En tránsito",comuna: "Iquique",      region: "Tarapacá",      zona: "Regiones", courier: "Blue Express", tracking: "BX-48501", fecha: "19 Feb" },
  { id: "e17", castingId: "p01", nombre: "Javiera Rojas",    handle: "@javi.beauty",    avatar: "💄", fotoTint: "#c9a24b", submarca: "rabanne", producto: "Phantom EDT",         estado: "Publicado",  comuna: "Providencia",  region: "Metropolitana", zona: "RM",       courier: "Blue Express", tracking: "BX-48540", fecha: "08 Feb" },
  { id: "e18", castingId: "p11", nombre: "Camila Reyes",     handle: "@cami.getready",  avatar: "🪞", fotoTint: "#d1859c", submarca: "ch",      producto: "212 VIP Rosé",        estado: "Entregado",  comuna: "Providencia",  region: "Metropolitana", zona: "RM",       courier: "Chilexpress",  tracking: "CX-77300", fecha: "15 Feb" },
];

/* ---------- Geografía para los mapas ---------- */
/* Regiones de Chile — coordenadas en un lienzo vertical estilizado (viewBox 0 0 120 640).
   No es cartografía exacta: es un "eje norte→sur" diseñado para el demo. */
export interface RegionGeo { label: string; short: string; x: number; y: number }
export const REGION_GEO: Record<string, RegionGeo> = {
  "Tarapacá":      { label: "Tarapacá",       short: "TPCA", x: 62, y: 60 },
  "Antofagasta":   { label: "Antofagasta",    short: "ANTOF", x: 60, y: 120 },
  "Coquimbo":      { label: "Coquimbo",       short: "COQ", x: 58, y: 210 },
  "Valparaíso":    { label: "Valparaíso",     short: "VALPO", x: 54, y: 275 },
  "Metropolitana": { label: "Metropolitana",  short: "RM", x: 60, y: 300 },
  "O'Higgins":     { label: "O'Higgins",      short: "OHIG", x: 58, y: 335 },
  "Biobío":        { label: "Biobío",         short: "BÍO", x: 56, y: 400 },
  "Araucanía":     { label: "Araucanía",      short: "ARAUC", x: 58, y: 445 },
  "Los Ríos":      { label: "Los Ríos",       short: "RÍOS", x: 56, y: 485 },
  "Los Lagos":     { label: "Los Lagos",      short: "LAGOS", x: 60, y: 525 },
};
/* Silueta estilizada de Chile (narrow strip) para el fondo del mapa de regiones. */
export const CHILE_PATH =
  "M64 20 C 52 60, 50 110, 54 160 C 58 210, 46 260, 52 310 C 58 360, 46 410, 54 460 C 60 510, 58 560, 66 612 L 82 612 C 88 560, 84 510, 88 460 C 92 410, 86 360, 90 310 C 94 260, 86 210, 90 160 C 94 110, 88 60, 80 20 Z";

/* Gran Santiago — comunas en un lienzo (viewBox 0 0 340 260). */
export interface ComunaGeo { x: number; y: number }
export const COMUNA_GEO: Record<string, ComunaGeo> = {
  "Vitacura":    { x: 258, y: 66 },
  "Las Condes":  { x: 272, y: 104 },
  "La Reina":    { x: 258, y: 138 },
  "Providencia": { x: 208, y: 116 },
  "Ñuñoa":       { x: 204, y: 150 },
  "Recoleta":    { x: 168, y: 84 },
  "Santiago":    { x: 156, y: 132 },
  "Maipú":       { x: 78,  y: 178 },
  "La Florida":  { x: 226, y: 196 },
  "Puente Alto": { x: 182, y: 224 },
};
/* Blob orgánico del Gran Santiago para el fondo del mapa RM. */
export const RM_BLOB =
  "M60 120 C 40 70, 110 34, 170 40 C 220 45, 300 30, 316 90 C 330 140, 300 190, 250 214 C 200 236, 120 240, 78 210 C 44 186, 40 158, 60 120 Z";

/* ---------- Coordenadas reales (para el mapa Leaflet) ---------- */
/* keyed por comuna/ciudad (canje.comuna). [lat, lng] */
export const LATLNG: Record<string, [number, number]> = {
  // Gran Santiago (RM)
  "Providencia": [-33.4314, -70.6093],
  "Las Condes":  [-33.4085, -70.5676],
  "Ñuñoa":       [-33.4569, -70.5978],
  "Santiago":    [-33.4489, -70.6693],
  "Maipú":       [-33.5110, -70.7580],
  "Vitacura":    [-33.3809, -70.5730],
  "La Reina":    [-33.4450, -70.5360],
  "La Florida":  [-33.5220, -70.5980],
  "Puente Alto": [-33.6110, -70.5760],
  "Recoleta":    [-33.4110, -70.6440],
  // Regiones
  "Viña del Mar":[-33.0246, -71.5518],
  "Concepción":  [-36.8201, -73.0444],
  "La Serena":   [-29.9027, -71.2519],
  "Temuco":      [-38.7359, -72.5904],
  "Rancagua":    [-34.1708, -70.7444],
  "Antofagasta": [-23.6509, -70.3975],
  "Valdivia":    [-39.8142, -73.2459],
  "Puerto Montt":[-41.4693, -72.9424],
  "Iquique":     [-20.2208, -70.1431],
};
export const SANTIAGO: [number, number] = [-33.45, -70.66];
export const CHILE_CENTER: [number, number] = [-35.5, -71.3];

/* ---------- Panel de medición por campaña (derivado) ---------- */
export type Plataforma = "Instagram" | "TikTok" | "Reel";
export interface Contenido {
  id: string; autor: string; handle: string; avatar: string; fotoTint: string;
  plataforma: Plataforma;
  tipo: string; alcance: number; likes: number; saves: number; comentarios: number; er: number;
  fecha: string;   // fecha de publicación (para el calendario)
}
export interface CreatorRow {
  id: string; nombre: string; handle: string; avatar: string; fotoTint: string;
  contenidos: number; alcance: number; engagement: number; er: number;
  costo: number;   // inversión asignada (CLP)
  cpr: number;     // costo por 1.000 de alcance (CLP)
  cpe: number;     // costo por engagement (CLP)
}
export interface SeriePunto { fecha: string; valor: number }
export interface CampañaPanel {
  activo: boolean;
  kpis: { impresiones: number; alcance: number; engagement: number; contenidos: number; emv: number; guardados: number };
  costos: { inversion: number; cpr: number; cpe: number; cpContenido: number; cpGuardado: number };
  serie: SeriePunto[];
  contenidos: Contenido[];          // ordenados por alcance desc
  creators: CreatorRow[];           // tabla de detalle por creador
  sentimiento: { indice: number; tendencia: number; pos: number; neu: number; neg: number; menciones: number };
  temas: { label: string; pct: number; tono: "pos" | "neu" | "neg" }[];
  comentarios: { autor: string; texto: string; tono: "pos" | "neu" | "neg" }[];
  topCreators: { nombre: string; handle: string; avatar: string; fotoTint: string; alcance: number; er: number }[];
}

const CLP_POR_ALCANCE = 12; // EMV mock: ~$12 por persona alcanzada
export const inversionDe = (c: PCampaña) => c.microinfluencers * 420_000; // producto + gestión + fee

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const mesIdx = (v: string) => Math.max(0, MESES.indexOf(v.slice(0, 3).toLowerCase()));
function fechasSemanales(startMonth: number, n: number): string[] {
  const out: string[] = []; let day = 4, m = startMonth;
  for (let i = 0; i < n; i++) { out.push(`${String(day).padStart(2, "0")} ${MESES[m % 12]}`); day += 7; if (day > 28) { day -= 28; m++; } }
  return out;
}
const PLATS: Plataforma[] = ["Reel", "TikTok", "Instagram"];
const TIPOS = ["GRWM", "Unboxing", "Primera impresión", "Get Ready", "Reseña", "Tutorial", "Haul", "ASMR"];

const EMPTY_PANEL: CampañaPanel = {
  activo: false,
  kpis: { impresiones: 0, alcance: 0, engagement: 0, contenidos: 0, emv: 0, guardados: 0 },
  costos: { inversion: 0, cpr: 0, cpe: 0, cpContenido: 0, cpGuardado: 0 },
  serie: [], contenidos: [], creators: [],
  sentimiento: { indice: 0, tendencia: 0, pos: 0, neu: 0, neg: 0, menciones: 0 },
  temas: [], comentarios: [], topCreators: [],
};

export function campañaPanel(c: PCampaña): CampañaPanel {
  if (c.estado === "En casting") return { ...EMPTY_PANEL };
  const inversion = inversionDe(c);
  const nCreators = Math.min(castingPool.length, Math.max(4, Math.round(c.microinfluencers / 4)));
  const creators = castingPool.slice(0, nCreators);
  const pesos = creators.map((_, i) => 1 + ((i * 3) % 5) * 0.35);
  const totalW = pesos.reduce((a, b) => a + b, 0);
  const fechas = fechasSemanales(mesIdx(c.ventana), 8);

  const contenidos: Contenido[] = [];
  const creatorRows: CreatorRow[] = creators.map((cr, i) => {
    const w = pesos[i];
    const alc = Math.round((c.alcance * w) / totalW);
    const er = +(c.engagement * (0.78 + ((i * 5) % 9) / 16)).toFixed(1);
    const nPieces = 2 + (i % 3); // 2–4 piezas por creador
    const eng = Math.round((alc * er) / 100);
    const costo = Math.round((inversion * w) / totalW);
    for (let k = 0; k < nPieces; k++) {
      const pr = Math.round(alc / nPieces);
      const perEr = +(er * (0.9 + (k % 3) * 0.08)).toFixed(1);
      const likes = Math.round((pr * perEr) / 100);
      contenidos.push({
        id: `${c.id}-${cr.id}-${k}`, autor: cr.nombre, handle: cr.handle, avatar: cr.avatar, fotoTint: cr.fotoTint,
        plataforma: PLATS[(i + k) % PLATS.length], tipo: TIPOS[(i * 2 + k) % TIPOS.length],
        alcance: pr, likes, saves: Math.round(likes * 0.22), comentarios: Math.round(likes * 0.08), er: perEr,
        fecha: fechas[(i * 2 + k) % fechas.length],
      });
    }
    return {
      id: cr.id, nombre: cr.nombre, handle: cr.handle, avatar: cr.avatar, fotoTint: cr.fotoTint,
      contenidos: nPieces, alcance: alc, engagement: eng, er, costo,
      cpr: Math.round((costo / Math.max(1, alc)) * 1000),
      cpe: Math.round(costo / Math.max(1, eng)),
    };
  });
  contenidos.sort((a, b) => b.alcance - a.alcance);
  creatorRows.sort((a, b) => b.alcance - a.alcance);

  const alcance = c.alcance;
  const engTotal = creatorRows.reduce((a, r) => a + r.engagement, 0);
  const guardados = Math.round(alcance * 0.04);
  const contenidosN = contenidos.length;
  const indice = 68 + ((c.progreso * 3) % 22);
  const pos = 58 + (c.progreso % 18);
  const neg = 6 + (c.progreso % 6);
  const neu = 100 - pos - neg;

  return {
    activo: true,
    kpis: {
      impresiones: Math.round(alcance * 1.7), alcance, engagement: c.engagement,
      contenidos: contenidosN, emv: Math.round(alcance * CLP_POR_ALCANCE), guardados,
    },
    costos: {
      inversion,
      cpr: Math.round((inversion / alcance) * 1000),
      cpe: Math.round(inversion / Math.max(1, engTotal)),
      cpContenido: Math.round(inversion / Math.max(1, contenidosN)),
      cpGuardado: Math.round(inversion / Math.max(1, guardados)),
    },
    serie: [0.08, 0.2, 0.34, 0.5, 0.66, 0.8, 0.92, 1].map((f, i) => ({ fecha: fechas[i], valor: Math.round(alcance * f) })),
    contenidos,
    creators: creatorRows,
    sentimiento: { indice, tendencia: 4 + (c.progreso % 5), pos, neu, neg, menciones: Math.round(alcance * 0.012) },
    temas: [
      { label: "Aroma / duración", pct: 42, tono: "pos" },
      { label: "Packaging del canje", pct: 28, tono: "pos" },
      { label: "Precio", pct: 18, tono: "neu" },
      { label: "Disponibilidad", pct: 12, tono: "neg" },
    ],
    comentarios: [
      { autor: "@meli.beautycl", texto: "Amé el aroma, me llegó el kit y quedé enamorada 😍", tono: "pos" },
      { autor: "@fran.makeup", texto: "El unboxing venía divino, súper premium el packaging", tono: "pos" },
      { autor: "@usuario_cl", texto: "Se ve lindo pero ¿dónde lo compro? no lo encuentro", tono: "neg" },
      { autor: "@caro.skin", texto: "Buena duración, aunque un poco caro para mi gusto", tono: "neu" },
    ],
    topCreators: creatorRows.slice(0, 3).map((x) => ({ nombre: x.nombre, handle: x.handle, avatar: x.avatar, fotoTint: x.fotoTint, alcance: x.alcance, er: x.er })),
  };
}

/* ---------- Resumen a nivel Puig / submarca (dashboard) ---------- */
export interface SubmarcaAgg {
  id: string; alcance: number; er: number; sentimiento: number;
  campanas: number; contenidos: number; emv: number; micro: number; share: number;
}
export interface PuigResumen {
  alcance: number; impresiones: number; er: number; sentimiento: number; emv: number;
  micro: number; contenidos: number; campanas: number; inversion: number; cpr: number;
  submarcas: SubmarcaAgg[];
  topCreators: { nombre: string; handle: string; avatar: string; fotoTint: string; alcance: number; submarca: string }[];
  topContenidos: Contenido[];
  plataformas: { plat: Plataforma; alcance: number; pct: number }[];
}
export function puigResumen(): PuigResumen {
  const activas = pcampañas.filter((c) => c.alcance > 0);
  const paneles = activas.map((c) => ({ c, p: campañaPanel(c) }));
  const alcance = activas.reduce((a, c) => a + c.alcance, 0);
  const wsum = <T,>(arr: T[], val: (t: T) => number, wt: (t: T) => number) => {
    const w = arr.reduce((a, t) => a + wt(t), 0) || 1;
    return arr.reduce((a, t) => a + val(t) * wt(t), 0) / w;
  };
  const er = wsum(activas, (c) => c.engagement, (c) => c.alcance);
  const sentimiento = wsum(paneles, (x) => x.p.sentimiento.indice, (x) => x.c.alcance);
  const inversion = activas.reduce((a, c) => a + inversionDe(c), 0);

  const submarcas_ = submarcas.map((s) => {
    const cs = activas.filter((c) => c.submarca === s.id);
    const ps = paneles.filter((x) => x.c.submarca === s.id);
    const alc = cs.reduce((a, c) => a + c.alcance, 0);
    return {
      id: s.id, alcance: alc,
      er: +wsum(cs, (c) => c.engagement, (c) => c.alcance).toFixed(1),
      sentimiento: Math.round(wsum(ps, (x) => x.p.sentimiento.indice, (x) => x.c.alcance)),
      campanas: cs.length,
      contenidos: cs.reduce((a, c) => a + c.contenidos, 0),
      emv: Math.round(alc * CLP_POR_ALCANCE),
      micro: cs.reduce((a, c) => a + c.microinfluencers, 0),
      share: alcance ? Math.round((alc / alcance) * 100) : 0,
    };
  }).filter((s) => s.alcance > 0).sort((a, b) => b.alcance - a.alcance);

  // top creators agregados por handle
  const acc = new Map<string, { nombre: string; handle: string; avatar: string; fotoTint: string; alcance: number; submarca: string }>();
  for (const { c, p } of paneles)
    for (const cr of p.creators) {
      const prev = acc.get(cr.handle);
      if (prev) prev.alcance += cr.alcance;
      else acc.set(cr.handle, { nombre: cr.nombre, handle: cr.handle, avatar: cr.avatar, fotoTint: cr.fotoTint, alcance: cr.alcance, submarca: c.submarca });
    }
  const topCreators = [...acc.values()].sort((a, b) => b.alcance - a.alcance).slice(0, 5);

  // top contenidos/piezas destacadas de todo Puig
  const topContenidos = paneles.flatMap((x) => x.p.contenidos).sort((a, b) => b.alcance - a.alcance).slice(0, 4);

  // mezcla de plataformas
  const platAcc = new Map<Plataforma, number>();
  for (const { p } of paneles) for (const ct of p.contenidos) platAcc.set(ct.plataforma, (platAcc.get(ct.plataforma) ?? 0) + ct.alcance);
  const platTotal = [...platAcc.values()].reduce((a, b) => a + b, 0) || 1;
  const plataformas = [...platAcc.entries()].map(([plat, a]) => ({ plat, alcance: a, pct: Math.round((a / platTotal) * 100) })).sort((a, b) => b.alcance - a.alcance);

  return {
    alcance, impresiones: Math.round(alcance * 1.7), er: +er.toFixed(1), sentimiento: Math.round(sentimiento),
    emv: Math.round(alcance * CLP_POR_ALCANCE), micro: pcampañas.filter(campañaAbierta).reduce((a, c) => a + c.microinfluencers, 0),
    contenidos: activas.reduce((a, c) => a + c.contenidos, 0), campanas: activas.length,
    inversion, cpr: Math.round((inversion / (alcance || 1)) * 1000),
    submarcas: submarcas_, topCreators, topContenidos, plataformas,
  };
}

/* ---------- Dashboard general: audiencia, entregables, benchmark, insights ---------- */
export interface Audiencia {
  edad: { rango: string; pct: number }[];
  generoF: number;
  ciudades: { ciudad: string; pct: number }[];
}
export const AUDIENCIA_PUIG: Audiencia = {
  edad: [{ rango: "18–24", pct: 28 }, { rango: "25–34", pct: 41 }, { rango: "35–44", pct: 20 }, { rango: "45+", pct: 11 }],
  generoF: 68,
  ciudades: [{ ciudad: "Santiago", pct: 36 }, { ciudad: "Concepción", pct: 11 }, { ciudad: "Valparaíso", pct: 8 }, { ciudad: "Antofagasta", pct: 5 }, { ciudad: "Temuco", pct: 4 }],
};

/* Audiencia como ROLLUP real de todos los microinfluencers del pool,
   ponderado por seguidores. Cada influencer aporta su bracket principal
   expandido a una distribución (bracket dominante + adyacentes). */
const EDAD_BRACKETS = ["18–24", "25–34", "35–44", "45+"];
const EDAD_PERFIL: Record<string, number[]> = {
  "18–24": [0.60, 0.28, 0.09, 0.03],
  "25–34": [0.22, 0.55, 0.18, 0.05],
  "35–44": [0.08, 0.30, 0.45, 0.17],
};
export function audienciaRollup(): Audiencia {
  const edadAcc = [0, 0, 0, 0];
  let generoAcc = 0, total = 0;
  const ciudadAcc = new Map<string, number>();
  for (const c of castingPool) {
    const w = c.seguidores;
    total += w;
    generoAcc += c.generoF * w;
    const perfil = EDAD_PERFIL[c.edadAudiencia] ?? EDAD_PERFIL["25–34"];
    perfil.forEach((f, i) => (edadAcc[i] += f * w));
    ciudadAcc.set(c.ciudad, (ciudadAcc.get(c.ciudad) ?? 0) + w);
  }
  const edadTot = edadAcc.reduce((a, b) => a + b, 0) || 1;
  const edad = EDAD_BRACKETS.map((rango, i) => ({ rango, pct: Math.round((edadAcc[i] / edadTot) * 100) }));
  const ciudades = [...ciudadAcc.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([ciudad, w]) => ({ ciudad, pct: Math.round((w / total) * 100) }));
  return { edad, generoF: Math.round(generoAcc / (total || 1)), ciudades };
}

/* Análisis macro de sentimiento a nivel Puig (todas las campañas). */
export interface SentDriver { label: string; pct: number; tono: "pos" | "neg" }
export interface SentimientoMacro {
  indice: number; pos: number; neu: number; neg: number; menciones: number; tendencia: number;
  porSubmarca: { id: string; indice: number; menciones: number }[];
  drivers: SentDriver[];
  serie: number[];
  insights: string[];
}
export function sentimientoMacro(): SentimientoMacro {
  const activas = pcampañas.filter((c) => c.alcance > 0);
  const paneles = activas.map((c) => ({ c, p: campañaPanel(c) }));
  const wA = activas.reduce((a, c) => a + c.alcance, 0) || 1;
  const wavg = (f: (x: { c: PCampaña; p: CampañaPanel }) => number) => Math.round(paneles.reduce((a, x) => a + f(x) * x.c.alcance, 0) / wA);
  const indice = wavg((x) => x.p.sentimiento.indice);
  const pos = wavg((x) => x.p.sentimiento.pos);
  const neg = wavg((x) => x.p.sentimiento.neg);
  const menciones = paneles.reduce((a, x) => a + x.p.sentimiento.menciones, 0);
  const porSubmarca = submarcas.map((s) => {
    const ps = paneles.filter((x) => x.c.submarca === s.id);
    if (ps.length === 0) return null;
    const w = ps.reduce((a, x) => a + x.c.alcance, 0) || 1;
    return { id: s.id, indice: Math.round(ps.reduce((a, x) => a + x.p.sentimiento.indice * x.c.alcance, 0) / w), menciones: ps.reduce((a, x) => a + x.p.sentimiento.menciones, 0) };
  }).filter(Boolean) as { id: string; indice: number; menciones: number }[];
  return {
    indice, pos, neg, neu: 100 - pos - neg, menciones, tendencia: 5,
    porSubmarca: porSubmarca.sort((a, b) => b.indice - a.indice),
    drivers: [
      { label: "Aroma / duración", pct: 38, tono: "pos" },
      { label: "Packaging / unboxing", pct: 26, tono: "pos" },
      { label: "Experiencia del canje", pct: 14, tono: "pos" },
      { label: "Precio", pct: 14, tono: "neg" },
      { label: "Disponibilidad / stock", pct: 8, tono: "neg" },
    ],
    serie: [72, 74, 76, 79, 80, 82, 81, indice],
    insights: [
      "El **aroma y la duración** son el driver transversal de recomendación en las 4 submarcas.",
      "**Charlotte Tilbury** lidera el índice de sentimiento (beauty), impulsada por el unboxing del kit.",
      "El ruido negativo se concentra en **precio y disponibilidad**: sumar links de compra y stock en bio.",
      "El **packaging del seeding** genera conversación positiva espontánea — mantenerlo premium.",
    ],
  };
}

export interface Entregables { brief: number; aprobados: number; publicados: number; pendientes: number }
export function entregablesPuig(): Entregables {
  const activas = pcampañas.filter((c) => c.alcance > 0);
  const publicados = activas.reduce((a, c) => a + c.contenidos, 0);
  const aprobados = activas.reduce((a, c) => a + c.seleccionados, 0);
  const brief = pcampañas.filter(campañaAbierta).length + 20;
  const pendientes = pcampañas.reduce((a, c) => a + Math.max(0, c.canjesTotal - c.canjesEnviados), 0);
  return { brief, aprobados, publicados, pendientes };
}

export interface BenchItem { key: string; label: string; delta: number; up: boolean; bueno: boolean }
export const BENCHMARK_PUIG: BenchItem[] = [
  { key: "alcance", label: "Alcance", delta: 18.2, up: true, bueno: true },
  { key: "er", label: "ER prom.", delta: 0.7, up: true, bueno: true },
  { key: "emv", label: "EMV", delta: 22.4, up: true, bueno: true },
  { key: "cpe", label: "CPE", delta: 7.6, up: false, bueno: true },
  { key: "sent", label: "Sentimiento", delta: 6.0, up: true, bueno: true },
];
export const INSIGHTS_PUIG: string[] = [
  "Los **Reels generaron 2.4x más engagement** que el feed. Priorizar ese formato en próximas campañas.",
  "Los **creadores top 5 aportan el 42% del EMV** total. Evaluar expansión de colaboraciones a largo plazo.",
  "**Carolina Herrera y Rabanne** concentran el 75% del alcance; **Charlotte Tilbury** crece en engagement (7.6%).",
  "Mejorar el uso de **CTAs en TikTok** para subir la tasa de clics (actual: 1.1%).",
];

/* ---------- Despacho por campaña (vista de seeding por campaña) ---------- */
export interface CampDespacho {
  total: number; pendiente: number; preparando: number; enTransito: number; entregado: number; publicado: number;
  pctEntregado: number; pctPublicado: number; tiempoProm: number;
  regiones: { region: string; n: number; pct: number }[];
  recientes: { handle: string; avatar: string; fotoTint: string; estado: EnvioEstado; region: string; fecha: string }[];
}
export function campDespacho(c: PCampaña): CampDespacho {
  const total = c.canjesTotal || c.microinfluencers;
  const enviados = c.canjesEnviados;
  const entregado = Math.round(enviados * 0.62);
  const enTransito = Math.round(enviados * 0.2);
  const preparando = Math.max(0, enviados - entregado - enTransito);
  const pendiente = Math.max(0, total - enviados);
  const publicado = Math.round(entregado * 0.55);
  // regiones desde los canjes de la submarca (o distribución por defecto)
  const rows = canjes.filter((x) => x.submarca === c.submarca);
  const rc = new Map<string, number>();
  for (const r of rows) rc.set(r.region, (rc.get(r.region) ?? 0) + 1);
  let regiones = [...rc.entries()].map(([region, n]) => ({ region, n })).sort((a, b) => b.n - a.n);
  if (regiones.length === 0) regiones = [{ region: "Metropolitana", n: 5 }, { region: "Valparaíso", n: 2 }, { region: "Biobío", n: 1 }];
  // escalar a 'entregado'
  const rtot = regiones.reduce((a, r) => a + r.n, 0) || 1;
  const regionesScaled = regiones.slice(0, 4).map((r) => ({ region: r.region, n: Math.max(1, Math.round((r.n / rtot) * entregado)), pct: Math.round((r.n / rtot) * 100) }));
  const recientes = rows.slice(0, 5).map((r) => ({ handle: r.handle, avatar: r.avatar, fotoTint: r.fotoTint, estado: r.estado, region: r.region, fecha: r.fecha }));
  return {
    total, pendiente, preparando, enTransito, entregado, publicado,
    pctEntregado: Math.round((entregado / (total || 1)) * 100),
    pctPublicado: entregado ? Math.round((publicado / entregado) * 100) : 0,
    tiempoProm: 2.4 + (c.progreso % 5) / 10,
    regiones: regionesScaled, recientes,
  };
}

/* ---------- Documentos de la campaña ---------- */
export type DocTipo = "Cotización" | "Factura" | "Guion" | "Brief" | "Reporte";
export interface DocItem { id: string; nombre: string; tipo: DocTipo; peso: string; fecha: string }
export function seedDocs(c: PCampaña): DocItem[] {
  return [
    { id: `${c.id}-d1`, nombre: `Cotización ${c.nombre}.pdf`, tipo: "Cotización", peso: "248 KB", fecha: "02 ene" },
    { id: `${c.id}-d2`, nombre: `Brief creativo ${c.producto}.pdf`, tipo: "Brief", peso: "1.2 MB", fecha: "05 ene" },
    { id: `${c.id}-d3`, nombre: `Guion GRWM squad.docx`, tipo: "Guion", peso: "86 KB", fecha: "11 ene" },
    { id: `${c.id}-d4`, nombre: `Factura 001 · seeding.pdf`, tipo: "Factura", peso: "192 KB", fecha: "20 ene" },
  ];
}

/* perfiles que la agencia propone para el casting de una campaña */
export const candidatosDe = (_campId: string): Casting[] => castingPool;

/* ---------- helpers de formato ---------- */
export const fmtK = (n: number) =>
  n >= 1_000_000 ? (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1) + "M"
  : n >= 1_000 ? (n / 1_000).toFixed(n >= 100_000 ? 0 : 1).replace(".0", "") + "K"
  : String(n);
