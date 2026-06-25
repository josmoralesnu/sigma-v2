import { useState } from "react";
import { motion } from "motion/react";
import { PlusCircle, Megaphone, Network, Users, TrendingUp, ArrowRight, Activity, Sparkles, Lock } from "lucide-react";
import type { View } from "../components/Sidebar";
import { conceptos, influencers, acentoHex, type Marca, type Campaña } from "../lib/data";
import { cn } from "../lib/cn";
import { Analisis } from "./Analisis";

interface ActividadItem { t: string; txt: string; color: string }

const CONFIDENCIAL = "Datos confidenciales";

export function Home({ setView, marca, campañas, actividad }: { setView: (v: View) => void; marca: Marca; campañas: Campaña[]; actividad: ActividadItem[] }) {
  const [tab, setTab] = useState<"resumen" | "analisis">("resumen");
  const kpis = [
    { label: "Campañas activas", value: marca.campañasActivas, icon: Megaphone },
    { label: "Conceptos generados", value: conceptos.length, icon: Network },
    { label: "Talento en cartera", value: influencers.length, icon: Users },
    { label: "Tendencias vigiladas", value: 6, icon: TrendingUp },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* tabs: Resumen | Análisis (item 9 — análisis accesible rápido desde Inicio) */}
      <div className="shrink-0 border-b border-line px-8 pt-5">
        <div className="mx-auto flex max-w-6xl items-center gap-1">
          {(["resumen", "analisis"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={cn("relative px-4 py-2.5 text-[13px] font-semibold transition-colors", tab === t ? "text-ink" : "text-ink-soft hover:text-ink")}>
              {t === "resumen" ? "Resumen" : "Análisis de marca"}
              {tab === t && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-cyan" />}
            </button>
          ))}
        </div>
      </div>

      {tab === "analisis" ? (
        <div className="min-h-0 flex-1 overflow-hidden">
          <Analisis onGenerar={() => setView("nueva")} />
        </div>
      ) : (
      <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
      <div className="mx-auto max-w-6xl space-y-5">
        {/* hero */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl border border-cyan/20 bg-[linear-gradient(120deg,rgba(207,77,107,0.10),rgba(199,154,82,0.06))] p-6">
          <div className="absolute -right-10 -top-12 h-48 w-48 rounded-full bg-cyan/10 blur-3xl" />
          <div className="relative flex items-end justify-between gap-6">
            <div>
              <div className="mb-2.5 flex items-center gap-2.5">
                <BrandLockup marca={marca} />
                <span className="kicker">· sala de control</span>
              </div>
              <h2 className="max-w-xl font-display text-[26px] font-extrabold leading-tight text-ink">
                Toda la operación creativa, sostenida por el cerebro.
              </h2>
              <p className="mt-1.5 max-w-lg text-[13px] text-ink-soft">
                Crea una campaña y deja que Sigma analice competencia, cruce tendencias y proponga conceptos con su bajada a influencers.
              </p>
            </div>
            <button onClick={() => setView("nueva")} className="group flex shrink-0 items-center gap-2.5 rounded-xl bg-cyan px-5 py-3 text-[13px] font-semibold text-void transition-all hover:shadow-[0_0_28px_-4px_var(--color-cyan)]">
              <PlusCircle size={17} /> Nueva campaña
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </motion.div>

        {/* kpis */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map((k, i) => {
            const Icon = k.icon;
            return (
              <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-line bg-surface/50 p-4">
                <Icon size={16} className="text-cyan" />
                <div className="mt-3 font-display text-[28px] font-extrabold leading-none text-ink">{k.value}</div>
                <div className="kicker mt-1.5">{k.label}</div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-12 gap-5">
          {/* campaigns */}
          <div className="col-span-12 lg:col-span-7">
            <SectionHead icon={Megaphone} title="Campañas recientes" action="Ver todas" onAction={() => setView("campañas")} />
            <div className="space-y-2.5">
              {campañas.slice(0, 4).map((c) => {
                const reveal = c.id.startsWith("cu"); // solo las creadas en esta sesión se muestran
                return (
                <div key={c.id} className="flex items-center gap-4 rounded-xl border border-line bg-surface/50 p-3.5">
                  <div className="min-w-0 flex-1">
                    {reveal ? (
                      <>
                        <div className="truncate text-[13.5px] font-semibold text-ink">{c.nombre}</div>
                        <div className="font-mono text-[10px] text-ink-mute">{c.marca} · {c.ventana}</div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-1.5 text-[13.5px] font-semibold text-ink-mute"><Lock size={12} /> {CONFIDENCIAL}</div>
                        <div className="font-mono text-[10px] text-ink-mute/70">acceso restringido</div>
                      </>
                    )}
                  </div>
                  <span className="chip py-0.5">{c.estado}</span>
                  <div className="w-28">
                    <div className="mb-1 flex justify-between font-mono text-[9px] text-ink-mute"><span>avance</span><span>{c.progreso}%</span></div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-void"><div className="h-full rounded-full bg-gradient-to-r from-cyan to-violet" style={{ width: `${c.progreso}%` }} /></div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          {/* activity */}
          <div className="col-span-12 lg:col-span-5">
            <SectionHead icon={Activity} title="Actividad del cerebro" />
            <div className="relative space-y-3 rounded-2xl border border-line bg-surface/40 p-4">
              {actividad.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="mt-1 h-2 w-2 rounded-full" style={{ background: acentoHex[a.color as keyof typeof acentoHex] }} />
                    {i < actividad.length - 1 && <span className="my-1 w-px flex-1 bg-line" />}
                  </div>
                  <div className="pb-1">
                    <div className="font-mono text-[9.5px] text-ink-mute">{a.t}</div>
                    <div className="text-[12px] leading-snug text-ink-soft">{a.txt}</div>
                  </div>
                </div>
              ))}
              <button onClick={() => setView("cerebro")} className="flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface/60 py-2.5 text-[12px] font-semibold text-cyan transition-colors hover:bg-surface-2">
                <Sparkles size={14} /> Abrir el cerebro
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
      )}
    </div>
  );
}

/* Lockup de marca — wordmark estilizado de Copec (aprox., reemplazable por el logo oficial) */
function BrandLockup({ marca }: { marca: Marca }) {
  if (marca.id === "copec") {
    return (
      <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#06122e]/70 px-2.5 py-1.5 backdrop-blur-sm">
        <span className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: "linear-gradient(135deg,#0a3aa0,#0e63c9)" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 2.5C12 2.5 5.2 9.8 5.2 15.2a6.8 6.8 0 0 0 13.6 0C18.8 9.8 12 2.5 12 2.5Z" fill="#ff5a36" />
            <circle cx="9.6" cy="15.4" r="1.7" fill="#ffd9cc" opacity="0.8" />
          </svg>
        </span>
        <span className="font-display text-[19px] font-extrabold leading-none tracking-tight text-[#eaf2ff]">copec</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2">
      <span className="grid h-7 w-7 place-items-center rounded-lg text-[14px] font-bold" style={{ background: `${acentoHex[marca.acento]}1f`, color: acentoHex[marca.acento] }}>{marca.glyph}</span>
      <span className="font-display text-[18px] font-extrabold tracking-tight text-ink">{marca.nombre}</span>
    </span>
  );
}

function SectionHead({ icon: Icon, title, action, onAction }: { icon: any; title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-surface-2 text-cyan"><Icon size={15} /></span>
        <span className="text-[14px] font-bold text-ink">{title}</span>
      </div>
      {action && <button onClick={onAction} className="flex items-center gap-1 text-[11.5px] font-semibold text-ink-soft transition-colors hover:text-cyan">{action} <ArrowRight size={13} /></button>}
    </div>
  );
}
