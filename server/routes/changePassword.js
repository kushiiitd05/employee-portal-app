// backend/routes/changePassword.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Use bcryptjs as it's consistent
const mysql = require('mysql2/promise');

// --- Database Connection Pool ---
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '######', // Your DB password
  database: 'employee_db',
});

// --- API Route to Change Password ---
// Handles POST requests to /account/change-password
router.post('/change-password', async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    // Find the user's current hashed password from the database
    const [rows] = await db.query('SELECT password FROM employees WHERE employeeId = ?', [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const dbHash = rows[0].password;

    // Compare the provided current password with the one in the database
    const isMatch = await bcrypt.compare(currentPassword, dbHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: '❌ Incorrect current password.' });
    }

    // If the current password is correct, hash the new password
    const newHash = await bcrypt.hash(newPassword, 10);

    // Update the database with the new hashed password
    await db.query('UPDATE employees SET password = ? WHERE employeeId = ?', [newHash, userId]);

    res.json({ success: true, message: '✅ Password changed successfully!' });

  } catch (err) {
    console.error('❌ Error changing password:', err);
    res.status(500).json({ success: false, message: '❌ A server error occurred.' });
  }
});

module.exports = router;
