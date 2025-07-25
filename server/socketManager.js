// backend/socketManager.js
const { Server } = require('socket.io');
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'kush1976', // Your DB password
  database: 'employee_db',
});

const setupSocket = (server) => {
  const io = new Server(server, { cors: { origin: 'http://localhost:5173' } });
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    socket.on('join', (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit('online-users', Array.from(onlineUsers.keys()));
    });

    socket.on('send-message', async ({ senderId, receiverId, message }) => {
      try {
        await db.query('INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)', [senderId, receiverId, message]);
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive-message', { senderId, message, created_at: new Date() });
          io.to(receiverSocketId).emit('update-unread-count');
        }
      } catch (err) {
        console.error('DB save error:', err);
      }
    });

    socket.on('manual-disconnect', (userId) => {
      onlineUsers.delete(userId);
      io.emit('online-users', Array.from(onlineUsers.keys()));
    });

    socket.on('disconnect', () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      io.emit('online-users', Array.from(onlineUsers.keys()));
    });

    // --- NATIVE WEBRTC SIGNALING LOGIC ---
    socket.on('offer', (payload) => {
      const calleeSocketId = onlineUsers.get(payload.calleeId);
      if (calleeSocketId) io.to(calleeSocketId).emit('offer', payload);
    });

    socket.on('answer', (payload) => {
      const callerSocketId = onlineUsers.get(payload.callerId);
      if (callerSocketId) io.to(callerSocketId).emit('answer', payload);
    });
    
    socket.on('ice-candidate', (payload) => {
        const otherUserSocketId = onlineUsers.get(payload.to);
        if(otherUserSocketId) io.to(otherUserSocketId).emit('ice-candidate', { candidate: payload.candidate, from: payload.from });
    });
    
    socket.on('end-call', (payload) => {
        const otherUserSocketId = onlineUsers.get(payload.to);
        if(otherUserSocketId) io.to(otherUserSocketId).emit('call-ended');
    });

    socket.on('decline-call', (payload) => {
        const callerSocketId = onlineUsers.get(payload.callerId);
        if(callerSocketId) io.to(callerSocketId).emit('call-declined', { declinerName: payload.declinerName });
    });
  });
};

module.exports = setupSocket;