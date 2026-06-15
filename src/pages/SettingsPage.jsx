import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Key, Eye, EyeOff, CheckCircle, AlertCircle, Trash2, ExternalLink, Clipboard, Loader, Shield } from 'lucide-react'
import { keyStore } from '../lib/keyStore.js'
import { validateKey } from '../lib/api.js'

export default function SettingsPage() {
  const [key, setKey] = useState('')
  const [show, setShow] = useState(false)
  const [validating, setValidating] = useState(false)
  const [status, setStatus] = useState(null)
  const [msg, setMsg] = useState('')

  useEffect(() => { const k = keyStore.get(); if (k) setKey(k) }, [])

  const pasteFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text?.trim().length > 10) {
        setKey(text.trim()); setStatus('paste'); setMsg('Pasted from clipboard!')
        setTimeout(() => setStatus(null), 2000)
      }
    } catch {
      setStatus('error'); setMsg('Long-press the field to paste manually.')
    }
  }, [])

  const save = async () => {
    const k = key.trim()
    if (!k || k.length < 20) { setStatus('error'); setMsg('Key too short — check it again.'); return }
    setValidating(true); setStatus(null)
    const result = await validateKey(k)
    setValidating(false)
    if (result.valid) { keyStore.set(k); setStatus('ok'); setMsg('Key saved successfully!') }
    else { setStatus('error'); setMsg('Invalid key. Check aiornot.com → API Keys.') }
  }

  const clear = () => { keyStore.clear(); setKey(''); window.location.reload() }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-xl mx-auto space-y-5">
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/25 flex items-center justify-center">
            <Key size={17} className="text-accent-cyan" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold">API Key Settings</h1>
            <p className="text-muted text-xs">Manage your aiornot.com key</p>
          </div>
        </motion.div>

        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-green-500/8 border border-green-500/20">
          <Shield size={15} className="text-accent-green mt-0.5 shrink-0" />
          <p className="text-sm text-muted leading-relaxed">
            Your API key is stored <strong className="text-white">only in this browser</strong>. It never touches any server we control.
          </p>
        </div>

        <div className="card p-5 space-y-3">
          <p className="text-muted text-xs mono uppercase tracking-widest">Your API Key</p>
          <div className="relative">
            <input type={show ? 'text' : 'password'} value={key}
              onChange={e => { setKey(e.target.value); setStatus(null) }}
              onKeyDown={e => e.key === 'Enter' && save()}
              placeholder="aon_prod_xxxxxxxxxxxxxxxxxxxxxxxx"
              className={`w-full bg-bg border rounded-xl px-4 py-3 pr-20 mono text-sm text-white placeholder-muted focus:outline-none transition-colors
                ${status === 'error' ? 'border-accent-red/60' : status === 'ok' || status === 'paste' ? 'border-accent-green/50' : 'border-border focus:border-accent-cyan/40'}`} />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <button onClick={pasteFromClipboard} className="p-1.5 rounded-lg text-muted hover:text-white"><Clipboard size={14} /></button>
              <button onClick={() => setShow(s => !s)} className="p-1.5 rounded-lg text-muted hover:text-white">{show ? <EyeOff size={14}/> : <Eye size={14}/>}</button>
            </div>
          </div>
          <AnimatePresence>
            {status && (
              <motion.p initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                className={`text-xs flex items-center gap-1.5 ${status === 'error' ? 'text-accent-red' : 'text-accent-green'}`}>
                {status === 'error' ? <AlertCircle size={11}/> : <CheckCircle size={11}/>} {msg}
              </motion.p>
            )}
          </AnimatePresence>
          <div className="flex gap-2">
            <button onClick={save} disabled={!key.trim() || validating}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all
                ${key.trim() && !validating ? 'bg-accent-cyan text-bg hover:bg-cyan-300' : 'bg-surface border border-border text-muted cursor-not-allowed'}`}>
              {validating ? <><Loader size={14} className="animate-spin"/> Validating…</> : <><CheckCircle size={14}/> Save Key</>}
            </button>
            <a href="https://www.aiornot.com/dashboard/api-keys" target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface border border-border text-muted hover:text-white text-sm transition-colors">
              <ExternalLink size={14} /> Get Key
            </a>
          </div>
        </div>

        <div className="card p-5 border-red-500/20">
          <p className="font-medium text-sm mb-1">Reset & Sign Out</p>
          <p className="text-muted text-xs mb-3">Removes your key from this browser and returns to the setup screen.</p>
          <button onClick={clear} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/30 text-accent-red hover:bg-red-500/10 text-sm transition-colors">
            <Trash2 size={14} /> Remove API Key
          </button>
        </div>
      </div>
    </div>
  )
}
