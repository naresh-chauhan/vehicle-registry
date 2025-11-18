# Supabase Setup Guide - Free Forever PostgreSQL

Supabase provides a free PostgreSQL database that works perfectly with your app!

## Step 1: Create Supabase Account & Project (5 minutes)

1. **Go to**: https://supabase.com
2. **Click "Start your project"** or **"Sign up"**
3. **Sign up** with GitHub (easiest) or email
4. **Click "New Project"**
5. **Fill in project details**:
   - **Name**: `vehicle-registry` (or any name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: **Free** (select this)
6. **Click "Create new project"**
7. **Wait 2-3 minutes** for project to provision

## Step 2: Get Your Database Connection String (2 minutes)

1. In your Supabase project dashboard, go to **"Settings"** (gear icon in left sidebar)
2. Click **"Database"** in the settings menu
3. Scroll down to **"Connection string"** section
4. Click on **"URI"** tab
5. You'll see a connection string like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. **Replace `[YOUR-PASSWORD]`** with the database password you created in Step 1
7. **Copy the complete connection string**

## Step 3: Add Connection String to Render (2 minutes)

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click on your Web Service** (`vehicle-registry`)
3. Go to **"Environment"** tab
4. Click **"Add Environment Variable"**
5. Add:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the Supabase connection string you copied
6. **Click "Save Changes"**

## Step 4: Deploy Your Code (automatic)

1. **Commit and push** your changes to GitHub (if you haven't already)
2. **Render will automatically redeploy** (takes 3-5 minutes)
3. **Done!** Your data will now persist in Supabase! ✅

---

## Verify It's Working

1. **Check Render logs**: Should say "✅ Using PostgreSQL database"
2. **Visit your site**: https://vehicle-registry.onrender.com
3. **Login and add a vehicle**
4. **Check Supabase**: Go to Supabase dashboard → Table Editor → You should see your `vehicles` table with data!

---

## Supabase Dashboard Features

Once set up, you can:
- **View your data**: Table Editor → See all vehicles
- **Run SQL queries**: SQL Editor → Write custom queries
- **Monitor usage**: Check database size, connections, etc.
- **Backup data**: Supabase handles backups automatically

---

## Free Tier Limits (More than enough!)

Supabase Free tier includes:
- ✅ **500 MB database storage** (plenty for thousands of vehicles)
- ✅ **2 GB bandwidth** per month
- ✅ **Unlimited API requests**
- ✅ **Automatic backups**
- ✅ **No credit card required**

---

## Troubleshooting

### "Connection refused" or "Connection timeout"
- Make sure you replaced `[YOUR-PASSWORD]` in the connection string
- Check that your Supabase project is running (not paused)
- Verify the connection string is correct

### "Table doesn't exist"
- The app creates tables automatically on first run
- Check Render deployment logs for errors
- Try accessing the site once to trigger table creation

### "SSL required"
- Supabase requires SSL connections
- The code already handles this automatically
- If you see SSL errors, check that `DATABASE_URL` is set correctly

### Connection string format
Make sure your connection string looks like:
```
postgresql://postgres:yourpassword@db.xxxxx.supabase.co:5432/postgres
```
NOT:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```
(Replace `[YOUR-PASSWORD]` with your actual password!)

---

## Security Note

- Your database password is stored securely in Render's environment variables
- Never commit the connection string to GitHub
- The `.gitignore` file already excludes sensitive files

---

## Next Steps

1. ✅ Set up Supabase (Step 1-2)
2. ✅ Add `DATABASE_URL` to Render (Step 3)
3. ✅ Deploy code (Step 4)
4. ✅ Your data is now persistent! 🎉

---

## Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **Render Support**: Check deployment logs in Render dashboard

