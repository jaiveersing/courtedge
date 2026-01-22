# 🆓 DEPLOY COURTEDGE COMPLETELY FREE!

## ⚡ 100% FREE HOSTING OPTIONS

---

## 🎯 METHOD 1: Vercel + Render (RECOMMENDED - 100% FREE)

### Total Cost: **$0/month** ✅

### Step 1: Deploy Frontend to Vercel (FREE FOREVER)

**What you get FREE:**
- ✅ Unlimited bandwidth
- ✅ 100GB bandwidth per month
- ✅ Auto SSL certificate
- ✅ Global CDN
- ✅ Automatic deployments from Git

**Deploy Steps:**
```powershell
# 1. Build your app
npm run build

# 2. Go to https://vercel.com/new
# 3. Sign up with GitHub (FREE)
# 4. Drag & drop your 'dist' folder
# 5. Click Deploy
```

✅ **Live in 2 minutes at:** `https://courtedge.vercel.app`

---

### Step 2: Deploy Backend to Render (FREE TIER)

**What you get FREE:**
- ✅ 750 hours/month (enough for 24/7 if only one service)
- ✅ Auto-deploy from GitHub
- ✅ Auto SSL
- ✅ 512MB RAM

**Deploy Backend:**
1. Go to https://render.com
2. Sign up with GitHub (FREE)
3. Click "New Web Service"
4. Connect your GitHub repo
5. Settings:
   - **Name:** `courtedge-backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server/index.js`
   - **Plan:** FREE
6. Click "Create Web Service"

✅ **Live at:** `https://courtedge-backend.onrender.com`

**⚠️ Note:** Free tier spins down after 15 min of inactivity. First request takes 30 seconds to wake up.

---

### Step 3: Deploy ML Service to Render (FREE TIER)

**Deploy ML Service:**
1. Click "New Web Service" again
2. Select your repo
3. Settings:
   - **Name:** `courtedge-ml`
   - **Root Directory:** `ml_service`
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python start_ml_service.py`
   - **Plan:** FREE
4. Click "Create Web Service"

✅ **Live at:** `https://courtedge-ml.onrender.com`

---

## 🎯 METHOD 2: Netlify + Railway (FREE)

### Total Cost: **$0/month** ✅

### Frontend: Netlify (100% FREE)

**What you get FREE:**
- ✅ 100GB bandwidth/month
- ✅ Unlimited sites
- ✅ Auto SSL
- ✅ Continuous deployment

**Deploy:**
```powershell
# 1. Build
npm run build

# 2. Go to https://netlify.com
# 3. Drag & drop 'dist' folder
```

### Backend: Railway (FREE $5/month credit)

**What you get FREE:**
- ✅ $5 credit/month (enough for small apps)
- ✅ 512MB RAM per service
- ✅ Auto-deploy from GitHub

**Deploy:**
1. Go to https://railway.app
2. Sign up with GitHub
3. New Project → Deploy from GitHub
4. Select your repo
5. Deploy both backend + ml_service

✅ **FREE if usage < $5/month**

---

## 🎯 METHOD 3: GitHub Pages + Cyclic (100% FREE)

### Frontend: GitHub Pages

```powershell
# 1. Build
npm run build

# 2. Install gh-pages
npm install --save-dev gh-pages

# 3. Add to package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# 4. Deploy
npm run deploy
```

✅ **Live at:** `https://yourusername.github.io/courtedge`

### Backend: Cyclic (FREE)

1. Go to https://cyclic.sh
2. Sign up with GitHub
3. Deploy from GitHub
4. FREE unlimited apps!

---

## 🎯 METHOD 4: Cloudflare Pages (100% FREE)

### Everything on Cloudflare (BEST FREE OPTION)

**What you get FREE:**
- ✅ Unlimited bandwidth
- ✅ Unlimited requests
- ✅ 500 builds/month
- ✅ Global CDN (fastest!)

**Deploy Frontend:**
1. Go to https://pages.cloudflare.com
2. Connect GitHub
3. Build command: `npm run build`
4. Output: `dist`
5. Deploy!

**Deploy Backend (Cloudflare Workers):**
- Free tier: 100,000 requests/day
- Perfect for small-medium traffic

---

## 📊 FREE TIER COMPARISON

| Platform | Frontend | Backend | ML Service | Limits |
|----------|----------|---------|------------|--------|
| **Vercel + Render** | FREE ✅ | FREE ✅ | FREE ✅ | Sleeps after 15min |
| **Netlify + Railway** | FREE ✅ | $5 credit | $5 credit | Good for low traffic |
| **GitHub + Cyclic** | FREE ✅ | FREE ✅ | Not supported | Basic features |
| **Cloudflare Pages** | FREE ✅ | FREE ✅ | Limited | Best performance |

---

## 🚀 QUICKEST FREE DEPLOYMENT (10 minutes)

### Option 1: Vercel Only (Frontend Static)

```powershell
# 1. Build
npm run build

# 2. Deploy
npm install -g vercel
vercel login
vercel --prod
```

✅ **100% FREE, live in 5 minutes!**

⚠️ **Note:** ML predictions won't work without backend, but all UI works!

---

### Option 2: Vercel + Render Free Tier (Full Stack)

**Step 1: Deploy Frontend**
```powershell
npm run build
# Drag & drop dist folder to vercel.com/new
```

**Step 2: Deploy Backend**
```
Go to render.com
Sign up FREE
Deploy from GitHub
Select Free plan
```

**Step 3: Deploy ML Service**
```
Same as Step 2
Use ml_service directory
```

✅ **100% FREE, Full features!**

⚠️ **Limitation:** Services sleep after 15 min inactivity (first load takes 30 sec)

---

## 🔧 FREE DEPLOYMENT SCRIPT

Save this as `deploy-free.ps1`:

```powershell
# CourtEdge Free Deployment Script

Write-Host "🆓 DEPLOYING COURTEDGE FOR FREE!" -ForegroundColor Green

# Step 1: Build
Write-Host "`n📦 Building frontend..." -ForegroundColor Cyan
npm run build

# Step 2: Instructions
Write-Host "`n✅ Build complete! Now:" -ForegroundColor Green
Write-Host "`n1. FRONTEND (Vercel - FREE):" -ForegroundColor Yellow
Write-Host "   → Go to https://vercel.com/new" -ForegroundColor White
Write-Host "   → Drag & drop the 'dist' folder" -ForegroundColor White
Write-Host "   → Click Deploy" -ForegroundColor White
Write-Host "   ✅ FREE FOREVER!" -ForegroundColor Green

Write-Host "`n2. BACKEND (Render - FREE):" -ForegroundColor Yellow
Write-Host "   → Go to https://render.com/register" -ForegroundColor White
Write-Host "   → Connect GitHub" -ForegroundColor White
Write-Host "   → Deploy 2 services (backend + ml_service)" -ForegroundColor White
Write-Host "   → Select FREE plan for both" -ForegroundColor White
Write-Host "   ✅ 750 hours/month FREE!" -ForegroundColor Green

Write-Host "`n💰 Total Cost: `$0.00/month" -ForegroundColor Magenta
Write-Host "🚀 Your app will be live in 10 minutes!" -ForegroundColor Green
```

Run it:
```powershell
.\deploy-free.ps1
```

---

## 💡 TIPS FOR FREE HOSTING

### Keep Free Services Active:
- Use a free uptime monitor: https://uptimerobot.com (pings your app every 5 min)
- This prevents Render from sleeping

### Optimize for Free Tier:
```javascript
// Add to your app
// Preload backend on frontend load
useEffect(() => {
  fetch('https://your-backend.onrender.com/health')
    .then(() => console.log('Backend warmed up!'))
}, [])
```

### Free Domain:
- Use Freenom.com for free .tk, .ml, .ga domains
- Or use Vercel's free subdomain: `yourapp.vercel.app`

---

## ✅ RECOMMENDED FREE SETUP

**Best Free Combination:**
1. **Frontend:** Vercel (100% free, unlimited)
2. **Backend:** Render Free Tier (750 hrs/month)
3. **ML Service:** Render Free Tier (750 hrs/month)
4. **Uptime Monitor:** UptimeRobot (keeps services awake)

**Total: $0.00/month** 🎉

---

## 🎯 DEPLOY NOW (FREE)

**3-Step Quick Start:**

```powershell
# 1. Build
npm run build

# 2. Vercel (Frontend - takes 2 min)
# Go to vercel.com/new → Drag 'dist' → Deploy

# 3. Render (Backend - takes 8 min)
# Go to render.com → Deploy from GitHub → Select FREE
```

**Live in 10 minutes, $0 cost!** 🚀

---

## 🆘 FREE HOSTING GOTCHAS

### Render Free Tier:
- ❌ Sleeps after 15 min inactivity
- ✅ First request takes 30 sec to wake
- ✅ Fix: Use UptimeRobot to ping every 5 min

### Vercel Free Tier:
- ✅ No sleep, always fast
- ✅ Unlimited bandwidth
- ✅ 100GB/month limit (more than enough)

### Railway Free Tier:
- ✅ $5 credit/month
- ✅ Usually enough for small apps
- ❌ Must add credit card (not charged unless over $5)

---

## 🎉 YOU'RE READY!

Choose your FREE hosting:
1. **Fastest:** Vercel only (frontend static)
2. **Full Features:** Vercel + Render (best FREE option)
3. **Most Reliable:** Vercel + Railway ($5 credit)

**All options are FREE!** Pick one and deploy now! 🚀
