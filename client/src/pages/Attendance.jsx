// src/pages/Attendance.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setAttendance } from '../redux/AttendanceSlice'; // Import the action
import PopupMessage from '../components/PopupMessage';

const Attendance = () => {
  const dispatch = useDispatch();
  const { id } = useSelector((state) => state.user);

  // This component READS its state from the central store
  const { today, yesterday } = useSelector((state) => state.attendance);

  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  const handleMark = async () => {
    // Prevent action if already marked
    if (today === 'Present') return;

    try {
      const res = await axios.post('http://localhost:5001/attendance/mark-attendance', { userId: id });
      
      // ✅ SUCCESS! Now, tell the entire application about the change.
      // This dispatch updates the Redux store, and any component listening will re-render.
      dispatch(setAttendance({ today: 'Present', yesterday }));

      // Show success popup
      setPopup({ show: true, message: res.data.message, type: 'success' });

    } catch (err) {
      setPopup({
        show: true,
        message: err.response?.data?.message || '❌ Failed to mark attendance',
        type: 'error',
      });
    }
  };
  
  return (
    <div className="p-10 text-white bg-[#1E2A38] min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Attendance</h1>
{/*       
      <div className="mb-4"> Today: {today}</div>
      <div className="mb-6">Yesterday: {yesterday}</div> */}

      <button
        className={`px-6 py-2 rounded-md font-semibold text-white transition-colors duration-300 ${
          today === 'Present'
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-600'
        }`}
        onClick={handleMark}
        disabled={today === 'Present'}
      >
        {today === 'Present' ? 'Attendance Marked' : "Mark Today's Attendance"}
      </button>

      {popup.show && (
        <PopupMessage
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup({ ...popup, show: false })}
        />
      )}
    </div>
  );
};

export default Attendance;