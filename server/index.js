// backend/index.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// --- Correctly Require All Route Files from the 'routes' Subdirectory ---
const loginRoute = require('./routes/login.js');
const attendanceRoutes = require('./routes/attendance.js');
const changePasswordRoute = require('./routes/changePassword.js');
const chatRoutes = require('./routes/chat.js'); // ✅ This now points to your new chat.js file
const employeeRoutes = require('./routes/employeeRoutes.js');
const setupSocket = require('./socketManager.js');

const app = express();
const server = http.createServer(app);
const PORT = 5001;

// --- Middlewares ---
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- MySQL Connection ---
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '######',
  database: 'employee_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('✅ MySQL Connected');
});

// --- API Route for Signup ---
app.post('/signup', async (req, res) => {
  const { name, email, password, address } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    db.query('INSERT INTO employees (name, email, password, address) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, address], (err, result) => {
      if (err) return res.status(500).json({ message: 'DB insert error' });
      const customEmpId = 'MYPORT' + result.insertId;
      db.query('UPDATE employees SET employeeId = ? WHERE id = ?', [customEmpId, result.insertId], (err2) => {
        if (err2) return res.status(500).json({ message: 'DB update error' });
        res.status(200).json({ id: customEmpId });
      });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Use All Routers with Correct Prefixes ---
app.use('/', employeeRoutes); // Handles the /employees route
app.use('/login', loginRoute);
app.use('/attendance', attendanceRoutes);
app.use('/chat', chatRoutes); // ✅ Server now correctly handles all /chat/... routes
app.use('/account', changePasswordRoute);

// --- Start Server ---
setupSocket(server);
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});