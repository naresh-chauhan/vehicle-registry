# Database Persistence Setup Guide

## The Problem

On Render's free tier, SQLite files are **ephemeral** - they get deleted when:
- The service restarts
- You deploy new code
- The service spins down after inactivity

This means **all your vehicle data gets lost**.

## The Solution: PostgreSQL

PostgreSQL is a persistent database that survives restarts and deployments. Render offers a **free PostgreSQL database** that you can use.

---

## Step 1: Create PostgreSQL Database on Render

1. **Go to your Render Dashboard**: https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `vehicle-registry-db` (or any name)
   - **Database**: `vehicle_registry` (or any name)
   - **User**: Auto-generated (or choose one)
   - **Region**: Same as your web service
   - **Plan**: **Free** (90 days free, then $7/month)
4. Click **"Create Database"**
5. **Wait for it to provision** (takes 1-2 minutes)

---

## Step 2: Connect Database to Your Web Service

1. In your **web service** settings (vehicle-registry)
2. Go to **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Add these variables (you'll find them in your PostgreSQL service):

   ```
   DATABASE_URL = <copy from PostgreSQL service>
   ```

   The DATABASE_URL looks like:
   ```
   postgresql://user:password@hostname:5432/database_name
   ```

5. **Save Changes**

---

## Step 3: Deploy Updated Code

The code has been updated to:
- ✅ Use PostgreSQL when `DATABASE_URL` is set (production)
- ✅ Use SQLite when `DATABASE_URL` is not set (local development)
- ✅ Automatically create tables on first run
- ✅ Create default admin user

**Deploy the updated code** (commit and push to GitHub, Render will auto-deploy)

---

## Step 4: Verify It Works

1. After deployment, visit your site
2. Login and add a vehicle
3. Restart your service (or wait for it to spin down/up)
4. **Your data should still be there!** ✅

---

## Alternative: Free Database Options

If you don't want to use Render's PostgreSQL (which has a 90-day free trial):

### Option 1: Supabase (Free Forever)
- Go to https://supabase.com
- Create free account
- Create new project
- Get connection string
- Use as `DATABASE_URL`

### Option 2: Neon (Free Forever)
- Go to https://neon.tech
- Create free account
- Create new project
- Get connection string
- Use as `DATABASE_URL`

### Option 3: Railway PostgreSQL (Free Tier)
- Go to https://railway.app
- Create PostgreSQL database
- Get connection string
- Use as `DATABASE_URL`

---

## Local Development

For local development, the app will still use SQLite (no setup needed).

To use PostgreSQL locally:
1. Install PostgreSQL locally, OR
2. Use a cloud database connection string locally
3. Set `DATABASE_URL` environment variable

---

## Migration Notes

- **Existing data**: If you have data in SQLite, it won't automatically migrate
- **Fresh start**: New PostgreSQL database starts empty
- **Default admin**: Will be created automatically on first run

---

## Cost

- **Render PostgreSQL**: Free for 90 days, then $7/month
- **Supabase**: Free forever (with limits)
- **Neon**: Free forever (with limits)
- **Railway**: Free tier available

