// src/pages/DashboardLayout.jsx
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { setAttendance } from '../redux/AttendanceSlice';

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const { id } = useSelector((state) => state.user);

  // This hook runs ONCE when the component loads.
  useEffect(() => {
    // Don't do anything if we don't have the user ID yet
    if (!id) return;

    const fetchInitialAttendance = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/attendance/get-attendance/${id}`);
        const todayDate = new Date().toISOString().split('T')[0];
        const todayRecord = res.data.attendance.find(a => a.date === todayDate);

        // ✅ THE FIX: This dispatches the TRUE status from the database.
        // It will replace "Loading..." with either "Present" or "Not Marked".
        dispatch(
          setAttendance({
            today: todayRecord ? 'Present' : 'Not Marked',
            yesterday: 'Not Marked',
          })
        );
      } catch (err) {
        // If the database call fails, show an error status.
        dispatch(setAttendance({ today: 'Error', yesterday: 'Error' }));
      }
    };

    fetchInitialAttendance();
  }, [id, dispatch]); // This dependency array ensures the code runs only once when the user ID is ready

  return (
    <div className="flex h-screen w-screen bg-[#1A202C]">
      <div className="w-64 flex-shrink-0"><Sidebar /></div>
      <main className="flex-1 flex flex-col overflow-hidden">
        <div><Topbar /></div>
        <div className="flex-1 overflow-y-auto p-6 md:p-8"><Outlet /></div>
      </main>
    </div>
  );
};

export default DashboardLayout;