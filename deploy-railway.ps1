# Railway Deployment Script for Student Dropout Predictor
# This script helps you deploy your backend to Railway

Write-Host "🚀 Railway Deployment Helper" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

Write-Host "`n📋 Manual Steps to Deploy Backend to Railway:" -ForegroundColor Yellow
Write-Host "1. Go to https://railway.app/" -ForegroundColor White
Write-Host "2. Sign up/Login with GitHub" -ForegroundColor White
Write-Host "3. Click 'New Project' → 'Deploy from GitHub repo'" -ForegroundColor White
Write-Host "4. Connect your GitHub account" -ForegroundColor White
Write-Host "5. Create a new repository on GitHub with your code" -ForegroundColor White
Write-Host "6. Select your repository in Railway" -ForegroundColor White
Write-Host "7. Railway will auto-detect Python and deploy!" -ForegroundColor White

Write-Host "`n📁 Your project files are ready:" -ForegroundColor Green
Write-Host "✅ Procfile (for Railway)" -ForegroundColor Green
Write-Host "✅ railway.json (Railway config)" -ForegroundColor Green
Write-Host "✅ requirements.txt (Python dependencies)" -ForegroundColor Green
Write-Host "✅ api.py (FastAPI backend)" -ForegroundColor Green

Write-Host "`n🔗 After Railway deployment:" -ForegroundColor Cyan
Write-Host "1. Copy your Railway app URL (e.g., https://your-app.railway.app)" -ForegroundColor White
Write-Host "2. Update frontend/vercel.json with your Railway URL" -ForegroundColor White
Write-Host "3. Redeploy frontend with: vercel --prod" -ForegroundColor White

Write-Host "`n💡 Alternative: Deploy to Render.com" -ForegroundColor Yellow
Write-Host "1. Go to https://render.com/" -ForegroundColor White
Write-Host "2. Create 'Web Service'" -ForegroundColor White
Write-Host "3. Connect GitHub repo" -ForegroundColor White
Write-Host "4. Build Command: pip install -r requirements.txt" -ForegroundColor White
Write-Host "5. Start Command: uvicorn api:app --host 0.0.0.0 --port `$PORT" -ForegroundColor White

Write-Host "`n🎯 Current Status:" -ForegroundColor Cyan
Write-Host "✅ Frontend: DEPLOYED to Vercel" -ForegroundColor Green
Write-Host "⏳ Backend: Ready for Railway/Render deployment" -ForegroundColor Yellow
Write-Host "⏳ Full app: Waiting for backend deployment" -ForegroundColor Yellow

Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
