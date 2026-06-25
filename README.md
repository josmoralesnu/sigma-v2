# Σ SIGMA v2 — la plataforma

Segunda versión, **independiente de la v1** (vive en su propia carpeta y en otro puerto).
Demo de la plataforma interna de Waller & Kluger para operar Influencer Marketing con IA.

- **v1** (la del raíz del proyecto) → `npm run dev` en `/` → http://localhost:5173
- **v2** (esta) → `npm run dev` en `/sigma-v2` → http://localhost:5174

## Qué cambia en v2

1. **Plataforma "entera"** — sidebar con secciones reales (Inicio, Nueva campaña, Insights,
   Cerebro, Tendencias, Aprendizajes, Campañas, Talento, Reportes) + **switcher de marca**.
2. **Wizard de nueva campaña dinámico** — Marca → Análisis de competencia (animado, con SOV y
   "espacio en blanco") → Importar links y campañas anteriores → Brief → Analizar.
3. **Insights con transcripción** — subes la reunión, Sigma extrae insights en vivo y los muestra.
4. **Transiciones lentas a propósito** — el cerebro "piensa": pausas, dots, reveals escalonados.
5. **Generación de conceptos en vivo** (el gran cambio) — en `Cerebro`, cada concepto se
   **construye por etapas**: territorio → rationale → ideas de contenido → tendencias de la
   ingesta → un aprendizaje pasado → influencers agrupados por arquetipo y mood. La **cámara
   sigue al cerebro** mientras genera cada uno. Control de **nivel creativo: Seguro / Audaz /
   Atrevido** que regenera conceptos más arriesgados.

## v2.1 — iteración (feedback)

- **Reunión no automática**: en Insights se **importa** la transcripción (archivo / pegar) y de
  esa reunión se extraen los insights. (`src/screens/Insights.tsx`)
- **“Activar cerebro” fijo arriba**: barra de acción superior, visible sin scroll.
- **Cerebro 3D**: núcleo neuronal en three.js que cambia de color y dispara sinapsis mientras
  piensa. Procedural (sin asset). Para usar un modelo real `.glb`, reemplazar `NeuralCore` por un
  `useGLTF('/brain.glb')` en `src/components/Brain3D.tsx`.
- **Estrategia en primer plano**: modal central (`src/components/ConceptoModal.tsx`) con
  **regenerar por pieza** (nombre / rationale / ideas) e influencers como **cards con foto +
  justificación**.
- **Presupuesto protagonista**: motor en `src/lib/budget.ts`. Según el monto recalcula la mezcla
  (menos macros / más micro-nano), da una **recomendación** y el **resultado esperado** (alcance,
  prueba, ER, CPM). Calibrar costos en `TIER_BASE` y el factor de `estFee`.

## Stack
Igual que v1 + **three / @react-three/fiber / @react-three/drei** para el cerebro 3D.
Vite + React 19 + TS + Tailwind v4 + @xyflow/react + motion + lucide.

## Dónde tocar
| Quiero cambiar…                         | Archivo                                  |
| --------------------------------------- | ---------------------------------------- |
| Conceptos, ideas, niveles creativos     | `src/lib/data.ts` (`conceptos`)          |
| Marcas / competidores / aprendizajes    | `src/lib/data.ts`                        |
| Velocidad del "pensar" (más/menos lento)| `src/screens/Cerebro.tsx` (`STAGGER`, `REVEAL`) y `ReasoningStream` (`perStep`) |
| El nodo generativo (etapas del reveal)  | `src/components/flow/nodes.tsx` (`ConceptoNode`) |
| Pasos del wizard                        | `src/screens/NewCampaign.tsx`            |
