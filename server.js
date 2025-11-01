// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Get all needs
app.get('/needs', async (req, res) => {
  const rows = await pool.query('SELECT * FROM needs');
  res.json(rows);
});

// Add a new need
app.post('/needs', async (req, res) => {
  const { name, category, amount } = req.body;
  await pool.query('INSERT INTO needs (name, category, amount) VALUES (?, ?, ?)', [name, category, amount]);
  res.sendStatus(201);
});

// Update need (for funding)
app.put('/needs/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('UPDATE needs SET funded = true WHERE id = ?', [id]);
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
