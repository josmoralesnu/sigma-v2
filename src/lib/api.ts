// 🔌 Cliente del API del Cerebro (backend Django de WK) para el Sigma inmersivo.
// Espeja el patrón de agenciaos/src/lib/api/sigma.ts (JWT + refresh automático),
// pero Vite-flavored (import.meta.env) y con los endpoints /api/brain/*.
//
// El backend scopea TODO por marca: un usuario 'client' ve solo la suya; el staff
// (admin/account) pasa ?brand=<id> para elegir. Este cliente expone ese brandId
// opcional en cada llamada.

const BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '')
// AgenciaOS (portal operativo) — destino del deep-link SSO.
const AGENCIAOS = (import.meta.env.VITE_AGENCIAOS_URL ?? 'http://localhost:3007').replace(/\/$/, '')
const ACCESS_KEY = 'sigma_access'
const REFRESH_KEY = 'sigma_refresh'

function getToken(key: string): string | null {
  return typeof window === 'undefined' ? null : window.localStorage.getItem(key)
}
function setTokens(access: string, refresh?: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(ACCESS_KEY, access)
  if (refresh) window.localStorage.setItem(REFRESH_KEY, refresh)
}
export function logout() {
  window.localStorage.removeItem(ACCESS_KEY)
  window.localStorage.removeItem(REFRESH_KEY)
}
export function isAuthenticated(): boolean {
  return !!getToken(ACCESS_KEY)
}

// ── Tipos del contrato del backend (subconjunto que usa el front) ──
export interface ApiUser {
  id: number; username: string; email: string; name: string; initials: string
  role: 'admin' | 'account' | 'client' | 'viewer'; avatar_url: string
  brand: number | null; brand_name: string | null
}
export interface ApiBrand {
  id: number; name: string; slug: string; accent: string; logo_url: string
  website: string; notes: string
}

export interface BrainSignals {
  current?: Record<string, number>
  velocity?: Record<string, number | null>
  acceleration?: Record<string, number | null>
  deviation_vs_goal?: Record<string, number>
  deviation_vs_market?: { eng_rate?: number; market_eng_rate?: number; competitors?: number }
  outliers?: { post_id: number; code: string; platform: string; eng_rate: number; reach: number }[]
  momentum?: string
  coverage?: { campaigns: number; days: number; posts_with_metrics: number }
  period?: { start?: string; end?: string }
}
export interface BrainState {
  brandId: number; brandName: string; brandSlug: string; accent: string
  status: string; archetype: string; objective: string
  voice: Record<string, unknown>; guardrails: Record<string, unknown>
  kpiTargets: Record<string, unknown>; version: number; consolidatedAt: string | null
  vectorNamespace: string; state: Record<string, unknown>
  signals: BrainSignals; narrative: string; selfModel: Record<string, unknown>
  snapshotId: number | null; snapshotAt: string | null; hasData: boolean
}
export interface BrainInsight {
  id: number; key: string; kind: string; tone: 'positivo' | 'alerta' | 'neutral'
  priority: number; title: string; narrative: string; evidence: Record<string, unknown>
  scope: Record<string, unknown>; confidence: number; status: string; createdAt: string
}
export interface BrainRecommendation {
  id: number; key: string; title: string; action: string; rationale: string
  palanca: string; priority: number; expectedEffect: Record<string, unknown>
  status: string; outcome: Record<string, unknown>; outcomeStatus: string
  actedAt: string | null; createdAt: string
}
export interface BrainMessage {
  id: number; role: string; content: string; retrieval: Record<string, unknown>
  citations: unknown[]; model: string; createdAt: string
}
export interface BrainConversation {
  id: number; title: string; status: string; brandId: number
  lastMessageAt: string | null; createdAt: string; messages?: BrainMessage[]
}
export interface BrainMention {
  id: number; platform: string; source: string; author: string; authorFollowers: number
  text: string; url: string; takenAt: string | null; sentiment: string
  sentimentScore: number | null; status: string; createdAt: string
}
export interface BrainCompetitor {
  id: number; brand: number; platform: string; username: string; display_name: string
  is_active: boolean; notes: string; latest: { date: string; followers: number; engRate: number } | null
}

// ── Auth ──
export async function login(username: string, password: string): Promise<ApiUser> {
  const res = await fetch(`${BASE}/api/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) throw new Error(`Login falló (${res.status})`)
  const data = await res.json()
  setTokens(data.access, data.refresh)
  return data.user
}

async function refresh(): Promise<boolean> {
  const r = getToken(REFRESH_KEY)
  if (!r) return false
  const res = await fetch(`${BASE}/api/auth/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: r }),
  })
  if (!res.ok) { logout(); return false }
  const data = await res.json()
  setTokens(data.access)
  return true
}

/** Guarda el token de un hand-off SSO (deep-link desde/hacia agenciaos). */
export function adoptToken(access: string, refreshToken?: string) {
  setTokens(access, refreshToken)
}

/** URL de hand-off SSO hacia AgenciaOS: lleva el JWT actual → la sesión salta con el
 *  usuario al portal operativo (mismas llaves de token; distinto origen). */
export function agenciaosSsoUrl(next = "/portal/marca"): string {
  const a = getToken(ACCESS_KEY) ?? "";
  const r = getToken(REFRESH_KEY) ?? "";
  return `${AGENCIAOS}/sso?access=${encodeURIComponent(a)}&refresh=${encodeURIComponent(r)}&next=${encodeURIComponent(next)}`;
}

function authHeaders(): Record<string, string> {
  const t = getToken(ACCESS_KEY)
  return {
    'Content-Type': 'application/json',
    ...(t ? { Authorization: `Bearer ${t}` } : {}),
  }
}

async function apiFetch<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const doFetch = () => fetch(`${BASE}${path}`, { ...init, headers: { ...authHeaders(), ...(init.headers ?? {}) } })
  let res = await doFetch()
  if (res.status === 401 && (await refresh())) res = await doFetch()
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`)
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

function unwrap<T>(d: unknown): T[] {
  if (Array.isArray(d)) return d as T[]
  if (d && typeof d === 'object' && 'results' in d) return (d as { results: T[] }).results
  return []
}

// ?brand=<id> para staff; el cliente lo omite (el backend lo scopea a su marca).
const q = (brandId?: number) => (brandId ? `?brand=${brandId}` : '')

// ── Endpoints del Cerebro ──
export const brainApi = {
  me: () => apiFetch<ApiUser>('/api/auth/me/'),
  brands: async () => unwrap<ApiBrand>(await apiFetch('/api/brands/')),

  state: (brandId?: number) => apiFetch<BrainState>(`/api/brain/state/${q(brandId)}`),
  consolidate: (brandId?: number) =>
    apiFetch<BrainState>(`/api/brain/consolidate/${q(brandId)}`, { method: 'POST' }),
  configure: (patch: Record<string, unknown>, brandId?: number) =>
    apiFetch<BrainState>(`/api/brain/configure/${q(brandId)}`, { method: 'PATCH', body: JSON.stringify(patch) }),

  insights: (brandId?: number) => apiFetch<BrainInsight[]>(`/api/brain/insights/${q(brandId)}`),
  insightAction: (id: number, action: 'acknowledge' | 'dismiss', brandId?: number) =>
    apiFetch<BrainInsight>(`/api/brain/insights/${id}/${action}/${q(brandId)}`, { method: 'POST' }),
  recommendations: (brandId?: number) => apiFetch<BrainRecommendation[]>(`/api/brain/recommendations/${q(brandId)}`),
  recommendationAction: (id: number, action: 'accept' | 'act' | 'reject', brandId?: number) =>
    apiFetch<BrainRecommendation>(`/api/brain/recommendations/${id}/${action}/${q(brandId)}`, { method: 'POST' }),

  conversations: (brandId?: number) => apiFetch<BrainConversation[]>(`/api/brain/conversations/${q(brandId)}`),
  conversation: (id: number, brandId?: number) =>
    apiFetch<BrainConversation>(`/api/brain/conversations/${id}/${q(brandId)}`),
  chat: (message: string, opts: { conversation?: number; brandId?: number } = {}) =>
    apiFetch<BrainMessage & { conversation: number }>(`/api/brain/chat/${q(opts.brandId)}`, {
      method: 'POST', body: JSON.stringify({ message, conversation: opts.conversation }),
    }),

  feedback: (
    body: { targetType: string; targetId: number; usefulness?: string; actedOn?: boolean; note?: string },
    brandId?: number,
  ) => apiFetch(`/api/brain/feedback/${q(brandId)}`, { method: 'POST', body: JSON.stringify(body) }),

  mentions: (brandId?: number) => apiFetch<BrainMention[]>(`/api/brain/mentions/${q(brandId)}`),
  competitors: async (brandId?: number) =>
    unwrap<BrainCompetitor>(await apiFetch(`/api/competitors/${q(brandId)}`)),
}

/** Chatbot en streaming (SSE). Llama onDelta por cada token y onDone al cerrar. */
export async function chatStream(
  opts: { message: string; conversation?: number; brandId?: number },
  onDelta: (t: string) => void,
  onDone: (d: { messageId: number; content: string; conversation: number; retrieval: unknown }) => void,
): Promise<void> {
  const res = await fetch(`${BASE}/api/brain/chat/stream/${q(opts.brandId)}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ message: opts.message, conversation: opts.conversation }),
  })
  if (!res.ok || !res.body) throw new Error(`chat/stream → ${res.status}`)

  const reader = res.body.getReader()
  const dec = new TextDecoder()
  let buf = ''
  const handle = (chunk: string) => {
    let event = 'message'
    let data = ''
    for (const line of chunk.split('\n')) {
      if (line.startsWith('event:')) event = line.slice(6).trim()
      else if (line.startsWith('data:')) data += line.slice(5).trim()
    }
    if (!data) return
    const parsed = JSON.parse(data)
    if (event === 'done') onDone(parsed)
    else if (parsed.delta) onDelta(parsed.delta)
  }
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buf += dec.decode(value, { stream: true })
    let idx: number
    while ((idx = buf.indexOf('\n\n')) >= 0) {
      handle(buf.slice(0, idx))
      buf = buf.slice(idx + 2)
    }
  }
}

// ── Data operativa de SIGMA MADRE (AgenciaOS) — scopeada por el backend ──────
// El cliente omite brandId → el backend devuelve solo su marca (misma data que ve
// la marca en AgenciaOS: posts, eventos, campañas).
export interface ApiPost {
  id: number; campaign: number | null; campaign_name?: string; brand_name?: string
  code: string; title: string; caption: string; platform: string
  media_type?: string; status: string; taken_at: string | null; planned_date: string | null
  like_count: number; comment_count: number; reach: number; engagement: number; eng_rate?: string
  thumbnail_url: string; media_url: string; featured?: boolean
}
export interface ApiEvent {
  id: number; brand: number; brand_name?: string; name: string; slug: string
  event_type?: string; status: string; date: string | null; venue: string
  comuna: string; direccion?: string; aforo: number; meta_asistentes: number
  presupuesto?: string; asistentes?: number; metrica?: Record<string, number>
}
export interface ApiCampaign {
  id: number; code: string; name: string; slug: string; status: string
  brand: number; brand_name?: string; budget?: string; investment?: string
  metrics?: Record<string, number>; goals?: Record<string, number>
}

export const sigmaData = {
  posts: async (brandId?: number) => unwrap<ApiPost>(await apiFetch(`/api/posts/${q(brandId)}`)),
  events: async (brandId?: number) => unwrap<ApiEvent>(await apiFetch(`/api/events/${q(brandId)}`)),
  campaigns: async (brandId?: number) => unwrap<ApiCampaign>(await apiFetch(`/api/campaigns/${q(brandId)}`)),
}

// ── Autonomía del cliente: solicitar campañas + revisar contenido ────────────
export interface ApiCampaignRequest {
  id: number; brand: number; brandName?: string; title: string; brief: string
  objective: string; budget_hint: string; channels: string[]; status: string
  notes: string; created_at: string
}
export interface ApiContentReview {
  id: number; post: number; decision: string; comment: string; createdAt: string; updatedAt: string
}

export const sigmaClient = {
  campaignRequests: async (brandId?: number) =>
    unwrap<ApiCampaignRequest>(await apiFetch(`/api/campaign-requests/${q(brandId)}`)),
  createCampaignRequest: (
    data: { title: string; brief?: string; objective?: string; budget_hint?: string; channels?: string[] },
    brandId?: number,
  ) => apiFetch<ApiCampaignRequest>(`/api/campaign-requests/${q(brandId)}`, {
    method: 'POST', body: JSON.stringify(brandId ? { ...data, brand: brandId } : data),
  }),
  contentReviews: async (brandId?: number) =>
    unwrap<ApiContentReview>(await apiFetch(`/api/brain/content-reviews/${q(brandId)}`)),
  reviewContent: (postId: number, data: { decision: string; comment?: string }, brandId?: number) =>
    apiFetch<ApiContentReview>(`/api/brain/content/${postId}/review/${q(brandId)}`, {
      method: 'POST', body: JSON.stringify(data),
    }),
}
