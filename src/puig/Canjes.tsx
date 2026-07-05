import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { PackageCheck, Truck, MapPin, Filter, Clock, Package, PackageOpen, Home, Sparkles } from "lucide-react";
import { Wrap, PageHeader, container, item } from "../centro/parts";
import { MapaCanjes } from "./MapaCanjes";
import {
  canjes, submarcas, submarcaById, ENVIO_FLOW, ENVIO_META,
  type Canje, type EnvioEstado,
} from "./pdata";

export function Canjes() {
  const [sub, setSub] = useState<"todas" | string>("todas");
  const data = useMemo(() => (sub === "todas" ? canjes : canjes.filter((c) => c.submarca === sub)), [sub]);

  const total = data.length;
  const completados = data.filter((c) => c.estado === "Entregado" || c.estado === "Publicado").length;
  const enCamino = data.filter((c) => c.estado === "Despachado" || c.estado === "En tránsito").length;
  const regiones = data.filter((c) => c.zona === "Regiones").length;
  const pctRegiones = total ? Math.round((regiones / total) * 100) : 0;

  const porEstado = (e: EnvioEstado) => data.filter((c) => c.estado === e).length;

  return (
    <Wrap>
      <PageHeader
        icon={<PackageCheck size={22} />}
        titulo="Canjes / Seeding"
        subtitulo={
          <>
            <span>Seguimiento de envíos de producto a los influencers</span>
            <span className="text-content-muted">·</span>
            <span className="font-semibold text-cyan">{pctRegiones}% a regiones</span>
          </>
        }
        right={
          <div className="flex items-center gap-1 rounded-xl bg-[var(--sf-1)] p-1 ring-1 ring-[var(--ln-1)]">
            <SubBtn active={sub === "todas"} onClick={() => setSub("todas")}>Todas</SubBtn>
            {submarcas.map((s) => (
              <SubBtn key={s.id} active={sub === s.id} onClick={() => setSub(s.id)} tint={s.tint}>{s.glyph}</SubBtn>
            ))}
          </div>
        }
      />

      {/* KPIs */}
      <motion.div variants={container} initial="hidden" animate="show" className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Canjes totales" value={String(total)} sub="en la campaña" />
        <Kpi label="Entregados / publicados" value={String(completados)} sub={`${total ? Math.round((completados / total) * 100) : 0}% completado`} accent />
        <Kpi label="En camino" value={String(enCamino)} sub="despachado + tránsito" />
        <Kpi label="Destino regiones" value={`${pctRegiones}%`} sub={`${regiones} fuera de la RM`} />
      </motion.div>

      {/* pipeline de estados — track animado */}
      <Pipeline data={data} total={total} porEstado={porEstado} />

      {/* barra de distribución por estado */}
      <div className="glass mb-5 rounded-2xl p-4">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-content-muted">Distribución de {total} envíos</span>
          <span className="text-[11px] text-content-muted">{completados} completados · {enCamino} en camino</span>
        </div>
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-[var(--sf-1)]">
          {ENVIO_FLOW.map((e) => {
            const n = porEstado(e);
            if (n === 0) return null;
            return (
              <motion.div key={e} title={`${ENVIO_META[e].label}: ${n}`} className="h-full first:rounded-l-full last:rounded-r-full"
                style={{ background: ENVIO_META[e].tint }} initial={{ width: 0 }} animate={{ width: `${(n / total) * 100}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
            );
          })}
        </div>
        <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
          {ENVIO_FLOW.map((e) => {
            const n = porEstado(e);
            return (
              <span key={e} className="inline-flex items-center gap-1.5 text-[11px] text-content-secondary">
                <span className="h-2 w-2 rounded-full" style={{ background: ENVIO_META[e].tint }} /> {ENVIO_META[e].label} <span className="font-semibold text-content">{n}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* mapa real de despachos + resumen por zona */}
      <div className="mb-5 grid gap-3 lg:grid-cols-[1.6fr_1fr]">
        <MapaCanjes data={data} />
        <ZonaResumen data={data} />
      </div>

      {/* tabla de envíos */}
      <div className="glass overflow-hidden rounded-2xl">
        <div className="flex items-center gap-2 border-b border-line px-5 py-3 text-[12px] font-semibold uppercase tracking-wide text-content-muted">
          <Filter size={13} /> Detalle de envíos ({data.length})
        </div>
        <div className="overflow-x-auto scroll-slim">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-line text-[11px] uppercase tracking-wide text-content-muted">
                <th className="px-4 py-2.5 font-semibold">Influencer</th>
                <th className="px-4 py-2.5 font-semibold">Producto</th>
                <th className="px-4 py-2.5 font-semibold">Estado</th>
                <th className="px-4 py-2.5 font-semibold">Destino</th>
                <th className="px-4 py-2.5 font-semibold">Courier · Tracking</th>
                <th className="px-4 py-2.5 font-semibold">Fecha</th>
              </tr>
            </thead>
            <motion.tbody variants={container} initial="hidden" animate="show">
              {data.map((c) => {
                const s = submarcaById(c.submarca);
                return (
                  <motion.tr key={c.id} variants={item} className="border-b border-line/60 hover:bg-[var(--hov)]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-8 w-8 place-items-center rounded-full text-[15px] ring-1 ring-[var(--ln-2)]" style={{ background: `${c.fotoTint}2e` }}>{c.avatar}</span>
                        <div className="leading-tight">
                          <div className="text-[12.5px] font-semibold text-content">{c.nombre}</div>
                          <div className="text-[11px] text-content-muted">{c.handle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[12.5px] text-content">{c.producto}</div>
                      <span className="mt-0.5 inline-block rounded text-[10.5px] font-semibold" style={{ color: s?.tint }}>{s?.nombre}</span>
                    </td>
                    <td className="px-4 py-3"><Badge estado={c.estado} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-[12.5px] text-content-secondary"><MapPin size={12} className="text-content-muted" /> {c.comuna}</div>
                      <div className="text-[10.5px] text-content-muted">{c.region} · {c.zona}</div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-content-secondary">
                      <div>{c.courier}</div>
                      <div className="font-mono text-[10.5px] text-content-muted">{c.tracking}</div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-content-muted">{c.fecha}</td>
                  </motion.tr>
                );
              })}
            </motion.tbody>
          </table>
        </div>
      </div>
    </Wrap>
  );
}

function SubBtn({ active, onClick, children, tint }: { active: boolean; onClick: () => void; children: React.ReactNode; tint?: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition-colors ${active ? "text-content-inverted" : "text-content-secondary hover:text-content"}`}
      style={active ? { background: tint ?? "var(--color-cyan)" } : undefined}
      title={typeof children === "string" ? undefined : undefined}
    >
      {children}
    </button>
  );
}

function Kpi({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <motion.div variants={item} className={`glass rounded-2xl p-4 ${accent ? "ring-1 ring-cyan/30" : ""}`}>
      <div className="text-[11px] font-medium uppercase tracking-wide text-content-muted">{label}</div>
      <div className={`mt-1 font-display text-[26px] font-bold leading-none ${accent ? "text-cyan" : "text-content"}`}>{value}</div>
      <div className="mt-1.5 text-[11.5px] text-content-muted">{sub}</div>
    </motion.div>
  );
}

function Badge({ estado }: { estado: EnvioEstado }) {
  const m = ENVIO_META[estado];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11.5px] font-semibold" style={{ background: `${m.tint}1c`, color: m.tint }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.tint }} />
      {m.label}
    </span>
  );
}

/* ============================ MAPAS ============================ */
const ACCENT = "var(--color-cyan)";

function countBy<K extends string>(data: Canje[], key: (c: Canje) => K) {
  const m = new Map<K, number>();
  for (const c of data) m.set(key(c), (m.get(key(c)) ?? 0) + 1);
  return m;
}

/* ---------- pipeline animado ---------- */
const STAGE_ICON: Record<EnvioEstado, any> = {
  "Pendiente": Clock, "Preparando": PackageOpen, "Despachado": Package,
  "En tránsito": Truck, "Entregado": Home, "Publicado": Sparkles,
};
function Pipeline({ data, total, porEstado }: { data: Canje[]; total: number; porEstado: (e: EnvioEstado) => number }) {
  const avgIdx = total ? ENVIO_FLOW.reduce((a, e, i) => a + porEstado(e) * i, 0) / total : 0;
  const fillPct = (avgIdx / (ENVIO_FLOW.length - 1)) * 100;
  const SPAN = 83.34; // % entre el centro del 1er y último nodo (grid de 6)
  void data;
  return (
    <div className="glass mb-3 rounded-2xl p-5">
      <div className="mb-1 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wide text-content-muted">
        <Truck size={14} /> Estado de los envíos
      </div>
      <div className="relative mt-5">
        {/* línea base + progreso */}
        <div className="absolute top-[24px] h-[3px] rounded-full bg-[var(--sf-2)]" style={{ left: "8.33%", right: "8.33%" }} />
        <motion.div className="absolute top-[24px] h-[3px] rounded-full bg-gradient-to-r from-cyan/60 to-cyan" style={{ left: "8.33%" }} initial={{ width: 0 }} animate={{ width: `${(fillPct / 100) * SPAN}%` }} transition={{ duration: 1, ease: "easeOut" }} />
        <div className="relative grid grid-cols-6 gap-1">
          {ENVIO_FLOW.map((e, i) => {
            const n = porEstado(e);
            const meta = ENVIO_META[e];
            const Icon = STAGE_ICON[e];
            const on = n > 0;
            return (
              <motion.div key={e} className="flex flex-col items-center"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <div className="grid h-12 w-12 place-items-center rounded-full ring-2 transition-colors"
                  style={{ background: on ? `${meta.tint}1f` : "rgba(255,255,255,.03)", boxShadow: `0 0 0 2px ${on ? meta.tint : "rgba(255,255,255,.08)"}`, borderColor: "transparent" }}>
                  <Icon size={18} style={{ color: on ? meta.tint : "rgba(255,255,255,.35)" }} />
                </div>
                <span className="mt-2 font-display text-[20px] font-bold leading-none" style={{ color: on ? meta.tint : "var(--color-content-muted)" }}>{n}</span>
                <span className="mt-1 text-center text-[10.5px] font-medium text-content-secondary">{meta.label.replace(" ✦", "")}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ZonaResumen({ data }: { data: Canje[] }) {
  const rm = data.filter((c) => c.zona === "RM").length;
  const reg = data.filter((c) => c.zona === "Regiones").length;
  const total = Math.max(1, rm + reg);
  const regionCounts = [...countBy(data.filter((c) => c.zona === "Regiones"), (c) => c.region).entries()].sort((a, b) => b[1] - a[1]);

  return (
    <motion.div variants={item} initial="hidden" animate="show" className="glass flex flex-col rounded-2xl p-5">
      <div className="mb-3 flex items-center gap-2 font-display text-[15px] font-bold text-content">
        <MapPin size={15} className="text-cyan" /> Destinos por zona
      </div>

      {/* RM vs Regiones */}
      <div className="space-y-3">
        {[
          { label: "Región Metropolitana", n: rm, tint: ACCENT },
          { label: "Regiones", n: reg, tint: "#6f93c4" },
        ].map((z) => (
          <div key={z.label}>
            <div className="mb-1 flex items-center justify-between text-[12px]">
              <span className="text-content-secondary">{z.label}</span>
              <span className="font-bold text-content">{z.n} <span className="text-content-muted">· {Math.round((z.n / total) * 100)}%</span></span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--sf-2)]">
              <motion.div className="h-full rounded-full" style={{ background: z.tint }} initial={{ width: 0 }} animate={{ width: `${(z.n / total) * 100}%` }} transition={{ duration: 0.7 }} />
            </div>
          </div>
        ))}
      </div>

      {/* ranking de regiones */}
      <div className="mt-4 border-t border-line pt-3">
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-content-muted">Regiones con envíos</div>
        <div className="space-y-0.5 overflow-y-auto scroll-slim" style={{ maxHeight: 210 }}>
          {regionCounts.map(([region, n]) => (
            <div key={region} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[var(--hov)]">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: "#6f93c4" }} />
              <span className="flex-1 text-[12px] text-content-secondary">{region}</span>
              <span className="text-[12.5px] font-bold text-content">{n}</span>
            </div>
          ))}
          {regionCounts.length === 0 && <div className="px-2 text-[12px] text-content-muted">Sin envíos a regiones.</div>}
        </div>
      </div>
    </motion.div>
  );
}
