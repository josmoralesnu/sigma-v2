import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, FileUp, ClipboardPaste, Sparkles, ArrowRight, Quote, TrendingUp, GraduationCap, Loader2, Check, FileAudio } from "lucide-react";
import { ReasoningStream } from "../components/ReasoningStream";
import { pasosTranscripcion, insightsReunion, tendencias, aprendizajes } from "../lib/data";
import { cn } from "../lib/cn";

const TRANSCRIPT = `[00:04] Cliente (Copec): nos preocupa Aramco, está creciendo muy rápido en la Ruta 5 con sus "Pit Stop". No podemos descuidar el verano.
[05:21] Cliente: el verano es clave, ahí se dispara el tráfico. Queremos estar donde la gente planifica el viaje.
[09:48] Agencia: ¿el foco es bencina o algo más?
[10:05] Cliente: que usen la App. Pagar, juntar beneficios... eso es lo que queremos empujar, no solo cargar.
[16:30] Cliente: y por favor, nada corporativo. Lo que funcionó fue darles libertad a los creadores.
[21:10] Cliente: ojo con la transparencia. Después del tema con el SERNAC, todo tiene que ir marcado como publicidad.`;

type Phase = "import" | "loading" | "ready" | "running" | "done";

export function Insights({ onContinue, onThinking }: { onContinue: () => void; onThinking: (b: boolean) => void }) {
  const [phase, setPhase] = useState<Phase>("import");
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const importar = (name?: string) => {
    if (name) setFileName(name);
    setPhase("loading");
    setTimeout(() => setPhase("ready"), 1600);
  };
  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) importar(f.name);
    e.target.value = ""; // permite re-subir el mismo archivo
  };
  const extraer = () => {
    setPhase("running");
    onThinking(true);
  };

  return (
    <div className="flex h-full flex-col">
      {/* sticky top action bar */}
      <div className="z-20 flex shrink-0 items-center gap-4 border-b border-line bg-graphite/60 px-8 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-surface-2 text-cyan"><Quote size={15} /></span>
          <div>
            <div className="text-[13px] font-bold text-ink">Reunión → Insights</div>
            <div className="kicker">{phase === "done" ? "insights listos" : "importa la reunión para empezar"}</div>
          </div>
        </div>
        <div className="flex-1" />
        <button
          onClick={onContinue}
          disabled={phase !== "done"}
          className={cn(
            "group flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-[13px] font-semibold transition-all",
            phase === "done" ? "bg-cyan text-void hover:shadow-[0_0_28px_-4px_var(--color-cyan)]" : "cursor-not-allowed border border-line text-ink-mute"
          )}
        >
          <Sparkles size={16} /> Activar cerebro
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
        <div className="mx-auto grid max-w-6xl grid-cols-12 gap-5">
          {/* left: import / transcript */}
          <div className="col-span-12 lg:col-span-5">
            <div className="rounded-2xl border border-line bg-surface/40 p-5">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface-2 text-cyan"><Mic size={16} /></span>
                <div>
                  <div className="text-[14px] font-bold text-ink">Reunión con el cliente</div>
                  <div className="kicker">{phase === "import" || phase === "loading" ? "sin importar" : "transcripción · 42 min"}</div>
                </div>
              </div>

              {/* hidden file input — abre el selector real del SO */}
              <input ref={fileRef} type="file" accept="audio/*,video/*,.txt,.vtt,.srt,.mp3,.m4a,.wav" className="hidden" onChange={onPick} />

              {/* import state */}
              {(phase === "import" || phase === "loading") && (
                <div
                  className="rounded-xl border border-dashed border-line bg-void/40 p-6 text-center transition-colors hover:border-cyan/40"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) importar(f.name); }}
                >
                  {phase === "loading" ? (
                    <div className="flex flex-col items-center gap-3 py-4">
                      <Loader2 size={26} className="animate-spin text-cyan" />
                      <div className="text-[12.5px] text-ink-soft">Importando y transcribiendo {fileName ? <span className="font-semibold text-ink">{fileName}</span> : "la reunión"}…</div>
                    </div>
                  ) : (
                    <>
                      <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl border border-line bg-surface-2 text-cyan"><FileUp size={22} /></div>
                      <div className="text-[13px] font-semibold text-ink">Importa la transcripción de la reunión</div>
                      <p className="mx-auto mt-1 max-w-xs text-[11.5px] text-ink-soft">Arrastra un audio, .txt o .vtt aquí — o pega el texto. Los insights salen de esta misma reunión.</p>
                      <div className="mt-4 flex justify-center gap-2">
                        <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 rounded-xl bg-cyan px-4 py-2.5 text-[12.5px] font-semibold text-void transition-all hover:shadow-[0_0_24px_-6px_var(--color-cyan)]"><FileUp size={14} /> Importar archivo</button>
                        <button onClick={() => importar()} className="flex items-center gap-1.5 rounded-xl border border-line px-4 py-2.5 text-[12.5px] font-semibold text-ink-soft transition-colors hover:text-ink"><ClipboardPaste size={14} /> Pegar texto</button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* transcript visible after import */}
              {(phase === "ready" || phase === "running" || phase === "done") && (
                <>
                  <div className="mb-2 flex items-center gap-2 text-[11px] text-lime">
                    <Check size={13} /> transcripción importada
                    {fileName && <span className="flex items-center gap-1 rounded-md border border-line bg-surface/60 px-1.5 py-0.5 font-mono text-[10px] text-ink-soft"><FileAudio size={10} className="text-cyan" /> {fileName}</span>}
                  </div>
                  <div className="max-h-[240px] overflow-y-auto rounded-xl border border-line bg-void/50 p-3.5 font-mono text-[11px] leading-relaxed text-ink-soft">
                    {TRANSCRIPT.split("\n").map((l, i) => <p key={i} className="mb-1.5">{l}</p>)}
                  </div>

                  {phase === "ready" && (
                    <button onClick={extraer} className="group mt-4 flex w-full items-center justify-center gap-2.5 rounded-xl bg-cyan px-5 py-3 text-[13px] font-semibold text-void transition-all hover:shadow-[0_0_28px_-4px_var(--color-cyan)]">
                      <Sparkles size={16} /> Extraer insights de la reunión
                    </button>
                  )}
                  {(phase === "running" || phase === "done") && (
                    <div className="mt-4 rounded-xl border border-line bg-void/40 p-3.5">
                      <ReasoningStream steps={pasosTranscripcion} running={phase === "running"} perStep={1100} onDone={() => { setPhase("done"); onThinking(false); }} />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* right: extracted insights */}
          <div className="col-span-12 lg:col-span-7">
            <div className="mb-3 flex items-center gap-2">
              <Quote size={15} className="text-cyan" />
              <span className="kicker">insights extraídos de la reunión</span>
            </div>

            {phase !== "done" ? (
              <div className="grid gap-2.5">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="rounded-xl border border-line bg-surface/40 p-4">
                    <div className="skeleton mb-2 h-2.5 w-1/4" />
                    <div className="skeleton h-3 w-5/6" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-2.5">
                {insightsReunion.map((r, i) => (
                  <motion.div key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.16 }} className="rounded-xl border border-line bg-surface/60 p-4">
                    <span className="chip py-0.5 text-cyan" style={{ borderColor: "var(--color-cyan)" }}>{r.tag}</span>
                    <p className="mt-1.5 text-[13px] leading-snug text-ink">“{r.texto}”</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* context strip */}
          <AnimatePresence>
            {phase === "done" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-12 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <MiniList icon={TrendingUp} title="Tendencias en alza" items={tendencias.slice(0, 3).map((t) => `${t.nombre.replace(/“|”/g, "")} · +${t.momentum}%`)} />
                <MiniList icon={GraduationCap} title="Aprendizajes recuperados" items={aprendizajes.slice(0, 3).map((a) => a.titulo)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function MiniList({ icon: Icon, title, items }: { icon: any; title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-line bg-surface/50 p-4">
      <div className="mb-2 flex items-center gap-2"><Icon size={14} className="text-cyan" /><span className="text-[12px] font-bold text-ink">{title}</span></div>
      <div className="space-y-1.5">
        {items.map((it) => <div key={it} className="flex items-start gap-2 text-[11.5px] text-ink-soft"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan" /> {it}</div>)}
      </div>
    </div>
  );
}
