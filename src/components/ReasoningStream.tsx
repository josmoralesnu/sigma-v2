import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check, Loader2 } from "lucide-react";

/**
 * Muestra una cadena de razonamiento revelada paso a paso, lenta a propósito.
 */
export function ReasoningStream({
  steps,
  perStep = 1100,
  running,
  onDone,
  compact = false,
}: {
  steps: string[];
  perStep?: number;
  running: boolean;
  onDone?: () => void;
  compact?: boolean;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!running) return;
    setI(0);
  }, [running, steps]);

  useEffect(() => {
    if (!running) return;
    if (i >= steps.length) {
      const t = setTimeout(() => onDone?.(), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setI((v) => v + 1), perStep);
    return () => clearTimeout(t);
  }, [running, i, steps.length, perStep]);

  return (
    <div className={compact ? "space-y-1" : "space-y-1.5"}>
      {steps.slice(0, i).map((s, idx) => (
        <motion.div key={idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-2.5">
          <Check size={13} className="mt-0.5 shrink-0 text-cyan" />
          <span className="font-mono text-[12px] leading-snug text-content-secondary">{s}</span>
        </motion.div>
      ))}
      {running && i < steps.length && (
        <div className="flex items-start gap-2.5">
          <Loader2 size={13} className="mt-0.5 shrink-0 animate-spin text-cyan" />
          <span className="font-mono text-[12px] leading-snug text-cyan caret">{steps[i]}</span>
        </div>
      )}
    </div>
  );
}
