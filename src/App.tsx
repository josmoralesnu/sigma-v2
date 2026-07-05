import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";
import { Sidebar, type View } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { Home } from "./screens/Home";
import { Analisis } from "./screens/Analisis";
import { NewCampaign } from "./screens/NewCampaign";
import { Insights } from "./screens/Insights";
import { Cerebro } from "./screens/Cerebro";
import { Campañas, Tendencias, Aprendizajes, Reportes } from "./screens/OtherScreens";
import { PanelResultados } from "./centro/PanelResultados";
import { PanelBrand } from "./centro/PanelBrand";
import { Contenidos } from "./centro/Contenidos";
import { Calendario } from "./centro/Calendario";
import { Gantt } from "./centro/Gantt";
import { Sentimiento } from "./centro/Sentimiento";
import { Atribucion } from "./centro/Atribucion";
import { Roster } from "./centro/Roster";
import { GrillasOrganicas } from "./centro/GrillasOrganicas";
import { Aprobacion } from "./centro/Aprobacion";
import { PuigDashboard } from "./puig/PuigDashboard";
import { PuigInicio } from "./puig/PuigInicio";
import { PuigSentimiento } from "./puig/PuigSentimiento";
import { Submarcas } from "./puig/Submarcas";
import { Casting } from "./puig/Casting";
import { Canjes } from "./puig/Canjes";
import { CampañaDetalle } from "./puig/CampañaDetalle";
import { PuigProvider } from "./puig/store";
import { pcampañas } from "./puig/pdata";
import { CentroProvider } from "./centro/store";
import { setPanelData } from "./centro/panel";
import { marcas, campañas as campañasSeed, actividadSeed, cliente, fmt, setBrandData, type Marca, type Campaña } from "./lib/data";

const BETTING = new Set(["betsson", "estelarbet"]);
import { BUDGET_DEFAULT, type Plan } from "./lib/budget";

interface ActividadItem { t: string; txt: string; color: string }

export default function App() {
  const [view, setViewRaw] = useState<View>(() => (marcas[0].id === "puig" ? "puig-inicio" : "inicio"));
  // inicializa los live bindings de data.ts con la marca por defecto (si no, arrancan en COPEC)
  const [marca, setMarca] = useState<Marca>(() => { setBrandData(marcas[0].id); setPanelData(marcas[0].id); return marcas[0]; });
  const betting = BETTING.has(marca.id);
  const [thinking, setThinking] = useState(false);
  const [presupuesto, setPresupuesto] = useState(BUDGET_DEFAULT);

  const [cerebroToken, setCerebroToken] = useState(0);
  const [cerebroAnimated, setCerebroAnimated] = useState(0);

  // tema claro/oscuro (persistido)
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try { return (localStorage.getItem("sigma.theme") as "dark" | "light") || "dark"; } catch { return "dark"; }
  });
  const toggleTheme = () => setTheme((t) => { const n = t === "dark" ? "light" : "dark"; try { localStorage.setItem("sigma.theme", n); } catch { /* noop */ } return n; });

  // Puig: campaña activa para el detalle/panel y el casting
  const [puigCamp, setPuigCamp] = useState(pcampañas[0].id);
  const [puigSub, setPuigSub] = useState<string>("todas");
  const abrirCampaña = (id: string) => { setPuigCamp(id); go("puig-campana"); };
  const abrirSubmarca = (id: string) => { setPuigSub(id); go("puig-marcas"); };

  // loop de retroalimentación: campañas creadas + actividad alimentan al sistema
  const [campañasExtra, setCampañasExtra] = useState<Campaña[]>([]);
  const [actividad, setActividad] = useState<ActividadItem[]>(actividadSeed);
  const [seq, setSeq] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const go = (v: View) => { setThinking(false); setViewRaw(v); };
  const activarCerebro = (navigate = true) => { setCerebroToken((t) => t + 1); if (navigate) go("cerebro"); };

  // cambiar de cliente: reasigna los datasets y reinicia el flujo para la nueva marca
  const cambiarMarca = (m: Marca) => {
    if (m.id === marca.id) return;
    setBrandData(m.id);
    setPanelData(m.id);
    setMarca(m);
    setCampañasExtra([]);
    setActividad(actividadSeed);
    setCerebroToken(0);
    setCerebroAnimated(0);
    setSeq(0);
    setThinking(false);
    setViewRaw(m.id === "puig" ? "puig-inicio" : "inicio");
  };

  const onAprobar = (titulo: string, plan: Plan) => {
    const id = `cu${seq}`;
    setSeq((s) => s + 1);
    const nueva: Campaña = {
      id, nombre: titulo, marca: cliente.marca, estado: "En estrategia",
      progreso: 14, alcance: fmt(plan.totalReach), ventana: cliente.ventana,
    };
    setCampañasExtra((c) => [nueva, ...c]);
    setActividad((a) => [
      { t: "ahora", txt: `Campaña creada: “${titulo}” — alimentando al cerebro (${plan.elegidos.length} creadores · alcance ${fmt(plan.totalReach)})`, color: "lime" },
      ...a,
    ]);
    setToast(`“${titulo}” creada · la sala de control y el cerebro se actualizaron`);
  };

  const allCampañas = [...campañasExtra, ...campañasSeed];

  return (
    <PuigProvider>
    <CentroProvider key={marca.id} brandId={marca.id}>
    <div className={`grain relative flex h-screen w-screen overflow-hidden bg-canvas brand-${marca.id} ${theme === "light" ? "theme-light" : ""}`}>
      <div className="pointer-events-none absolute inset-0 bg-aura opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

      <Sidebar view={view} setView={go} marca={marca} setMarca={cambiarMarca} betting={betting} />

      <div className="relative flex min-w-0 flex-1 flex-col">
        <Topbar view={view} marca={marca} thinking={thinking} theme={theme} onToggleTheme={toggleTheme} onNueva={() => go("nueva")} />

        <main key={marca.id} className="relative min-h-0 flex-1">
          {view === "inicio" && <Home setView={go} marca={marca} campañas={allCampañas} actividad={actividad} />}
          {view === "analisis" && <Analisis onGenerar={() => go("nueva")} />}
          {view === "nueva" && <NewCampaign marca={marca} presupuesto={presupuesto} setPresupuesto={setPresupuesto} onThinking={setThinking} onFinish={() => go("insights")} />}
          {view === "insights" && <Insights onThinking={setThinking} onContinue={() => activarCerebro(true)} />}
          {view === "cerebro" && (
            <Cerebro
              token={cerebroToken}
              animatedToken={cerebroAnimated}
              onAnimated={setCerebroAnimated}
              presupuesto={presupuesto}
              onThinking={setThinking}
              onGoNueva={() => go("nueva")}
              onGoAnalisis={() => go("analisis")}
              onActivate={() => activarCerebro(false)}
              onAprobar={onAprobar}
            />
          )}
          {view === "campañas" && <Campañas campañas={allCampañas} />}
          {view === "tendencias" && <Tendencias />}
          {view === "aprendizajes" && <Aprendizajes />}
          {view === "reportes" && <Reportes />}
          {view === "panel" && (betting ? <PanelResultados /> : <PanelBrand />)}
          {view === "contenidos" && <Contenidos />}
          {view === "calendario" && <Calendario />}
          {view === "gantt" && <Gantt />}
          {view === "sentimiento" && <Sentimiento />}
          {view === "atribucion" && (betting ? <Atribucion /> : <PanelBrand />)}
          {view === "organico" && <GrillasOrganicas />}
          {view === "produccion" && <Aprobacion />}
          {view === "roster" && <Roster />}
          {view === "puig-inicio" && <PuigInicio onOpenSubmarca={abrirSubmarca} onCerebro={() => go("cerebro")} onDashboard={() => go("puig-dashboard")} />}
          {view === "puig-sentimiento" && <PuigSentimiento onBack={() => go("puig-dashboard")} />}
          {view === "puig-dashboard" && <PuigDashboard onOpenSubmarca={abrirSubmarca} onVerCampanas={() => { setPuigSub("todas"); go("puig-marcas"); }} onVerSentimiento={() => go("puig-sentimiento")} />}
          {view === "puig-marcas" && <Submarcas onCasting={() => go("casting")} onCanjes={() => go("canjes")} onOpenCampaña={abrirCampaña} initialSub={puigSub} />}
          {view === "puig-campana" && <CampañaDetalle campId={puigCamp} onBack={() => go("puig-marcas")} onCasting={() => go("casting")} />}
          {view === "casting" && <Casting campId={puigCamp} onCampChange={setPuigCamp} />}
          {view === "canjes" && <Canjes />}
        </main>
      </div>

      {/* toast de retroalimentación */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 16, x: "-50%" }}
            className="glass fixed bottom-6 left-1/2 z-[100] flex items-center gap-2.5 rounded-xl px-4 py-3"
          >
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-lime/15 text-lime"><Sparkles size={15} /></span>
            <span className="text-[12.5px] font-medium text-content">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </CentroProvider>
    </PuigProvider>
  );
}
