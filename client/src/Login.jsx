// src/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { setUser } from './redux/UserSlice';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5001/login', { email, password });
      const token = res.data.token;
      const decoded = jwtDecode(token);
      const userPayload = { ...decoded, token };
      dispatch(setUser(userPayload));
      localStorage.setItem('user', JSON.stringify(userPayload));
      navigate('/dashboard/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full px-4 py-3 bg-[#2D3748] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500";

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1A202C] text-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-[#2D3748] rounded-2xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-gray-400">Sign in to continue to your dashboard</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className={inputStyles} required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className={inputStyles} required />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-500">
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>
        <p className="text-sm text-center text-gray-400">
          Don't have an account? <Link to="/signup" className="font-medium text-blue-400 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;