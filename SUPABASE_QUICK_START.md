# Supabase Quick Start - 3 Steps

## ✅ Step 1: Create Supabase Project

1. Go to https://supabase.com → Sign up
2. Click "New Project"
3. Name: `vehicle-registry`
4. Create strong password (save it!)
5. Choose Free plan
6. Wait 2-3 minutes

## ✅ Step 2: Get Connection String

1. Supabase Dashboard → Settings → Database
2. Copy "Connection string" (URI tab)
3. Replace `[YOUR-PASSWORD]` with your actual password
4. Should look like:
   ```
   postgresql://postgres:yourpassword@db.xxxxx.supabase.co:5432/postgres
   ```

## ✅ Step 3: Add to Render

1. Render Dashboard → Your Web Service → Environment
2. Add: `DATABASE_URL` = (paste Supabase connection string)
3. Save
4. Render auto-redeploys (3-5 minutes)

## Done! 🎉

Your data will now persist in Supabase forever (free tier)!

---

**That's it!** The code already supports PostgreSQL, so it works with Supabase automatically.

