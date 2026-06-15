import { Mic } from 'lucide-react'
import { motion } from 'framer-motion'
import { useDetection } from '../hooks/useDetection.js'
import { detectAudio } from '../lib/api.js'
import DetectorPage from '../components/DetectorPage.jsx'
import { GeneratorBadges } from '../components/DetectionUI.jsx'

function Extras({ result }) {
  return (
    <div className="space-y-4">
      <GeneratorBadges generators={result.generator} />
      {result.chunks?.length > 0 && (
        <div className="space-y-2">
          <p className="text-muted text-xs mono uppercase tracking-widest">Chunk timeline (10s segments)</p>
          <div className="space-y-1.5 max-h-44 overflow-y-auto">
            {result.chunks.map((chunk, i) => {
              const isAI = chunk.ai?.is_detected
              const conf = chunk.ai?.confidence || chunk.human?.confidence || 0
              return (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-surface border border-border">
                  <span className="text-muted text-xs mono w-20 shrink-0">{i*10}s–{(i+1)*10}s</span>
                  <div className="flex-1 h-1.5 bg-border rounded overflow-hidden">
                    <motion.div className={`h-full rounded ${isAI ? 'bg-accent-red' : 'bg-accent-green'}`}
                      initial={{ width:0 }} animate={{ width:`${conf*100}%` }} transition={{ delay:i*.05, duration:.6 }} />
                  </div>
                  <span className={`text-xs mono ${isAI ? 'text-accent-red' : 'text-accent-green'}`}>
                    {isAI ? 'AI' : 'HU'} {Math.round(conf*100)}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function AudioPage() {
  const hook = useDetection(detectAudio, 'audio')
  return (
    <DetectorPage title="Audio / Voice Detection" subtitle="Detect AI voice clones, deepfake speech and synthetic narration"
      icon={Mic} accent="#00FF87" modality="audio"
      acceptTypes={{ 'audio/*': ['.mp3','.wav','.ogg','.m4a','.flac','.aac'] }}
      dropLabel="Drop your audio file here" dropHint="MP3, WAV, OGG, M4A — up to 25 MB"
      {...hook} onDetect={hook.detect} onReset={hook.reset} ResultExtras={Extras} />
  )
}
