# 🎯 ML Service Deployment Checklist

## Before You Start
- [ ] GitHub repo is pushed and up to date ✅ (Just pushed!)
- [ ] Have GitHub account ✅
- [ ] 30 minutes available ⏰

---

## Deployment Steps

### 1️⃣ Sign Up on Render (2 min)
- [ ] Go to https://render.com
- [ ] Click "Sign up with GitHub"
- [ ] Authorize Render

### 2️⃣ Create Web Service (3 min)
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository: **courtedge**
- [ ] Select repository

### 3️⃣ Configure Service (5 min)
- [ ] Name: `courtedge-ml-service`
- [ ] Region: `Oregon (US West)`
- [ ] Branch: `main`
- [ ] Root Directory: `ml_service`
- [ ] Runtime: `Python 3`
- [ ] Build Command: `pip install --upgrade pip && pip install -r requirements-prod.txt`
- [ ] Start Command: `python start_ml_service.py`
- [ ] Instance Type: **Free**
- [ ] Environment Variables:
  - [ ] `ENVIRONMENT` = `production`
  - [ ] `PORT` = `8000`

### 4️⃣ Deploy (15-20 min)
- [ ] Click "Create Web Service"
- [ ] Wait for build to complete
- [ ] See "Build successful 🎉"
- [ ] See "Your service is live 🎉"

### 5️⃣ Get Service URL (1 min)
- [ ] Copy service URL (e.g., `https://courtedge-ml-service.onrender.com`)
- [ ] Test: Visit `https://your-url.onrender.com/health`
- [ ] Should see: `{"status":"healthy"}`

### 6️⃣ Update Vercel (5 min)
Go to https://vercel.com/dashboard → courtedge → Settings → Environment Variables

Update these:
- [ ] `VITE_ML_SERVICE_URL` = `https://your-render-url.onrender.com`
- [ ] `VITE_ML_API_URL` = `https://your-render-url.onrender.com`
- [ ] `VITE_ENABLE_ML_FEATURES` = `true`
- [ ] `VITE_USE_MOCK_DATA` = `false`

For each variable, select: Production, Preview, Development

### 7️⃣ Redeploy Vercel (3 min)
- [ ] Go to Deployments tab
- [ ] Click "..." → "Redeploy"
- [ ] Wait 1-2 minutes

### 8️⃣ Test (2 min)
- [ ] Visit https://courtedge.vercel.app
- [ ] ML Service Status shows "Online" (green)
- [ ] No error messages
- [ ] Visit https://your-render-url.onrender.com/docs
- [ ] See ML API documentation

---

## ✅ Success Criteria

You're done when:
- ✅ Render service shows "Live" status
- ✅ Health check returns success
- ✅ Vercel app shows ML service online
- ✅ No red error messages
- ✅ API docs accessible

---

## 🆘 If Something Goes Wrong

### Render build fails:
1. Check logs in Render dashboard
2. Look for Python or package installation errors
3. Try: Settings → Manual Deploy → Clear build cache

### Service crashes on startup:
1. Check "Logs" tab in Render
2. Look for Python errors
3. Verify environment variables set correctly

### Vercel still shows offline:
1. Verify you saved all environment variables
2. Force redeploy with cache clear
3. Wait 3-5 minutes for DNS propagation

---

## 📋 Quick Reference URLs

- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Your ML Service** (after deploy): `https://courtedge-ml-service.onrender.com`
- **Your Frontend**: https://courtedge.vercel.app
- **Full Guide**: See ML_SERVICE_DEPLOYMENT.md

---

## ⏱️ Time Estimate

- Setup: 10 minutes
- Build/Deploy: 15-20 minutes  
- Configuration: 8 minutes
- **Total: ~30-35 minutes**

---

## 💡 Pro Tips

1. **Don't close the browser** while build is running
2. **First deploy is slow** - subsequent updates are faster
3. **Free tier sleeps** - First request after 15 min is slow
4. **Save your Render URL** - you'll need it for Vercel
5. **Test health endpoint first** before updating Vercel

---

## 🎉 What You're Deploying

- FastAPI ML prediction service
- Scikit-learn models
- Real-time health monitoring
- RESTful API with documentation
- Production-ready configuration

**All on free tier!** 🚀

---

Start when ready! Follow: **ML_SERVICE_DEPLOYMENT.md** for detailed steps.
