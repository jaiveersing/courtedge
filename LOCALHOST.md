# 🏠 CourtEdge Localhost Guide

## ✅ YOUR APP IS RUNNING!

### 🌐 Access Points

**Frontend (Main App):**
- 🔗 **http://localhost:5175**
- Click to open in browser!

**ML Service (Backend API):**
- 🔗 **http://127.0.0.1:8001**
- 📚 API Docs: **http://127.0.0.1:8001/docs**

**Backend API (Node.js):**
- Usually runs on **http://localhost:3000**
- Not currently running (frontend works without it for now)

---

## 🎮 Quick Start

### 1. Open Your App
```
http://localhost:5175
```

Just click that link or paste in your browser!

### 2. What You Can Do

**Dashboard** (`/dashboard`)
- See ML Service Status (should show "Online" in green)
- View your betting performance charts
- Check live alerts

**ML Workstation** (`/ml-workstation`)
- 🎯 **Player Props Tab**: Predict LeBron, Curry, etc. points/rebounds/assists
- 🏀 **Game Outcomes Tab**: Predict LAL vs GSW winners
- 💰 **Sharp Money Tab**: See line movements
- ⚡ **Bankroll Tab**: Get optimal bet sizing

**Player Database** (`/players`)
- Browse 100 NBA players
- Search by name, filter by team/position
- View detailed stats

---

## 🚀 Starting Services

### Frontend (Already Running!)
```powershell
cd C:\Users\hp\Desktop\CourtEdge
npm run dev
```
**Status:** ✅ Running on http://localhost:5175

### ML Service (Already Running!)
```powershell
cd C:\Users\hp\Desktop\CourtEdge\ml_service\src
uvicorn api:app --host 127.0.0.1 --port 8001 --reload
```
**Status:** ✅ Running on http://127.0.0.1:8001

### Backend API (Optional - Start if needed)
```powershell
cd C:\Users\hp\Desktop\CourtEdge
node server/index.js
```
**Status:** ⏸️ Not needed for basic testing

---

## 🎯 Test the ML Service

### 1. Visit ML Workstation
```
http://localhost:5175/ml-workstation
```

### 2. Try Player Props Prediction

**Fill in the form:**
- Player Name: `LeBron James`
- Stat Type: `points`
- Line: `25.5`
- Opponent: `GSW`
- Home/Away: `away`

Click **"Generate Prediction"**

**You'll get:**
- Predicted value (e.g., 27.3 points)
- Confidence percentage (e.g., 72%)
- Recommendation (OVER/UNDER)
- Confidence interval

### 3. Try Game Outcome

**Fill in:**
- Home Team: `LAL`
- Away Team: `GSW`
- Spread: `-3.5`
- Total: `225.5`

Click **"Predict Game"**

**You'll get:**
- Win probabilities for both teams
- Spread recommendation
- Total (Over/Under) recommendation

---

## 🔍 Check ML Service Status

### Option 1: In the App
1. Go to **Dashboard** (http://localhost:5175/dashboard)
2. Look for **"ML Service Status"** widget
3. Should show green **"Online"** badge

### Option 2: Direct API Call
```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:8001/health" -Method GET | ConvertFrom-Json
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-20T...",
  "redis_connected": true,
  "models_loaded": {...},
  "version": "1.0.0"
}
```

---

## 🛠️ Troubleshooting

### Frontend Not Loading?

**Check if it's running:**
```powershell
netstat -ano | findstr :5175
```

**Restart if needed:**
```powershell
cd C:\Users\hp\Desktop\CourtEdge
npm run dev
```

### ML Service Not Responding?

**Check if it's running:**
```powershell
netstat -ano | findstr :8001
```

**Restart if needed:**
```powershell
cd C:\Users\hp\Desktop\CourtEdge\ml_service\src
uvicorn api:app --host 127.0.0.1 --port 8001 --reload
```

### "Cannot connect to ML service" Error?

1. **Verify ML service is running** (see above)
2. **Check the port** in browser console (F12)
3. **Restart both services**

### Port Already in Use?

**Find what's using the port:**
```powershell
# For port 5175 (frontend)
netstat -ano | findstr :5175

# For port 8001 (ML service)
netstat -ano | findstr :8001
```

**Kill the process:**
```powershell
taskkill /PID [process_id] /F
```

---

## 📱 Pages to Explore

### Main Navigation
- **Dashboard** - `/dashboard` - Overview & ML status
- **Predictions** - `/predictions` - Game predictions
- **Today's Matchups** - `/todays-matchups` - Daily games
- **Player Props** - `/player-props` - Prop betting
- **Line Shop** - `/line-shop` - Compare odds
- **Analytics** - `/analytics` - Performance analytics
- **Player Trends** - `/player-trends` - Historical trends
- **Player Database** - `/players` - 100 NBA players
- **ML Workstation** - `/ml-workstation` - ⭐ AI predictions
- **Portfolio** - `/portfolio` - Betting portfolio
- **Bets** - `/bets` - Bet tracking
- **Bankroll** - `/bankroll` - Money management
- **Community** - `/community` - Social features
- **Settings** - `/settings` - App settings

---

## 🎨 Features Working Locally

### ✅ Currently Working
- Frontend UI (all pages)
- ML Service predictions
- Player database
- Interactive charts
- Real-time ML status monitoring
- Dark/Light theme toggle

### ⏳ Requires Backend API
- User authentication
- Bet saving/tracking
- Bankroll updates
- Community features
- Live odds from sportsbooks

**To enable these:**
```powershell
# Start the backend
cd C:\Users\hp\Desktop\CourtEdge
node server/index.js
```

---

## 🔥 Quick Demo Workflow

### 5-Minute Test Run

**1. Open App** (http://localhost:5175)

**2. Check Dashboard**
- Verify ML Service shows "Online"

**3. Visit Player Database** (`/players`)
- Search for "LeBron"
- Filter by team "Lakers"
- Toggle table/card view

**4. Try ML Workstation** (`/ml-workstation`)
- Predict LeBron over 25.5 points
- Get recommendation and confidence

**5. Explore Other Pages**
- Check out the Analytics charts
- Browse Today's Matchups
- View Player Trends

---

## 📊 Sample API Calls

### Using PowerShell

**Health Check:**
```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:8001/health"
```

**Player Prop Prediction:**
```powershell
$body = @{
    playerName = "LeBron James"
    stat = "points"
    line = 25.5
    opponent = "GSW"
    homeAway = "away"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://127.0.0.1:8001/predict/player-prop" `
    -Method POST `
    -Body $body `
    -ContentType "application/json" | ConvertFrom-Json
```

**Game Prediction:**
```powershell
$body = @{
    homeTeam = "LAL"
    awayTeam = "GSW"
    spread = -3.5
    total = 225.5
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://127.0.0.1:8001/predict/game-outcome" `
    -Method POST `
    -Body $body `
    -ContentType "application/json" | ConvertFrom-Json
```

---

## 🎯 Localhost URLs Reference

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | http://localhost:5175 | ✅ Running |
| **ML API** | http://127.0.0.1:8001 | ✅ Running |
| **ML Docs** | http://127.0.0.1:8001/docs | ✅ Available |
| **Backend** | http://localhost:3000 | ⏸️ Optional |

---

## 💡 Tips

### Hot Reload
- Frontend automatically reloads when you edit files
- ML service reloads with `--reload` flag (already enabled)

### Browser DevTools
- Press **F12** to open developer tools
- Check **Console** tab for errors
- Check **Network** tab for API calls

### VS Code
- Keep terminals open in VS Code
- View logs in real-time
- Edit code and see changes instantly

### Testing ML Predictions
- Start with simple predictions (player props)
- Try different players and scenarios
- Check confidence scores
- Predictions are based on trained models

---

## 🚀 Next Steps

### After Testing Locally

1. **Satisfied with features?** → Deploy to production (see HOSTING_GUIDE.md)
2. **Want real data?** → Integrate live NBA API
3. **Need user accounts?** → Start the backend API
4. **Want to customize?** → Edit the code and see changes live!

---

## 🆘 Need Help?

### Check Logs

**Frontend errors:**
- Browser → F12 → Console tab

**ML Service errors:**
- Terminal where uvicorn is running

**Backend errors:**
- Terminal where node is running

### Common Issues

**Blank page?**
- Check browser console for errors
- Verify frontend is running on correct port

**ML predictions not working?**
- Check ML Service status in Dashboard
- Verify ML service is running on port 8001
- Test health endpoint directly

**Slow predictions?**
- ML models take 2-3 seconds to predict
- This is normal for deep learning models

---

## ✅ You're All Set!

**Your CourtEdge app is running locally at:**

# 🔗 http://localhost:5175

**Just click that link and start exploring!** 🏀💰

---

**Last Updated:** January 20, 2026  
**Status:** ✅ RUNNING LOCALLY  
**Services:** Frontend (5175) + ML API (8001)
