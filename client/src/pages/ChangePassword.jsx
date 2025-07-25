// src/pages/ChangePassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import PopupMessage from '../components/PopupMessage';

const ChangePassword = () => {
  const { id } = useSelector((state) => state.user);
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showPopup = (msg, type = 'success') => {
    setPopup({ show: true, message: msg, type });
  };

  const handleSubmit = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      return showPopup('❌ All fields are required', 'error');
    }
    if (form.newPassword !== form.confirmPassword) {
      return showPopup('❌ New passwords do not match', 'error');
    }

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5001/account/change-password', {
        userId: id,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });
      showPopup(res.data.message, 'success');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showPopup(err.response?.data?.message || '❌ Server error', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ✅ This is the updated className for the input fields
  const inputStyles = "mb-4 w-full p-3 rounded-md bg-[#1E2A38] text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors";

  return (
    <div className="min-h-screen bg-[#1E2A38] flex items-center justify-center">
      <div className="w-full max-w-md bg-[#2C3E50] p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">🔐 Change Password</h2>

        <input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          value={form.currentPassword}
          onChange={handleChange}
          className={inputStyles}
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
          className={inputStyles}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className={inputStyles}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 text-white rounded-md transition duration-300 ${
            loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Updating...' : 'Change Password'}
        </button>

        {popup.show && (
          <PopupMessage
            message={popup.message}
            type={popup.type}
            onClose={() => setPopup({ ...popup, show: false })}
          />
        )}
      </div>
    </div>
  );
};

export default ChangePassword;