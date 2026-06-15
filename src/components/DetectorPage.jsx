import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Clock } from 'lucide-react'
import { DropZone, LoadingAnalysis, ErrorDisplay, FilePreview, ConfidenceMeter, VerdictBadge } from './DetectionUI.jsx'
import AdSlot from './AdSlot.jsx'

export default function DetectorPage({ title, subtitle, icon: Icon, accent='#00E5FF', modality,
  acceptTypes, dropLabel, dropHint, file, preview, loading, result, error, elapsed, onDetect, onReset, ResultExtras }) {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="flex items-center gap-4 mb-6">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center border shrink-0"
            style={{ background:`${accent}12`, borderColor:`${accent}30` }}>
            <Icon size={20} style={{ color:accent }} />
          </div>
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold">{title}</h1>
            <p className="text-muted text-xs mt-0.5">{subtitle}</p>
          </div>
          {result && (
            <button onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-muted hover:text-white text-xs transition-colors">
              <RotateCcw size={12} /> New scan
            </button>
          )}
        </motion.div>

        <motion.div layout className="card p-5 min-h-60">
          <AnimatePresence mode="wait">
            {!file && !loading && !result && !error && (
              <motion.div key="drop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <DropZone onFile={onDetect} accept={acceptTypes} label={dropLabel} icon={Icon} hint={dropHint} />
              </motion.div>
            )}
            {loading && (
              <motion.div key="loading" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <FilePreview file={file} preview={preview} modality={modality} onRemove={onReset} />
                <LoadingAnalysis modality={modality} />
              </motion.div>
            )}
            {error && !loading && (
              <motion.div key="error" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <ErrorDisplay message={error} onReset={onReset} />
              </motion.div>
            )}
            {result && !loading && (
              <motion.div key="result" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="space-y-4">
                <FilePreview file={file} preview={preview} modality={modality} onRemove={onReset} />
                <div className="rounded-2xl border p-5 space-y-4"
                  style={{ borderColor:result.isAI?'rgba(255,61,87,.2)':'rgba(0,255,135,.2)', background:result.isAI?'rgba(255,61,87,.04)':'rgba(0,255,135,.04)' }}>
                  <VerdictBadge verdict={result.verdict} large />
                  <ConfidenceMeter confidence={result.confidence} isAI={result.isAI} />
                  {elapsed && (
                    <div className="flex items-center gap-1.5 text-muted text-xs mono">
                      <Clock size={11} /> Analyzed in {elapsed}s
                    </div>
                  )}
                </div>
                {ResultExtras && <ResultExtras result={result} />}
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

        <p className="text-center text-muted text-xs mt-3 mono">
          Powered by <a href="https://aiornot.com" target="_blank" rel="noreferrer" className="text-accent-cyan hover:underline">aiornot.com</a>
        </p>
      </div>
    </div>
  )
}
