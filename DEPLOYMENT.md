# SmartSathi — Production Deployment Guide

Frontend → **Vercel** | Backend → **Render**

---

## Architecture

```
User Browser
    │
    ▼
Vercel (React SPA)
    │  fetch('/api/...')  — rewrites via vercel.json
    ▼
Render (Express API)
    │
    ├── OpenRouter API  (AI chat / scam / screenshot / news)
    └── YouTube Data API v3
```

---

## Step 1 — Deploy Backend to Render

### Create Web Service

1. Go to https://render.com → **New** → **Web Service**
2. Connect your GitHub repo: `atharv3046/SAHAYAK`
3. Configure:

| Field | Value |
|---|---|
| **Name** | `sahayak-api` (or any name) |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

### Environment Variables (set in Render dashboard → Environment tab)

| Variable | Value |
|---|---|
| `CLIENT_URL` | `https://YOUR-APP.vercel.app` ← set after Vercel deploy |
| `OPENROUTER_API_KEY` | your key from `server/.env` |
| `OPENROUTER_MODEL` | `openai/gpt-oss-120b:free` |
| `YOUTUBE_API_KEY` | your key from `server/.env` |

> **DO NOT set PORT** — Render sets this automatically.

### Verify Backend

Once deployed, visit:
```
https://sahayak-api.onrender.com/api/health
```
Expected response:
```json
{ "status": "ok", "model": "openai/gpt-oss-120b:free", "ts": "..." }
```

---

## Step 2 — Update vercel.json with Real Render URL

After you have your Render URL, update `client/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://sahayak-api.onrender.com/api/:path*"
    }
  ]
}
```

Then commit and push:
```bash
git add client/vercel.json
git commit -m "deploy: set Render backend URL in vercel.json"
git push origin main
```

---

## Step 3 — Deploy Frontend to Vercel

### Create Project

1. Go to https://vercel.com → **Add New** → **Project**
2. Import GitHub repo: `atharv3046/SAHAYAK`
3. Configure:

| Field | Value |
|---|---|
| **Framework Preset** | `Create React App` |
| **Root Directory** | `client` |
| **Build Command** | `npm run build` (auto-detected) |
| **Output Directory** | `build` (auto-detected) |
| **Install Command** | `npm install` (auto-detected) |

### Environment Variables (Vercel dashboard → Settings → Environment Variables)

> No environment variables are required on Vercel when using the `vercel.json` rewrite approach — all API routing is handled by the rewrite rules.

### Deploy

Click **Deploy**. Vercel will:
1. Run `npm install`
2. Run `npm run build`
3. Serve the `build/` folder as a static site
4. Apply `vercel.json` rewrite rules

### Get Your Vercel URL

After deploy: `https://YOUR-APP.vercel.app`

---

## Step 4 — Update Render CLIENT_URL

Go to Render dashboard → your service → **Environment** tab:
- Set `CLIENT_URL` = `https://YOUR-APP.vercel.app`
- Click **Save Changes** → Render will auto-redeploy

---

## Post-Deployment Verification Checklist

```
□ GET  https://sahayak-api.onrender.com/api/health   → {"status":"ok"}
□ Frontend loads at https://YOUR-APP.vercel.app
□ Chat works (send a Hindi message)
□ Scam Checker works (paste sample SMS)
□ Screenshot Analyzer works (upload image)
□ News page loads (UPI tab)
□ Language switching works (try Tamil / Bengali)
□ YouTube suggestions appear in Chat
```

---

## Files Changed for Deployment

| File | Change |
|---|---|
| `.gitignore` | Added `client/.env.production`, `client/.env.local` |
| `server/.env.example` | Synced model name, added `CLIENT_URL` production comment |
| `client/vercel.json` | **NEW** — rewrites `/api/*` to Render backend |
| `DEPLOYMENT.md` | **NEW** — this file |

**Zero changes to any component `.js` files or application logic.**
