import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Send, RotateCcw, Clock } from 'lucide-react'
import { useDetection } from '../hooks/useDetection.js'
import { detectText } from '../lib/api.js'
import { VerdictBadge, ConfidenceMeter, LoadingAnalysis, ErrorDisplay } from '../components/DetectionUI.jsx'
import AdSlot from '../components/AdSlot.jsx'

export default function TextPage() {
  const [text, setText] = useState('')
  const { loading, result, error, elapsed, detectText: run, reset } = useDetection(detectText, 'text')

  const handleReset = () => { reset(); setText('') }
  const canDetect = text.trim().length >= 250 && !loading

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="flex items-center gap-4 mb-6">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center border shrink-0"
            style={{ background:'rgba(255,61,87,.1)', borderColor:'rgba(255,61,87,.25)' }}>
            <FileText size={20} className="text-accent-red" />
          </div>
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold">Text Detection</h1>
            <p className="text-muted text-xs mt-0.5">Detect ChatGPT, Claude, Gemini, DeepSeek and other LLMs</p>
          </div>
          {result && (
            <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-muted hover:text-white text-xs transition-colors">
              <RotateCcw size={12} /> New scan
            </button>
          )}
        </motion.div>

        <motion.div layout className="card p-5 min-h-60">
          <AnimatePresence mode="wait">
            {!loading && !result && !error && (
              <motion.div key="input" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="space-y-3">
                <textarea value={text} onChange={e => setText(e.target.value.slice(0,10000))}
                  placeholder="Paste or type the text you want to analyze here…"
                  className="w-full h-52 bg-surface border border-border rounded-xl p-4 text-sm text-white placeholder-muted resize-none focus:outline-none focus:border-accent-red/40 transition-colors leading-relaxed" />
                <div className="flex items-center justify-between">
                  <span className={`text-xs mono ${text.length < 250 ? 'text-muted' : 'text-accent-green'}`}>
                    {text.length} chars {text.length < 250 && `(min 250)`}
                  </span>
                  <button onClick={() => run(text)} disabled={!canDetect}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all
                      ${canDetect ? 'bg-accent-red text-white hover:bg-red-400 shadow-lg shadow-red-500/20' : 'bg-surface border border-border text-muted cursor-not-allowed'}`}>
                    <Send size={13} /> Analyze Text
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['ChatGPT output','Article / blog','Email / message'].map(l => (
                    <div key={l} className="px-2 py-2 rounded-lg bg-surface border border-border text-muted text-xs text-center">{l}</div>
                  ))}
                </div>
              </motion.div>
            )}
            {loading && (
              <motion.div key="loading" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <LoadingAnalysis modality="text" />
              </motion.div>
            )}
            {error && !loading && (
              <motion.div key="error" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <ErrorDisplay message={error} onReset={handleReset} />
              </motion.div>
            )}
            {result && !loading && (
              <motion.div key="result" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="space-y-4">
                <div className="p-4 rounded-xl bg-surface border border-border">
                  <p className="text-muted text-xs mono mb-2">Analyzed text</p>
                  <p className="text-sm text-white/70 leading-relaxed line-clamp-3">{text}</p>
                </div>
                <div className="rounded-2xl border p-5 space-y-4"
                  style={{ borderColor:result.isAI?'rgba(255,61,87,.2)':'rgba(0,255,135,.2)', background:result.isAI?'rgba(255,61,87,.04)':'rgba(0,255,135,.04)' }}>
                  <VerdictBadge verdict={result.verdict} large />
                  <ConfidenceMeter confidence={result.confidence} isAI={result.isAI} />
                  {elapsed && <div className="flex items-center gap-1.5 text-muted text-xs mono"><Clock size={11}/> Analyzed in {elapsed}s</div>}
                </div>
                <details className="group">
                  <summary className="cursor-pointer text-muted text-xs mono hover:text-white transition-colors flex items-center gap-1.5">
                    <span className="group-open:rotate-90 transition-transform inline-block">▶</span> Raw API response
                  </summary>
                  <pre className="mt-3 p-4 bg-surface rounded-xl border border-border text-xs mono text-muted overflow-auto max-h-56">
                    {JSON.stringify(result.raw, null, 2)}
                  </pre>
                </details>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {result && !loading && <AdSlot className="mt-4" />}
      </div>
    </div>
  )
}
