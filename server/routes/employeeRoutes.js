// backend/routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// --- Database Connection Pool ---
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'kush1976', // Your DB password
  database: 'employee_db',
});

// --- Route to get all employees for the chat sidebar ---
router.get('/employees', async (req, res) => {
  try {
    // ✅ THE FIX IS HERE: The query must select 'employeeId', not 'id'.
    const [employees] = await db.query('SELECT name, employeeId FROM employees');

    res.json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ error: 'Server error while fetching employees' });
  }
});

module.exports = router;