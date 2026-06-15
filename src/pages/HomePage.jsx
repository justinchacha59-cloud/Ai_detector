import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ImageIcon, Video, Music, Mic, FileText, ArrowRight, Shield, Zap, Eye } from 'lucide-react'

const MODES = [
  { to:'/image', icon:ImageIcon, label:'Image', desc:'DALL-E, Midjourney, Stable Diffusion, deepfakes', accent:'#00E5FF', formats:'JPG · PNG · WEBP · HEIC', stat:'98.9%' },
  { to:'/video', icon:Video,     label:'Video', desc:'Sora, Runway, Kling, HeyGen, face-swaps',         accent:'#BD93F9', formats:'MP4 · MOV · AVI · MKV', stat:'97.5%' },
  { to:'/audio', icon:Mic,       label:'Audio / Voice', desc:'AI voice clones, deepfake speech, synthetic narration', accent:'#00FF87', formats:'MP3 · WAV · OGG · M4A', stat:'96.8%' },
  { to:'/music', icon:Music,     label:'Music', desc:'Suno, Udio, Beatoven, Soundraw',                  accent:'#FFD60A', formats:'MP3 · WAV · FLAC · AAC', stat:'95.4%' },
  { to:'/text',  icon:FileText,  label:'Text',  desc:'ChatGPT, Claude, Gemini, DeepSeek and more',      accent:'#FF3D57', formats:'Paste or type any text', stat:'98.2%' },
]

const cont = { hidden:{}, show:{ transition:{ staggerChildren:.08 } } }
const item = { hidden:{ opacity:0, y:24 }, show:{ opacity:1, y:0, transition:{ type:'spring', bounce:.3 } } }

export default function HomePage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity:0, y:32 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6 }} className="text-center mb-14">
          <div className="absolute left-1/2 top-32 -translate-x-1/2 w-80 h-80 rounded-full bg-accent-cyan/5 blur-3xl pointer-events-none" />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 mb-7">
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
            <span className="text-accent-cyan text-xs mono">Powered by aiornot.com API</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-5">
            Is it <span className="text-accent-cyan">real</span> or <span className="text-accent-red">AI?</span>
          </h1>
          <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">
            Detect AI-generated content with <strong className="text-white">98.9% accuracy</strong>. Real engine, not guesswork.
          </p>
          <div className="flex items-center justify-center gap-6 mt-8">
            {[{ icon:Shield, l:'Accuracy', v:'98.9%' },{ icon:Zap, l:'Speed', v:'<2s' },{ icon:Eye, l:'Modalities', v:'5' }].map(({ icon:Icon, l, v }) => (
              <div key={l} className="flex items-center gap-1.5">
                <Icon size={14} className="text-accent-cyan" />
                <span className="mono text-muted text-xs">{l}:</span>
                <span className="mono font-bold text-sm">{v}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={cont} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODES.map(({ to, icon:Icon, label, desc, accent, formats, stat }) => (
            <motion.div key={to} variants={item}>
              <Link to={to} className="block rounded-2xl p-5 border border-border bg-surface hover:border-white/15 group relative overflow-hidden transition-all hover:-translate-y-0.5">
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background:`radial-gradient(circle at 20% 20%, ${accent}08, transparent 60%)` }} />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center border" style={{ background:`${accent}12`, borderColor:`${accent}30` }}>
                      <Icon size={20} style={{ color:accent }} />
                    </div>
                    <span className="text-xs mono px-2.5 py-1 rounded-lg border" style={{ borderColor:`${accent}30`, background:`${accent}10`, color:accent }}>{stat}</span>
                  </div>
                  <h2 className="font-display text-lg font-bold mb-2">{label} Detection</h2>
                  <p className="text-muted text-sm leading-relaxed mb-4">{desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-muted text-xs mono">{formats}</span>
                    <div className="flex items-center gap-1 text-sm font-medium group-hover:translate-x-1 transition-transform" style={{ color:accent }}>
                      Analyze <ArrowRight size={13} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
