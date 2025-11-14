# How to Deploy Updates to Render.com

## Quick Steps

1. **Commit your changes to Git**
2. **Push to GitHub**
3. **Render automatically redeploys** (or manually trigger)

---

## Method 1: Using GitHub Desktop (Easiest)

If you used GitHub Desktop to deploy originally:

1. **Open GitHub Desktop**
2. **Review your changes** - You should see all the modified files:
   - `server.js` (authentication added)
   - `package.json` (new dependencies)
   - `public/login.html` (new file)
   - `public/index.html` (updated)
   - `public/script.js` (updated)
   - `SECURITY.md` (new file)
   - etc.

3. **Commit the changes**:
   - Write a commit message: `"Add authentication and login system"`
   - Click "Commit to main"

4. **Push to GitHub**:
   - Click "Push origin" button
   - This uploads your changes to GitHub

5. **Render will automatically detect the push and redeploy** (takes 2-5 minutes)

---

## Method 2: Using Git Commands

If you have Git installed in PowerShell:

```bash
# 1. Check what files changed
git status

# 2. Add all changes
git add .

# 3. Commit with a message
git commit -m "Add authentication and login system"

# 4. Push to GitHub
git push origin main
```

Render will automatically redeploy after the push.

---

## Method 3: Manual Redeploy on Render

If you've already pushed to GitHub but Render hasn't redeployed:

1. **Go to your Render dashboard**: https://dashboard.render.com
2. **Click on your service** (`vehicle-registry`)
3. **Click "Manual Deploy"** → **"Deploy latest commit"**
4. **Wait 2-5 minutes** for deployment to complete

---

## What Changed (Summary)

Your recent changes include:
- ✅ Login page (`/login`)
- ✅ Username/password authentication
- ✅ Protected API routes
- ✅ Logout functionality
- ✅ Session management
- ✅ New dependencies: `express-session`, `bcrypt`

**Default credentials**: `admin` / `admin123`

---

## Verify Deployment

After deployment completes:

1. **Visit**: https://vehicle-registry.onrender.com
2. **You should be redirected to**: https://vehicle-registry.onrender.com/login
3. **Login with**: `admin` / `admin123`
4. **You should see the main page** with logout button

---

## Troubleshooting

### Render shows "Build failed"
- Check the build logs in Render dashboard
- Make sure `package.json` includes all dependencies
- Verify all files were committed

### Changes not showing
- Wait 2-5 minutes for deployment
- Clear your browser cache
- Try incognito/private browsing mode

### Still seeing old version
- Check Render deployment logs
- Verify you pushed to the correct GitHub branch
- Try manual redeploy in Render dashboard

---

## Important Notes

1. **Database will reset**: On Render's free tier, the SQLite database is ephemeral and resets on each deployment. Your vehicle data will be lost, but the default admin user will be recreated.

2. **First deployment after changes**: May take longer (5-10 minutes) as it needs to install new dependencies (`express-session`, `bcrypt`).

3. **Environment Variables**: If you set any in Render dashboard, they'll persist across deployments.

