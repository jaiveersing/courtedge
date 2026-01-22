# 🚀 DEPLOY COURTEDGE NOW - Quick Guide

## ⚡ FASTEST METHOD: Vercel + Railway (15 minutes)

### Step 1: Build Frontend (2 min)
```powershell
cd C:\Users\hp\Desktop\CourtEdge
npm run build
```

### Step 2: Deploy to Vercel (5 min)

**Option A: Using Vercel Dashboard (EASIEST)**
1. Go to https://vercel.com/new
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Import your Git repository OR drag & drop the `dist` folder
5. Framework: **Vite**
6. Build Command: `npm run build`
7. Output Directory: `dist`
8. Click **Deploy**

**Option B: Using Vercel CLI**
```powershell
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

✅ Frontend will be live at: `https://courtedge.vercel.app`

---

### Step 3: Deploy Backend to Railway (8 min)

**1. Create Railway Account**
- Go to https://railway.app
- Sign up with GitHub

**2. Deploy Backend API**
- Click "New Project" → "Deploy from GitHub repo"
- Select your CourtEdge repository
- Railway will auto-detect Node.js
- Add these environment variables:
  ```
  PORT=3000
  NODE_ENV=production
  ML_SERVICE_URL=https://your-ml-service.up.railway.app
  ```
- Click Deploy

**3. Deploy ML Service**
- Click "New Project" → "Deploy from GitHub repo"
- Select `/ml_service` directory
- Railway will auto-detect Python
- Add environment variable:
  ```
  PORT=8000
  ```
- Click Deploy

**4. Connect Services**
- Copy ML Service URL from Railway
- Update Backend's `ML_SERVICE_URL` environment variable
- Redeploy backend

✅ Backend live at: `https://courtedge-api.up.railway.app`
✅ ML Service live at: `https://courtedge-ml.up.railway.app`

---

## 🎯 Alternative: Deploy Everything to Render (10 min)

### Step 1: Create Render Account
- Go to https://render.com
- Sign up with GitHub

### Step 2: Deploy Frontend
- Click "New Static Site"
- Connect your GitHub repo
- Build Command: `npm run build`
- Publish Directory: `dist`
- Click "Create Static Site"

### Step 3: Deploy Backend
- Click "New Web Service"
- Select your repo
- Name: `courtedge-backend`
- Environment: `Node`
- Build Command: `npm install`
- Start Command: `node server/index.js`
- Click "Create Web Service"

### Step 4: Deploy ML Service
- Click "New Web Service"
- Select your repo (ml_service folder)
- Name: `courtedge-ml`
- Environment: `Python 3`
- Build Command: `pip install -r requirements.txt`
- Start Command: `python start_ml_service.py`
- Click "Create Web Service"

---

## 🐳 Docker Deployment (VPS/Cloud)

### Prerequisites
- Have Docker installed on server
- Have domain name (optional)

### Deploy with Docker Compose
```bash
# On your server
cd /var/www
git clone your-repo-url courtedge
cd courtedge

# Create .env file
cat > .env << EOF
NODE_ENV=production
SERVER_BASE44_BASE_URL=your_base44_url
SERVER_BASE44_APP_ID=your_app_id
SERVER_BASE44_API_KEY=your_api_key
EOF

# Build and start all services
docker-compose up -d --build

# Check status
docker-compose ps
```

Services will be available at:
- Frontend: http://your-server-ip:5173
- Backend: http://your-server-ip:3000
- ML Service: http://your-server-ip:8000

---

## 🔧 Environment Variables Needed

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url.com/api
VITE_ML_SERVICE_URL=https://your-ml-service-url.com
```

### Backend (server/.env)
```
PORT=3000
NODE_ENV=production
ML_SERVICE_URL=https://your-ml-service-url.com
SERVER_BASE44_BASE_URL=your_value
SERVER_BASE44_APP_ID=your_value
SERVER_BASE44_API_KEY=your_value
```

### ML Service (ml_service/.env)
```
PORT=8000
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## ✅ Post-Deployment Checklist

After deployment, verify:

1. **Frontend Works**
   - [ ] Site loads at your URL
   - [ ] Navigation works
   - [ ] No console errors (F12)

2. **Backend API Works**
   - [ ] Test: `https://your-backend.com/health`
   - [ ] Should return: `{"status":"ok"}`

3. **ML Service Works**
   - [ ] Test: `https://your-ml-service.com/health`
   - [ ] Should return: `{"status":"healthy"}`

4. **Integration Works**
   - [ ] Player Props page loads
   - [ ] ML predictions appear
   - [ ] Workstation functions
   - [ ] Charts render correctly

---

## 🚨 Quick Fixes

### Frontend not loading?
```powershell
# Rebuild and redeploy
npm run build
vercel --prod
```

### Backend errors?
- Check environment variables are set
- Check ML_SERVICE_URL is correct
- View logs in Railway/Render dashboard

### ML Service not responding?
- Check Python requirements installed
- Check models folder exists
- View logs for errors

---

## 💰 Cost Breakdown (Monthly)

### Vercel + Railway (Recommended)
- Frontend (Vercel): **FREE**
- Backend (Railway): **$5**
- ML Service (Railway): **$5**
- **Total: ~$10/month**

### Render
- Frontend: **FREE**
- Backend: **$7**
- ML Service: **$7**
- **Total: ~$14/month**

### Self-Hosted VPS (DigitalOcean/Linode)
- 2GB RAM Droplet: **$12/month**
- Domain (optional): **$10-15/year**
- **Total: ~$12/month**

---

## 🎉 RECOMMENDED: Quick Start (15 minutes)

1. **Build locally**
   ```powershell
   npm run build
   ```

2. **Deploy to Vercel** (Frontend)
   - Go to vercel.com/new
   - Drag & drop the `dist` folder
   - Done! ✅

3. **Deploy to Railway** (Backend + ML)
   - Go to railway.app
   - Connect GitHub
   - Deploy both services
   - Done! ✅

4. **Update URLs**
   - Update frontend env vars with Railway URLs
   - Redeploy frontend

**You're LIVE! 🚀**

---

## 📞 Need Help?

Common issues and solutions in HOSTING_GUIDE.md

**Ready to deploy?** Pick your method above and follow the steps! 🎯
