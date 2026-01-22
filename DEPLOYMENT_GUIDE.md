# 🚀 FREE DEPLOYMENT GUIDE - CourtEdge Full Stack

## ✅ FRONTEND DEPLOYED!
**URL:** https://courtedge-app.vercel.app

---

## 🔧 ML BACKEND - FREE DEPLOYMENT OPTIONS

### Option 1: Render.com (RECOMMENDED - Easiest)

1. Go to https://render.com and sign up (FREE)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo OR use "Public Git repository"
4. Configure:
   - **Name:** courtedge-ml-api
   - **Root Directory:** ml_service
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements-prod.txt`
   - **Start Command:** `uvicorn src.api:app --host 0.0.0.0 --port $PORT`
   
5. Add Environment Variables:
   ```
   ENVIRONMENT=production
   CORS_ORIGINS=https://courtedge-app.vercel.app
   ```

6. Click "Create Web Service" (FREE tier)

**Note:** Free tier sleeps after 15 min inactivity, first request takes ~30s to wake

---

### Option 2: Railway.app (Good free tier)

1. Go to https://railway.app and sign up with GitHub (FREE $5/month credit)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repo, set root to `ml_service`
4. Add environment variables:
   ```
   ENVIRONMENT=production
   CORS_ORIGINS=https://courtedge-app.vercel.app
   PORT=8000
   ```
5. Railway auto-detects Python and deploys!

---

### Option 3: Vercel Serverless (Python Functions)

Not ideal for FastAPI but possible with adaptations.

---

## 📝 AFTER BACKEND DEPLOYMENT

Once your ML backend is deployed, update Vercel environment variables:

1. Go to https://vercel.com/dashboard
2. Select "courtedge-app" project
3. Go to Settings → Environment Variables
4. Add:
   ```
   VITE_ML_SERVICE_URL=https://your-render-url.onrender.com
   VITE_ML_API_URL=https://your-render-url.onrender.com
   ```
5. Redeploy: `vercel --prod`

---

## 🔗 Your Deployed URLs

| Service | URL | Status |
|---------|-----|--------|
| Frontend | https://courtedge-app.vercel.app | ✅ LIVE |
| ML Backend | (Deploy using steps above) | ⏳ Pending |

---

## 💡 Quick Deploy Commands

### Push to GitHub (then connect to Render):
```bash
git init
git add .
git commit -m "Deploy CourtEdge"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/courtedge.git
git push -u origin main
```

### Update Vercel after backend deployment:
```bash
vercel env add VITE_ML_SERVICE_URL production
# Enter: https://courtedge-ml-api.onrender.com

vercel --prod
```

---

## 🆓 Free Tier Limits

| Platform | Limits |
|----------|--------|
| Vercel | 100GB bandwidth, unlimited deploys |
| Render | 750 hours/month, sleeps after 15min |
| Railway | $5 free credit/month |

All completely FREE! 🎉
