// src/Signup.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5001/signup', form);
      // Redirect to login after successful signup
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const inputStyles = "w-full px-4 py-3 bg-[#2D3748] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500";

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1A202C] text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#2D3748] rounded-2xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-gray-400">Join our platform today!</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className={inputStyles} required />
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email Address" className={inputStyles} required />
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className={inputStyles} required />
          <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className={inputStyles} required />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-500">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
         <p className="text-sm text-center text-gray-400">
          Already have an account? <Link to="/login" className="font-medium text-blue-400 hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;