import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Map as MapIcon } from "lucide-react";
import { LATLNG, SANTIAGO, CHILE_CENTER, ENVIO_META, type Canje } from "./pdata";

type ZoomTo = "chile" | "rm";

/* Mapa real (Leaflet + tiles oscuros CartoDB, sin API key).
   Un pin por comuna, dimensionado por nº de envíos; popup con el detalle. */
export function MapaCanjes({ data }: { data: Canje[] }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const [zoom, setZoom] = useState<ZoomTo>("chile");

  // init una sola vez
  useEffect(() => {
    if (!el.current || map.current) return;
    const m = L.map(el.current, { zoomControl: true, attributionControl: false, scrollWheelZoom: false }).setView(CHILE_CENTER, 4);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd", maxZoom: 19,
    }).addTo(m);
    layer.current = L.layerGroup().addTo(m);
    map.current = m;
    // fix de tamaño tras montar en el contenedor flex
    setTimeout(() => m.invalidateSize(), 120);
    return () => { m.remove(); map.current = null; };
  }, []);

  // pins por comuna cuando cambia la data
  useEffect(() => {
    const lg = layer.current;
    if (!lg) return;
    lg.clearLayers();

    const byComuna = new Map<string, Canje[]>();
    for (const c of data) {
      if (!LATLNG[c.comuna]) continue;
      const arr = byComuna.get(c.comuna) ?? [];
      arr.push(c);
      byComuna.set(c.comuna, arr);
    }
    const max = Math.max(1, ...[...byComuna.values()].map((v) => v.length));
    const bounds: L.LatLngExpression[] = [];

    for (const [comuna, list] of byComuna) {
      const [lat, lng] = LATLNG[comuna];
      bounds.push([lat, lng]);
      const n = list.length;
      const size = 26 + Math.round((n / max) * 18);
      const html = `<div style="
        width:${size}px;height:${size}px;line-height:${size}px;border-radius:50%;
        background:radial-gradient(circle at 35% 30%, #e3c584, #c9a24b);
        color:#141210;font-weight:800;font-size:${n >= 10 ? 12 : 13}px;text-align:center;
        box-shadow:0 0 0 3px rgba(201,162,75,.28), 0 6px 16px rgba(0,0,0,.5);
        border:1.5px solid rgba(255,255,255,.6);">${n}</div>`;
      const icon = L.divIcon({ html, className: "", iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
      const region = list[0].region;
      const filas = list
        .map((c) => {
          const m = ENVIO_META[c.estado];
          return `<div style="display:flex;align-items:center;gap:6px;padding:3px 0;border-top:1px solid rgba(255,255,255,.08)">
            <span style="font-size:14px">${c.avatar}</span>
            <span style="flex:1;min-width:0">
              <b style="color:#f4efe8;font-size:11.5px">${c.handle}</b>
              <span style="display:block;color:#a79f95;font-size:10.5px">${c.producto}</span>
            </span>
            <span style="color:${m.tint};font-size:10px;font-weight:700;white-space:nowrap">${m.label}</span>
          </div>`;
        })
        .join("");
      const popup = `<div style="min-width:210px;font-family:inherit">
        <div style="color:#c9a24b;font-weight:800;font-size:13px">${comuna}</div>
        <div style="color:#a79f95;font-size:10.5px;margin-bottom:2px">${region} · ${n} ${n === 1 ? "envío" : "envíos"}</div>
        ${filas}
      </div>`;
      L.marker([lat, lng], { icon }).addTo(lg).bindPopup(popup, { closeButton: true });
    }

    // encuadre según zona
    const m = map.current!;
    if (zoom === "rm") m.setView(SANTIAGO, 10, { animate: true });
    else if (bounds.length) m.fitBounds(L.latLngBounds(bounds).pad(0.25), { animate: true });
    else m.setView(CHILE_CENTER, 4);
  }, [data, zoom]);

  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-2 font-display text-[15px] font-bold text-content">
          <MapIcon size={15} className="text-cyan" /> Mapa de despachos
        </div>
        <div className="flex items-center gap-1 rounded-xl bg-white/6 p-1 ring-1 ring-white/10">
          {(["chile", "rm"] as const).map((z) => (
            <button
              key={z}
              onClick={() => setZoom(z)}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-colors ${zoom === z ? "bg-cyan text-content-inverted" : "text-content-secondary hover:text-content"}`}
            >
              {z === "chile" ? "Todo Chile" : "Región Metropolitana"}
            </button>
          ))}
        </div>
      </div>
      <div ref={el} className="h-[420px] w-full" style={{ background: "#0e1013" }} />
    </div>
  );
}
