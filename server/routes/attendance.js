const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// ✅ Create DB connection
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'kush1976',
  database: 'employee_db',
});

// ✅ POST: Mark today's attendance
router.post('/mark-attendance', async (req, res) => {
  const { userId } = req.body;
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  try {
    // Check if already marked
    const [existing] = await db.query(
      'SELECT * FROM attendance WHERE user_id = ? AND date = ?',
      [userId, today]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Attendance already marked for today.' });
    }

    // Mark attendance
    await db.query(
      'INSERT INTO attendance (user_id, is_present, date, time) VALUES (?, ?, ?, NOW())',
      [userId, true, today]
    );

    res.json({ success: true, message: '✅ Attendance marked successfully.' });
  } catch (err) {
    console.error('❌ Error marking attendance:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ✅ GET: Last 2 days' attendance
router.get('/get-attendance/:userId', async (req, res) => {
  const userId = req.params.userId;
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const format = (date) => date.toISOString().split('T')[0];

  try {
    const [rows] = await db.query(
      `SELECT date, is_present AS present, time FROM attendance 
       WHERE user_id = ? AND (date = ? OR date = ?)
       ORDER BY date DESC`,
      [userId, format(today), format(yesterday)]
    );

    res.json({ success: true, attendance: rows });
  } catch (err) {
    console.error('❌ Error fetching attendance:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
