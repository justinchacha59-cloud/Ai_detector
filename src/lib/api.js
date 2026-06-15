/**
 * VeritasAI API Client
 * Calls /api/* (local CORS proxy) which forwards to api.aiornot.com.
 * User key travels as Authorization header — never stored server-side.
 */
import { keyStore } from './keyStore.js'

// In dev, Vite proxies /api → localhost:3001.
// In production, set VITE_PROXY_URL to your deployed proxy's full URL
// e.g. https://veritasai-proxy.onrender.com
const BASE = import.meta.env.VITE_PROXY_URL
  ? `${import.meta.env.VITE_PROXY_URL}/api`
  : '/api'

function authHeader(key) {
  const k = key || keyStore.get()
  if (!k) throw new Error('NO_KEY')
  return { Authorization: `Bearer ${k}` }
}

function normalizeImage(raw) {
  const ag = raw.report?.ai_generated
  const df = raw.report?.deepfake
  const verdict = ag?.verdict || (ag?.ai?.is_detected ? 'ai' : 'human')
  const confidence = verdict === 'ai' ? (ag?.ai?.confidence ?? 0) : (ag?.human?.confidence ?? 0)
  return { verdict, confidence, isAI: verdict === 'ai', generator: ag?.generator || {},
    deepfake: df ? { detected: df?.face_swapped?.is_detected || false, confidence: df?.face_swapped?.confidence || 0 } : null, raw }
}

function normalizeVideo(raw) {
  const aiVideo = raw.report?.ai_video
  const deepfake = raw.report?.deepfake_video
  const signals = [aiVideo?.ai?.confidence || 0, deepfake?.face_swapped?.confidence || 0].filter(Boolean)
  const top = signals.length ? Math.max(...signals) : 0
  const isAI = top > 0.5
  return { verdict: isAI ? 'ai' : 'human', confidence: isAI ? top : 1 - top, isAI,
    components: { aiVideo, deepfake, aiVoice: raw.report?.ai_voice, aiMusic: raw.report?.ai_music }, raw }
}

function normalizeAudio(raw) {
  const report = raw.report?.ai_voice || raw.report?.ai_music || {}
  const isAI = report?.ai?.is_detected ?? false
  const confidence = isAI ? (report?.ai?.confidence ?? 0) : (report?.human?.confidence ?? 0)
  return { verdict: isAI ? 'ai' : 'human', confidence, isAI,
    chunks: raw.report?.ai_voice?.chunks || [], generator: report?.generator || {}, raw }
}

function normalizeText(raw) {
  // aiornot text/sync response shape may be { report: { ai_text: {...} } }
  // or { report: { ai_generated: {...} } } depending on API version — handle both.
  const node = raw.report?.ai_text || raw.report?.ai_generated || {}
  const isAI = node.is_detected ?? (node.verdict === 'ai') ?? (node.ai?.is_detected) ?? false
  const confidence = node.confidence ?? node.ai?.confidence ?? (isAI ? 0 : (node.human?.confidence ?? 0))
  const finalConfidence = isAI ? confidence : (node.human?.confidence ?? (1 - confidence))
  return { verdict: isAI ? 'ai' : 'human', confidence: finalConfidence, isAI,
    annotations: node.annotations || [], raw }
}

async function handle(res) {
  if (res.status === 401) throw new Error('INVALID_KEY')
  if (res.status === 402) throw new Error('QUOTA_EXCEEDED')
  if (res.status === 422) return res.json() // validation error — still forward
  if (!res.ok) {
    const d = await res.json().catch(() => ({}))
    throw new Error(d?.detail || d?.message || d?.error || `Error ${res.status}`)
  }
  return res.json()
}

export async function detectImage(file) {
  const form = new FormData(); form.append('file', file)
  return normalizeImage(await handle(await fetch(`${BASE}/image`, { method: 'POST', headers: authHeader(), body: form })))
}
export async function detectVideo(file) {
  const form = new FormData(); form.append('file', file)
  return normalizeVideo(await handle(await fetch(`${BASE}/video`, { method: 'POST', headers: authHeader(), body: form })))
}
export async function detectAudio(file) {
  const form = new FormData(); form.append('file', file)
  return normalizeAudio(await handle(await fetch(`${BASE}/audio`, { method: 'POST', headers: authHeader(), body: form })))
}
export async function detectMusic(file) {
  const form = new FormData(); form.append('file', file)
  return normalizeAudio(await handle(await fetch(`${BASE}/music`, { method: 'POST', headers: authHeader(), body: form })))
}
export async function detectText(text) {
  return normalizeText(await handle(await fetch(`${BASE}/text`, {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  })))
}

export async function validateKey(key) {
  try {
    const longEnough = 'This is a test sentence used only to validate the API key connection. '.repeat(4)
    const res = await fetch(`${BASE}/text`, {
      method: 'POST',
      headers: { ...authHeader(key), 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: longEnough })
    })
    const data = await res.json().catch(() => ({}))
    if (res.status === 401 || res.status === 403) return { valid: false, reason: 'invalid', detail: data }
    if (res.status === 402) return { valid: true, reason: 'quota' }
    if (res.ok) return { valid: true, reason: 'ok' }
    // Any other error with a clear message from aiornot still proves the key works
    const msg = (data?.message || data?.error || data?.detail || '').toLowerCase()
    if (msg.includes('too short') || msg.includes('minimum length')) return { valid: true, reason: 'ok' }
    return { valid: false, reason: 'error', detail: data }
  } catch {
    return { valid: false, reason: 'network' }
  }
}
