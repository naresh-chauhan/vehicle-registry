# Deployment Guide

This guide will help you deploy your Vehicle Registry website to the internet.

## Option 1: Render (Recommended - Free Tier Available)

**Render** is beginner-friendly and offers a free tier.

### Steps:

1. **Create a GitHub account** (if you don't have one) at https://github.com

2. **Create a new repository** on GitHub:
   - Click "New repository"
   - Name it `vehicle-registry`
   - Make it public (required for free tier)
   - Don't initialize with README

3. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/vehicle-registry.git
   git push -u origin main
   ```
   (Replace YOUR_USERNAME with your GitHub username)

4. **Deploy on Render**:
   - Go to https://render.com
   - Sign up with your GitHub account
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: vehicle-registry (or any name)
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free
   - Click "Create Web Service"
   - Your site will be live at: `https://your-app-name.onrender.com`

**Note**: Free tier services on Render spin down after 15 minutes of inactivity, so the first request after inactivity may take ~30 seconds.

---

## Option 2: Railway (Free Tier Available)

**Railway** is very easy to use and has a generous free tier.

### Steps:

1. **Push your code to GitHub** (same as Step 1-3 above)

2. **Deploy on Railway**:
   - Go to https://railway.app
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your `vehicle-registry` repository
   - Railway will auto-detect Node.js and deploy
   - Your site will be live at: `https://your-app-name.up.railway.app`

---

## Option 3: Fly.io (Free Tier Available)

**Fly.io** offers good performance and a free tier.

### Steps:

1. **Install Fly CLI**:
   ```bash
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **Login to Fly**:
   ```bash
   fly auth login
   ```

3. **Initialize Fly in your project**:
   ```bash
   fly launch
   ```
   - Follow the prompts
   - Don't deploy yet when asked

4. **Create fly.toml** (if not auto-generated):
   ```toml
   app = "your-app-name"
   primary_region = "iad"

   [build]

   [http_service]
     internal_port = 3000
     force_https = true
     auto_stop_machines = true
     auto_start_machines = true
     min_machines_running = 0
     processes = ["app"]

   [[vm]]
     cpu_kind = "shared"
     cpus = 1
     memory_mb = 256
   ```

5. **Deploy**:
   ```bash
   fly deploy
   ```

---

## Option 4: Heroku (Paid, but has free alternatives)

**Note**: Heroku removed their free tier, but you can use it with paid plans.

### Steps:

1. **Create a Procfile** (already created in project)

2. **Install Heroku CLI** from https://devcenter.heroku.com/articles/heroku-cli

3. **Login and deploy**:
   ```bash
   heroku login
   heroku create your-app-name
   git push heroku main
   ```

---

## Important Notes for All Platforms:

### Database Persistence
- **SQLite files are ephemeral** on most free hosting platforms
- Your database will reset when the service restarts
- For production, consider:
  - **Upgrading to a paid plan** with persistent storage
  - **Using a cloud database** (PostgreSQL, MongoDB Atlas free tier)
  - **Using Render/Railway's PostgreSQL** addon

### Environment Variables
- The app already uses `process.env.PORT` which is good
- No additional environment variables needed for basic deployment

### Security Considerations
- The current app has no authentication
- Anyone can add/delete vehicles
- Consider adding authentication for production use

---

## Quick Start (Render - Easiest)

1. Push code to GitHub
2. Sign up at https://render.com
3. Connect GitHub repo
4. Deploy!
5. Your site is live in ~5 minutes

---

## Need Help?

- **Render Docs**: https://render.com/docs
- **Railway Docs**: https://docs.railway.app
- **Fly.io Docs**: https://fly.io/docs

