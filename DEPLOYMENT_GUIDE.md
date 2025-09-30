# 🚀 Complete Deployment Guide - Student Dropout Predictor

## ✅ Current Status
- **Frontend**: ✅ DEPLOYED to Vercel
- **Backend**: ⏳ Ready for deployment
- **Full App**: ⏳ Waiting for backend

## 🌐 Your Live Frontend
**URL**: https://frontend-44s4qwox8-amans-projects-3a50b102.vercel.app

---

## 📋 Step 1: Deploy Backend to Railway

### Option A: Railway (Recommended)

1. **Go to Railway**: https://railway.app/
2. **Sign up/Login** with GitHub
3. **Create New Project** → "Deploy from GitHub repo"
4. **Connect GitHub** account
5. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Repository name: `student-dropout-predictor`
   - Make it Public
   - Click "Create repository"

6. **Push your code to GitHub**:
   ```bash
   git remote add origin https://github.com/2006-Aman/student-dropout-predictor.git
   git branch -M main
   git push -u origin main
   ```

7. **Deploy on Railway**:
   - Select your repository
   - Railway will auto-detect Python
   - Uses `Procfile` and `railway.json` automatically
   - Wait for deployment to complete

8. **Get your Railway URL** (e.g., `https://your-app.railway.app`)

### Option B: Render (Alternative)

1. **Go to Render**: https://render.com/
2. **Sign up/Login** with GitHub
3. **Create Web Service**
4. **Connect GitHub repo**
5. **Configure**:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn api:app --host 0.0.0.0 --port $PORT`
6. **Deploy**

---

## 📋 Step 2: Connect Frontend to Backend

1. **Update API URL** in `frontend/vercel.json`:
   ```json
   {
     "env": {
       "VITE_API_BASE_URL": "https://your-railway-app.railway.app"
     }
   }
   ```

2. **Redeploy Frontend**:
   ```bash
   cd frontend
   vercel --prod
   ```

---

## 🎯 Final Result

- **Frontend**: https://frontend-44s4qwox8-amans-projects-3a50b102.vercel.app
- **Backend**: https://your-app.railway.app
- **Full App**: Working end-to-end!

---

## 🔧 Quick Commands

### Push to GitHub (if needed):
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Deploy Frontend:
```bash
cd frontend
vercel --prod
```

### Check Backend Health:
```bash
curl https://your-app.railway.app/health
```

---

## 📞 Need Help?

1. **Railway Issues**: Check Railway dashboard logs
2. **Vercel Issues**: Check Vercel dashboard
3. **API Connection**: Test with browser dev tools
4. **CORS Issues**: Backend has CORS enabled for all origins

---

## 🎉 You're Almost There!

Your frontend is live! Just deploy the backend and connect them. The hardest part (frontend deployment) is done! 🚀
