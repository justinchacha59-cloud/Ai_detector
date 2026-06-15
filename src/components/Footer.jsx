import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border/50 py-5 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-muted text-xs mono">
          Powered by{' '}
          <a href="https://aiornot.com" target="_blank" rel="noreferrer" className="text-accent-cyan hover:underline">
            aiornot.com
          </a>
          {' '}· 98.9% accuracy
        </p>
        <p className="text-muted text-xs mono flex items-center gap-1.5">
          Made with <Heart size={11} className="text-accent-red fill-accent-red" /> by{' '}
          <span className="text-white font-medium">Justin Chachap</span>
        </p>
      </div>
    </footer>
  )
}
