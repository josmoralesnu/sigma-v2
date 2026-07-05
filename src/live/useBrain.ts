// Data del Cerebro para un usuario ya autenticado (100% API real, scopeado).
// Staff → switcher de marcas (?brand). Cliente → bloqueado a su marca (backend scopea).
import { useCallback, useEffect, useState } from "react";
import {
  brainApi,
  type ApiBrand,
  type ApiUser,
  type BrainCompetitor,
  type BrainInsight,
  type BrainMention,
  type BrainRecommendation,
  type BrainState,
} from "../lib/api";

export function useBrain(user: ApiUser) {
  const isStaff = user.role !== "client";
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [brandId, setBrandId] = useState<number | undefined>(
    !isStaff && user.brand ? user.brand : undefined,
  );
  const [state, setState] = useState<BrainState | null>(null);
  const [insights, setInsights] = useState<BrainInsight[]>([]);
  const [recs, setRecs] = useState<BrainRecommendation[]>([]);
  const [mentions, setMentions] = useState<BrainMention[]>([]);
  const [competitors, setCompetitors] = useState<BrainCompetitor[]>([]);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // El staff necesita la lista de marcas (switcher) y una marca por defecto.
  useEffect(() => {
    if (!isStaff) return;
    (async () => {
      try {
        const bs = await brainApi.brands();
        setBrands(bs);
        setBrandId((cur) => cur ?? bs.find((x) => /copec/i.test(x.name))?.id ?? bs[0]?.id);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    })();
  }, [isStaff]);

  // El cliente omite ?brand (el backend lo scopea); el staff lo pasa explícito.
  const bid = isStaff ? brandId : undefined;

  const load = useCallback(async () => {
    if (isStaff && brandId == null) return;
    try {
      const [st, ins, rc, mn, cp] = await Promise.all([
        brainApi.state(bid),
        brainApi.insights(bid),
        brainApi.recommendations(bid),
        brainApi.mentions(bid).catch(() => [] as BrainMention[]),
        brainApi.competitors(bid).catch(() => [] as BrainCompetitor[]),
      ]);
      setState(st);
      setInsights(ins);
      setRecs(rc);
      setMentions(mn);
      setCompetitors(cp);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [bid, brandId, isStaff]);

  useEffect(() => {
    load();
  }, [load]);

  const consolidate = useCallback(async () => {
    setThinking(true);
    try {
      await brainApi.consolidate(bid);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setThinking(false);
    }
  }, [bid, load]);

  const dismissInsight = useCallback(
    async (id: number) => {
      setInsights((x) => x.filter((i) => i.id !== id));
      try {
        await brainApi.insightAction(id, "dismiss", bid);
      } catch {
        load();
      }
    },
    [bid, load],
  );

  const actRecommendation = useCallback(
    async (id: number) => {
      try {
        const r = await brainApi.recommendationAction(id, "act", bid);
        setRecs((x) => x.map((o) => (o.id === id ? r : o)));
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    },
    [bid],
  );

  return {
    isStaff, brands, brandId, setBrandId, bid,
    state, insights, recs, mentions, competitors,
    thinking, error,
    load, consolidate, dismissInsight, actRecommendation,
  };
}
