# 🚀 Render Deployment Guide

This guide will help you deploy your Student Dropout Predictor application to Render.

## 📋 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Your code is already pushed to GitHub
3. **Domain (Optional)**: Custom domain for your application

## 🔧 Deployment Steps

### Step 1: Deploy Backend API

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Click "New +" → "Web Service"

2. **Connect GitHub Repository**
   - Select "Build and deploy from a Git repository"
   - Connect your GitHub account
   - Select `2006-Aman/students-dropout-predictor`

3. **Configure Backend Service**
   - **Name**: `student-dropout-api`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn api:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Choose `Starter` (free tier)

4. **Environment Variables**
   - `PYTHON_VERSION`: `3.11.0`
   - `PORT`: `10000` (Render will override this)

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the service URL (e.g., `https://student-dropout-api.onrender.com`)

### Step 2: Deploy Frontend

1. **Create Static Site**
   - In Render Dashboard, click "New +" → "Static Site"
   - Connect the same GitHub repository

2. **Configure Frontend**
   - **Name**: `student-dropout-frontend`
   - **Build Command**: 
     ```bash
     cd frontend
     npm install
     npm run build
     ```
   - **Publish Directory**: `frontend/dist`
   - **Environment Variables**:
     - `VITE_API_BASE_URL`: `https://your-api-url.onrender.com`

3. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment to complete

### Step 3: Update API URL

1. **Get Backend URL**
   - Copy the backend service URL from Step 1

2. **Update Frontend Environment**
   - Go to your frontend service settings
   - Update `VITE_API_BASE_URL` with your actual backend URL
   - Redeploy the frontend

## 🔄 Alternative: Single Service Deployment

If you prefer to deploy everything as one service:

1. **Create Web Service**
   - Use the same repository
   - **Build Command**: 
     ```bash
     pip install -r requirements.txt
     cd frontend
     npm install
     npm run build
     ```
   - **Start Command**: `python start_render.py`

2. **Environment Variables**
   - `PYTHON_VERSION`: `3.11.0`
   - `PORT`: `10000`

## 📊 Monitoring and Logs

### View Logs
- Go to your service dashboard
- Click "Logs" tab
- Monitor deployment and runtime logs

### Health Checks
- Backend health check: `https://your-api-url.onrender.com/docs`
- Frontend: Your static site URL

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Python version compatibility
   - Verify all dependencies in `requirements.txt`
   - Check build logs for specific errors

2. **Runtime Errors**
   - Ensure all environment variables are set
   - Check that the PORT environment variable is used
   - Verify file paths are correct

3. **Frontend Not Loading**
   - Check that `VITE_API_BASE_URL` is set correctly
   - Verify the backend is running and accessible
   - Check browser console for errors

### Performance Optimization

1. **Enable Caching**
   - Add cache headers for static assets
   - Use CDN for better performance

2. **Database Considerations**
   - For production, consider using a database
   - Current setup uses file-based storage

## 🔐 Security Considerations

1. **Environment Variables**
   - Never commit sensitive data to Git
   - Use Render's environment variable system

2. **CORS Configuration**
   - Update CORS settings in `api.py` for production
   - Allow only your frontend domain

3. **Rate Limiting**
   - Consider implementing rate limiting for API endpoints

## 📈 Scaling

### Upgrade Plans
- **Starter**: Free tier with limitations
- **Standard**: Better performance and reliability
- **Pro**: Advanced features and support

### Database Integration
- Consider PostgreSQL for production data storage
- Implement proper data persistence

## 🔄 Continuous Deployment

Your application will automatically redeploy when you push changes to the main branch of your GitHub repository.

### Manual Deployment
- Go to your service dashboard
- Click "Manual Deploy" → "Deploy latest commit"

## 📞 Support

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **Community Support**: Render Community Forum
- **GitHub Issues**: Create issues in your repository

## 🎉 Success!

Once deployed, your application will be available at:
- **Frontend**: `https://your-frontend-url.onrender.com`
- **Backend API**: `https://your-api-url.onrender.com`
- **API Documentation**: `https://your-api-url.onrender.com/docs`
