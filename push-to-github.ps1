# Push to GitHub Script
param(
    [string]$GitHubUsername = "",
    [string]$RepoName = "student-dropout-predictor"
)

Write-Host "🚀 GitHub Repository Setup" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

if (-not $GitHubUsername) {
    $GitHubUsername = Read-Host "Enter your GitHub username"
}

$RepoUrl = "https://github.com/$GitHubUsername/$RepoName.git"

Write-Host "`n📋 Steps to complete:" -ForegroundColor Yellow
Write-Host "1. Go to https://github.com/new" -ForegroundColor White
Write-Host "2. Repository name: $RepoName" -ForegroundColor White
Write-Host "3. Make it Public" -ForegroundColor White
Write-Host "4. Click 'Create repository'" -ForegroundColor White
Write-Host "5. Press Enter when done..." -ForegroundColor White

Read-Host

Write-Host "`n🔄 Adding remote and pushing..." -ForegroundColor Cyan

try {
    git remote add origin $RepoUrl
    Write-Host "✅ Remote added: $RepoUrl" -ForegroundColor Green
    
    git branch -M main
    Write-Host "✅ Branch renamed to main" -ForegroundColor Green
    
    git push -u origin main
    Write-Host "✅ Code pushed to GitHub!" -ForegroundColor Green
    
    Write-Host "`n🎯 Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Go to https://railway.app/" -ForegroundColor White
    Write-Host "2. Deploy from GitHub repo: $RepoUrl" -ForegroundColor White
    Write-Host "3. Get your Railway URL" -ForegroundColor White
    Write-Host "4. Update frontend/vercel.json with Railway URL" -ForegroundColor White
    Write-Host "5. Redeploy frontend: vercel --prod" -ForegroundColor White
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`n💡 Manual steps:" -ForegroundColor Yellow
    Write-Host "git remote add origin $RepoUrl" -ForegroundColor White
    Write-Host "git branch -M main" -ForegroundColor White
    Write-Host "git push -u origin main" -ForegroundColor White
}
