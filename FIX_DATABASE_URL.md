# Fix Database URL for Supabase

## Your Current URL (with special characters)
```
postgresql://postgres:[A_2V$6Ck?FTeiyS]@db.uaxjojnnegeerhsevezg.supabase.co:5432/postgres
```

## Problem
The password contains special characters that need to be URL-encoded:
- `[` = `%5B`
- `]` = `%5D`
- `?` = `%3F`
- `$` = `%24`

## Solution: URL-Encoded Connection String

If your password is: `A_2V$6Ck?FTeiyS`

The encoded connection string should be:
```
postgresql://postgres:A_2V%246Ck%3FFTeiyS@db.uaxjojnnegeerhsevezg.supabase.co:5432/postgres
```

**OR** if your password actually includes the brackets `[A_2V$6Ck?FTeiyS]`:
```
postgresql://postgres:%5BA_2V%246Ck%3FFTeiyS%5D@db.uaxjojnnegeerhsevezg.supabase.co:5432/postgres
```

---

## Quick Fix Steps

### Step 1: Get Your Actual Password
1. Go to Supabase Dashboard
2. Settings → Database
3. Look for your database password (the one you created when setting up the project)
4. **Copy the actual password** (without brackets if they're just showing format)

### Step 2: URL Encode the Password

Use this online tool or encode manually:
- Go to: https://www.urlencoder.org/
- Paste your password
- Copy the encoded version

**Or encode manually:**
- `$` → `%24`
- `?` → `%3F`
- `[` → `%5B`
- `]` → `%5D`

### Step 3: Update in Render

1. Go to Render Dashboard
2. Your Web Service → Environment tab
3. Find `DATABASE_URL`
4. Replace with the properly encoded URL
5. Save
6. Render will auto-redeploy

---

## Example

If your password is: `A_2V$6Ck?FTeiyS`

**Before (wrong):**
```
postgresql://postgres:A_2V$6Ck?FTeiyS@db.uaxjojnnegeerhsevezg.supabase.co:5432/postgres
```

**After (correct):**
```
postgresql://postgres:A_2V%246Ck%3FFTeiyS@db.uaxjojnnegeerhsevezg.supabase.co:5432/postgres
```

---

## Verify It Works

After updating, check Render logs:
- Should see: "✅ Using PostgreSQL database"
- Should see: "✅ Database initialized and ready"
- Should NOT see connection errors

---

## Alternative: Get Connection String from Supabase

1. Supabase Dashboard → Settings → Database
2. Scroll to "Connection string"
3. Click "URI" tab
4. Copy the connection string
5. **Replace `[YOUR-PASSWORD]` with your actual password (URL-encoded)**
6. Use that in Render

