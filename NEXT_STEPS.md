# Next Steps After Running Git Commands

## Step 1: Create GitHub Repository

1. Go to https://github.com and sign in
2. Click the **"+"** icon (top right) → **"New repository"**
3. Repository name: `vehicle-registry`
4. Make it **Public** (required for free hosting)
5. **DO NOT** check "Initialize with README"
6. Click **"Create repository"**

## Step 2: Connect Your Code to GitHub

After creating the repository, GitHub will show you a page with commands.

**In PowerShell** (in your project folder), run these commands:

```bash
# Add GitHub as remote (REPLACE YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/vehicle-registry.git

# Push your code to GitHub
git push -u origin main
```

**Important**: When you run `git push`, you'll be asked for credentials:
- **Username**: Your GitHub username
- **Password**: You need a **Personal Access Token** (NOT your GitHub password)

### How to Create a Personal Access Token:

1. Go to GitHub → Click your profile picture (top right) → **Settings**
2. Scroll down → Click **"Developer settings"** (left sidebar)
3. Click **"Personal access tokens"** → **"Tokens (classic)"**
4. Click **"Generate new token"** → **"Generate new token (classic)"**
5. Give it a name: `vehicle-registry-deploy`
6. Select expiration: **90 days** (or your preference)
7. Check the **"repo"** checkbox (this gives full repository access)
8. Scroll down → Click **"Generate token"**
9. **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)
10. Use this token as your password when pushing

## Step 3: Deploy to Render (Easiest Option)

Once your code is on GitHub:

1. Go to https://render.com
2. Sign up with your **GitHub account** (click "Sign up with GitHub")
3. Click **"New +"** → **"Web Service"**
4. Click **"Connect account"** if prompted
5. Find and select your **`vehicle-registry`** repository
6. Configure the service:
   - **Name**: `vehicle-registry` (or any name)
   - **Environment**: **Node**
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: **Free**
7. Click **"Create Web Service"**
8. Wait 2-3 minutes for deployment
9. Your site will be live at: `https://vehicle-registry.onrender.com` (or similar)

## Alternative: Deploy to Railway (Also Easy)

1. Go to https://railway.app
2. Sign up with **GitHub**
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your `vehicle-registry` repository
6. Railway will auto-detect Node.js and deploy automatically
7. Your site will be live in a few minutes!

## Troubleshooting

### If Git commands don't work:
- Make sure Git is installed: https://git-scm.com/download/win
- **Restart PowerShell** after installing Git
- Try: `refreshenv` in PowerShell

### If push fails:
- Make sure you created the GitHub repository first
- Check that your username in the URL is correct
- Use a Personal Access Token, not your password

### If deployment fails:
- Make sure all files are committed: `git status`
- Check that `package.json` and `server.js` are in the repository
- Look at the deployment logs on Render/Railway for errors

