// 🪟 Portal de Cliente (inmersivo) — la marca ve SU campaña con los módulos de
// `sigma externo` (Resumen · Desempeño · Contenido · Inteligencia · Competencia ·
// Brand Experience · Insights) pero con DATA REAL de SIGMA MADRE (AgenciaOS):
// cerebro (señales/insights/menciones/competidores) + posts + eventos + campañas.
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import {
  Activity, BarChart3, Brain, Check, ExternalLink, Eye, Gauge, Heart, Images, LogOut,
  MapPin, MessageCircle, MessageSquareText, Plus, Send, Sparkles, Target, Tent,
  TrendingDown, TrendingUp, Users,
} from "lucide-react";
import { Brain3D, BrainStage } from "../components/Brain3D";
import {
  agenciaosSsoUrl, sigmaClient, sigmaData,
  type ApiCampaign, type ApiContentReview, type ApiEvent, type ApiPost, type ApiUser, type BrainMention,
} from "../lib/api";
import { Chat } from "./Chat";
import { useBrain } from "./useBrain";

const nf = new Intl.NumberFormat("es-CL");
const fmt = (n?: number | null) => (n == null ? "—" : nf.format(Math.round(n)));
const pct = (n?: number | null) => (n == null ? "—" : `${n > 0 ? "+" : ""}${n.toFixed(0)}%`);
const compact = (n?: number | null) => {
  if (n == null) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n >= 10_000_000 ? 1 : 2).replace(".", ",") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(n >= 10_000 ? 0 : 1).replace(".", ",") + "K";
  return nf.format(Math.round(n));
};
const TONE: Record<string, string> = { positivo: "text-lime", alerta: "text-rose", neutral: "text-amber" };
const DOT: Record<string, string> = { positivo: "bg-lime", alerta: "bg-rose", neutral: "bg-amber" };

type View = "resumen" | "nueva" | "desempeno" | "contenido" | "inteligencia" | "competencia" | "brandexp" | "insights" | "preguntar";
const NAV: { id: View; label: string; icon: ReactNode }[] = [
  { id: "resumen", label: "Resumen", icon: <Gauge size={15} /> },
  { id: "nueva", label: "Nueva campaña", icon: <Plus size={15} /> },
  { id: "desempeno", label: "Desempeño", icon: <BarChart3 size={15} /> },
  { id: "contenido", label: "Contenido", icon: <Images size={15} /> },
  { id: "inteligencia", label: "Inteligencia", icon: <MessageSquareText size={15} /> },
  { id: "competencia", label: "Competencia", icon: <Target size={15} /> },
  { id: "brandexp", label: "Brand Experience", icon: <Tent size={15} /> },
  { id: "insights", label: "Insights", icon: <Sparkles size={15} /> },
  { id: "preguntar", label: "Preguntar", icon: <Brain size={15} /> },
];

type B = ReturnType<typeof useBrain>;

export function ClientDashboard({ user, onLogout }: { user: ApiUser; onLogout: () => void }) {
  const b = useBrain(user);
  const [view, setView] = useState<View>("resumen");
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [campaigns, setCampaigns] = useState<ApiCampaign[]>([]);
  const [reviews, setReviews] = useState<Record<number, ApiContentReview>>({});

  useEffect(() => {
    // Data de SIGMA MADRE, scopeada por el backend (cliente → su marca, sin brandId).
    sigmaData.posts().then(setPosts).catch(() => {});
    sigmaData.events().then(setEvents).catch(() => {});
    sigmaData.campaigns().then(setCampaigns).catch(() => {});
    sigmaClient.contentReviews().then((rs) => setReviews(Object.fromEntries(rs.map((r) => [r.post, r])))).catch(() => {});
  }, []);

  const reviewPost = async (postId: number, decision: string, comment: string) => {
    try {
      const r = await sigmaClient.reviewContent(postId, { decision, comment });
      setReviews((m) => ({ ...m, [postId]: r }));
    } catch {
      /* noop */
    }
  };

  if (!b.state && !b.error) return <Splash label="Cargando tu marca…" />;
  if (b.error && !b.state) return <Splash label={`No pude conectar: ${b.error}`} error />;

  const accent = b.state?.accent || "#1f7aed";
  const themeVars = { "--color-cyan": accent, "--color-cyan-deep": accent } as CSSProperties;
  const brandName = b.state?.brandName || user.brand_name || "Tu marca";

  return (
    <div className="grain flex h-screen w-screen overflow-hidden bg-canvas text-content" style={themeVars}>
      <div className="pointer-events-none fixed inset-0 bg-aura opacity-60" />

      <aside className="glass-rail relative z-10 flex w-[236px] shrink-0 flex-col border-r border-line px-4 py-5">
        <div className="flex items-center gap-2.5 px-1">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan/15 text-cyan glow-cyan"><Sparkles size={17} /></span>
          <div>
            <div className="font-display text-[17px] font-extrabold leading-none">Sigma</div>
            <div className="kicker mt-1">Portal de cliente</div>
          </div>
        </div>
        <nav className="mt-7 space-y-1">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => setView(n.id)} className={"flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] transition-colors " + (view === n.id ? "bg-cyan/12 text-cyan glass-accent" : "text-content-secondary hover:bg-white/5 hover:text-content")}>
              <span className={view === n.id ? "text-cyan" : "text-content-muted"}>{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto space-y-2">
          <a href={agenciaosSsoUrl()} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl glass glass-hover px-3 py-2 text-[12px] text-content-secondary hover:text-content">
            <ExternalLink size={13} /> Ver en AgenciaOS
          </a>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/5 px-3 py-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg text-[12px] font-bold" style={{ background: `${accent}22`, color: accent }}>{brandName.slice(0, 2).toUpperCase()}</span>
            <div className="min-w-0">
              <div className="truncate text-[12.5px] font-semibold text-content">{brandName}</div>
              <div className="truncate text-[11px] text-content-muted">{user.name || user.email}</div>
            </div>
            <button onClick={onLogout} title="Salir" className="ml-auto text-content-muted hover:text-content"><LogOut size={14} /></button>
          </div>
        </div>
      </aside>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line px-7 py-4">
          <div>
            <div className="text-[15px] font-semibold text-content">{NAV.find((n) => n.id === view)?.label}</div>
            <div className="kicker mt-0.5">{brandName} · cerebro v{b.state?.version ?? 0}</div>
          </div>
          <span className="chip text-lime"><span className="h-1.5 w-1.5 rounded-full bg-lime" /> Datos en vivo</span>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-7 py-6">
          {view === "resumen" && <Resumen b={b} accent={accent} brandName={brandName} campaigns={campaigns} />}
          {view === "nueva" && <NuevaCampana bid={b.bid} />}
          {view === "desempeno" && <Desempeno b={b} posts={posts} />}
          {view === "contenido" && <Contenido posts={posts} reviews={reviews} onReview={reviewPost} />}
          {view === "inteligencia" && <Inteligencia b={b} />}
          {view === "competencia" && <Competencia b={b} brandName={brandName} />}
          {view === "brandexp" && <BrandExp events={events} />}
          {view === "insights" && <Insights b={b} />}
          {view === "preguntar" && <div className="mx-auto max-w-[560px]"><Chat bid={b.bid} /></div>}
        </main>
      </div>
    </div>
  );
}

// ── Resumen ──
function Resumen({ b, accent, brandName, campaigns }: { b: B; accent: string; brandName: string; campaigns: ApiCampaign[] }) {
  const s = b.state?.signals ?? {};
  const cur = s.current ?? {};
  const dev = s.deviation_vs_goal ?? {};
  const featured = campaigns.find((c) => /activ|progress|curso/i.test(c.status)) ?? campaigns[0];
  return (
    <div className="space-y-6">
      {featured && (
        <div className="relative overflow-hidden rounded-2xl border border-line p-6" style={{ background: `linear-gradient(120deg, ${accent}26, ${accent}0a 60%, transparent)` }}>
          <div className="kicker">Campaña destacada · {featured.status}</div>
          <div className="mt-1 font-display text-2xl font-extrabold">{featured.name}</div>
          <div className="mt-1 text-[13px] text-content-secondary">{featured.brand_name || brandName}</div>
        </div>
      )}
      <div className="grid grid-cols-4 gap-4">
        <Kpi label="Alcance" value={compact(cur.reach)} delta={`${pct(dev.reach)} vs meta`} />
        <Kpi label="Impresiones" value={compact(cur.impressions)} delta={`${pct(dev.impressions)} vs meta`} />
        <Kpi label="Engagement" value={compact(cur.engagement)} delta={`${pct(dev.engagement)} vs meta`} />
        <Kpi label="Tasa eng." value={`${cur.eng_rate ?? "—"}%`} delta={s.deviation_vs_market?.eng_rate != null ? `${pct(s.deviation_vs_market.eng_rate)} vs mercado` : ""} />
      </div>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-5">
          <BrainStage thinking={b.thinking} className="relative flex h-[300px] items-center justify-center">
            <div className="absolute left-5 top-4 z-10 kicker">Cerebro · {brandName}</div>
            <Brain3D size={230} thinking={b.thinking} interactive accent={accent} />
          </BrainStage>
        </div>
        <div className="col-span-7 space-y-4">
          <div className="panel p-5">
            <div className="kicker mb-1.5">Lectura del cerebro</div>
            <div className="font-display text-[19px] font-extrabold leading-snug">{(b.state?.state?.headline as string) || "Aún sin consolidar"}</div>
            {b.state?.narrative && <p className="mt-2 text-[13px] leading-relaxed text-content-secondary">{b.state.narrative}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Kpi label="Aceleración eng." value={pct(s.acceleration?.engagement)} delta="2ª derivada" tone={(s.acceleration?.engagement ?? 0) < 0 ? "alerta" : "positivo"} />
            <div className="panel flex items-center gap-3 p-4">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-cyan/12 text-cyan"><Sparkles size={16} /></span>
              <div className="text-[12px] text-content-muted">Formatos que rinden<br /><span className="text-[13px] text-content">{(((b.state?.selfModel as Record<string, unknown>)?.winning_formats as string[]) ?? []).join(" · ") || "—"}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Desempeño ──
function Desempeno({ b, posts }: { b: B; posts: ApiPost[] }) {
  const s = b.state?.signals ?? {};
  const mix = platformMix(posts);
  const maxReach = Math.max(1, ...mix.map((m) => m.reach));
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Kpi label="Alcance" value={compact(s.current?.reach)} delta={`${pct(s.deviation_vs_goal?.reach)} vs meta`} />
        <Kpi label="Velocidad eng." value={s.velocity?.engagement != null ? "+" + compact(s.velocity.engagement) : "—"} delta="último tramo" />
        <Kpi label="Aceleración eng." value={pct(s.acceleration?.engagement)} delta="2ª derivada" tone={(s.acceleration?.engagement ?? 0) < 0 ? "alerta" : "positivo"} />
        <Kpi label="Piezas" value={String(posts.length)} delta={`${(s.coverage?.days ?? 0)} días de serie`} />
      </div>
      <div className="panel p-5">
        <div className="kicker mb-4">Mix por plataforma</div>
        <div className="space-y-3">
          {mix.map((m) => (
            <div key={m.name}>
              <div className="mb-1 flex items-center justify-between text-[12.5px]">
                <span className="font-medium text-content">{m.name}</span>
                <span className="text-content-muted">{compact(m.reach)} alcance · {m.posts} posts · {m.tasa}% eng.</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-cyan" style={{ width: `${(m.reach / maxReach) * 100}%` }} /></div>
            </div>
          ))}
          {mix.length === 0 && <div className="text-[13px] text-content-muted">Sin posts con métricas aún.</div>}
        </div>
      </div>
      <div className="panel p-5">
        <div className="kicker mb-3">Contenido top (por engagement)</div>
        <div className="space-y-2">
          {(s.outliers ?? []).map((o) => (
            <div key={o.post_id} className="flex items-center justify-between border-b border-line pb-2 last:border-0">
              <span className="chip text-cyan">{o.platform}</span>
              <span className="text-[12.5px] text-content-secondary">{o.eng_rate}% eng.</span>
              <span className="text-[12.5px] text-content-muted">{compact(o.reach)} alcance</span>
            </div>
          ))}
          {(s.outliers ?? []).length === 0 && <div className="text-[13px] text-content-muted">Sin datos.</div>}
        </div>
      </div>
    </div>
  );
}

// ── Contenido (con aprobar / pedir cambios) ──
function Contenido({ posts, reviews, onReview }: { posts: ApiPost[]; reviews: Record<number, ApiContentReview>; onReview: (id: number, decision: string, comment: string) => void }) {
  const sorted = [...posts].sort((a, b) => (b.reach || 0) - (a.reach || 0));
  return (
    <div>
      {sorted.length === 0 && <Empty>Aún no hay contenido publicado con métricas.</Empty>}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {sorted.map((p) => {
          const rev = reviews[p.id];
          return (
            <div key={p.id} className="overflow-hidden rounded-xl border border-line bg-white/[0.03]">
              <div className="relative aspect-[4/5]">
                {p.thumbnail_url ? (
                  <img src={p.thumbnail_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full" style={{ background: `linear-gradient(135deg, var(--color-cyan), transparent)` }} />
                )}
                <span className="absolute left-2 top-2 chip bg-black/40 text-white backdrop-blur-md">{p.platform}</span>
                {p.status && p.status !== "published" && <span className="absolute right-2 top-2 chip bg-black/40 text-amber backdrop-blur-md">{p.status}</span>}
                {rev && (
                  <span className={"absolute bottom-2 right-2 chip backdrop-blur-md " + (rev.decision === "approved" ? "bg-lime/25 text-lime" : rev.decision === "changes_requested" ? "bg-amber/25 text-amber" : "bg-black/40 text-white")}>
                    {rev.decision === "approved" ? "aprobado" : rev.decision === "changes_requested" ? "cambios" : "revisado"}
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="line-clamp-2 text-[12px] leading-snug text-content-secondary">{p.title || p.caption || p.code}</p>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-content-muted">
                  <span className="flex items-center gap-1"><Eye size={12} /> {compact(p.reach)}</span>
                  <span className="flex items-center gap-1"><Heart size={12} /> {compact(p.like_count)}</span>
                  <span className="flex items-center gap-1"><MessageCircle size={12} /> {compact(p.comment_count)}</span>
                </div>
                <div className="mt-2.5 flex gap-1.5">
                  <button onClick={() => onReview(p.id, "approved", "")} className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-lime/15 px-2 py-1.5 text-[11px] font-medium text-lime transition-colors hover:bg-lime/25">
                    <Check size={12} /> Aprobar
                  </button>
                  <button onClick={() => { const c = window.prompt("¿Qué cambios pedís? (va a tu agencia)"); if (c != null) onReview(p.id, "changes_requested", c); }} className="flex flex-1 items-center justify-center gap-1 rounded-lg glass glass-hover px-2 py-1.5 text-[11px] text-content-secondary transition-colors hover:text-content">
                    <MessageCircle size={12} /> Cambios
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Nueva campaña (el cliente solicita → levanta a la agencia) ──
function NuevaCampana({ bid }: { bid?: number }) {
  const [title, setTitle] = useState("");
  const [brief, setBrief] = useState("");
  const [objective, setObjective] = useState("conversion");
  const [budget, setBudget] = useState("");
  const [channels, setChannels] = useState<string[]>(["instagram"]);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const toggle = (c: string) => setChannels((x) => (x.includes(c) ? x.filter((y) => y !== c) : [...x, c]));
  const submit = async () => {
    if (!title.trim() || busy) return;
    setBusy(true);
    try {
      await sigmaClient.createCampaignRequest({ title, brief, objective, budget_hint: budget, channels }, bid);
      setSent(true);
    } catch {
      /* noop */
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="panel mx-auto max-w-[560px] p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-lime/15 text-lime"><Check size={26} /></span>
        <div className="mt-4 font-display text-xl font-extrabold">Solicitud levantada a tu agencia</div>
        <p className="mt-2 text-[13px] leading-relaxed text-content-secondary">
          Tu equipo de Sigma ya la tiene en su pipeline (SIGMA MADRE) en estado <span className="text-content">nueva</span>. La cotizan y te vuelven con una propuesta.
        </p>
        <button onClick={() => { setSent(false); setTitle(""); setBrief(""); setBudget(""); }} className="mt-5 rounded-xl bg-cyan px-4 py-2 text-[13px] font-semibold text-content-inverted">Crear otra</button>
      </div>
    );
  }

  const OBJ: [string, string][] = [["conversion", "Conversión"], ["masividad", "Masividad"], ["advocacy", "Advocacy"], ["evento", "Evento / BTL"]];
  const CH = ["instagram", "tiktok", "youtube"];
  return (
    <div className="mx-auto max-w-[620px] space-y-4">
      <div className="panel space-y-4 p-5">
        <div>
          <div className="kicker mb-1.5">Nombre de la campaña</div>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Lanzamiento verano app" />
        </div>
        <div>
          <div className="kicker mb-1.5">Brief · qué querés lograr</div>
          <textarea className="input min-h-[90px] resize-y" value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="Contanos el objetivo, el público, el tono, fechas…" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="kicker mb-1.5">Objetivo</div>
            <div className="flex flex-wrap gap-1.5">{OBJ.map(([v, l]) => <button key={v} onClick={() => setObjective(v)} className={"chip cursor-pointer " + (objective === v ? "bg-cyan/15 text-cyan" : "text-content-secondary")}>{l}</button>)}</div>
          </div>
          <div>
            <div className="kicker mb-1.5">Presupuesto estimado</div>
            <input className="input" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Ej: 8–12M" />
          </div>
        </div>
        <div>
          <div className="kicker mb-1.5">Canales</div>
          <div className="flex flex-wrap gap-1.5">{CH.map((c) => <button key={c} onClick={() => toggle(c)} className={"chip cursor-pointer " + (channels.includes(c) ? "bg-cyan/15 text-cyan" : "text-content-secondary")}>{c}</button>)}</div>
        </div>
        <button onClick={submit} disabled={busy || !title.trim()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan py-2.5 text-[13px] font-semibold text-content-inverted transition-opacity disabled:opacity-50">
          <Send size={15} /> {busy ? "Enviando…" : "Levantar a mi agencia"}
        </button>
      </div>
      <p className="text-center text-[12px] text-content-muted">Tu solicitud entra al pipeline de tu agencia en SIGMA MADRE — ellos la cotizan y ejecutan.</p>
    </div>
  );
}

// ── Inteligencia ──
function Inteligencia({ b }: { b: B }) {
  const c = sentCounts(b.mentions);
  const total = b.mentions.length || 1;
  const byPlat = platformSent(b.mentions);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Kpi label="Menciones" value={String(b.mentions.length)} delta="social listening" />
        <Kpi label="Positivas" value={String(c.positive)} delta={`${Math.round((c.positive / total) * 100)}%`} tone="positivo" />
        <Kpi label="Neutrales" value={String(c.neutral)} delta={`${Math.round((c.neutral / total) * 100)}%`} tone="neutral" />
        <Kpi label="Negativas" value={String(c.negative)} delta={`${Math.round((c.negative / total) * 100)}%`} tone="alerta" />
      </div>
      {byPlat.length > 0 && (
        <div className="panel p-5">
          <div className="kicker mb-3">Sentimiento por plataforma</div>
          <div className="space-y-2.5">
            {byPlat.map((p) => (
              <div key={p.name}>
                <div className="mb-1 flex justify-between text-[12px]"><span className="text-content">{p.name}</span><span className="text-content-muted">{p.total} menciones</span></div>
                <div className="flex h-2 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full bg-lime" style={{ width: `${(p.positive / p.total) * 100}%` }} />
                  <div className="h-full bg-amber" style={{ width: `${(p.neutral / p.total) * 100}%` }} />
                  <div className="h-full bg-rose" style={{ width: `${(p.negative / p.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="panel p-5">
        <div className="kicker mb-3">Comentarios / menciones destacadas</div>
        <div className="space-y-2.5">
          {b.mentions.map((m) => (
            <div key={m.id} className="panel-2 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] font-medium text-content-secondary">@{m.author || "anónimo"} <span className="text-content-muted">· {m.platform}</span></span>
                <span className={"chip " + ({ positive: "text-lime", negative: "text-rose", neutral: "text-amber", unknown: "text-content-muted" }[m.sentiment] ?? "text-content-muted")}>{{ positive: "positivo", negative: "negativo", neutral: "neutral", unknown: "sin clasificar" }[m.sentiment] ?? m.sentiment}</span>
              </div>
              <p className="mt-1 text-[13px] text-content-muted">{m.text}</p>
            </div>
          ))}
          {b.mentions.length === 0 && <div className="text-[13px] text-content-muted">Sin menciones aún (se llenan con el social listening).</div>}
        </div>
      </div>
    </div>
  );
}

// ── Competencia ──
function Competencia({ b, brandName }: { b: B; brandName: string }) {
  const d = b.state?.signals?.deviation_vs_market;
  const myRate = b.state?.signals?.current?.eng_rate ?? 0;
  const rows = [
    { name: brandName, rate: myRate, mine: true },
    ...b.competitors.map((c) => ({ name: `@${c.username}`, rate: c.latest?.engRate ?? 0, mine: false })),
  ];
  const max = Math.max(1, ...rows.map((r) => r.rate));
  return (
    <div className="space-y-6">
      <div className="panel p-6">
        <div className="kicker mb-2">Engagement vs mercado</div>
        {d?.eng_rate != null ? (
          <div className={"font-display text-4xl font-extrabold " + (d.eng_rate < 0 ? "text-rose" : "text-lime")}>
            {pct(d.eng_rate)}<span className="ml-3 text-[13px] font-normal text-content-muted">tu tasa ({myRate}%) vs {d.market_eng_rate}% del mercado · {d.competitors} competidor(es)</span>
          </div>
        ) : <div className="text-[13px] text-content-muted">Aún sin competidores medidos.</div>}
      </div>
      <div className="panel p-5">
        <div className="kicker mb-4">Benchmark de engagement</div>
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.name}>
              <div className="mb-1 flex justify-between text-[12.5px]"><span className={r.mine ? "font-semibold text-cyan" : "text-content-secondary"}>{r.name}{r.mine ? " (tú)" : ""}</span><span className="text-content-muted">{r.rate}%</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-white/5"><div className={"h-full rounded-full " + (r.mine ? "bg-cyan" : "bg-white/25")} style={{ width: `${(r.rate / max) * 100}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Brand Experience ──
function BrandExp({ events }: { events: ApiEvent[] }) {
  const asis = (e: ApiEvent) => e.asistentes || e.aforo || 0;
  const totalAsis = events.reduce((a, e) => a + asis(e), 0);
  const byComuna: Record<string, number> = {};
  for (const e of events) if (e.comuna) byComuna[e.comuna] = (byComuna[e.comuna] || 0) + asis(e);
  const comunas = Object.entries(byComuna).sort((a, b) => b[1] - a[1]);
  const maxC = Math.max(1, ...comunas.map(([, v]) => v));
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Kpi label="Activaciones" value={String(events.length)} delta="BTL" />
        <Kpi label="Asistentes" value={compact(totalAsis)} delta="acumulado" />
        <Kpi label="Comunas" value={String(comunas.length)} delta="cobertura geográfica" />
      </div>
      <div className="panel p-5">
        <div className="kicker mb-3">Activaciones</div>
        <div className="space-y-2">
          {events.map((e) => (
            <div key={e.id} className="flex items-center justify-between border-b border-line pb-2.5 last:border-0">
              <div>
                <div className="text-[13px] font-medium text-content">{e.name}</div>
                <div className="text-[11px] text-content-muted flex items-center gap-1"><MapPin size={11} /> {e.venue || e.comuna || "—"}</div>
              </div>
              <div className="text-right text-[12.5px] text-content-secondary">{compact(asis(e))} asist.<br /><span className="text-[11px] text-content-muted">{e.status}</span></div>
            </div>
          ))}
          {events.length === 0 && <div className="text-[13px] text-content-muted">Sin activaciones BTL registradas.</div>}
        </div>
      </div>
      {comunas.length > 0 && (
        <div className="panel p-5">
          <div className="kicker mb-4">Distribución geográfica</div>
          <div className="space-y-3">
            {comunas.map(([c, v]) => (
              <div key={c}>
                <div className="mb-1 flex justify-between text-[12.5px]"><span className="text-content">{c}</span><span className="text-content-muted">{compact(v)}</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-cyan" style={{ width: `${(v / maxC) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Insights ──
function Insights({ b }: { b: B }) {
  return (
    <div className="grid grid-cols-2 gap-5">
      <div>
        <div className="kicker mb-3">Insights</div>
        <div className="space-y-2.5">
          {b.insights.map((i) => (
            <div key={i.id} className="panel flex gap-3 p-3.5">
              <span className={"mt-1.5 h-2 w-2 shrink-0 rounded-full " + (DOT[i.tone] ?? "bg-content-muted")} />
              <div>
                <div className={"text-[13px] font-semibold " + (TONE[i.tone] ?? "text-content")}>{i.title}</div>
                <p className="mt-0.5 text-[12.5px] leading-snug text-content-muted">{i.narrative}</p>
              </div>
            </div>
          ))}
          {b.insights.length === 0 && <Empty>Sin insights aún.</Empty>}
        </div>
      </div>
      <div>
        <div className="kicker mb-3">Recomendaciones de Sigma</div>
        <div className="space-y-2.5">
          {b.recs.map((r) => (
            <div key={r.id} className="panel p-3.5">
              <div className="flex items-center gap-2"><span className="chip text-cyan">{r.palanca || "acción"}</span><span className="text-[13px] font-semibold text-content">{r.title}</span></div>
              <p className="mt-1 text-[12.5px] leading-snug text-content-muted">{r.action}</p>
            </div>
          ))}
          {b.recs.length === 0 && <Empty>Sin recomendaciones activas.</Empty>}
        </div>
      </div>
    </div>
  );
}

// ── helpers de agregación ──
function platformMix(posts: ApiPost[]) {
  const g: Record<string, { reach: number; engagement: number; posts: number }> = {};
  for (const p of posts) {
    const ch = /tiktok/i.test(p.platform) ? "TikTok" : /you/i.test(p.platform) ? "YouTube" : "Instagram";
    g[ch] = g[ch] || { reach: 0, engagement: 0, posts: 0 };
    g[ch].reach += p.reach || 0; g[ch].engagement += p.engagement || 0; g[ch].posts += 1;
  }
  return Object.entries(g).map(([name, v]) => ({ name, ...v, tasa: v.reach ? +((v.engagement / v.reach) * 100).toFixed(1) : 0 })).sort((a, b) => b.reach - a.reach);
}
function sentCounts(ms: BrainMention[]) {
  const c: Record<string, number> = { positive: 0, neutral: 0, negative: 0, unknown: 0 };
  for (const m of ms) c[m.sentiment] = (c[m.sentiment] ?? 0) + 1;
  return c;
}
function platformSent(ms: BrainMention[]) {
  const g: Record<string, { positive: number; neutral: number; negative: number; total: number }> = {};
  for (const m of ms) {
    const k = m.platform || "otro";
    g[k] = g[k] || { positive: 0, neutral: 0, negative: 0, total: 0 };
    if (m.sentiment === "positive") g[k].positive += 1;
    else if (m.sentiment === "negative") g[k].negative += 1;
    else g[k].neutral += 1;
    g[k].total += 1;
  }
  return Object.entries(g).map(([name, v]) => ({ name, ...v }));
}

// ── átomos ──
function Kpi({ label, value, delta, tone }: { label: string; value: string; delta?: string; tone?: string }) {
  return (
    <div className="panel p-4">
      <div className="kicker">{label}</div>
      <div className={"mt-1.5 font-display text-[24px] font-extrabold " + (tone ? TONE[tone] : "text-content")}>{value}</div>
      {delta && <div className="text-[11px] text-content-muted">{delta}</div>}
    </div>
  );
}
function Empty({ children }: { children: ReactNode }) {
  return <div className="panel p-4 text-[13px] text-content-muted">{children}</div>;
}
function Splash({ label, error }: { label: string; error?: boolean }) {
  return (
    <div className="grid h-screen w-screen place-items-center bg-canvas text-content">
      <div className="flex flex-col items-center gap-4">
        <span className={"grid h-14 w-14 place-items-center rounded-2xl " + (error ? "bg-rose/15 text-rose" : "bg-cyan/15 text-cyan breathe")}><Sparkles size={24} /></span>
        <div className="text-[13.5px] text-content-secondary">{label}</div>
      </div>
    </div>
  );
}
