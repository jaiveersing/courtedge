# CourtEdge Free Deployment Script
# Deploy your app 100% FREE in 10 minutes!

Write-Host "`n🆓 COURTEDGE FREE DEPLOYMENT ASSISTANT`n" -ForegroundColor Green

# Step 1: Build
Write-Host "📦 Step 1: Building your app..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!`n" -ForegroundColor Green
    
    # Instructions
    Write-Host "=== DEPLOY FOR FREE (10 minutes) ===" -ForegroundColor Yellow
    Write-Host "`n🎯 OPTION 1: VERCEL + RENDER (RECOMMENDED - 100% FREE)`n" -ForegroundColor Magenta
    
    Write-Host "📱 FRONTEND (Vercel - 2 minutes):" -ForegroundColor Cyan
    Write-Host "   1. Go to: https://vercel.com/new" -ForegroundColor White
    Write-Host "   2. Sign up with GitHub (FREE)" -ForegroundColor White
    Write-Host "   3. Drag & drop your 'dist' folder" -ForegroundColor White
    Write-Host "   4. Click 'Deploy'" -ForegroundColor White
    Write-Host "   ✅ Live at: yourapp.vercel.app`n" -ForegroundColor Green
    
    Write-Host "⚙️ BACKEND (Render - 5 minutes):" -ForegroundColor Cyan
    Write-Host "   1. Go to: https://render.com/register" -ForegroundColor White
    Write-Host "   2. Sign up with GitHub (FREE)" -ForegroundColor White
    Write-Host "   3. Click 'New Web Service'" -ForegroundColor White
    Write-Host "   4. Connect your GitHub repo" -ForegroundColor White
    Write-Host "   5. Settings:" -ForegroundColor White
    Write-Host "      - Name: courtedge-backend" -ForegroundColor Gray
    Write-Host "      - Environment: Node" -ForegroundColor Gray
    Write-Host "      - Build: npm install" -ForegroundColor Gray
    Write-Host "      - Start: node server/index.js" -ForegroundColor Gray
    Write-Host "      - Plan: FREE" -ForegroundColor Gray
    Write-Host "   6. Click 'Create Web Service'" -ForegroundColor White
    Write-Host "   ✅ Live at: courtedge-backend.onrender.com`n" -ForegroundColor Green
    
    Write-Host "🤖 ML SERVICE (Render - 5 minutes):" -ForegroundColor Cyan
    Write-Host "   1. Click 'New Web Service' again" -ForegroundColor White
    Write-Host "   2. Connect same repo" -ForegroundColor White
    Write-Host "   3. Settings:" -ForegroundColor White
    Write-Host "      - Name: courtedge-ml" -ForegroundColor Gray
    Write-Host "      - Root Directory: ml_service" -ForegroundColor Gray
    Write-Host "      - Environment: Python 3" -ForegroundColor Gray
    Write-Host "      - Build: pip install -r requirements.txt" -ForegroundColor Gray
    Write-Host "      - Start: python start_ml_service.py" -ForegroundColor Gray
    Write-Host "      - Plan: FREE" -ForegroundColor Gray
    Write-Host "   4. Click 'Create Web Service'" -ForegroundColor White
    Write-Host "   ✅ Live at: courtedge-ml.onrender.com`n" -ForegroundColor Green
    
    Write-Host "💰 TOTAL COST: `$0.00/month" -ForegroundColor Yellow
    Write-Host "🚀 Your app will be live in 10 minutes!`n" -ForegroundColor Green
    
    Write-Host "📖 For detailed instructions, read: FREE_DEPLOY.md" -ForegroundColor Cyan
    Write-Host "`n⚠️ NOTE: Free tier sleeps after 15 min. First load takes 30 sec." -ForegroundColor Yellow
    Write-Host "💡 TIP: Use uptimerobot.com (free) to keep services awake!`n" -ForegroundColor Magenta
    
    # Open browser
    $openBrowser = Read-Host "Open deployment sites now? (y/n)"
    if ($openBrowser -eq 'y') {
        Start-Process "https://vercel.com/new"
        Start-Sleep -Seconds 2
        Start-Process "https://render.com/register"
        Write-Host "`n✅ Opened deployment sites in browser!" -ForegroundColor Green
    }
    
    Write-Host "`n🎉 Your 'dist' folder is ready to deploy!" -ForegroundColor Green
    Write-Host "📂 Location: $PWD\dist" -ForegroundColor Cyan
    
} else {
    Write-Host "❌ Build failed! Check errors above." -ForegroundColor Red
    Write-Host "Try: npm install" -ForegroundColor Yellow
}

Write-Host "`n====================================" -ForegroundColor Gray
Write-Host "Need help? Check FREE_DEPLOY.md" -ForegroundColor White
Write-Host "====================================" -ForegroundColor Gray
