import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Smartphone } from 'lucide-react'

export default function PWAInstallBanner() {
  const [prompt, setPrompt] = useState(null)
  const [visible, setVisible] = useState(false)
  const [iosGuide, setIosGuide] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return
    if (localStorage.getItem('pwa_dismissed')) return

    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream
    if (isIOS) { setVisible(true); return }

    const handler = e => { e.preventDefault(); setPrompt(e); setVisible(true) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = async () => {
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
    if (isIOS) { setIosGuide(true); return }
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setVisible(false)
    setPrompt(null)
  }

  const dismiss = () => { setVisible(false); localStorage.setItem('pwa_dismissed','1') }

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div initial={{ y:80, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:80, opacity:0 }}
            transition={{ type:'spring', bounce:.3 }}
            className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto">
            <div className="card p-3.5 flex items-center gap-3" style={{ boxShadow:'0 0 20px rgba(0,229,255,.1)' }}>
              <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/25 flex items-center justify-center shrink-0">
                <Smartphone size={17} className="text-accent-cyan" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Install VeritasAI</p>
                <p className="text-muted text-xs mt-0.5">Add to home screen for instant access</p>
              </div>
              <button onClick={install} className="px-3 py-1.5 rounded-lg bg-accent-cyan text-bg text-xs font-bold shrink-0">
                <Download size={12} className="inline mr-1" />Install
              </button>
              <button onClick={dismiss} className="w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center text-muted hover:text-white shrink-0">
                <X size={12} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {iosGuide && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 bg-bg/90 backdrop-blur-md flex items-end justify-center p-4"
            onClick={() => setIosGuide(false)}>
            <motion.div initial={{ y:50 }} animate={{ y:0 }} exit={{ y:50 }} onClick={e => e.stopPropagation()}
              className="card p-6 w-full max-w-sm mb-2">
              <h3 className="font-display font-bold text-lg mb-4">Install on iPhone / iPad</h3>
              <ol className="space-y-3">
                {['Tap the Share button at the bottom of Safari','Scroll down and tap "Add to Home Screen"','Tap "Add" in the top right corner'].map((s,i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full bg-accent-cyan/15 border border-accent-cyan/30 flex items-center justify-center shrink-0 mt-0.5 text-accent-cyan text-xs font-bold">{i+1}</span>
                    <span className="text-muted">{s}</span>
                  </li>
                ))}
              </ol>
              <button onClick={() => setIosGuide(false)} className="w-full mt-5 py-2.5 rounded-xl bg-surface border border-border text-muted text-sm">
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
