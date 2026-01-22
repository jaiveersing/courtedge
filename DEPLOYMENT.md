# CourtEdge Deployment Guide

## Quick Fix for Vercel Deployment

Your app is currently trying to connect to `localhost:8000` which doesn't work in production. Here's how to fix it:

### Option 1: Run Without ML Service (Immediate Fix)

1. **Go to Vercel Dashboard**:
   - Navigate to your project: `https://vercel.com/your-username/courtedge`
   - Click **Settings** → **Environment Variables**

2. **Add these environment variables**:
   ```
   VITE_ML_SERVICE_URL=
   VITE_ENABLE_ML_FEATURES=false
   VITE_USE_MOCK_DATA=true
   ```
   - Leave `VITE_ML_SERVICE_URL` empty
   - Set environment to: **Production**

3. **Redeploy**:
   - Go to **Deployments** tab
   - Click **...** on the latest deployment → **Redeploy**

✅ **Result**: App will work without ML service, using fallback data. No more errors!

---

### Option 2: Deploy ML Service (Full Solution)

#### Step 1: Deploy to Render.com (Free Tier)

1. **Sign up at [render.com](https://render.com)**

2. **Create New Web Service**:
   - Click **New +** → **Web Service**
   - Connect your GitHub repository
   - Select the repository: `CourtEdge`

3. **Configure Service**:
   - **Name**: `courtedge-ml-service`
   - **Root Directory**: `ml_service`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python start_ml_service.py`
   - **Plan**: `Free`

4. **Add Environment Variables** (in Render dashboard):
   ```
   ENVIRONMENT=production
   PORT=8000
   ```

5. **Deploy** → Wait for build to complete (5-10 minutes)

6. **Copy Public URL**:
   - Will look like: `https://courtedge-ml-service.onrender.com`

#### Step 2: Update Vercel Environment Variables

1. Go to **Vercel** → **Settings** → **Environment Variables**

2. Update/Add:
   ```
   VITE_ML_SERVICE_URL=https://courtedge-ml-service.onrender.com
   VITE_ML_API_URL=https://courtedge-ml-service.onrender.com
   VITE_ENABLE_ML_FEATURES=true
   VITE_USE_MOCK_DATA=false
   ```

3. **Redeploy** your Vercel app

✅ **Result**: Full ML functionality working in production!

---

### Option 3: Use ngrok (Temporary Testing)

For quick testing without deploying:

1. **Download ngrok**: https://ngrok.com/download

2. **Start ML service locally**:
   ```powershell
   cd ml_service
   python start_ml_service.py
   ```

3. **In another terminal, run ngrok**:
   ```powershell
   ngrok http 8000
   ```

4. **Copy the ngrok URL** (e.g., `https://abc123.ngrok.io`)

5. **Update Vercel environment variable**:
   ```
   VITE_ML_SERVICE_URL=https://abc123.ngrok.io
   ```

6. **Redeploy**

⚠️ **Note**: ngrok URLs change each time. Only good for temporary testing.

---

## Local Development Setup

To run everything locally:

1. **Start ML Service**:
   ```powershell
   cd ml_service
   python start_ml_service.py
   ```

2. **Start Frontend** (in another terminal):
   ```powershell
   npm run dev
   ```

3. **Access**:
   - Frontend: http://localhost:5173
   - ML Service: http://localhost:8000
   - ML API Docs: http://localhost:8000/docs

---

## Troubleshooting

### "Cannot connect to ML service"

**Solution**: The ML service is not deployed. Use **Option 1** above to disable ML features temporarily.

### "Environment variable not updating"

1. Clear Vercel build cache
2. Redeploy from scratch
3. Make sure variable is set for **Production** environment

### "ML Service crashing on Render"

1. Check Render logs for errors
2. Verify all dependencies in `requirements.txt`
3. Make sure `PORT=8000` is set in Render environment variables

---

## Current Status

✅ **Frontend**: Deployed on Vercel  
❌ **ML Service**: Not deployed (localhost only)  
🔧 **Quick Fix**: Use Option 1 to disable ML features  
🚀 **Full Solution**: Use Option 2 to deploy ML service

---

## What Changed

The app now gracefully handles missing ML service:
- Shows warning instead of error
- Uses fallback data when ML not available
- Configurable via environment variables
- No code changes needed after deployment

---

## Questions?

- Frontend deployment: https://courtedge.vercel.app
- ML Service code: `/ml_service` folder
- Environment config: `.env.production` file
