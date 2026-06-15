# VeritasAI — AI Detector (PWA)

Detect AI-generated **images**, **video**, **audio**, **music**, and **text**
with 98.9% accuracy. Each user brings their own free aiornot.com API key —
stored only in their browser. A thin local proxy avoids CORS issues
(it never stores or logs your key).

---

## Termux Setup

```bash
# 1. Extract this archive (if not already extracted)
tar -xzf veritasai.tar.gz
cd veritasai

# 2. Install Node
pkg update && pkg install nodejs-lts -y

# 3. Install frontend deps
npm install

# 4. Install proxy server deps
cd server && npm install && cd ..

# 5. Start the proxy (Terminal/session 1)
node server/index.js

# 6. Start the frontend (Terminal/session 2 — use tmux or a new Termux session)
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Using tmux for both servers
```bash
pkg install tmux -y
tmux new-session -d -s proxy 'node server/index.js'
npm run dev
```

---

## First Launch — Get Your Free Key

1. App shows a Welcome screen → tap **Get Started**
2. Tap **Open aiornot.com — Get Free Key** (opens in new tab)
3. Sign up free (no credit card), go to Dashboard → API Keys → Create
4. Copy the key, return to the app
5. Tap the clipboard icon to auto-paste, or paste manually
6. Tap **Save & Continue** — key is validated live and stored in your browser only

You can update or remove the key anytime via the Settings icon (top right).

---

## Project Tree

```
veritasai/
├── index.html                  PWA meta tags, fonts
├── package.json                Frontend deps + scripts
├── vite.config.js              Vite + vite-plugin-pwa + /api proxy
├── tailwind.config.js
├── postcss.config.js
├── .gitignore
├── README.md
│
├── public/
│   ├── favicon.svg
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
│
├── server/
│   ├── index.js               Thin CORS proxy → api.aiornot.com
│   └── package.json
│
└── src/
    ├── main.jsx
    ├── App.jsx                 Routes + OnboardingGate + Footer + PWA banner
    ├── index.css
    │
    ├── lib/
    │   ├── keyStore.js          localStorage key management
    │   ├── api.js               Calls /api/* with user's key as Bearer token
    │   └── localHistory.js     Local scan history (localStorage)
    │
    ├── hooks/
    │   └── useDetection.js
    │
    ├── components/
    │   ├── OnboardingGate.jsx   First-launch 3-step key setup
    │   ├── PWAInstallBanner.jsx Install prompt (Android + iOS guide)
    │   ├── Navbar.jsx
    │   ├── Footer.jsx           "Made by Justin Chachap"
    │   ├── DetectionUI.jsx      Shared UI primitives
    │   └── DetectorPage.jsx     Generic detector page shell
    │
    └── pages/
        ├── HomePage.jsx
        ├── ImagePage.jsx
        ├── VideoPage.jsx
        ├── AudioPage.jsx
        ├── MusicPage.jsx
        ├── TextPage.jsx
        ├── HistoryPage.jsx
        └── SettingsPage.jsx
```

---

## Production Build

```bash
npm run build      # → dist/ (static site)
node server/index.js  # keep proxy running, or deploy separately (Railway/Render)
```

---

## Deploying to Production (Render.com — free tier)

This app has two parts: a static frontend (`dist/`) and a tiny CORS proxy
(`server/`). Deploy them as two separate services on Render.

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "VeritasAI"
# create a repo on github.com, then:
git remote add origin https://github.com/yourname/veritasai.git
git push -u origin main
```

### 2. Deploy the proxy (Web Service)
- Render dashboard → New → Web Service → connect your repo
- **Root Directory:** `server`
- **Build Command:** `npm install`
- **Start Command:** `node index.js`
- Deploy. Copy the URL Render gives you, e.g.
  `https://veritasai-proxy.onrender.com`

### 3. Deploy the frontend (Static Site)
- Render dashboard → New → Static Site → same repo
- **Root Directory:** *(leave blank — repo root)*
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Environment Variable:**
  - `VITE_PROXY_URL` = `https://veritasai-proxy.onrender.com` (from step 2, no trailing slash)
- Deploy.

That's it — visit your static site URL. The onboarding flow, key storage,
and all 5 detectors will work exactly as they do locally.

### Notes
- Render's free tier proxy may "sleep" after inactivity — first request after
  idle can take ~30s to wake up. Fine for a portfolio demo.
- For a custom domain, add it under the Static Site's settings → Custom Domains.
- Alternatives to Render: Railway, Fly.io, or a VPS with PM2 for the proxy;
  Vercel/Netlify/Cloudflare Pages for the frontend.

---

## Monetization — Google AdSense

Ads are wired in but **disabled by default** (no broken ad boxes during dev).

### Setup
1. Get approved for [Google AdSense](https://adsense.google.com)
2. In `index.html`, replace `ca-pub-XXXXXXXXXXXXXXXX` with your publisher ID
3. In AdSense dashboard: Ads → By ad unit → create a **Responsive Display** unit
4. Copy its numeric slot ID into `src/components/AdSlot.jsx` → `ADSENSE_SLOT`

Once both values are set, a single ad unit appears below the result card
on every detector page (Image, Video, Audio, Music, Text) — right after
the user gets their verdict, which is the highest-engagement moment.

### Notes
- AdSense review requires real content — consider adding a short "How this
  works" blurb to each detector page before submitting for approval.
- Ads never appear during onboarding, loading, or error states — only after
  a successful result, to avoid disrupting first impressions.
- If `ADSENSE_CLIENT`/`ADSENSE_SLOT` are left as placeholders, `AdSlot`
  renders `null` — safe to ship without ads configured.

---

## Security Notes

**What's protected:**
- User's aiornot API key lives only in their browser (localStorage). The proxy
  forwards it per-request and never logs, stores, or persists it.
- Proxy has `helmet()` security headers, a 30 req/min per-IP rate limit, and
  a 25MB upload cap with friendly error messages.
- No database at all — scan history is stored entirely in the browser's
  localStorage, so there's no SQL injection surface or shared data store.

**Recommended hardening before going fully public:**
1. Set `ALLOWED_ORIGIN` env var on your proxy deployment to your exact frontend
   URL (e.g. `https://veritasai.onrender.com`) instead of `*`. This stops other
   sites from using your proxy as their own CORS bypass.
2. If traffic grows, tighten the rate limit (`max: 30` in `server/index.js`)
   or add a Cloudflare proxy in front for DDoS protection.
3. Each user supplies their own aiornot key, so you're never liable for their
   API usage/costs — but consider adding a short Terms note ("bring your own
   key, you're responsible for your own aiornot usage").
4. Keep dependencies updated: `npm audit` periodically in both `/` and `/server`.

---

Made by ** © Justin Chachap**
