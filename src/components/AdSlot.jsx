import { useEffect, useRef } from 'react'

/**
 * Google AdSense ad unit.
 *
 * Setup:
 * 1. Replace the publisher ID in index.html (`ca-pub-XXXXXXXXXXXXXXXX`)
 * 2. In your AdSense dashboard, create a "Display ad" → "Responsive" unit
 * 3. Copy its numeric data-ad-slot value into ADSENSE_SLOT below
 *
 * Until both are set, this renders nothing (no broken ad boxes during dev).
 */

const ADSENSE_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX'
const ADSENSE_SLOT = '0000000000'

const isConfigured = !ADSENSE_CLIENT.includes('XXXX') && !ADSENSE_SLOT.includes('000000')

export default function AdSlot({ className = '' }) {
  const insRef = useRef(null)
  const pushed = useRef(false)

  useEffect(() => {
    if (!isConfigured) return
    if (pushed.current) return
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
      pushed.current = true
    } catch {
      // AdSense script not loaded yet or blocked (ad blocker) — fail silently
    }
  }, [])

  if (!isConfigured) return null

  return (
    <div className={`w-full ${className}`}>
      <p className="text-muted text-[10px] mono uppercase tracking-widest mb-1.5 text-center">Advertisement</p>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={ADSENSE_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
