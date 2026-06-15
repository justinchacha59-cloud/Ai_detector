import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, RotateCcw, AlertCircle } from 'lucide-react'

export function DropZone({ onFile, accept, label, icon: Icon, hint, disabled }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: files => files[0] && onFile(files[0]),
    accept, maxFiles: 1, disabled, multiple: false,
  })
  return (
    <div {...getRootProps()}
      className={`upload-zone flex flex-col items-center justify-center gap-4 p-12 ${isDragActive ? 'drag-over' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <input {...getInputProps()} />
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${isDragActive ? 'bg-accent-cyan/10 border-accent-cyan' : 'bg-surface border-border'}`}>
        <Icon size={28} className={isDragActive ? 'text-accent-cyan' : 'text-muted'} />
      </div>
      <div className="text-center">
        <p className="font-display font-semibold text-lg">{isDragActive ? 'Drop it here' : label}</p>
        <p className="text-muted text-sm mt-1">{hint}</p>
      </div>
      <div className="flex items-center gap-2">
        <Upload size={13} className="text-accent-cyan" />
        <span className="text-accent-cyan text-sm font-medium mono">Browse files</span>
      </div>
    </div>
  )
}

export function ConfidenceMeter({ confidence, isAI }) {
  const pct = Math.round(confidence * 100)
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-muted text-sm mono">Confidence</span>
        <motion.span className={`font-display text-2xl font-bold ${isAI ? 'text-accent-red' : 'text-accent-green'}`}
          initial={{ opacity:0, scale:.5 }} animate={{ opacity:1, scale:1 }} transition={{ delay:.3, type:'spring' }}>
          {pct}%
        </motion.span>
      </div>
      <div className="confidence-bar">
        <motion.div
          className={`confidence-fill ${isAI ? 'bg-gradient-to-r from-red-500 to-accent-red' : 'bg-gradient-to-r from-green-500 to-accent-green'}`}
          initial={{ width:0 }} animate={{ width:`${pct}%` }}
          transition={{ duration:1.2, ease:[.4,0,.2,1], delay:.2 }} />
      </div>
    </div>
  )
}

export function VerdictBadge({ verdict, large }) {
  const isAI = verdict === 'ai'
  return (
    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ type:'spring', delay:.1 }}
      className={`inline-flex items-center gap-2 rounded-xl border font-display font-bold tracking-wider
        ${large ? 'text-2xl px-6 py-3' : 'text-sm px-4 py-2'}
        ${isAI ? 'border-red-500/40 bg-red-500/10 text-accent-red' : 'border-green-500/40 bg-green-500/10 text-accent-green'}`}>
      <span className={`w-2 h-2 rounded-full ${isAI ? 'bg-accent-red' : 'bg-accent-green'} animate-pulse`} />
      {isAI ? 'AI GENERATED' : 'HUMAN MADE'}
    </motion.div>
  )
}

export function LoadingAnalysis({ modality }) {
  const steps = ['Uploading file…','Extracting features…','Running detection models…','Analyzing patterns…','Computing confidence scores…']
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex flex-col items-center gap-6 py-10">
      <div className="relative w-20 h-20">
        {[0,1,2].map(i => (
          <div key={i} className="absolute inset-0 rounded-full border border-accent-cyan/25 radar-pulse" style={{ animationDelay:`${i*.66}s` }} />
        ))}
        <div className="absolute inset-0 flex items-center justify-center"><div className="spinner" /></div>
      </div>
      <div className="text-center">
        <p className="font-display text-lg font-semibold text-accent-cyan">Analyzing {modality}</p>
        <p className="text-muted text-xs mt-1 mono">Powered by aiornot.com · 98.9% accuracy</p>
      </div>
      <div className="h-5 overflow-hidden">
        {steps.map((step, i) => (
          <motion.p key={step} className="text-muted text-xs mono text-center"
            initial={{ opacity:0, y:16 }} animate={{ opacity:[0,1,1,0], y:[16,0,0,-16] }}
            transition={{ delay:i*.8, duration:.8, times:[0,.2,.8,1] }}>
            {step}
          </motion.p>
        ))}
      </div>
    </motion.div>
  )
}

export function ErrorDisplay({ message, onReset }) {
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex flex-col items-center gap-4 py-8">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
        <AlertCircle size={24} className="text-accent-red" />
      </div>
      <div className="text-center">
        <p className="font-display font-semibold text-accent-red">Detection Failed</p>
        <p className="text-muted text-sm mt-1 max-w-xs">{message}</p>
      </div>
      <button onClick={onReset} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border text-sm text-muted hover:text-white transition-colors">
        <RotateCcw size={13} /> Try Again
      </button>
    </motion.div>
  )
}

export function FilePreview({ file, preview, modality, onRemove }) {
  if (!file) return null
  return (
    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="card p-4 flex items-center gap-3 mb-4">
      {preview && modality === 'image' && <img src={preview} alt="" className="w-12 h-12 rounded-xl object-cover border border-border" />}
      {preview && modality === 'video' && <video src={preview} className="w-12 h-12 rounded-xl object-cover border border-border" muted />}
      {(modality === 'audio' || modality === 'music') && (
        <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center text-xl">🎵</div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{file.name}</p>
        {file.size && <p className="text-muted text-xs mono mt-0.5">{(file.size/1024/1024).toFixed(2)} MB</p>}
      </div>
      <button onClick={onRemove}
        className="w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center text-muted hover:text-accent-red hover:border-red-500/40 transition-all">
        <X size={13} />
      </button>
    </motion.div>
  )
}

export function GeneratorBadges({ generators }) {
  const top = Object.entries(generators || {}).filter(([,v]) => v > 0.1).sort(([,a],[,b]) => b-a).slice(0,5)
  if (!top.length) return null
  return (
    <div className="space-y-2">
      <p className="text-muted text-xs mono uppercase tracking-widest">Likely generators</p>
      <div className="flex flex-wrap gap-2">
        {top.map(([name, conf]) => (
          <div key={name} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface border border-border text-sm">
            <span className="capitalize">{name.replace(/_/g,' ')}</span>
            <span className="mono text-muted text-xs">{Math.round(conf*100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
