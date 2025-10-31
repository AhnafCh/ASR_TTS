# Railway Deployment Guide for SenseVoice API

## 📋 Prerequisites

- [Railway Account](https://railway.app/) (free tier available)
- Git repository with your code
- Environment variables values (TTS_API_BASE_URL, ASR_API_BASE_URL)

## 🚀 Deployment Steps

### 1. Prepare Your Repository

Ensure these files exist in your repo root:
- ✅ `requirements.txt` - Python dependencies
- ✅ `Procfile` - Start command for Railway
- ✅ `runtime.txt` - Python version specification
- ✅ `railway.json` - Railway configuration (optional but recommended)

### 2. Push to GitHub

```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin master
```

### 3. Deploy on Railway

#### Option A: Deploy from GitHub (Recommended)

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository: `AhnafCh/AST_TTS`
5. Railway will auto-detect your Python app

#### Option B: Deploy with Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

### 4. Configure Environment Variables

In Railway Dashboard:
1. Go to your project
2. Click on **"Variables"** tab
3. Add these environment variables:
   - `TTS_API_BASE_URL` = your_tts_api_url
   - `ASR_API_BASE_URL` = your_asr_api_url
   - `PORT` = (automatically set by Railway)

### 5. Verify Deployment

After deployment completes:
1. Railway will provide a public URL (e.g., `https://your-app.railway.app`)
2. Test your API:
   - Visit `https://your-app.railway.app/docs` for Swagger UI
   - Visit `https://your-app.railway.app/health` for health check

## 🔧 Configuration Files Explained

### `Procfile`
```
web: cd api && uvicorn main:app --host 0.0.0.0 --port $PORT
```
- Changes to `api` directory where `main.py` is located
- Runs FastAPI app on Railway's dynamic port

### `runtime.txt`
```
python-3.11.0
```
- Specifies Python version for Railway

### `railway.json` (Optional)
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd api && uvicorn main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```
- Configures build and deployment settings
- Auto-restart on failure

## 🌐 Update CORS Origins

After deployment, update your API's CORS settings in `api/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-frontend-domain.vercel.app",  # Add your frontend URL
        "https://your-app.railway.app",  # Add your Railway URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📊 Monitoring

Railway provides:
- **Logs**: View real-time application logs
- **Metrics**: CPU, Memory, Network usage
- **Deployments**: History of all deployments

Access these from your Railway project dashboard.

## 🔄 Continuous Deployment

Railway automatically redeploys when you push to your connected GitHub branch:
```bash
git add .
git commit -m "Update API"
git push origin master
# Railway automatically deploys!
```

## 💰 Pricing

- **Free Tier**: $5 credit/month (good for small projects)
- **Pro Plan**: $20/month + usage

Monitor your usage in Railway dashboard.

## 🐛 Troubleshooting

### Build Fails
- Check `requirements.txt` for correct package versions
- Verify Python version in `runtime.txt` matches your local version

### App Crashes on Start
- Check Railway logs for errors
- Verify environment variables are set correctly
- Ensure `PORT` variable is used: `--port $PORT`

### CORS Errors
- Add your frontend domain to `allow_origins` in `main.py`
- Redeploy after updating CORS settings

### Timeout Errors
- Check if external APIs (TTS_API_BASE_URL, ASR_API_BASE_URL) are accessible
- Verify API URLs in environment variables

## 📚 Resources

- [Railway Documentation](https://docs.railway.app/)
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)
- [Railway Community](https://discord.gg/railway)

## ✅ Deployment Checklist

- [ ] All files committed to Git
- [ ] `requirements.txt` includes all dependencies
- [ ] `Procfile` has correct start command
- [ ] Repository pushed to GitHub
- [ ] Railway project created
- [ ] Environment variables configured
- [ ] CORS origins updated with Railway URL
- [ ] API tested via `/docs` endpoint
- [ ] Frontend updated with new API URL

---

**Need Help?** Check Railway logs first, then consult the troubleshooting section above.
