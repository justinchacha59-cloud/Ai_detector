/**
 * VeritasAI Local History
 * Scan history stored entirely in the browser's localStorage.
 * No server, no database, no account needed.
 */

const KEY = 'veritas_scan_history'
const MAX_ENTRIES = 100

export function getHistory() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function addScan({ modality, filename, verdict, confidence }) {
  try {
    const history = getHistory()
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      modality,
      filename: filename || null,
      verdict,
      confidence,
      createdAt: new Date().toISOString(),
    }
    const updated = [entry, ...history].slice(0, MAX_ENTRIES)
    localStorage.setItem(KEY, JSON.stringify(updated))
    return entry
  } catch {
    return null
  }
}

export function clearHistory() {
  localStorage.removeItem(KEY)
}

export function getStats() {
  const history = getHistory()
  const total = history.length
  const aiCount = history.filter(s => s.verdict === 'ai').length
  return { total, aiCount, humanCount: total - aiCount }
}
