import { Camera, MonitorPlay, Gamepad2, AtSign, Music2, Globe } from "lucide-react";
import type { Plataforma } from "./panel";

/* lucide quitó los íconos de marca (Instagram/YouTube/Twitch/X) por trademark;
   usamos genéricos reconocibles que evocan cada red. */

/* ============================================================
   Fuente única de identidad visual por red social (RRSS).
   Antes había dos mapas de color duplicados (Contenidos /
   Grillas orgánicas). Centralizado acá: color de punto, clase
   de texto e ícono lucide por plataforma.
   ============================================================ */
export interface PlatMeta { dot: string; text: string; Icon: any; label: string }

export const PLAT_META: Record<Plataforma, PlatMeta> = {
  Instagram: { dot: "#f0529b", text: "text-rose", Icon: Camera, label: "Instagram" },
  TikTok: { dot: "#22d3ee", text: "text-ink", Icon: Music2, label: "TikTok" },
  YouTube: { dot: "#f87171", text: "text-negative", Icon: MonitorPlay, label: "YouTube" },
  Twitch: { dot: "#a78bfa", text: "text-violet", Icon: Gamepad2, label: "Twitch" },
  X: { dot: "#e7e7ea", text: "text-ink", Icon: AtSign, label: "X" },
};

const FALLBACK: PlatMeta = { dot: "var(--color-cyan)", text: "text-ink-soft", Icon: Globe, label: "—" };

export const platMeta = (p: string): PlatMeta => PLAT_META[p as Plataforma] ?? FALLBACK;
