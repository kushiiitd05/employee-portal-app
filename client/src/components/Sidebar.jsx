// src/components/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // ✅ Import useSelector
import { Home, CalendarCheck, MessageSquare, LogOut } from 'lucide-react';
import { clearUser } from '../redux/UserSlice';
import socket from '../socket'; // ✅ Import the socket instance

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ THE FIX: Get the current user's ID from the Redux store.
  const currentUserId = useSelector((state) => state.user.id);

  const handleLogout = () => {
    // 1. Tell the server you are logging out, using the ID from Redux.
    if (currentUserId) {
      socket.emit('manual-disconnect', currentUserId);
    }

    // 2. Clear the local user data from Redux and localStorage.
    dispatch(clearUser());
    localStorage.removeItem('user');

    // 3. Redirect to the login page.
    navigate('/login');
  };

  const getTextClass = (isActive) =>
    isActive ? 'text-white' : 'text-gray-400 group-hover:text-orange-300';

  return (
    <div className="bg-[#1E2A38] h-screen w-64 flex flex-col p-6">
      <h2 className="text-2xl font-bold text-white mb-8">At@Employee</h2>

      <NavLink to="/dashboard/home" className="group flex items-center gap-4 mb-4 px-4 py-3 rounded-lg transition-all">
        {({ isActive }) => (
          <>
            <Home size={24} className={getTextClass(isActive)} />
            <span className={`text-base ${getTextClass(isActive)}`}>Home</span>
          </>
        )}
      </NavLink>

      <NavLink to="/dashboard/attendance" className="group flex items-center gap-4 mb-4 px-4 py-3 rounded-lg transition-all">
        {({ isActive }) => (
          <>
            <CalendarCheck size={24} className={getTextClass(isActive)} />
            <span className={`text-base ${getTextClass(isActive)}`}>Attendance</span>
          </>
        )}
      </NavLink>

      <NavLink to="/dashboard/chat" className="group flex items-center gap-4 mb-4 px-4 py-3 rounded-lg transition-all">
        {({ isActive }) => (
          <>
            <MessageSquare size={24} className={getTextClass(isActive)} />
            <span className={`text-base ${getTextClass(isActive)}`}>Chat</span>
          </>
        )}
      </NavLink>

      <button
        onClick={handleLogout}
        className="group flex items-center gap-3 mt-auto px-4 py-3 rounded-lg text-gray-400 hover:bg-red-500 hover:text-white transition-all duration-300"
      >
        <LogOut size={24} />
        <span className="text-base font-semibold">Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;