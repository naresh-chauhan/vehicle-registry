# Troubleshooting "Network Error" on Login

## Quick Checks

### 1. Is the server running?
- **Local**: Check if `npm start` is running
- **Render**: Check Render dashboard → Your service → Should show "Live"

### 2. Check browser console
- Press `F12` → Go to "Console" tab
- Look for specific error messages
- Look for "Network" tab → Check if `/api/login` request is failing

### 3. Check server logs
- **Local**: Look at terminal where server is running
- **Render**: Go to Render dashboard → Your service → "Logs" tab
- Look for error messages

---

## Common Causes & Solutions

### Issue 1: Database Connection Failed

**Symptoms:**
- Error in server logs about database connection
- "Database not ready" message

**Solution:**
- **If using Supabase**: 
  - Check `DATABASE_URL` environment variable in Render
  - Verify connection string is correct (includes password)
  - Test connection in Supabase dashboard

- **If using SQLite locally**:
  - Make sure you have write permissions
  - Check if `vehicles.db` file exists

### Issue 2: Server Not Responding

**Symptoms:**
- "Failed to fetch" error
- Network tab shows request pending

**Solution:**
- **Local**: Make sure server is running on correct port (3000)
- **Render**: Check if service is deployed and running
- Try accessing: `http://localhost:3000/api/auth/check` (should return JSON)

### Issue 3: CORS or Session Issues

**Symptoms:**
- Request fails immediately
- Cookies not being set

**Solution:**
- Check browser console for CORS errors
- Make sure `credentials: 'include'` is in fetch requests (already added)
- Try clearing browser cookies and cache

### Issue 4: Database Not Initialized

**Symptoms:**
- "Database not ready" message
- Server logs show initialization errors

**Solution:**
- Wait a few seconds after server starts
- Check server logs for "✅ Database initialized and ready"
- If using Supabase, verify connection string is correct

---

## Debug Steps

### Step 1: Test API Endpoint Directly

Open browser and go to:
```
http://localhost:3000/api/auth/check
```

**Expected**: Should return JSON: `{"authenticated":false}`

**If error**: Server is not running or route is wrong

### Step 2: Check Server Logs

Look for:
- ✅ "Database initialized and ready"
- ✅ "Using PostgreSQL database" or "Using SQLite database"
- ❌ Any error messages

### Step 3: Test Database Connection

**If using Supabase:**
1. Go to Supabase dashboard
2. Check "Database" → "Connection pooling"
3. Verify connection string matches `DATABASE_URL` in Render

**If using SQLite:**
- Check if `vehicles.db` file exists in project folder
- Check file permissions

### Step 4: Check Browser Network Tab

1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Try to login
4. Look for `/api/login` request
5. Check:
   - **Status**: Should be 200, 401, or 503
   - **Response**: Should be JSON
   - **Headers**: Check if cookies are being set

---

## Specific Error Messages

### "Cannot connect to server"
- Server is not running
- Wrong URL
- Firewall blocking connection

### "Database not ready"
- Database is still initializing
- Wait 5-10 seconds and try again
- Check server logs for initialization errors

### "Invalid username or password"
- This is NOT a network error - it's working!
- Check credentials: `admin` / `admin123`

### "Internal server error"
- Check server logs for specific error
- Usually database connection issue
- Check `DATABASE_URL` environment variable

---

## For Render Deployment

### Check Render Logs

1. Go to Render dashboard
2. Click your service
3. Click "Logs" tab
4. Look for:
   - Database initialization messages
   - Error messages
   - "Server running" message

### Verify Environment Variables

1. Render dashboard → Your service
2. "Environment" tab
3. Check `DATABASE_URL` is set (if using Supabase)
4. Verify connection string is correct

### Common Render Issues

- **Service spinning down**: Free tier services sleep after 15 min inactivity
- **Build failed**: Check build logs for npm install errors
- **Database connection timeout**: Check Supabase connection string

---

## Still Not Working?

1. **Check browser console** for specific error
2. **Check server logs** for error messages
3. **Test API directly** using browser or Postman
4. **Verify database connection** is working
5. **Try incognito mode** to rule out browser extensions

---

## Quick Test

Run this in browser console on login page:
```javascript
fetch('/api/auth/check', {credentials: 'include'})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

Should return: `{authenticated: false}`

If it fails, the server/route is the issue.

