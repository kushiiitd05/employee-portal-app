// backend/routes/chat.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// --- Database Connection Pool ---
// Using a pool is more efficient for handling multiple simultaneous database connections.
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'kush1976', // Your DB password
  database: 'employee_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * @route   GET /chat/get-messages/:senderId/:receiverId
 * @desc    Fetches the message history between two specific users.
 * @access  Private
 */
router.get('/get-messages/:senderId/:receiverId', async (req, res) => {
  const { senderId, receiverId } = req.params;
  try {
    const [messages] = await db.query(
      `SELECT
         sender_id as senderId,
         receiver_id as receiverId,
         message,
         created_at
       FROM messages
       WHERE (sender_id = ? AND receiver_id = ?)
          OR (sender_id = ? AND receiver_id = ?)
       ORDER BY created_at ASC`,
      [senderId, receiverId, receiverId, senderId]
    );
    res.json({ success: true, messages });
  } catch (err) {
    console.error('❌ DB Error [get-messages]:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching messages.' });
  }
});

/**
 * @route   GET /chat/unread-count/:userId
 * @desc    Gets the total number of unread messages for a specific user.
 * @access  Private
 */
router.get('/unread-count/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT COUNT(*) as unreadCount FROM messages WHERE receiver_id = ? AND is_read = FALSE',
      [userId]
    );
    res.json({ success: true, unreadCount: rows[0].unreadCount });
  } catch (err) {
    console.error('❌ DB Error [unread-count]:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching unread count.' });
  }
});

/**
 * @route   POST /chat/mark-as-read
 * @desc    Marks all messages from a specific sender to the logged-in user as read.
 * @access  Private
 */
router.post('/mark-as-read', async (req, res) => {
  // receiverId is the current logged-in user who is reading the messages
  const { senderId, receiverId } = req.body;
  try {
    await db.query(
      'UPDATE messages SET is_read = TRUE WHERE sender_id = ? AND receiver_id = ?',
      [senderId, receiverId]
    );
    res.json({ success: true, message: 'Messages marked as read.' });
  } catch (err) {
    console.error('❌ DB Error [mark-as-read]:', err);
    res.status(500).json({ success: false, message: 'Server error while marking messages as read.' });
  }
});

module.exports = router;