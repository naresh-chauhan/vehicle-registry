# Security & Authentication Guide

## Default Login Credentials

When you first start the server, a default admin user is automatically created:

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **IMPORTANT**: Change this password immediately after first login!

## How Authentication Works

1. **Login Required**: All pages and API endpoints require authentication
2. **Session-Based**: Uses secure sessions (cookies) to track logged-in users
3. **Password Hashing**: Passwords are hashed using bcrypt (never stored in plain text)
4. **Auto-Redirect**: Unauthenticated users are automatically redirected to the login page

## Features

- ✅ Secure password hashing (bcrypt)
- ✅ Session management
- ✅ Protected API routes
- ✅ Automatic logout on session expiry (24 hours)
- ✅ Login page with error handling

## Changing the Default Password

### Option 1: Direct Database Update (Advanced)

You can update the password directly in the database using SQL:

```sql
-- This requires bcrypt hashing, so use Option 2 instead
```

### Option 2: Create a New User (Recommended)

To add a new user or change password, you'll need to:

1. **Create a script** to hash and insert a new password
2. **Or modify the server code** temporarily to create a new user

### Option 3: Use a Password Management Script

Create a file `create-user.js`:

```javascript
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');

const db = new Database('vehicles.db');
const username = 'admin'; // or new username
const newPassword = 'your-new-secure-password';

const hashedPassword = bcrypt.hashSync(newPassword, 10);

// Update existing user
db.prepare('UPDATE users SET password_hash = ? WHERE username = ?')
  .run(hashedPassword, username);

console.log(`Password updated for user: ${username}`);
db.close();
```

Run it: `node create-user.js`

## Adding More Users

You can add additional users by inserting into the database:

```javascript
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');

const db = new Database('vehicles.db');
const username = 'newuser';
const password = 'securepassword123';
const hashedPassword = bcrypt.hashSync(password, 10);

db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)')
  .run(username, hashedPassword);

console.log(`User created: ${username}`);
db.close();
```

## Security Best Practices

1. **Change Default Password**: Immediately after first deployment
2. **Use Strong Passwords**: Minimum 12 characters, mix of letters, numbers, symbols
3. **Session Secret**: Change the session secret in `server.js` for production:
   ```javascript
   secret: process.env.SESSION_SECRET || 'your-very-long-random-secret-key'
   ```
4. **HTTPS**: Use HTTPS in production (set `secure: true` in session config)
5. **Environment Variables**: Store secrets in environment variables, not code

## Production Deployment

For production, set these environment variables:

```bash
SESSION_SECRET=your-very-long-random-secret-key-here
```

On Render/Railway, add this in your environment variables settings.

## Troubleshooting

### Can't Login
- Check username/password are correct
- Check server console for errors
- Verify database file exists

### Session Expires Too Quickly
- Default is 24 hours
- Adjust `maxAge` in session config in `server.js`

### Forgot Password
- You'll need to reset it via database (see Option 2 above)
- Or delete the user and recreate

