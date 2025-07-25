// src/pages/DashboardHome.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const DashboardHome = () => {
  const { id } = useSelector((state) => state.user);

  // ✅ THE FIX: This component ONLY reads data from the Redux store.
  // It has no fetching logic of its own for attendance.
  const attendanceStatus = useSelector((state) => state.attendance.today);
  
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    if (!id) return;
    axios.get(`http://localhost:5001/chat/unread-count/${id}`)
      .then(res => {
        if (res.data.success) setMessageCount(res.data.unreadCount);
      });
  }, [id]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white shadow rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">📅 Today's Attendance</h3>
        <p className="text-3xl font-bold text-gray-800">{attendanceStatus}</p>
      </div>
      <div className="bg-white shadow rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">📩 New Messages</h3>
        <p className="text-3xl font-bold text-blue-500">{messageCount}</p>
      </div>
      <div className="bg-white shadow rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">📝 Upcoming Task</h3>
        <p className="text-xl text-gray-700 mt-2">Finish Building Portal</p>
      </div>
    </div>
  );
};

export default DashboardHome;
