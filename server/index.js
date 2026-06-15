/**
 * VeritasAI – Thin CORS Proxy
 * Forwards requests to api.aiornot.com.
 * The user's API key comes in the Authorization header from the browser.
 * This server NEVER stores, logs, or persists any key.
 */
import express from 'express'
import fetch from 'node-fetch'
import FormData from 'form-data'
import multer from 'multer'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'

const app = express()
const PORT = process.env.PORT || 3001
const AIORNOT = 'https://api.aiornot.com/v2'

app.use(helmet())

// Restrict in production: set ALLOWED_ORIGIN to your deployed frontend URL
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*'
app.use(cors({ origin: ALLOWED_ORIGIN }))
app.use(express.json())

// Basic abuse protection — limits requests per IP regardless of key used
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests — please slow down.' }
})
app.use('/api', limiter)

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB — adjust if your aiornot plan allows larger
})

// ── Safely parse a response that might not be JSON ───────
async function safeJson(upstream) {
  const text = await upstream.text()
  try {
    return JSON.parse(text)
  } catch {
    return { error: text || `Upstream returned ${upstream.status} with empty body` }
  }
}

// ── Forward a file upload to aiornot ─────────────────────
async function forwardFile(req, res, endpoint, field) {
  const auth = req.headers['authorization']
  if (!auth) return res.status(401).json({ error: 'No Authorization header received by proxy' })
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  try {
    const form = new FormData()
    form.append(field, req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    })
    const upstream = await fetch(`${AIORNOT}${endpoint}`, {
      method: 'POST',
      headers: { Authorization: auth, ...form.getHeaders() },
      body: form
    })
    const data = await safeJson(upstream)
    res.status(upstream.status).json(data)
  } catch (err) {
    res.status(502).json({ error: 'Upstream request failed' })
  }
}

// ── Forward text request to aiornot (multipart/form-data) ─
async function forwardText(req, res, endpoint) {
  const auth = req.headers['authorization']
  if (!auth) return res.status(401).json({ error: 'No Authorization header received by proxy' })
  if (!req.body?.text) return res.status(400).json({ error: 'No text provided' })
  try {
    const form = new FormData()
    form.append('text', req.body.text)
    const upstream = await fetch(`${AIORNOT}${endpoint}`, {
      method: 'POST',
      headers: { Authorization: auth, ...form.getHeaders() },
      body: form
    })
    const data = await safeJson(upstream)
    res.status(upstream.status).json(data)
  } catch (err) {
    res.status(502).json({ error: 'Upstream request failed' })
  }
}

app.post('/api/image', upload.single('file'), (req, res) => forwardFile(req, res, '/image/sync', 'image'))
app.post('/api/video', upload.single('file'), (req, res) => forwardFile(req, res, '/video/sync', 'video'))
app.post('/api/audio', upload.single('file'), (req, res) => forwardFile(req, res, '/voice/sync', 'audio'))
app.post('/api/music', upload.single('file'), (req, res) => forwardFile(req, res, '/music/sync', 'audio'))
app.post('/api/text',                         (req, res) => forwardText(req, res, '/text/sync'))
app.get( '/api/health',                       (_,  res) => res.json({ ok: true }))

// Friendly error for oversized uploads (must come after routes)
app.use((err, req, res, next) => {
  if (err?.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large. Maximum size is 25MB.' })
  }
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`VeritasAI CORS proxy listening on port ${PORT}`)
})
