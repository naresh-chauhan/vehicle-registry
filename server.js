const express = require('express');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Initialize database
const db = new Database('vehicles.db');

// Create table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    color TEXT NOT NULL,
    license_plate TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// API Routes

// Get all vehicles
app.get('/api/vehicles', (req, res) => {
  try {
    const vehicles = db.prepare('SELECT * FROM vehicles ORDER BY created_at DESC').all();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new vehicle
app.post('/api/vehicles', (req, res) => {
  try {
    const { name, phone, make, model, color, license_plate } = req.body;
    
    if (!name || !phone || !make || !model || !color || !license_plate) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO vehicles (name, phone, make, model, color, license_plate)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(name, phone, make, model, color, license_plate);
    res.json({ 
      id: result.lastInsertRowid,
      message: 'Vehicle added successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search vehicles
app.get('/api/vehicles/search', (req, res) => {
  try {
    const query = req.query.q || '';
    
    if (!query.trim()) {
      return res.json([]);
    }

    const searchTerm = `%${query}%`;
    const vehicles = db.prepare(`
      SELECT * FROM vehicles 
      WHERE name LIKE ? 
         OR phone LIKE ?
         OR make LIKE ?
         OR model LIKE ?
         OR color LIKE ?
         OR license_plate LIKE ?
      ORDER BY created_at DESC
    `).all(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a vehicle
app.delete('/api/vehicles/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM vehicles WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});

