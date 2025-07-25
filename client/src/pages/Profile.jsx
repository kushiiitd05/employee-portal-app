// pages/Profile.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { name, id ,profileImage} = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E2A38] via-[#2C3E50] to-[#1E2A38] text-white p-8">
      <h1 className="text-4xl font-extrabold text-center mb-10 tracking-wide">
        👤 My Profile
      </h1>

      <div className="max-w-4xl mx-auto bg-[#2C3E50] p-8 rounded-xl shadow-xl flex flex-col md:flex-row items-center gap-8 transition-transform hover:scale-[1.01]">
        <img
          src={profileImage||`https://i.pravatar.cc/150?u=${id}`}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-white shadow-md"
        />
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold mb-1">Welcome, {name}</h2>
          <p className="text-gray-300 font-medium">ID: {id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto">
      
       <Link to="/dashboard/change-password">
  <div className="bg-[#2C3E50] hover:bg-[#3B4B5E] p-6 rounded-xl text-center shadow-md transition-all transform hover:scale-105 cursor-pointer">
    <h3 className="text-lg font-semibold mb-2">🔐 Change Password</h3>
    <p className="text-gray-300 text-sm">Secure your account</p>
  </div>
</Link>


        <Link to="/dashboard/change-picture">
          <div className="bg-[#2C3E50] hover:bg-[#3B4B5E] p-6 rounded-xl text-center shadow-md transition-all transform hover:scale-105 cursor-pointer">
            <h3 className="text-lg font-semibold mb-2">🖼️ Change Picture</h3>
            <p className="text-gray-300 text-sm">Update your profile photo</p>
          </div>
        </Link>

        <div className="bg-[#2C3E50] hover:bg-[#3B4B5E] p-6 rounded-xl text-center shadow-md transition-all transform hover:scale-105 cursor-pointer">
          <h3 className="text-lg font-semibold mb-2">📍 Change Address</h3>
          <p className="text-gray-300 text-sm">Update your contact details</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
// This component displays the user's profile information and provides options to change password, picture, and address.