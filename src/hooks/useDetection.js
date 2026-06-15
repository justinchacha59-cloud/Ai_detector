import { useState, useCallback } from 'react'
import { addScan } from '../lib/localHistory.js'

const ERR = {
  NO_KEY: 'No API key saved. Go to Settings to add your key.',
  INVALID_KEY: 'API key rejected. Go to Settings → update your key.',
  QUOTA_EXCEEDED: 'Your aiornot.com quota is used up. Check your dashboard.',
}

export function useDetection(detectorFn, modality) {
  const [state, setState] = useState({
    file: null, preview: null, loading: false, result: null, error: null, elapsed: null
  })

  const reset = useCallback(() => {
    if (state.preview) URL.revokeObjectURL(state.preview)
    setState({ file: null, preview: null, loading: false, result: null, error: null, elapsed: null })
  }, [state.preview])

  const detect = useCallback(async (file) => {
    if (!file) return
    const preview = ['image','video','audio','music'].includes(modality) ? URL.createObjectURL(file) : null
    setState(s => ({ ...s, file, preview, loading: true, result: null, error: null }))
    const t0 = performance.now()
    try {
      const result = await detectorFn(file)
      setState(s => ({ ...s, loading: false, result, elapsed: ((performance.now()-t0)/1000).toFixed(2) }))
      addScan({ modality, filename: file.name, verdict: result.verdict, confidence: result.confidence })
    } catch (err) {
      setState(s => ({ ...s, loading: false, error: ERR[err.message] || err.message || 'Detection failed' }))
    }
  }, [detectorFn, modality])

  const detectText = useCallback(async (text) => {
    setState(s => ({ ...s, file: { name: 'text input' }, loading: true, result: null, error: null }))
    const t0 = performance.now()
    try {
      const result = await detectorFn(text)
      setState(s => ({ ...s, loading: false, result, elapsed: ((performance.now()-t0)/1000).toFixed(2) }))
      addScan({ modality: 'text', filename: null, verdict: result.verdict, confidence: result.confidence })
    } catch (err) {
      setState(s => ({ ...s, loading: false, error: ERR[err.message] || err.message || 'Detection failed' }))
    }
  }, [detectorFn])

  return { ...state, detect, detectText, reset }
}
