import { ImageIcon } from 'lucide-react'
import { useDetection } from '../hooks/useDetection.js'
import { detectImage } from '../lib/api.js'
import DetectorPage from '../components/DetectorPage.jsx'
import { GeneratorBadges } from '../components/DetectionUI.jsx'

function Extras({ result }) {
  return (
    <div className="space-y-3">
      <GeneratorBadges generators={result.generator} />
      {result.deepfake?.detected && (
        <div className="px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/8">
          <p className="text-accent-red text-sm font-medium">⚠️  Deepfake / face-swap detected</p>
          <p className="text-muted text-xs mono mt-0.5">Confidence: {Math.round(result.deepfake.confidence*100)}%</p>
        </div>
      )}
    </div>
  )
}

export default function ImagePage() {
  const hook = useDetection(detectImage, 'image')
  return (
    <DetectorPage title="Image Detection" subtitle="Detect AI-generated photos, deepfakes and synthetic imagery"
      icon={ImageIcon} accent="#00E5FF" modality="image"
      acceptTypes={{ 'image/*': ['.jpg','.jpeg','.png','.webp','.heic','.heif'] }}
      dropLabel="Drop your image here" dropHint="JPG, PNG, WEBP, HEIC — up to 25 MB"
      {...hook} onDetect={hook.detect} onReset={hook.reset} ResultExtras={Extras} />
  )
}
