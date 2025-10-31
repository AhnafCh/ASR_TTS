# 🚀 Railway Deployment - Quick Start

## Files Created ✅

- `Procfile` - Railway start command
- `runtime.txt` - Python 3.11.0 specification
- `requirements.txt` - All Python dependencies (root level)
- `railway.json` - Railway configuration
- `nixpacks.toml` - **Forces Python-only deployment (ignores Next.js)**
- `.railwayignore` - Excludes frontend files from deployment
- `.env.example` - Environment variables template
- `RAILWAY_DEPLOYMENT.md` - Complete deployment guide

## 📋 Pre-Deployment Checklist

### 1. Verify Files
- [ ] `requirements.txt` is in repo root
- [ ] `Procfile` is in repo root
- [ ] `runtime.txt` is in repo root
- [ ] `api/main.py` exists with FastAPI app

### 2. Environment Variables Needed
You'll need these values for Railway:
- [ ] `TTS_API_BASE_URL` - Your TTS service URL
- [ ] `ASR_API_BASE_URL` - Your ASR service URL
- [ ] `ALLOWED_ORIGINS` (optional) - Comma-separated frontend URLs

### 3. Git Repository
```bash
# Check current status
git status

# Add all files
git add .

# Commit changes
git commit -m "Prepare for Railway deployment"

# Push to GitHub
git push origin master
```

## 🎯 Deploy Now (3 Steps)

### Step 1: Go to Railway
Visit: https://railway.app/dashboard

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `AhnafCh/AST_TTS`
4. Railway auto-detects Python app

### Step 3: Add Environment Variables
In Railway dashboard → Variables tab:
```
TTS_API_BASE_URL = your_tts_api_url
ASR_API_BASE_URL = your_asr_api_url
```

## ✅ Verify Deployment

After deployment (2-3 minutes):
1. Railway provides URL: `https://your-app.railway.app`
2. Test endpoints:
   - `https://your-app.railway.app/` → Welcome message
   - `https://your-app.railway.app/docs` → Swagger UI
   - `https://your-app.railway.app/health` → Health check

## 🔧 Update Frontend

After successful deployment, update your Next.js frontend:

**File:** `app/playground/page.tsx` or wherever you call the API

```typescript
// Change from localhost to Railway URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://your-app.railway.app"
```

Add to `.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://your-app.railway.app
```

## 🔄 Continuous Deployment

Every push to `master` auto-deploys:
```bash
git add .
git commit -m "Update API"
git push
# Railway automatically redeploys!
```

## 🐛 Troubleshooting

**Build fails?**
- Check Railway logs in dashboard
- Verify `requirements.txt` syntax

**App crashes?**
- Ensure environment variables are set
- Check logs for missing dependencies

**CORS errors?**
- Add your frontend URL to `ALLOWED_ORIGINS` in Railway
- Format: `https://yoursite.com,https://other.com`

## 📚 Full Documentation

See `RAILWAY_DEPLOYMENT.md` for complete guide with:
- Detailed explanations
- Advanced configurations
- Monitoring setup
- Pricing information

---

**Ready to deploy?** Follow the 3 steps above! 🚀
