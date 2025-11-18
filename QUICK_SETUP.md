# Quick Setup: Persistent Database on Render

## 3 Simple Steps to Make Your Data Persistent

### Step 1: Create PostgreSQL Database on Render (2 minutes)

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Settings:
   - **Name**: `vehicle-registry-db`
   - **Database**: `vehicle_registry`
   - **Plan**: **Free** (90 days free)
4. Click **"Create Database"**
5. Wait 1-2 minutes for it to provision

### Step 2: Connect Database to Your Web Service (1 minute)

1. In your **PostgreSQL service**, find the **"Connection"** section
2. Copy the **"Internal Database URL"** (looks like: `postgresql://user:pass@host:5432/dbname`)

3. Go to your **Web Service** (vehicle-registry)
4. Click **"Environment"** tab
5. Click **"Add Environment Variable"**
6. Add:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the Internal Database URL you copied
7. Click **"Save Changes"**

### Step 3: Deploy Updated Code (automatic)

1. **Commit and push** your changes to GitHub:
   - The code now supports PostgreSQL automatically
   - It will use PostgreSQL when `DATABASE_URL` is set
   - It will use SQLite locally (when `DATABASE_URL` is not set)

2. **Render will automatically redeploy** (takes 3-5 minutes)

3. **Done!** Your data will now persist! ✅

---

## How It Works

- **Local Development**: Uses SQLite (no setup needed)
- **Production (Render)**: Uses PostgreSQL (when `DATABASE_URL` is set)
- **Automatic**: The code detects which database to use

---

## Verify It Works

1. After deployment, visit your site
2. Login and add a vehicle
3. Restart your service in Render dashboard
4. **Your vehicle should still be there!** ✅

---

## Free Alternatives (If You Don't Want to Pay After 90 Days)

### Supabase (Free Forever)
- https://supabase.com
- Create account → New project → Copy connection string
- Use as `DATABASE_URL` in Render

### Neon (Free Forever)
- https://neon.tech
- Create account → New project → Copy connection string
- Use as `DATABASE_URL` in Render

---

## Troubleshooting

**"Database connection failed"**
- Check `DATABASE_URL` is set correctly
- Make sure you copied the **Internal Database URL** (not External)
- Verify database is running in Render dashboard

**"Tables don't exist"**
- The code creates tables automatically on first run
- Check deployment logs for errors
- Try manual redeploy

**Data still getting lost**
- Make sure `DATABASE_URL` environment variable is set
- Check that you're using PostgreSQL, not SQLite
- Look at server logs: should say "Using PostgreSQL database"

