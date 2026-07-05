// 🧠 Cerebro en vivo — la cara del "Sigma externo", 100% conectada al backend real.
// Hero = hologram reaccionando al estado real; paneles = señales de 2ª derivada,
// insights, recomendaciones, competencia, sentimiento y chatbot SSE. Temado por el
// acento real de la marca (setea --color-cyan → glass/bloom/brain se tiñen solos).
import type { CSSProperties } from "react";
import {
  Activity, AlertTriangle, Check, ExternalLink, LogOut, MessageSquareText, RefreshCw,
  Sparkles, Target, TrendingDown, TrendingUp, Users, X,
} from "lucide-react";
import { Brain3D, BrainStage } from "../components/Brain3D";
import { agenciaosSsoUrl, type ApiUser, type BrainInsight, type BrainRecommendation } from "../lib/api";
import { Chat } from "./Chat";
import { useBrain } from "./useBrain";

const nf = new Intl.NumberFormat("es-CL");
const fmt = (n?: number | null) => (n == null ? "—" : nf.format(Math.round(n)));
const pct = (n?: number | null) => (n == null ? "—" : `${n > 0 ? "+" : ""}${n.toFixed(0)}%`);

const TONE: Record<string, string> = { positivo: "text-lime", alerta: "text-rose", neutral: "text-amber" };
const TONE_DOT: Record<string, string> = { positivo: "bg-lime", alerta: "bg-rose", neutral: "bg-amber" };

export function CerebroLive({ user, onLogout }: { user: ApiUser; onLogout: () => void }) {
  const b = useBrain(user);

  if (!b.state && !b.error) return <Splash label="Cargando cerebro…" />;
  if (b.error && !b.state) return <Splash label={`No pude conectar: ${b.error}`} error />;

  const accent = b.state?.accent || "#5ec27d";
  const themeVars = { "--color-cyan": accent, "--color-cyan-deep": accent } as CSSProperties;
  const s = b.state?.signals ?? {};
  const cur = s.current ?? {};
  const headline = (b.state?.state?.headline as string) || "";

  return (
    <div
      className="grain relative h-screen w-screen overflow-y-auto bg-canvas text-content"
      style={themeVars}
    >
      <div className="pointer-events-none fixed inset-0 bg-aura opacity-70" />
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-25" />

      <div className="relative mx-auto max-w-[1400px] px-6 pb-16 pt-5">
        {/* ── Header ── */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan/15 text-cyan glow-cyan">
              <Sparkles size={17} />
            </span>
            <div>
              <div className="font-display text-[19px] font-extrabold leading-none tracking-tight">Sigma</div>
              <div className="kicker mt-1">Cerebro de marca · en vivo</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {b.isStaff && (
              <div className="flex flex-wrap gap-1.5">
                {b.brands.map((m) => {
                  const on = m.id === b.brandId;
                  return (
                    <button
                      key={m.id}
                      onClick={() => b.setBrandId(m.id)}
                      className={
                        "rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors " +
                        (on ? "bg-cyan/15 text-cyan glass-accent" : "glass glass-hover text-content-secondary")
                      }
                      style={on ? ({ "--color-cyan": m.accent || accent } as CSSProperties) : undefined}
                    >
                      {m.name}
                    </button>
                  );
                })}
              </div>
            )}
            <a
              href={agenciaosSsoUrl()}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-xl glass glass-hover px-3 py-2 text-[12.5px] font-medium text-content-secondary hover:text-content"
              title="Abrir el portal operativo en AgenciaOS (SSO)"
            >
              <ExternalLink size={13} /> AgenciaOS
            </a>
            <button
              onClick={b.consolidate}
              disabled={b.thinking}
              className="flex items-center gap-2 rounded-xl bg-cyan px-3.5 py-2 text-[12.5px] font-semibold text-content-inverted transition-opacity disabled:opacity-50"
            >
              <RefreshCw size={14} className={b.thinking ? "animate-spin" : ""} />
              {b.thinking ? "Consolidando…" : "Consolidar"}
            </button>
            <button
              onClick={onLogout}
              title="Salir"
              className="grid h-9 w-9 place-items-center rounded-xl glass glass-hover text-content-muted hover:text-content"
            >
              <LogOut size={14} />
            </button>
          </div>
        </header>

        {/* ── Hero: hologram + estado ── */}
        <div className="mt-5 grid grid-cols-12 gap-5">
          <div className="col-span-12 lg:col-span-7">
            <BrainStage thinking={b.thinking} className="relative flex h-[440px] items-center justify-center">
              <div className="absolute left-6 top-6 z-10 max-w-[62%]">
                <div className="kicker">{b.state?.brandName} · {b.state?.archetype}</div>
                <div className="mt-1 font-display text-[26px] font-extrabold leading-tight text-glow-cyan">
                  {headline || "Sin consolidar"}
                </div>
                <MomentumBadge momentum={s.momentum} />
              </div>
              <Brain3D size={360} thinking={b.thinking} interactive accent={accent} />
              <div className="absolute bottom-5 left-6 z-10 kicker">
                v{b.state?.version ?? 0} · {b.state?.hasData ? "memoria activa" : "sin datos aún"}
              </div>
            </BrainStage>
          </div>

          {/* Señales de 2ª derivada */}
          <div className="col-span-12 grid grid-cols-2 gap-3 lg:col-span-5">
            <Stat icon={<Users size={14} />} label="Alcance" value={fmt(cur.reach)} sub={pct(s.deviation_vs_goal?.reach) + " vs meta"} />
            <Stat icon={<Activity size={14} />} label="Engagement" value={fmt(cur.engagement)} sub={`${cur.eng_rate ?? "—"}% rate`} />
            <Stat
              icon={(s.acceleration?.engagement ?? 0) < 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
              label="Aceleración eng."
              value={pct(s.acceleration?.engagement)}
              sub="2ª derivada"
              tone={(s.acceleration?.engagement ?? 0) < 0 ? "alerta" : "positivo"}
            />
            <Stat
              icon={<Target size={14} />}
              label="vs Mercado"
              value={s.deviation_vs_market?.eng_rate != null ? pct(s.deviation_vs_market.eng_rate) : "—"}
              sub={s.deviation_vs_market?.competitors ? `${s.deviation_vs_market.competitors} competidor(es)` : "sin competidores"}
              tone={(s.deviation_vs_market?.eng_rate ?? 0) < 0 ? "alerta" : "positivo"}
            />
            {b.state?.narrative && (
              <div className="panel col-span-2 p-4">
                <div className="kicker mb-1.5">Lectura del cerebro</div>
                <p className="text-[13px] leading-relaxed text-content-secondary">{b.state.narrative}</p>
              </div>
            )}
            <div className="panel col-span-2 flex items-center gap-3 p-3.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan/12 text-cyan"><Sparkles size={15} /></span>
              <div className="text-[12px] text-content-muted">
                Formatos que rinden:{" "}
                <span className="text-content">
                  {(((b.state?.selfModel as Record<string, unknown>)?.winning_formats as string[]) ?? []).join(" · ") || "—"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Insights + Recomendaciones ── */}
        <div className="mt-5 grid grid-cols-12 gap-5">
          <section className="col-span-12 lg:col-span-6">
            <SectionTitle icon={<Sparkles size={13} />} title="Insights" count={b.insights.length} />
            <div className="mt-3 space-y-2.5">
              {b.insights.length === 0 && <Empty label="Sin insights — consolidá el cerebro." />}
              {b.insights.map((i) => <InsightCard key={i.id} i={i} onDismiss={() => b.dismissInsight(i.id)} />)}
            </div>
          </section>
          <section className="col-span-12 lg:col-span-6">
            <SectionTitle icon={<Check size={13} />} title="Recomendaciones" count={b.recs.length} />
            <div className="mt-3 space-y-2.5">
              {b.recs.length === 0 && <Empty label="Sin recomendaciones activas." />}
              {b.recs.map((r) => <RecCard key={r.id} r={r} onAct={() => b.actRecommendation(r.id)} />)}
            </div>
          </section>
        </div>

        {/* ── Competencia + Sentimiento + Chat ── */}
        <div className="mt-5 grid grid-cols-12 gap-5">
          <section className="col-span-12 lg:col-span-4">
            <SectionTitle icon={<Target size={13} />} title="Competencia" count={b.competitors.length} />
            <div className="panel mt-3 p-4">
              {s.deviation_vs_market?.eng_rate != null ? (
                <div className={"font-display text-2xl font-extrabold " + (s.deviation_vs_market.eng_rate < 0 ? "text-rose" : "text-lime")}>
                  {pct(s.deviation_vs_market.eng_rate)}
                  <span className="ml-2 text-[12px] font-normal text-content-muted">eng. vs mercado ({s.deviation_vs_market.market_eng_rate}%)</span>
                </div>
              ) : (
                <div className="text-[13px] text-content-muted">Aún sin competidores medidos.</div>
              )}
              <div className="mt-3 space-y-1.5">
                {b.competitors.map((c) => (
                  <div key={c.id} className="flex items-center justify-between text-[12.5px]">
                    <span className="text-content-secondary">@{c.username}</span>
                    <span className="text-content-muted">
                      {c.latest ? `${fmt(c.latest.followers)} · ${c.latest.engRate}%` : "sin métrica"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="col-span-12 lg:col-span-4">
            <SectionTitle icon={<MessageSquareText size={13} />} title="Sentimiento / menciones" count={b.mentions.length} />
            <div className="panel mt-3 max-h-[300px] space-y-2 overflow-y-auto p-4">
              {b.mentions.length === 0 && <div className="text-[13px] text-content-muted">Sin menciones (conecta el listening).</div>}
              {b.mentions.map((m) => (
                <div key={m.id} className="panel-2 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-content-secondary">@{m.author || "anónimo"}</span>
                    <SentimentBadge s={m.sentiment} />
                  </div>
                  <p className="mt-1 text-[12.5px] leading-snug text-content-muted">{m.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="col-span-12 lg:col-span-4">
            <SectionTitle icon={<Sparkles size={13} />} title="Chat" />
            <div className="mt-3">
              <Chat bid={b.bid} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// ── sub-componentes ────────────────────────────────────────────────────────────

function Stat({ icon, label, value, sub, tone }: { icon: React.ReactNode; label: string; value: string; sub?: string; tone?: string }) {
  return (
    <div className="panel p-4">
      <div className="flex items-center gap-1.5 text-content-muted">
        <span className="text-cyan">{icon}</span>
        <span className="kicker">{label}</span>
      </div>
      <div className={"mt-1.5 font-display text-[22px] font-extrabold " + (tone ? TONE[tone] : "text-content")}>{value}</div>
      {sub && <div className="text-[11px] text-content-muted">{sub}</div>}
    </div>
  );
}

function MomentumBadge({ momentum }: { momentum?: string }) {
  if (!momentum) return null;
  const bad = /desaceler|cayendo/.test(momentum);
  return (
    <span className={"chip mt-3 " + (bad ? "text-rose" : "text-lime")}>
      {bad ? <TrendingDown size={11} /> : <TrendingUp size={11} />} {momentum}
    </span>
  );
}

function SectionTitle({ icon, title, count }: { icon: React.ReactNode; title: string; count?: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-6 w-6 place-items-center rounded-md bg-cyan/12 text-cyan">{icon}</span>
      <h2 className="text-[13.5px] font-semibold text-content">{title}</h2>
      {count != null && <span className="chip">{count}</span>}
    </div>
  );
}

function InsightCard({ i, onDismiss }: { i: BrainInsight; onDismiss: () => void }) {
  return (
    <div className="panel group flex gap-3 p-3.5">
      <span className={"mt-1.5 h-2 w-2 shrink-0 rounded-full " + (TONE_DOT[i.tone] ?? "bg-content-muted")} />
      <div className="min-w-0 flex-1">
        <div className={"text-[13px] font-semibold " + (TONE[i.tone] ?? "text-content")}>{i.title}</div>
        <p className="mt-0.5 text-[12.5px] leading-snug text-content-muted">{i.narrative}</p>
      </div>
      <button onClick={onDismiss} className="h-6 w-6 shrink-0 place-items-center rounded-md text-content-muted opacity-0 transition-opacity hover:bg-white/5 hover:text-content group-hover:opacity-100 grid" title="Descartar">
        <X size={13} />
      </button>
    </div>
  );
}

function RecCard({ r, onAct }: { r: BrainRecommendation; onAct: () => void }) {
  const done = r.status === "acted_on";
  return (
    <div className="panel p-3.5">
      <div className="flex items-center gap-2">
        <span className="chip text-cyan">{r.palanca || "acción"}</span>
        <span className="text-[13px] font-semibold text-content">{r.title}</span>
      </div>
      <p className="mt-1 text-[12.5px] leading-snug text-content-muted">{r.action}</p>
      <button
        onClick={onAct}
        disabled={done}
        className={
          "mt-2.5 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11.5px] font-medium transition-colors " +
          (done ? "bg-lime/15 text-lime" : "glass glass-hover text-content-secondary hover:text-content")
        }
      >
        <Check size={12} /> {done ? "Ejecutada · midiendo outcome" : "Marcar ejecutada"}
      </button>
    </div>
  );
}

function SentimentBadge({ s }: { s: string }) {
  const map: Record<string, string> = { positive: "text-lime", negative: "text-rose", neutral: "text-amber", unknown: "text-content-muted" };
  const label: Record<string, string> = { positive: "positivo", negative: "negativo", neutral: "neutral", unknown: "sin clasificar" };
  return <span className={"chip " + (map[s] ?? "text-content-muted")}>{label[s] ?? s}</span>;
}

function Empty({ label }: { label: string }) {
  return <div className="panel p-4 text-[13px] text-content-muted">{label}</div>;
}

function Splash({ label, error }: { label: string; error?: boolean }) {
  return (
    <div className="grid h-screen w-screen place-items-center bg-canvas text-content">
      <div className="flex flex-col items-center gap-4">
        <span className={"grid h-14 w-14 place-items-center rounded-2xl " + (error ? "bg-rose/15 text-rose" : "bg-cyan/15 text-cyan breathe")}>
          {error ? <AlertTriangle size={24} /> : <Sparkles size={24} />}
        </span>
        <div className="text-[13.5px] text-content-secondary">{label}</div>
      </div>
    </div>
  );
}
