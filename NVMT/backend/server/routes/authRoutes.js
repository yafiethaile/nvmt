const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db'); 
const router = express.Router();
const saltRounds = 10;
const jwt = require('jsonwebtoken');


// Registration route
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, hashedPassword]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: "User does not exist." });
    }
    const isValidPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // User authenticated, generate a JWT token
    const accessToken = jwt.sign(
      { username: user.rows[0].username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.json({ accessToken: accessToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
