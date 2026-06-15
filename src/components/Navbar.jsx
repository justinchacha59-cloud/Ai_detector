import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, Settings } from 'lucide-react'
import { keyStore } from '../lib/keyStore.js'

const NAV = [
  { to:'/', label:'Home' },
  { to:'/image', label:'Image' },
  { to:'/video', label:'Video' },
  { to:'/audio', label:'Audio' },
  { to:'/music', label:'Music' },
  { to:'/text', label:'Text' },
  { to:'/history', label:'History' },
]

export default function Navbar() {
  const loc = useLocation()
  const hasKey = keyStore.has()
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-3 h-14 flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2 shrink-0 mr-1">
          <div className="w-7 h-7 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center">
            <Eye size={13} className="text-accent-cyan" />
          </div>
          <span className="font-display font-bold text-sm tracking-tight hidden sm:block">
            Veritas<span className="text-accent-cyan">AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none flex-1">
          {NAV.map(({ to, label }) => {
            const active = loc.pathname === to
            return (
              <Link key={to} to={to}
                className={`relative px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors
                  ${active ? 'text-white' : 'text-muted hover:text-white'}`}>
                {active && (
                  <motion.div layoutId="nav-active"
                    className="absolute inset-0 bg-white/8 rounded-lg border border-white/10"
                    transition={{ type:'spring', bounce:.2, duration:.4 }} />
                )}
                <span className="relative">{label}</span>
              </Link>
            )
          })}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs mono
            ${hasKey ? 'bg-green-500/8 border-green-500/20 text-accent-green' : 'bg-red-500/8 border-red-500/20 text-accent-red'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${hasKey ? 'bg-accent-green' : 'bg-accent-red'}`}
              style={{ animation:'blink 2s ease-in-out infinite' }} />
            {hasKey ? 'Key Active' : 'No Key'}
          </div>
          <Link to="/settings"
            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors
              ${loc.pathname === '/settings' ? 'bg-white/8 border-white/15 text-white' : 'border-border text-muted hover:text-white'}`}>
            <Settings size={13} />
          </Link>
        </div>
      </div>
    </nav>
  )
}
