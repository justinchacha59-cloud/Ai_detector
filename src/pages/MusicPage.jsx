import { Music } from 'lucide-react'
import { useDetection } from '../hooks/useDetection.js'
import { detectMusic } from '../lib/api.js'
import DetectorPage from '../components/DetectorPage.jsx'
import { GeneratorBadges } from '../components/DetectionUI.jsx'

export default function MusicPage() {
  const hook = useDetection(detectMusic, 'music')
  return (
    <DetectorPage title="Music Detection" subtitle="Identify AI-generated tracks from Suno, Udio, Beatoven, Soundraw"
      icon={Music} accent="#FFD60A" modality="music"
      acceptTypes={{ 'audio/*': ['.mp3','.wav','.flac','.aac','.ogg','.m4a'] }}
      dropLabel="Drop your music file here" dropHint="MP3, WAV, FLAC, AAC — up to 25 MB"
      {...hook} onDetect={hook.detect} onReset={hook.reset}
      ResultExtras={({ result }) => <GeneratorBadges generators={result.generator} />} />
  )
}
