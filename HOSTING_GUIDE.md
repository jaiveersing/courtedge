# 🚀 CourtEdge Hosting & Deployment Guide

## 📋 Overview

This guide covers multiple hosting options for deploying your CourtEdge NBA betting platform with ML service.

**Stack:**
- **Frontend:** React + Vite (static files)
- **Backend API:** Node.js + Express (port 3000)
- **ML Service:** Python FastAPI (port 8001)
- **Database:** File-based (can upgrade to PostgreSQL)

---

## 🎯 Quick Deployment Options

| Option | Frontend | Backend | ML Service | Cost | Difficulty |
|--------|----------|---------|------------|------|------------|
| **Vercel + Railway** | Vercel | Railway | Railway | ~$10/mo | Easy ⭐ |
| **Netlify + Render** | Netlify | Render | Render | ~$15/mo | Easy ⭐ |
| **AWS (Full Stack)** | S3+CloudFront | EC2/ECS | EC2/ECS | ~$30/mo | Medium ⭐⭐ |
| **DigitalOcean** | App Platform | App Platform | App Platform | ~$20/mo | Easy ⭐ |
| **Heroku** | Heroku | Heroku | Heroku | ~$25/mo | Easy ⭐ |
| **Self-Hosted VPS** | Nginx | PM2 | PM2 | ~$5-15/mo | Hard ⭐⭐⭐ |

**Recommended:** Vercel (Frontend) + Railway (Backend + ML) for easiest deployment

---

## ⚡ Option 1: Vercel + Railway (RECOMMENDED)

### Why This Stack?
- ✅ Easiest to deploy
- ✅ Auto-scaling
- ✅ Free tier available
- ✅ CI/CD built-in
- ✅ Great performance

### A. Deploy Frontend to Vercel

**1. Install Vercel CLI**
```powershell
npm install -g vercel
```

**2. Login to Vercel**
```powershell
vercel login
```

**3. Configure Build**
Create `vercel.json` in project root:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "VITE_API_URL": "https://your-backend.railway.app/api",
    "VITE_ML_SERVICE_URL": "https://your-ml-service.railway.app"
  }
}
```

**4. Deploy**
```powershell
cd C:\Users\hp\Desktop\CourtEdge
vercel --prod
```

**Result:** Frontend live at `https://courtedge.vercel.app`

---

### B. Deploy Backend + ML to Railway

**1. Create Railway Account**
- Go to https://railway.app
- Sign up with GitHub

**2. Install Railway CLI**
```powershell
npm install -g @railway/cli
```

**3. Login**
```powershell
railway login
```

**4. Deploy Backend API**

Create `railway.json` for backend:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node server/index.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

Create `Procfile` (optional):
```
web: node server/index.js
```

Deploy:
```powershell
cd C:\Users\hp\Desktop\CourtEdge
railway init
railway up
```

**5. Deploy ML Service**

Create separate Railway project for ML:

Create `ml_service/railway.json`:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd src && uvicorn api:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

Create `ml_service/runtime.txt`:
```
python-3.11
```

Deploy:
```powershell
cd C:\Users\hp\Desktop\CourtEdge\ml_service
railway init
railway up
```

**6. Configure Environment Variables**

In Railway dashboard, add:
```
NODE_ENV=production
PORT=3000
VITE_API_URL=https://your-backend.railway.app/api
VITE_ML_SERVICE_URL=https://your-ml-service.railway.app
```

**Result:** 
- Backend: `https://courtedge-api.railway.app`
- ML Service: `https://courtedge-ml.railway.app`

---

## 🌐 Option 2: Netlify + Render

### A. Deploy Frontend to Netlify

**1. Install Netlify CLI**
```powershell
npm install -g netlify-cli
```

**2. Create `netlify.toml`**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  VITE_API_URL = "https://your-backend.onrender.com/api"
  VITE_ML_SERVICE_URL = "https://your-ml-service.onrender.com"
```

**3. Deploy**
```powershell
netlify login
netlify init
netlify deploy --prod
```

### B. Deploy to Render

**1. Create `render.yaml`**
```yaml
services:
  # Backend API
  - type: web
    name: courtedge-api
    env: node
    buildCommand: npm install
    startCommand: node server/index.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000

  # ML Service
  - type: web
    name: courtedge-ml
    env: python
    buildCommand: pip install -r ml_service/requirements.txt
    startCommand: cd ml_service/src && uvicorn api:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PYTHON_VERSION
        value: 3.11
```

**2. Deploy via Render Dashboard**
- Connect GitHub repo
- Render auto-deploys on push

---

## ☁️ Option 3: AWS (Production-Grade)

### Architecture
```
CloudFront (CDN)
    ↓
S3 (Frontend Static Files)
    ↓
ALB (Load Balancer)
    ↓
ECS/EC2 (Backend + ML)
    ↓
RDS (Database - optional)
```

### A. Frontend on S3 + CloudFront

**1. Build Frontend**
```powershell
npm run build
```

**2. Create S3 Bucket**
```powershell
aws s3 mb s3://courtedge-frontend
aws s3 sync dist/ s3://courtedge-frontend/
```

**3. Configure S3 for Static Hosting**
```powershell
aws s3 website s3://courtedge-frontend/ --index-document index.html
```

**4. Create CloudFront Distribution**
- Origin: S3 bucket
- Enable HTTPS
- Custom domain (optional)

### B. Backend on ECS/Fargate

**1. Create Dockerfile for Backend**
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .

EXPOSE 3000
CMD ["node", "server/index.js"]
```

**2. Build and Push to ECR**
```powershell
aws ecr create-repository --repository-name courtedge-api
docker build -t courtedge-api .
docker tag courtedge-api:latest [ECR_URL]/courtedge-api:latest
docker push [ECR_URL]/courtedge-api:latest
```

**3. Create ECS Service**
- Use AWS Console or CLI
- Configure task definition
- Set environment variables

### C. ML Service on EC2

**1. Launch EC2 Instance**
- Type: t3.medium (2 vCPU, 4GB RAM)
- OS: Ubuntu 22.04
- Security Group: Allow port 8001

**2. Install Dependencies**
```bash
sudo apt update
sudo apt install python3.11 python3-pip nginx -y
```

**3. Deploy ML Service**
```bash
cd /opt
git clone [your-repo]
cd CourtEdge/ml_service
pip install -r requirements.txt

# Run with systemd
sudo systemctl start courtedge-ml
```

**4. Configure Nginx Reverse Proxy**
```nginx
server {
    listen 80;
    server_name ml.courtedge.com;

    location / {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 💧 Option 4: DigitalOcean App Platform

### All-in-One Deployment

**1. Create `.do/app.yaml`**
```yaml
name: courtedge
services:
  # Frontend
  - name: frontend
    github:
      repo: your-username/CourtEdge
      branch: main
    build_command: npm run build
    run_command: npm run preview
    envs:
      - key: VITE_API_URL
        value: ${backend.PUBLIC_URL}/api
      - key: VITE_ML_SERVICE_URL
        value: ${ml-service.PUBLIC_URL}
    routes:
      - path: /

  # Backend API
  - name: backend
    github:
      repo: your-username/CourtEdge
      branch: main
    dockerfile_path: Dockerfile.backend
    http_port: 3000
    routes:
      - path: /api

  # ML Service
  - name: ml-service
    github:
      repo: your-username/CourtEdge
      branch: main
    dockerfile_path: ml_service/Dockerfile
    http_port: 8001
```

**2. Create Dockerfiles**

`Dockerfile.backend`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY server ./server
COPY Entities ./Entities
CMD ["node", "server/index.js"]
```

`ml_service/Dockerfile`:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "src.api:app", "--host", "0.0.0.0", "--port", "8001"]
```

**3. Deploy**
```powershell
doctl apps create --spec .do/app.yaml
```

**Cost:** ~$20/month (3 basic containers)

---

## 🔧 Option 5: Self-Hosted VPS (Cheapest)

### Single VPS Setup (DigitalOcean/Linode/Vultr)

**Server Specs:**
- 2 vCPU, 4GB RAM
- 80GB SSD
- Ubuntu 22.04
- Cost: $12-20/month

### Setup Script

**1. Initial Server Setup**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python
sudo apt install -y python3.11 python3-pip

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2
```

**2. Deploy Application**
```bash
# Clone repo
cd /var/www
git clone [your-repo] courtedge
cd courtedge

# Install frontend dependencies
npm install
npm run build

# Install backend dependencies
cd server
npm install

# Install ML service dependencies
cd ../ml_service
pip install -r requirements.txt
cd ..

# Start services with PM2
pm2 start server/index.js --name courtedge-api
pm2 start ml_service/start_ml_service.py --name courtedge-ml --interpreter python3
pm2 save
pm2 startup
```

**3. Configure Nginx**
```nginx
# /etc/nginx/sites-available/courtedge
server {
    listen 80;
    server_name courtedge.com www.courtedge.com;

    # Frontend
    location / {
        root /var/www/courtedge/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # ML Service
    location /ml {
        rewrite ^/ml/(.*) /$1 break;
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

**4. Enable SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d courtedge.com -d www.courtedge.com
```

**5. Setup Auto-Deploy (Optional)**
```bash
# Create deploy script
cat > /var/www/courtedge/deploy.sh << 'EOF'
#!/bin/bash
cd /var/www/courtedge
git pull origin main
npm install
npm run build
pm2 restart all
EOF

chmod +x /var/www/courtedge/deploy.sh

# Add webhook endpoint for GitHub
# Or setup cron for periodic updates
```

---

## 🐳 Docker Compose (All Platforms)

### Complete Docker Setup

**Create `docker-compose.yml`**
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend
      - ml-service
    environment:
      - VITE_API_URL=http://backend:3000/api
      - VITE_ML_SERVICE_URL=http://ml-service:8001

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    volumes:
      - ./server/data:/app/data

  ml-service:
    build:
      context: ./ml_service
      dockerfile: Dockerfile
    ports:
      - "8001:8001"
    environment:
      - PYTHONUNBUFFERED=1
    volumes:
      - ./ml_service/models:/app/models

  # Optional: Add Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

volumes:
  redis-data:
```

**Dockerfiles**

`Dockerfile.frontend`:
```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

`Dockerfile.backend`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY server ./server
COPY Entities ./Entities
EXPOSE 3000
CMD ["node", "server/index.js"]
```

`ml_service/Dockerfile`:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8001
CMD ["uvicorn", "src.api:app", "--host", "0.0.0.0", "--port", "8001"]
```

**Deploy**
```powershell
docker-compose up -d
```

---

## 🔒 Security Checklist

### Before Going Live

- [ ] Change all default credentials
- [ ] Set secure `JWT_SECRET` in environment
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS properly
- [ ] Set up firewall (allow only 80, 443, 22)
- [ ] Enable rate limiting on APIs
- [ ] Set up monitoring (UptimeRobot, Datadog)
- [ ] Configure automated backups
- [ ] Add error tracking (Sentry)
- [ ] Review API authentication
- [ ] Sanitize user inputs
- [ ] Enable security headers

---

## 🌍 Custom Domain Setup

### 1. Purchase Domain (Namecheap, GoDaddy, etc.)

### 2. Configure DNS

**For Vercel:**
```
A     @      76.76.21.21
CNAME www    cname.vercel-dns.com
```

**For Custom Server:**
```
A     @      [your-server-ip]
A     www    [your-server-ip]
CNAME api    [your-server-ip]
CNAME ml     [your-server-ip]
```

### 3. Update Environment Variables
```bash
VITE_API_URL=https://api.courtedge.com
VITE_ML_SERVICE_URL=https://ml.courtedge.com
```

---

## 📊 Monitoring & Analytics

### Recommended Tools

**Uptime Monitoring:**
- UptimeRobot (free)
- Pingdom
- StatusCake

**Error Tracking:**
```powershell
npm install @sentry/react @sentry/node
```

**Analytics:**
```javascript
// Add to index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

**Performance:**
- Vercel Analytics
- Google Lighthouse
- WebPageTest

---

## 💰 Cost Comparison

| Platform | Frontend | Backend | ML Service | Total/Month |
|----------|----------|---------|------------|-------------|
| **Vercel + Railway** | Free | $5 | $5 | **$10** |
| **Netlify + Render** | Free | $7 | $7 | **$14** |
| **AWS (Optimized)** | $1 | $15 | $15 | **$31** |
| **DigitalOcean** | - | - | - | **$20** (bundled) |
| **VPS Self-Hosted** | - | - | - | **$12** (bundled) |
| **Heroku** | Free | $7 | $7 | **$14** |

**Recommended for Beginners:** Vercel + Railway ($10/month)  
**Best Performance:** AWS (~$30/month)  
**Most Economical:** VPS Self-Hosted ($12/month)

---

## 🚀 Quick Start Commands

### Deploy to Vercel + Railway (5 minutes)

```powershell
# 1. Frontend to Vercel
cd C:\Users\hp\Desktop\CourtEdge
vercel --prod

# 2. Backend to Railway
railway login
railway init --name courtedge-backend
railway up

# 3. ML Service to Railway
cd ml_service
railway init --name courtedge-ml
railway up

# Done! Your app is live 🎉
```

---

## 🆘 Troubleshooting

### Common Issues

**Build fails on deployment:**
```bash
# Ensure all dependencies in package.json
# Check Node version matches (18.x)
# Verify build command: npm run build
```

**ML Service crashes:**
```bash
# Check Python version (3.11)
# Verify all model files exist
# Increase memory allocation
```

**CORS errors:**
```javascript
// Update server/index.js
app.use(cors({
  origin: ['https://courtedge.vercel.app'],
  credentials: true
}));
```

**Environment variables not working:**
```bash
# Prefix with VITE_ for frontend
# Rebuild after changing env vars
# Check deployment platform dashboard
```

---

## 📚 Additional Resources

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Netlify Docs:** https://docs.netlify.com
- **AWS Deployment:** https://aws.amazon.com/getting-started
- **Docker Compose:** https://docs.docker.com/compose

---

## ✅ Deployment Checklist

- [ ] Choose hosting platform
- [ ] Set up accounts (Vercel, Railway, etc.)
- [ ] Configure environment variables
- [ ] Build and test locally
- [ ] Deploy frontend
- [ ] Deploy backend
- [ ] Deploy ML service
- [ ] Configure custom domain (optional)
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test all features live
- [ ] Update documentation with live URLs

---

## 🎉 You're Ready to Go Live!

**Next Steps:**
1. Choose your hosting platform
2. Follow the specific deployment guide
3. Deploy in order: ML Service → Backend → Frontend
4. Test thoroughly
5. Share with users!

**Need help?** Each platform has excellent documentation and support channels.

**Last Updated:** January 20, 2026  
**Status:** Production Ready 🚀
