// backend/routes/login.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

// --- Secret Key for JWT (should be in a .env file in production) ---
const JWT_SECRET = "mySuperSecretJWTKey";

// --- Database Connection Pool ---
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'kush1976', // Your DB password
  database: 'employee_db',
});

// --- Login API Endpoint ---
// Handles POST requests to /login
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  try {
    // Find the user by their email address
    const [results] = await db.query('SELECT * FROM employees WHERE email = ?', [email]);

    if (results.length === 0) {
      // Use a 401 status for both user not found and wrong password to prevent email enumeration
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please try again.' });
    }

    const user = results[0];

    // Compare the provided password with the hashed password from the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please try again.' });
    }

    // If credentials are correct, create a JWT token with the user's data
    const token = jwt.sign(
      {
        id: user.employeeId,
        name: user.name,
        email: user.email,
        address: user.address,
        profileImage: user.profileImage || null
      },
      JWT_SECRET,
      { expiresIn: '1d' } // Token expires in 1 day
    );

    // Send the token back to the frontend
    return res.status(200).json({ success: true, token });

  } catch (err) {
    console.error('❌ Login Server Error:', err);
    return res.status(500).json({ success: false, message: 'A server error occurred. Please try again later.' });
  }
});

module.exports = router;