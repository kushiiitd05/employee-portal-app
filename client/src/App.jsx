import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import DashboardLayout from './pages/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import Attendance from './pages/Attendance';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import ChangePicture from './pages/ChangePicture';
import ChangePassword from './pages/ChangePassword';

import ChatWrapper from './components/Chat/ChatWrapper'; // ✅ Import this

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* ✅ Protected Routes under Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="home" element={<DashboardHome />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="chat" element={<ChatWrapper />} /> {/* ✅ FIXED HERE */}
        <Route path="profile" element={<Profile />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="change-picture" element={<ChangePicture />} />
      </Route>

      {/* fallback route */}
      <Route path="*" element={<Signup />} />
    </Routes>
  );
}

export default App;
