const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Determine database type
const usePostgreSQL = !!process.env.DATABASE_URL;
let db; // Will be SQLite or PostgreSQL pool

// Initialize database connection
if (usePostgreSQL) {
  // Use PostgreSQL (production)
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('localhost') ? false : {
      rejectUnauthorized: false
    }
  });
  db = pool;
  console.log('✅ Using PostgreSQL database');
} else {
  // Use SQLite (local development)
  const Database = require('better-sqlite3');
  db = new Database('vehicles.db');
  console.log('✅ Using SQLite database (local)');
}

// Database helper functions
const dbHelpers = {
  // Execute query (works for both SQLite and PostgreSQL)
  async query(sql, params = []) {
    if (usePostgreSQL) {
      // PostgreSQL uses $1, $2, etc. for parameters
      // Convert ? placeholders to $1, $2, etc.
      let paramIndex = 1;
      const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
      const result = await db.query(pgSql, params);
      return {
        rows: result.rows,
        changes: result.rowCount || 0,
        lastInsertRowId: result.rows[0]?.id || null
      };
    } else {
      // SQLite
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        const stmt = db.prepare(sql);
        const rows = stmt.all(...params);
        return { rows, changes: rows.length, lastInsertRowId: null };
      } else {
        const stmt = db.prepare(sql);
        const result = stmt.run(...params);
        return {
          rows: [],
          changes: result.changes,
          lastInsertRowId: result.lastInsertRowid
        };
      }
    }
  },

  // Execute multiple statements (for table creation)
  async exec(sql) {
    if (usePostgreSQL) {
      // Split by semicolon and execute each statement
      const statements = sql.split(';').filter(s => s.trim());
      for (const statement of statements) {
        if (statement.trim()) {
          await db.query(statement.trim());
        }
      }
    } else {
      db.exec(sql);
    }
  }
};

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve login page (before static files)
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Protect main page - redirect to login if not authenticated
app.get('/', (req, res) => {
  if (req.session && req.session.userId) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.redirect('/login');
  }
});

// Serve static files (CSS, JS, images, etc.)
app.use(express.static('public'));

// Create tables if they don't exist
async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    if (usePostgreSQL) {
      // PostgreSQL table creation
      await dbHelpers.exec(`
        CREATE TABLE IF NOT EXISTS vehicles (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          make TEXT NOT NULL,
          model TEXT NOT NULL,
          color TEXT NOT NULL,
          license_plate TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ PostgreSQL tables created/verified');
    } else {
      // SQLite table creation
      await dbHelpers.exec(`
        CREATE TABLE IF NOT EXISTS vehicles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          make TEXT NOT NULL,
          model TEXT NOT NULL,
          color TEXT NOT NULL,
          license_plate TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ SQLite tables created/verified');
    }

    // Create default admin user if no users exist
    const userCount = await dbHelpers.query('SELECT COUNT(*) as count FROM users');
    const count = usePostgreSQL 
      ? parseInt(userCount.rows[0]?.count || 0) 
      : (userCount.rows[0]?.count || 0);
    
    if (count === 0) {
      const defaultPassword = 'admin123';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      await dbHelpers.query(
        'INSERT INTO users (username, password_hash) VALUES (?, ?)',
        ['admin', hashedPassword]
      );
      console.log('✅ Default admin user created: username="admin", password="admin123"');
      console.log('⚠️  IMPORTANT: Change the default password after first login!');
    } else {
      console.log('✅ Users table already has data');
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error; // Re-throw to be caught by the caller
  }
}

// Initialize database on startup
let dbReady = false;
initializeDatabase().then(() => {
  dbReady = true;
  console.log('✅ Database initialized and ready');
}).catch((error) => {
  console.error('❌ Database initialization failed:', error);
  process.exit(1);
});

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  } else {
    return res.status(401).json({ error: 'Authentication required' });
  }
};

// API Routes

// Authentication routes
app.post('/api/login', async (req, res) => {
  try {
    // Check if database is ready
    if (!dbReady) {
      return res.status(503).json({ error: 'Database not ready. Please try again in a moment.' });
    }

    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const result = await dbHelpers.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    const user = usePostgreSQL ? result.rows[0] : result.rows[0];
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    req.session.userId = user.id;
    req.session.username = user.username;
    res.json({ 
      message: 'Login successful',
      username: user.username
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

app.get('/api/auth/check', (req, res) => {
  if (req.session && req.session.userId) {
    res.json({ 
      authenticated: true,
      username: req.session.username
    });
  } else {
    res.json({ authenticated: false });
  }
});

// Protected API Routes - require authentication
// Get all vehicles
app.get('/api/vehicles', requireAuth, async (req, res) => {
  try {
    const result = await dbHelpers.query(
      'SELECT * FROM vehicles ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new vehicle
app.post('/api/vehicles', requireAuth, async (req, res) => {
  try {
    const { name, phone, make, model, color, license_plate } = req.body;
    
    if (!name || !phone || !make || !model || !color || !license_plate) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    let result;
    if (usePostgreSQL) {
      // PostgreSQL - use RETURNING to get the inserted ID
      const pgResult = await db.query(
        `INSERT INTO vehicles (name, phone, make, model, color, license_plate)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [name, phone, make, model, color, license_plate]
      );
      result = { id: pgResult.rows[0].id };
    } else {
      // SQLite
      const sqliteResult = await dbHelpers.query(
        `INSERT INTO vehicles (name, phone, make, model, color, license_plate)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, phone, make, model, color, license_plate]
      );
      result = { id: sqliteResult.lastInsertRowId };
    }
    
    res.json({ 
      id: result.id,
      message: 'Vehicle added successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search vehicles
app.get('/api/vehicles/search', requireAuth, async (req, res) => {
  try {
    const query = req.query.q || '';
    
    if (!query.trim()) {
      return res.json([]);
    }

    const searchTerm = `%${query}%`;
    const result = await dbHelpers.query(
      `SELECT * FROM vehicles 
       WHERE name LIKE ? 
          OR phone LIKE ?
          OR make LIKE ?
          OR model LIKE ?
          OR color LIKE ?
          OR license_plate LIKE ?
       ORDER BY created_at DESC`,
      [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm]
    );
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a vehicle
app.delete('/api/vehicles/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await dbHelpers.query(
      'DELETE FROM vehicles WHERE id = ?',
      [id]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes for login and main page are defined above (before static files)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Login page: http://localhost:${PORT}/login`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  if (usePostgreSQL) {
    await db.end();
  } else {
    db.close();
  }
  process.exit(0);
});
