import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Key, CheckCircle, AlertCircle, Eye, EyeOff, ArrowRight, Clipboard, Loader } from 'lucide-react'
import { keyStore } from '../lib/keyStore.js'
import { validateKey } from '../lib/api.js'

const AIORNOT_URL = 'https://www.aiornot.com/dashboard/api-keys'

function StepWelcome({ onNext }) {
  return (
    <motion.div key="welcome" initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
      className="flex flex-col items-center text-center gap-5">
      {/* Radar logo */}
      <div className="relative w-24 h-24 my-2">
        <div className="absolute inset-0 rounded-3xl bg-accent-cyan/10 border border-accent-cyan/20" />
        {[0,1,2].map(i => (
          <div key={i} className="absolute inset-0 rounded-3xl border border-accent-cyan/20 radar-pulse"
            style={{ animationDelay: `${i*0.7}s` }} />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <circle cx="22" cy="22" r="20" stroke="#00E5FF" strokeWidth="1.2" opacity=".3"/>
            <circle cx="22" cy="22" r="12" stroke="#00E5FF" strokeWidth="1.2" opacity=".6"/>
            <circle cx="22" cy="22" r="5" fill="#00E5FF" opacity=".95"/>
            <circle cx="22" cy="22" r="2" fill="#080C10"/>
            <line x1="22" y1="4" x2="22" y2="10" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="22" y1="34" x2="22" y2="40" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="4" y1="22" x2="10" y2="22" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="34" y1="22" x2="40" y2="22" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      <div>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold mb-3">
          Welcome to <span className="text-accent-cyan">Veritas</span>AI
        </h1>
        <p className="text-muted text-sm leading-relaxed max-w-xs">
          Detect AI-generated images, video, audio, music and text with{' '}
          <strong className="text-white">98.9% accuracy</strong>.
        </p>
      </div>

      <div className="w-full max-w-sm grid grid-cols-2 gap-2 text-left">
        {[['🖼️','Image detection'],['🎬','Video detection'],['🎤','Voice / audio'],['🎵','Music detection'],['📝','Text detection'],['🔒','Your key, your data']].map(([icon,label]) => (
          <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface border border-border text-sm">
            <span>{icon}</span><span className="text-white/80 text-xs">{label}</span>
          </div>
        ))}
      </div>

      <div className="w-full max-w-sm px-4 py-3 rounded-xl bg-accent-cyan/8 border border-accent-cyan/20 text-xs text-muted text-left">
        <span className="text-accent-cyan font-semibold">Why your own key? </span>
        You use your free aiornot.com credits. Your key is saved only in your browser — never sent to our servers.
      </div>

      <button onClick={onNext}
        className="w-full max-w-sm flex items-center justify-center gap-2 py-3.5 rounded-xl
          bg-accent-cyan text-bg font-display font-bold text-base
          hover:bg-cyan-300 active:scale-95 transition-all shadow-lg shadow-cyan-500/20">
        Get Started <ArrowRight size={18} />
      </button>
    </motion.div>
  )
}

function StepGetKey({ onSave }) {
  const [key, setKey] = useState('')
  const [show, setShow] = useState(false)
  const [validating, setValidating] = useState(false)
  const [error, setError] = useState('')
  const [pasted, setPasted] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  // Listen for global paste
  useEffect(() => {
    const handler = (e) => {
      const text = e.clipboardData?.getData('text')?.trim()
      if (text && text.length > 10 && document.activeElement?.tagName !== 'INPUT') {
        setKey(text); setPasted(true); setError('')
        setTimeout(() => setPasted(false), 2000)
      }
    }
    window.addEventListener('paste', handler)
    return () => window.removeEventListener('paste', handler)
  }, [])

  const pasteFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text?.trim().length > 10) {
        setKey(text.trim()); setPasted(true); setError('')
        setTimeout(() => setPasted(false), 2000)
      }
    } catch {
      setError('Tap the input field and use long-press → Paste.')
    }
  }, [])

  const save = async () => {
    const k = key.trim()
    if (!k) { setError('Please enter your API key.'); return }
    if (k.length < 20) { setError('Key looks too short — check you copied the full key.'); return }
    setValidating(true); setError('')
    const result = await validateKey(k)
    setValidating(false)
    if (result.valid) { keyStore.set(k); onSave() }
    else if (result.reason === 'network') setError('Cannot reach the proxy server. Start it with: node server/index.js')
    else {
      const detail = result.detail?.message || result.detail?.error || result.detail?.detail
      setError(detail ? `aiornot.com: ${detail}` : 'Key not recognised. Check you copied the correct key from aiornot.com.')
    }
  }


  return (
    <motion.div key="getkey" initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
      className="flex flex-col gap-4">
      <div className="text-center">
        <div className="w-11 h-11 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/25 flex items-center justify-center mx-auto mb-3">
          <Key size={20} className="text-accent-cyan" />
        </div>
        <h2 className="font-display text-2xl font-bold mb-1">Get Your Free API Key</h2>
        <p className="text-muted text-sm">30 seconds. No credit card needed.</p>
      </div>

      {[
        { n:'1', t:'Open aiornot.com below', s:'Sign up free — Google or email' },
        { n:'2', t:'Dashboard → API Keys → Create key', s:'Copy the key to your clipboard' },
        { n:'3', t:'Come back and paste it below', s:'We validate and save it locally' },
      ].map(({n,t,s}) => (
        <div key={n} className="flex items-start gap-3 px-3 py-3 rounded-xl bg-surface border border-border">
          <div className="w-6 h-6 rounded-full bg-accent-cyan/12 border border-accent-cyan/30 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-accent-cyan text-xs font-bold mono">{n}</span>
          </div>
          <div><p className="text-sm font-medium">{t}</p><p className="text-muted text-xs mt-0.5">{s}</p></div>
        </div>
      ))}

      <a href={AIORNOT_URL} target="_blank" rel="noreferrer"
        className="flex items-center justify-center gap-2 py-3 rounded-xl border border-accent-cyan/30 text-accent-cyan text-sm font-semibold hover:bg-accent-cyan/8 transition-colors">
        <ExternalLink size={14} /> Open aiornot.com — Get Free Key
      </a>

      <div>
        <p className="text-muted text-xs mono uppercase tracking-widest mb-2">Paste Your API Key</p>
        <div className="relative">
          <input ref={inputRef} type={show ? 'text' : 'password'} value={key}
            onChange={e => { setKey(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && save()}
            placeholder="aon_prod_xxxxxxxxxxxxxxxxxxxxxxxx"
            className={`w-full bg-surface rounded-xl px-4 py-3 pr-20 mono text-sm text-white placeholder-muted
              focus:outline-none transition-colors border
              ${error ? 'border-accent-red/60' : pasted ? 'border-accent-green/50' : 'border-border focus:border-accent-cyan/40'}`} />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <button onClick={pasteFromClipboard} className={`p-1.5 rounded-lg transition-colors ${pasted ? 'text-accent-green' : 'text-muted hover:text-white'}`}>
              <Clipboard size={14} />
            </button>
            <button onClick={() => setShow(s => !s)} className="p-1.5 rounded-lg text-muted hover:text-white transition-colors">
              {show ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {pasted && <motion.p initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-accent-green text-xs mt-1.5 flex items-center gap-1"><CheckCircle size={11}/> Pasted from clipboard!</motion.p>}
          {error && <motion.p initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-accent-red text-xs mt-1.5 flex items-center gap-1.5"><AlertCircle size={11}/> {error}</motion.p>}
        </AnimatePresence>
      </div>

      <button onClick={save} disabled={!key.trim() || validating}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-display font-bold text-sm transition-all
          ${key.trim() && !validating ? 'bg-accent-cyan text-bg hover:bg-cyan-300 shadow-lg shadow-cyan-500/20 active:scale-95' : 'bg-surface border border-border text-muted cursor-not-allowed'}`}>
        {validating ? <><Loader size={15} className="animate-spin"/> Validating…</> : <><CheckCircle size={15}/> Save & Continue</>}
      </button>

      <p className="text-center text-muted text-xs mono">🔒 Saved to your browser only. Never sent to any server.</p>
    </motion.div>
  )
}

function StepSuccess({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1800); return () => clearTimeout(t) }, [onDone])
  return (
    <motion.div key="success" initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
      className="flex flex-col items-center gap-5 py-10 text-center">
      <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', bounce:.5, delay:.1 }}
        className="w-20 h-20 rounded-full bg-green-500/12 border border-green-500/30 flex items-center justify-center">
        <CheckCircle size={40} className="text-accent-green" />
      </motion.div>
      <div>
        <h2 className="font-display text-2xl font-bold text-accent-green mb-1">You're all set!</h2>
        <p className="text-muted text-sm">Loading VeritasAI…</p>
      </div>
      <div className="flex gap-1.5">
        {[0,1,2].map(i => (
          <motion.div key={i} className="w-2 h-2 rounded-full bg-accent-green"
            animate={{ opacity:[.3,1,.3] }} transition={{ duration:1, delay:i*.2, repeat:Infinity }} />
        ))}
      </div>
    </motion.div>
  )
}

export default function OnboardingGate({ children }) {
  const [step, setStep] = useState(null)
  useEffect(() => { setStep(keyStore.has() ? 'done' : 'welcome') }, [])
  if (step === null) return null
  if (step === 'done') return children

  return (
    <div className="fixed inset-0 z-50 scanlines grid-bg overflow-y-auto flex flex-col items-center justify-center p-5">
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="relative w-full max-w-md py-8">
        <AnimatePresence mode="wait">
          {step === 'welcome' && <StepWelcome onNext={() => setStep('getkey')} />}
          {step === 'getkey'  && <StepGetKey  onSave={() => setStep('success')} />}
          {step === 'success' && <StepSuccess onDone={() => setStep('done')} />}
        </AnimatePresence>
      </div>
      <p className="fixed bottom-5 text-muted text-xs mono">
        Made by <span className="text-white/70">Justin Chachap</span>
      </p>
    </div>
  )
}
