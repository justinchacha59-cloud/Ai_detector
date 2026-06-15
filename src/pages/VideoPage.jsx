import { Video } from 'lucide-react'
import { useDetection } from '../hooks/useDetection.js'
import { detectVideo } from '../lib/api.js'
import DetectorPage from '../components/DetectorPage.jsx'

function Extras({ result }) {
  const rows = [
    { label:'AI-Generated Video', data:result.components?.aiVideo },
    { label:'Deepfake / Face Swap', data:result.components?.deepfake },
    { label:'AI Voice Track', data:result.components?.aiVoice },
    { label:'AI Music Track', data:result.components?.aiMusic },
  ].filter(r => r.data)
  if (!rows.length) return null
  return (
    <div className="space-y-2">
      <p className="text-muted text-xs mono uppercase tracking-widest">Component analysis</p>
      {rows.map(({ label, data }) => {
        const detected = data?.ai?.is_detected || data?.face_swapped?.is_detected || false
        const conf = data?.ai?.confidence || data?.face_swapped?.confidence || 0
        return (
          <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border">
            <span className="text-sm">{label}</span>
            <div className="flex items-center gap-3">
              <span className="mono text-xs text-muted">{Math.round(conf*100)}%</span>
              <span className={`text-xs font-bold mono ${detected ? 'text-accent-red' : 'text-accent-green'}`}>{detected ? 'DETECTED' : 'CLEAN'}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function VideoPage() {
  const hook = useDetection(detectVideo, 'video')
  return (
    <DetectorPage title="Video Detection" subtitle="Sora, Runway, Kling, HeyGen, face-swaps and AI compositing"
      icon={Video} accent="#BD93F9" modality="video"
      acceptTypes={{ 'video/*': ['.mp4','.mov','.avi','.mkv','.webm'] }}
      dropLabel="Drop your video here" dropHint="MP4, MOV, AVI, MKV — up to 25 MB"
      {...hook} onDetect={hook.detect} onReset={hook.reset} ResultExtras={Extras} />
  )
}
