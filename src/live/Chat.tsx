// Chatbot del Cerebro con streaming SSE real (/api/brain/chat/stream).
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { chatStream } from "../lib/api";

interface Turn { role: "user" | "assistant"; content: string }

const SUGERENCIAS = ["¿Cómo va el desempeño?", "¿Qué me recomiendas?", "¿Qué formato rinde mejor?", "¿Hay alertas?"];

export function Chat({ bid }: { bid?: number }) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const convRef = useRef<number | undefined>(undefined);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns]);

  const send = async (text: string) => {
    text = text.trim();
    if (!text || streaming) return;
    setInput("");
    setTurns((t) => [...t, { role: "user", content: text }, { role: "assistant", content: "" }]);
    setStreaming(true);
    try {
      await chatStream(
        { message: text, conversation: convRef.current, brandId: bid },
        (delta) =>
          setTurns((t) => {
            const c = [...t];
            c[c.length - 1] = { role: "assistant", content: c[c.length - 1].content + delta };
            return c;
          }),
        (done) => {
          convRef.current = done.conversation;
        },
      );
    } catch {
      setTurns((t) => {
        const c = [...t];
        c[c.length - 1] = { role: "assistant", content: "(no pude conectar con el cerebro)" };
        return c;
      });
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="panel flex h-[360px] flex-col overflow-hidden">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-cyan/15 text-cyan">
          <Sparkles size={14} />
        </span>
        <div>
          <div className="text-[13px] font-semibold text-content">Preguntá al cerebro</div>
          <div className="kicker">RAG · streaming en vivo</div>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {turns.length === 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {SUGERENCIAS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="chip glass-hover cursor-pointer hover:text-content"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {turns.map((t, i) => (
          <div key={i} className={t.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed " +
                (t.role === "user"
                  ? "bg-cyan/15 text-content"
                  : "glass text-content-secondary")
              }
            >
              {t.content || <span className="caret" />}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="flex items-center gap-2 border-t border-line px-3 py-2.5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Escribe una pregunta sobre la marca…"
          className="input"
        />
        <button
          onClick={() => send(input)}
          disabled={streaming || !input.trim()}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cyan text-content-inverted transition-opacity disabled:opacity-40"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
