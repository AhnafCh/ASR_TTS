# 🎯 Railway Deployment - Manual Configuration Guide

## ⚡ Quick Fix (2 Minutes)

Railway is detecting Node.js instead of Python. Configure it manually in the dashboard:

### Step 1: Open Railway Settings
1. Go to your Railway project
2. Click on **Settings** tab

### Step 2: Configure Build Settings
Scroll to **Build** section and set:

**Root Directory**: 
```
(leave empty or set to /)
```

**Build Command**: 
```bash
pip install -r requirements.txt
```

**Start Command**:
```bash
cd api && uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Step 3: Set Environment Variables
Go to **Variables** tab and add:

**Required Variables:**
```
NIXPACKS_PYTHON_VERSION = 3.11
TTS_API_BASE_URL = your_tts_api_url_here
ASR_API_BASE_URL = your_asr_api_url_here
```

**Optional but Recommended:**
```
ALLOWED_ORIGINS = https://your-frontend.vercel.app,http://localhost:3000
```

### Step 4: Redeploy
1. Go to **Deployments** tab
2. Click **⋮** (three dots) on latest deployment
3. Click **Redeploy**

## ✅ Expected Result

Build log should show:
```
✓ Installing Python 3.11
✓ Installing requirements.txt
✓ Starting uvicorn
✓ Server running on port $PORT
```

Your API will be live at: `https://your-project.railway.app`

## 🧪 Test Your Deployment

Visit these URLs:
- `https://your-project.railway.app/` - Welcome message
- `https://your-project.railway.app/docs` - Swagger UI
- `https://your-project.railway.app/health` - Health check

## 🐛 Still Having Issues?

### Issue: "pip: command not found"
**Solution**: Add `NIXPACKS_PYTHON_VERSION=3.11` to Variables tab

### Issue: "Module not found"
**Solution**: Check that `requirements.txt` is in the root directory

### Issue: "Port already in use"
**Solution**: Make sure start command uses `--port $PORT` (Railway's dynamic port)

### Issue: "CORS errors from frontend"
**Solution**: Add your frontend domain to `ALLOWED_ORIGINS` variable

## 📱 Connect Frontend to Backend

After successful deployment:

1. **Get your Railway API URL**:
   ```
   https://your-project-abc123.railway.app
   ```

2. **Update your frontend** (Next.js `.env.local`):
   ```bash
   NEXT_PUBLIC_API_URL=https://your-project-abc123.railway.app
   ```

3. **Deploy frontend to Vercel**:
   ```bash
   vercel --prod
   ```

## 🎉 Done!

Your architecture:
- ✅ **Backend (FastAPI)**: Railway - `https://your-api.railway.app`
- ✅ **Frontend (Next.js)**: Vercel - `https://your-site.vercel.app`
- ✅ **Database**: Supabase - Managed authentication

---

**Need Help?** Check Railway logs in the Deployments tab for detailed error messages.
