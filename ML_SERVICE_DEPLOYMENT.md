# 🚀 Deploy ML Service to Render.com - Step by Step

## Prerequisites
- GitHub account (you already have the repo)
- Render.com account (free - sign up at https://render.com)

---

## Step 1: Sign Up on Render (2 minutes)

1. Go to **https://render.com**
2. Click **Get Started** or **Sign Up**
3. Choose **Sign up with GitHub** (recommended)
4. Authorize Render to access your GitHub repos

✅ You're now logged into Render!

---

## Step 2: Create New Web Service (3 minutes)

1. Click **New +** button (top right)
2. Select **Web Service**
3. Connect your repository:
   - If first time: Click **Connect account** → Authorize GitHub
   - Find repository: **courtedge** (or your repo name)
   - Click **Connect**

---

## Step 3: Configure the Service (5 minutes)

Fill in the configuration:

### Basic Settings:
- **Name**: `courtedge-ml-service` (or any name you like)
- **Region**: `Oregon (US West)` (free tier available)
- **Branch**: `main`
- **Root Directory**: `ml_service`

### Build & Deploy:
- **Runtime**: `Python 3`
- **Build Command**: 
  ```
  pip install --upgrade pip && pip install -r requirements-prod.txt
  ```
- **Start Command**:
  ```
  python start_ml_service.py
  ```

### Instance:
- **Instance Type**: Select **Free** (this is important!)
- **Environment Variables**: Click **Add Environment Variable**
  - Key: `ENVIRONMENT` → Value: `production`
  - Key: `PORT` → Value: `8000`

---

## Step 4: Deploy! (15-20 minutes)

1. Click **Create Web Service** button
2. Render will start building your service
3. You'll see live logs - don't close the page
4. Wait for these messages:
   ```
   ==> Build successful 🎉
   ==> Starting service...
   ==> Your service is live 🎉
   ```

**Note**: First deployment takes 10-20 minutes as it installs all packages.

---

## Step 5: Get Your ML Service URL (1 minute)

After deployment succeeds:

1. Look at the top of the page for your service URL
2. It will look like: `https://courtedge-ml-service.onrender.com`
3. **Copy this URL** - you'll need it for Vercel

### Test it works:
- Visit: `https://your-service.onrender.com/health`
- Should see: `{"status":"healthy","version":"1.0.0"}`

---

## Step 6: Update Vercel Environment Variables (5 minutes)

1. Go to **https://vercel.com/dashboard**
2. Click your **courtedge** project
3. Go to **Settings** → **Environment Variables**
4. **Edit/Add** these variables:

   **Variable 1**: `VITE_ML_SERVICE_URL`
   - Old value: (empty or localhost)
   - **New value**: `https://courtedge-ml-service.onrender.com` (your URL)
   - Environment: **Production**, **Preview**, **Development**
   - Click **Save**

   **Variable 2**: `VITE_ML_API_URL`
   - **New value**: `https://courtedge-ml-service.onrender.com` (same URL)
   - Environment: **Production**, **Preview**, **Development**
   - Click **Save**

   **Variable 3**: `VITE_ENABLE_ML_FEATURES`
   - **New value**: `true`
   - Environment: **Production**, **Preview**, **Development**
   - Click **Save**

   **Variable 4**: `VITE_USE_MOCK_DATA`
   - **New value**: `false`
   - Environment: **Production**, **Preview**, **Development**
   - Click **Save**

---

## Step 7: Redeploy Vercel (3 minutes)

1. Go to **Deployments** tab in Vercel
2. Click **...** (three dots) on the latest deployment
3. Click **Redeploy**
4. Wait 1-2 minutes

---

## Step 8: Test Everything! (2 minutes)

1. Visit: **https://courtedge.vercel.app**
2. Look for **ML Service Status** component
3. Should now show:
   - ✅ Badge: **Online** (green)
   - ✅ Status: **Connected to ML Service**
   - ✅ No error messages!

### Also test:
- ML API directly: `https://courtedge-ml-service.onrender.com/docs`
- Health check: `https://courtedge-ml-service.onrender.com/health`

---

## 🎉 Done! Your ML Service is Live!

### What you just deployed:
- ✅ ML prediction service on Render.com
- ✅ Frontend on Vercel connected to ML service
- ✅ Full ML features enabled
- ✅ All running on free tiers!

---

## Troubleshooting

### Render build fails
**Problem**: Build command errors

**Solution**:
1. Check Render logs for specific error
2. Make sure `requirements-prod.txt` exists in `ml_service` folder
3. Try changing build command to: `pip install -r requirements.txt`

### Render service crashes on startup
**Problem**: Service starts but crashes immediately

**Solution**:
1. Check Render logs under "Logs" tab
2. Verify `start_ml_service.py` exists
3. Check environment variables are set

### Vercel still shows error
**Problem**: Updated variables but still seeing errors

**Solution**:
1. Clear Vercel cache:
   - Settings → General → Clear Cache
2. Force redeploy:
   - Deployments → Redeploy
3. Wait 2-3 minutes for propagation

### ML service is slow
**Problem**: First request takes 30+ seconds

**Solution**: 
- **This is normal on Render free tier!**
- Free tier services spin down after 15 minutes of inactivity
- First request wakes it up (slow)
- Subsequent requests are fast
- Consider upgrading to paid tier ($7/mo) for always-on

---

## Free Tier Limitations

### Render Free Tier:
- ✅ 750 hours/month (enough for testing)
- ⚠️ Spins down after 15 min inactivity
- ⚠️ Cold starts take 30-60 seconds
- ✅ 512 MB RAM
- ✅ Shared CPU

### Alternative if Render free tier doesn't work:
1. **Railway.app** - Similar to Render, $5 free credit
2. **Fly.io** - More complex but generous free tier
3. **Python Anywhere** - Python-specific hosting

---

## Cost Estimate (if you upgrade later):

- **Render**: $7/month (Starter plan)
- **Vercel**: Free forever for personal projects
- **Total**: $7/month for full production app

---

## Next Steps After Deployment:

1. Monitor Render dashboard for service health
2. Check Render logs if issues occur
3. Set up custom domain (optional)
4. Add monitoring/alerts (optional)
5. Consider upgrading to paid tier for production use

---

## Support

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Vercel Docs: https://vercel.com/docs

**Need help?** Check Render logs first - they show exactly what's wrong!
