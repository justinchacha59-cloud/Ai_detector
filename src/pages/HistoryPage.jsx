import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { History, ImageIcon, Video, Mic, Music, FileText, Trash2 } from 'lucide-react'
import { getHistory, clearHistory } from '../lib/localHistory.js'

const ICONS = { image:ImageIcon, video:Video, audio:Mic, music:Music, text:FileText }
const ACCENTS = { image:'#00E5FF', video:'#BD93F9', audio:'#00FF87', music:'#FFD60A', text:'#FF3D57' }

function timeAgo(d) {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m/60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h/24)}d ago`
}

export default function HistoryPage() {
  const [scans, setScans] = useState([])

  useEffect(() => { setScans(getHistory()) }, [])

  const total = scans.length
  const aiCount = scans.filter(s => s.verdict === 'ai').length

  const handleClear = () => {
    clearHistory()
    setScans([])
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="flex items-center gap-4 mb-6">
          <div className="w-11 h-11 rounded-xl bg-white/5 border border-border flex items-center justify-center">
            <History size={20} className="text-muted" />
          </div>
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold">Scan History</h1>
            <p className="text-muted text-xs mt-0.5">Stored locally on this device — last 100 scans</p>
          </div>
          {total > 0 && (
            <button onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-muted hover:text-accent-red hover:border-red-500/30 text-xs transition-colors">
              <Trash2 size={12} /> Clear
            </button>
          )}
        </motion.div>

        {total > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-5">
            <div className="card p-3 text-center"><p className="font-display text-2xl font-bold">{total}</p><p className="text-muted text-xs mt-0.5">Total</p></div>
            <div className="card p-3 text-center"><p className="font-display text-2xl font-bold text-accent-red">{aiCount}</p><p className="text-muted text-xs mt-0.5">AI</p></div>
            <div className="card p-3 text-center"><p className="font-display text-2xl font-bold text-accent-green">{total-aiCount}</p><p className="text-muted text-xs mt-0.5">Human</p></div>
          </div>
        )}

        <div className="space-y-2">
          {total === 0 && (
            <div className="card p-10 text-center text-muted text-sm">
              No scans yet. Run your first detection — it'll show up here.
            </div>
          )}
          {scans.map((scan, i) => {
            const Icon = ICONS[scan.modality] || FileText
            const accent = ACCENTS[scan.modality] || '#fff'
            const isAI = scan.verdict === 'ai'
            return (
              <motion.div key={scan.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.02 }}
                className="card p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center border shrink-0" style={{ background:`${accent}12`, borderColor:`${accent}25` }}>
                  <Icon size={15} style={{ color:accent }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{scan.filename || 'text input'}</p>
                  <p className="text-muted text-xs mono capitalize">{scan.modality}</p>
                </div>
                <span className="mono text-sm text-muted">{Math.round(scan.confidence*100)}%</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg border mono ${isAI ? 'text-accent-red border-red-500/25 bg-red-500/8' : 'text-accent-green border-green-500/25 bg-green-500/8'}`}>
                  {isAI ? 'AI' : 'HU'}
                </span>
                <span className="text-muted text-xs mono hidden sm:block">{timeAgo(scan.createdAt)}</span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
