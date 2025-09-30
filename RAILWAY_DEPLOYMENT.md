# 🚂 Railway Deployment Guide

This guide will help you deploy your Student Dropout Predictor application to Railway.

## 📋 Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Your code is already pushed to GitHub
3. **Railway CLI** (Optional): For local deployment

## 🚀 Deployment Steps

### Step 1: Connect to Railway

1. **Go to [railway.app](https://railway.app)**
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**: `2006-Aman/students-dropout-predictor`

### Step 2: Configure Deployment

Railway will automatically detect your project structure:

- **Build Command**: `pip install --upgrade pip setuptools==68.0.0 wheel==0.41.2 && pip install --no-cache-dir -r requirements.txt`
- **Start Command**: `uvicorn api:app --host 0.0.0.0 --port $PORT --workers 1`
- **Python Version**: 3.11.9 (from runtime.txt)

### Step 3: Environment Variables

Railway will automatically set:
- `PORT`: Automatically assigned
- `RAILWAY_ENVIRONMENT`: Production/development
- `RAILWAY_PROJECT_ID`: Your project ID

### Step 4: Deploy

1. **Click "Deploy"**
2. **Wait for build** to complete
3. **Get your URL** from Railway dashboard

## 🔧 Configuration Files

### `railway.json`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn api:app --host 0.0.0.0 --port $PORT --workers 1",
    "healthcheckPath": "/docs",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### `nixpacks.toml`
```toml
[phases.setup]
nixPkgs = ["python311", "pip"]

[phases.install]
cmds = [
  "pip install --upgrade pip setuptools==68.0.0 wheel==0.41.2",
  "pip install --no-cache-dir -r requirements.txt"
]

[phases.build]
cmds = ["echo 'Build phase completed'"]

[start]
cmd = "uvicorn api:app --host 0.0.0.0 --port $PORT --workers 1"
```

### `Procfile`
```
web: uvicorn api:app --host 0.0.0.0 --port $PORT --workers 1
```

## 📊 Monitoring

### View Logs
- Go to your project dashboard
- Click "Deployments" tab
- Click on your deployment
- View logs in real-time

### Health Checks
- **API Health**: `https://your-app.railway.app/docs`
- **Root Endpoint**: `https://your-app.railway.app/`

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Railway dashboard
   - Verify Python version compatibility
   - Check requirements.txt syntax

2. **Runtime Errors**
   - Check application logs
   - Verify environment variables
   - Check port configuration

3. **Import Errors**
   - Ensure all dependencies are in requirements.txt
   - Check Python path configuration

### Performance Optimization

1. **Enable Caching**
   - Railway automatically caches dependencies
   - Use specific versions in requirements.txt

2. **Resource Management**
   - Monitor memory usage
   - Optimize worker count if needed

## 🔄 Continuous Deployment

Your application will automatically redeploy when you push changes to the main branch of your GitHub repository.

### Manual Deployment
- Go to your project dashboard
- Click "Deploy" to trigger manual deployment

## 📞 Support

- **Railway Documentation**: [docs.railway.app](https://docs.railway.app)
- **Community Support**: Railway Discord
- **GitHub Issues**: Create issues in your repository

## 🎉 Success!

Once deployed, your application will be available at:
- **API**: `https://your-app.railway.app`
- **API Documentation**: `https://your-app.railway.app/docs`
- **Health Check**: `https://your-app.railway.app/health`
