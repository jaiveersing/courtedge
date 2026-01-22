# Quick Fix Instructions for Vercel

## Step 1: Go to Vercel Dashboard
https://vercel.com/

## Step 2: Find Your Project
Click on "courtedge" project

## Step 3: Go to Settings → Environment Variables
https://vercel.com/your-username/courtedge/settings/environment-variables

## Step 4: Add These Variables

Click "Add New" for each:

### Variable 1:
- **Key**: `VITE_ML_SERVICE_URL`
- **Value**: ` ` (leave empty/blank)
- **Environment**: Select "Production"
- Click "Save"

### Variable 2:
- **Key**: `VITE_ENABLE_ML_FEATURES`
- **Value**: `false`
- **Environment**: Select "Production"
- Click "Save"

### Variable 3:
- **Key**: `VITE_USE_MOCK_DATA`
- **Value**: `true`
- **Environment**: Select "Production"
- Click "Save"

## Step 5: Redeploy

The code has been pushed to GitHub, Vercel will auto-deploy.

OR manually redeploy:
1. Go to "Deployments" tab
2. Click "..." on latest deployment
3. Click "Redeploy"

## Step 6: Wait & Test

- Wait 1-2 minutes for deployment
- Visit: https://courtedge.vercel.app
- The error should be replaced with a yellow warning box
- App will work with fallback data

## Done! ✅

The app will now:
- ✅ Load without errors
- ✅ Show friendly warning about ML service
- ✅ Work with mock/fallback data
- ✅ Be ready for when you deploy the ML service later

---

## Next Steps (Optional - For Full ML Features)

See [DEPLOYMENT.md](DEPLOYMENT.md) for instructions on:
- Deploying ML service to Render.com (free)
- Connecting it to your Vercel app
- Enabling full ML predictions
