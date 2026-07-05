import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sprout, FileDown, Sparkles, TrendingUp, Users, Heart, Bookmark, Share2,
  MessageCircle, UserPlus, Leaf, Megaphone, Eye, Globe, Star, Wand2, Send, X,
} from "lucide-react";
import { Wrap, PageHeader, Chip, card, container, item } from "./parts";
import { organico, short, ventana, type OrganicoData, type OrgFuente } from "./panel";
import { cliente } from "../lib/data";
import { ConfProvider, Conf, ConfToggle } from "./confid";
import { platMeta } from "./plataformas";

const KPI_ICON: Record<string, any> = {
  alcance: Users, engagement: Heart, saves: Bookmark, seguidores: UserPlus,
};

/* curva de seguidores ganados (área SVG animada, acento de marca) */
function CurvaSeguidores({ fechas, puntos }: { fechas: string[]; puntos: number[] }) {
  const max = Math.max(...puntos) * 1.08 || 1;
  const pts = puntos.map((v, i) => [(i / (puntos.length - 1)) * 100, 100 - (v / max) * 100] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
  const area = `M0 100 ` + pts.map(([x, y]) => `L${x.toFixed(2)} ${y.toFixed(2)}`).join(" ") + " L100 100 Z";
  const last = pts[pts.length - 1];
  return (
    <div className={`${card} p-5`}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-bold text-ink">Seguidores ganados</h3>
          <p className="text-[11.5px] text-ink-mute">acumulado · atribuible a la colaboración</p>
        </div>
        <Chip>+{short(puntos[puntos.length - 1])}</Chip>
      </div>
      <div className="relative h-[200px] w-full">
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-px w-full bg-[var(--sf-2)]" />)}
        </div>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <linearGradient id="org-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-cyan)" stopOpacity="0.34" />
              <stop offset="100%" stopColor="var(--color-cyan)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path d={area} fill="url(#org-fill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }} />
          <motion.path d={line} fill="none" stroke="var(--color-cyan)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: "easeInOut" }} />
          <motion.circle cx={last[0]} cy={last[1]} r="2.4" fill="var(--color-cyan)" stroke="#0a0a0c" strokeWidth="1" vectorEffect="non-scaling-stroke"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.1, type: "spring", stiffness: 300 }} />
        </svg>
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
          className="absolute rounded-lg bg-[var(--sf-2)] px-2 py-1 text-center ring-1 ring-[var(--ln-2)] backdrop-blur"
          style={{ left: `${last[0]}%`, top: `${last[1]}%`, transform: "translate(-50%,-130%)" }}>
          <div className="font-display text-[13px] font-bold leading-none text-ink"><Conf px={5}>+{short(puntos[puntos.length - 1])}</Conf></div>
          <div className="text-[9px] text-ink-mute">nuevos</div>
        </motion.div>
      </div>
      <div className="mt-2 flex justify-between text-[10.5px] text-ink-mute">
        {fechas.map((f) => <span key={f}>{f}</span>)}
      </div>
    </div>
  );
}

/* split orgánico vs pago — barra apilada + leyenda */
function SplitReach({ organico: org, pago }: { organico: number; pago: number }) {
  return (
    <div className={`${card} p-5`}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-bold text-ink">Orgánico vs. pago</h3>
          <p className="text-[11.5px] text-ink-mute">share del alcance total</p>
        </div>
        <Chip><Leaf size={12} /> {org}% orgánico</Chip>
      </div>

      {/* aro grande del % orgánico */}
      <div className="flex items-center gap-6">
        <div className="relative grid h-32 w-32 shrink-0 place-items-center">
          <svg viewBox="0 0 36 36" className="h-32 w-32 -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3.2" />
            <motion.circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--color-cyan)" strokeWidth="3.2" strokeLinecap="round"
              pathLength={1} initial={{ strokeDashoffset: 1 }} animate={{ strokeDashoffset: 1 - org / 100 }}
              transition={{ duration: 1.1, ease: "easeInOut" }} style={{ strokeDasharray: 1 }} />
          </svg>
          <div className="absolute text-center">
            <div className="font-display text-[26px] font-bold leading-none text-ink"><Conf px={7}>{org}%</Conf></div>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-ink-mute">orgánico</div>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          {[
            { label: "Alcance orgánico", val: org, Icon: Leaf, color: "var(--color-cyan)", nota: "earned · no pago" },
            { label: "Alcance pago", val: pago, Icon: Megaphone, color: "rgba(255,255,255,0.45)", nota: "media impulsada" },
          ].map((r, i) => (
            <div key={r.label}>
              <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
                <span className="inline-flex items-center gap-1.5 font-semibold text-ink-soft"><r.Icon size={13} /> {r.label}</span>
                <span className="font-display font-bold tabular-nums text-ink"><Conf px={5}>{r.val}%</Conf></span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[var(--sf-2)]">
                <motion.div className="h-full rounded-full" style={{ background: r.color }}
                  initial={{ width: 0 }} animate={{ width: `${r.val}%` }} transition={{ duration: 0.9, delay: 0.2 + i * 0.1, ease: "easeOut" }} />
              </div>
              <div className="mt-1 text-[10.5px] text-ink-mute">{r.nota}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-cyan/10 px-2.5 py-1.5 text-[11.5px] font-semibold text-cyan ring-1 ring-cyan/20">
        <TrendingUp size={13} /> {org}% del alcance se logró sin inversión en pauta
      </div>
    </div>
  );
}


/* mini-render de **negrita** dentro de un string */
function Rich({ text }: { text: string }) {
  return <>{text.split("**").map((p, i) => (i % 2 ? <b key={i} className="font-semibold text-ink">{p}</b> : <span key={i}>{p}</span>))}</>;
}

const FUENTE_META = {
  paginas: { Icon: Globe, color: "var(--color-cyan)" },
  propio: { Icon: Star, color: "#8b5cf6" },
} as const;

/* análisis temporal: alcance semanal, páginas vs. propio */
function SerieTemporal({ serie }: { serie: OrganicoData["serie"] }) {
  const n = serie.fechas.length;
  const max = Math.max(...serie.paginas, ...serie.propio) * 1.12 || 1;
  const toPts = (arr: number[]) => arr.map((v, i) => [(i / (n - 1)) * 100, 100 - (v / max) * 100] as const);
  const line = (pts: readonly (readonly [number, number])[]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
  const area = (pts: readonly (readonly [number, number])[]) => `M0 100 ` + pts.map(([x, y]) => `L${x.toFixed(2)} ${y.toFixed(2)}`).join(" ") + " L100 100 Z";
  const pP = toPts(serie.paginas), pO = toPts(serie.propio);
  return (
    <div className={`${card} p-5`}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-bold text-ink">Evolución del orgánico</h3>
          <p className="text-[11.5px] text-ink-mute">alcance semanal · páginas vs. propio</p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-semibold">
          <span className="inline-flex items-center gap-1.5 text-ink-soft"><span className="h-2 w-2 rounded-full" style={{ background: FUENTE_META.paginas.color }} /> Páginas</span>
          <span className="inline-flex items-center gap-1.5 text-ink-soft"><span className="h-2 w-2 rounded-full" style={{ background: FUENTE_META.propio.color }} /> Propio</span>
        </div>
      </div>
      <div className="relative h-[200px] w-full">
        <div className="absolute inset-0 flex flex-col justify-between">{[0, 1, 2, 3].map((i) => <div key={i} className="h-px w-full bg-[var(--sf-2)]" />)}</div>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <linearGradient id="s-pag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={FUENTE_META.paginas.color} stopOpacity="0.28" /><stop offset="100%" stopColor={FUENTE_META.paginas.color} stopOpacity="0" /></linearGradient>
            <linearGradient id="s-pro" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={FUENTE_META.propio.color} stopOpacity="0.24" /><stop offset="100%" stopColor={FUENTE_META.propio.color} stopOpacity="0" /></linearGradient>
          </defs>
          <motion.path d={area(pP)} fill="url(#s-pag)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }} />
          <motion.path d={area(pO)} fill="url(#s-pro)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }} />
          <motion.path d={line(pP)} fill="none" stroke={FUENTE_META.paginas.color} strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: "easeInOut" }} />
          <motion.path d={line(pO)} fill="none" stroke={FUENTE_META.propio.color} strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, delay: 0.15, ease: "easeInOut" }} />
        </svg>
      </div>
      <div className="mt-2 flex justify-between text-[10.5px] text-ink-mute">{serie.fechas.map((f) => <span key={f}>{f}</span>)}</div>
    </div>
  );
}

function FuenteCard({ f }: { f: OrgFuente }) {
  const m = FUENTE_META[f.key];
  const Icon = m.Icon;
  return (
    <motion.div variants={item} className={`${card} p-5`}>
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl ring-1 ring-[var(--ln-1)]" style={{ background: `${m.color}22`, color: m.color }}><Icon size={18} /></span>
          <div>
            <div className="text-[15px] font-bold text-ink">{f.label}</div>
            <div className="text-[11px] text-ink-mute">{f.desc}</div>
          </div>
        </div>
        <span className="rounded-md px-2 py-0.5 text-[12px] font-bold ring-1" style={{ color: m.color, background: `${m.color}18`, borderColor: `${m.color}40` }}>{f.share}%</span>
      </div>
      <div className="grid grid-cols-3 gap-2 border-y border-line py-3 text-center">
        {[["Alcance", short(f.alcance)], ["ER", f.er + "%"], ["Piezas", String(f.piezas)]].map(([l, v]) => (
          <div key={l}><div className="text-[9.5px] uppercase tracking-wide text-ink-mute">{l}</div><div className="mt-0.5 font-display text-[16px] font-bold tabular-nums text-ink"><Conf px={5}>{v}</Conf></div></div>
        ))}
      </div>
      <div className="mt-3">
        <div className="mb-2 text-[10.5px] uppercase tracking-wide text-ink-mute">{f.key === "paginas" ? "Páginas top" : "Cuentas propias"}</div>
        <div className="space-y-1.5">
          {f.ejemplos.map((e) => (
            <div key={e.handle} className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[var(--sf-1)] text-[15px] ring-1 ring-[var(--ln-1)]">{e.avatar}</span>
              <div className="min-w-0 flex-1"><div className="truncate text-[12px] font-semibold text-ink"><Conf px={4}>{e.nombre}</Conf></div><div className="text-[10px] text-ink-mute"><Conf px={3}>{e.handle}</Conf></div></div>
              <div className="shrink-0 text-right"><div className="text-[11.5px] font-bold tabular-nums text-ink"><Conf px={4}>{short(e.alcance)}</Conf></div></div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* Panel "Sigma explica" — insights de IA + chat */
function SigmaExplica({ insights, onClose }: { insights: string[]; onClose: () => void }) {
  const [msgs, setMsgs] = useState<{ role: "user" | "sigma"; text: string }[]>([]);
  const [q, setQ] = useState("");
  const sugeridas = ["¿Conviene más páginas o contenido propio?", "¿Por qué crece el orgánico?", "¿Qué hago la próxima semana?"];
  const responder = (p: string): string => {
    const s = p.toLowerCase();
    if (s.includes("propio") || s.includes("pagina") || s.includes("página") || s.includes("conviene"))
      return "Las páginas te dan volumen barato, pero el contenido propio convierte mejor (mayor ER y guardados). Mezcla ideal: ~60% páginas para reach y ~40% propio para intención y seguidores.";
    if (s.includes("crece") || s.includes("porqué") || s.includes("por qué") || s.includes("sube") || s.includes("temporal"))
      return "El alcance semanal se acelera desde la semana 4: coincide con la fase alta de la campaña y más publicaciones de páginas; el contenido propio sostiene el engagement en paralelo.";
    if (s.includes("semana") || s.includes("próxima") || s.includes("hago") || s.includes("recom"))
      return "En la semana pico reforzá 2–3 piezas propias (son las que ganan seguidores) y mantené las páginas para el reach de cabecera. Priorizá formatos que generan guardados.";
    return "Mirando el orgánico: las páginas aportan alcance y el contenido propio, engagement de mayor intención. ¿Querés que profundice en una fuente o en alguna semana puntual?";
  };
  const enviar = (p: string) => { if (!p.trim()) return; setMsgs((m) => [...m, { role: "user", text: p }, { role: "sigma", text: responder(p) }]); setQ(""); };
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={onClose}>
      <motion.aside initial={{ x: 60, opacity: 0.6 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="flex h-full w-full max-w-[440px] flex-col bg-[var(--modal)] ring-1 ring-[var(--ln-1)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan/15 text-cyan ring-1 ring-cyan/25"><Sparkles size={17} /></span>
            <div><h3 className="font-display text-[16px] font-bold text-ink">Sigma explica</h3><p className="text-[11px] text-ink-mute">Insights del orgánico</p></div>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-ink-mute hover:bg-[var(--hov)] hover:text-ink"><X size={16} /></button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto scroll-slim p-5">
          <div className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-mute">Lo que veo</div>
          {insights.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 * i }}
              className="flex gap-2.5 rounded-xl bg-[var(--sf-1)] p-3 text-[12.5px] leading-relaxed text-ink-soft ring-1 ring-[var(--ln-1)]">
              <Sparkles size={14} className="mt-0.5 shrink-0 text-cyan" /> <span><Rich text={t} /></span>
            </motion.div>
          ))}

          {msgs.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[12.5px] leading-relaxed ${m.role === "user" ? "bg-cyan text-content-inverted" : "bg-[var(--sf-1)] text-ink-soft ring-1 ring-[var(--ln-1)]"}`}>{m.text}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-line p-4">
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            {sugeridas.map((s) => <button key={s} onClick={() => enviar(s)} className="rounded-lg bg-[var(--sf-1)] px-2.5 py-1 text-[11px] font-medium text-ink-soft ring-1 ring-[var(--ln-1)] hover:bg-[var(--hov)]">{s}</button>)}
          </div>
          <div className="flex gap-2">
            <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") enviar(q); }} placeholder="Preguntale a Sigma sobre el orgánico…"
              className="flex-1 rounded-xl bg-[var(--sf-1)] px-3 py-2.5 text-[12.5px] text-ink outline-none ring-1 ring-[var(--ln-1)] placeholder:text-ink-mute focus:ring-cyan/40" />
            <button onClick={() => enviar(q)} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan text-content-inverted hover:opacity-90"><Send size={16} /></button>
          </div>
        </div>
      </motion.aside>
    </div>
  );
}

export function GrillasOrganicas() {
  const [reveal, setReveal] = useState(false);
  const [explica, setExplica] = useState(false);
  const o = organico;
  const maxPlat = Math.max(...o.plataformas.map((p) => p.alcance), 1);
  const senales = [
    { label: "Guardados", valor: o.saves.guardados, Icon: Bookmark, nota: "saves" },
    { label: "Compartidos", valor: o.saves.compartidos, Icon: Share2, nota: "shares" },
    { label: "Comentarios", valor: o.saves.comentarios, Icon: MessageCircle, nota: "conversación" },
    { label: "Nuevos seguidores", valor: o.saves.nuevos, Icon: UserPlus, nota: "earned" },
  ];

  return (
    <ConfProvider revealed={reveal}>
    <Wrap>
      <PageHeader
        icon={<Sprout size={24} />}
        titulo="Orgánico"
        subtitulo={<><span>{cliente.campania}</span><span className="text-ink-mute">·</span><span>{ventana}</span><Chip>Contenido earned</Chip></>}
        right={
          <>
            <ConfToggle revealed={reveal} onToggle={() => setReveal((v) => !v)} />
            <button onClick={() => setExplica(true)} className="inline-flex items-center gap-2 rounded-xl bg-cyan px-3.5 py-2 text-[13px] font-bold text-content-inverted hover:opacity-90">
              <Wand2 size={15} /> Sigma explica
            </button>
            <button className="glass glass-hover inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-semibold text-ink">
              <FileDown size={15} className="text-cyan" /> Exportar reporte
            </button>
          </>
        }
      />

      {/* KPIs */}
      <motion.section variants={container} initial="hidden" animate="show" className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {o.kpis.map((k) => {
          const Icon = KPI_ICON[k.id] ?? Sparkles;
          return (
            <motion.div key={k.id} variants={item} whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className={`${card} p-4`}>
              <div className="mb-2.5 flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan/12 text-cyan ring-1 ring-cyan/20"><Icon size={15} /></span>
              </div>
              <div className="text-[12px] font-medium text-ink-soft">{k.label}</div>
              <div className="mt-0.5 font-display text-[22px] font-bold leading-none tracking-tight text-ink"><Conf px={7}>{k.valor}</Conf></div>
              <div className="mt-2 flex items-center gap-1.5">
                <TrendingUp size={13} className="text-lime" />
                <span className="text-[11.5px] font-semibold text-lime"><Conf px={5}>{k.delta}</Conf></span>
                <span className="text-[10.5px] text-ink-mute">{k.sub}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.section>

      {/* Split + curva */}
      <section className="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <SplitReach organico={o.split.organico} pago={o.split.pago} />
        <CurvaSeguidores fechas={o.curva.fechas} puntos={o.curva.puntos} />
      </section>

      {/* Fuente del orgánico: páginas contratadas vs. propio */}
      <div className="mb-2 flex items-center gap-2">
        <h2 className="text-[13px] font-bold uppercase tracking-wide text-ink-soft">Origen del contenido orgánico</h2>
        <span className="text-[11.5px] text-ink-mute">páginas contratadas vs. propio de la marca</span>
      </div>
      <motion.section variants={container} initial="hidden" animate="show" className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        {o.fuentes.map((f) => <FuenteCard key={f.key} f={f} />)}
      </motion.section>
      <section className="mb-5"><SerieTemporal serie={o.serie} /></section>

      {/* Plataformas + señales de valor */}
      <section className="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
        {/* alcance orgánico por plataforma */}
        <div className={`${card} p-5 xl:col-span-7`}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-ink">Alcance orgánico por plataforma</h3>
            <span className="text-[11.5px] text-ink-mute">{o.plataformas.length} plataformas</span>
          </div>
          <div className="space-y-3.5">
            {o.plataformas.map((p, i) => (
              <motion.div key={p.plataforma} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * i }}>
                <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
                  <span className="inline-flex items-center gap-2 font-semibold text-ink">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: platMeta(p.plataforma).dot }} />
                    {p.plataforma}
                  </span>
                  <span className="flex items-center gap-3 text-ink-soft">
                    <span className="inline-flex items-center gap-1 text-[11px] text-ink-mute"><Heart size={11} /> <Conf px={4}>{p.er}%</Conf></span>
                    <span className="font-display font-bold tabular-nums text-ink"><Conf px={5}>{short(p.alcance)}</Conf></span>
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[var(--sf-2)]">
                  <motion.div className="h-full rounded-full bg-cyan" initial={{ width: 0 }} animate={{ width: `${(p.alcance / maxPlat) * 100}%` }}
                    transition={{ duration: 0.9, delay: 0.1 + 0.08 * i, ease: "easeOut" }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* señales de valor */}
        <div className={`${card} p-5 xl:col-span-5`}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-ink">Señales de valor</h3>
            <span className="text-[11.5px] text-ink-mute">guardar &gt; like</span>
          </div>
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 gap-3">
            {senales.map((s) => (
              <motion.div key={s.label} variants={item} whileHover={{ y: -3 }} className="rounded-xl bg-[var(--sf-1)] p-4 ring-1 ring-[var(--ln-1)]">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-cyan/12 text-cyan ring-1 ring-cyan/20"><s.Icon size={16} /></span>
                <div className="mt-3 font-display text-[22px] font-bold leading-none text-ink"><Conf px={7}>{short(s.valor)}</Conf></div>
                <div className="mt-1.5 text-[12px] font-semibold text-ink-soft">{s.label}</div>
                <div className="text-[10.5px] text-ink-mute">{s.nota}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Top piezas orgánicas */}
      <section className={`${card} p-5`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-ink">Top piezas orgánicas</h3>
          <span className="text-[11.5px] text-ink-mute">por alcance earned</span>
        </div>
        <div className="overflow-hidden rounded-xl ring-1 ring-[var(--ln-1)]">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="bg-[var(--sf-1)] text-[11px] uppercase tracking-wide text-ink-mute">
                <th className="px-4 py-2.5 font-semibold">Pieza</th>
                <th className="px-4 py-2.5 font-semibold">Plataforma</th>
                <th className="px-4 py-2.5 text-right font-semibold">Alcance</th>
                <th className="px-4 py-2.5 text-right font-semibold">Guardados</th>
                <th className="px-4 py-2.5 text-right font-semibold">Compartidos</th>
                <th className="px-4 py-2.5 text-right font-semibold">ER</th>
              </tr>
            </thead>
            <tbody>
              {o.piezas.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
                  className="border-t border-line hover:bg-[var(--sf-1)]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--sf-1)] text-[16px] ring-1 ring-[var(--ln-1)]">{p.avatar}</span>
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-ink">{p.titulo}</div>
                        <div className="text-[11px] text-ink-mute"><Conf px={4}>{p.autor}</Conf> · {p.tipo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-ink-soft">
                      <span className="h-2 w-2 rounded-full" style={{ background: platMeta(p.plataforma).dot }} />
                      {p.plataforma}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums text-ink"><Conf px={5}><span className="inline-flex items-center gap-1"><Eye size={12} className="text-ink-mute" />{short(p.alcance)}</span></Conf></td>
                  <td className="px-4 py-3 text-right tabular-nums text-ink-soft"><Conf px={4}>{short(p.guardados)}</Conf></td>
                  <td className="px-4 py-3 text-right tabular-nums text-ink-soft"><Conf px={4}>{short(p.compartidos)}</Conf></td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums text-cyan"><Conf px={4}>{p.er}%</Conf></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="mt-6 flex items-center gap-1.5 text-[12px] text-ink-mute">
        <Sparkles size={13} className="text-cyan" /> Alcance, engagement y crecimiento de seguidores del contenido orgánico (no pago) de los últimos 30 días.
      </footer>

      <AnimatePresence>
        {explica && <SigmaExplica insights={o.insightIA} onClose={() => setExplica(false)} />}
      </AnimatePresence>
    </Wrap>
    </ConfProvider>
  );
}
