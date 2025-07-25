// components/Topbar.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Topbar = () => {
  const { name, id, profileImage } = useSelector((state) => state.user);

  return (
    <div className="bg-[#2C3E50] text-white flex justify-between items-center px-6 py-3 shadow-md">
      <marquee behavior="scroll" direction="left" className="text-sm font-medium">
        👋 Welcome, {name} : {id}
      </marquee>

      <div className="flex items-center gap-4">
        <Link to="/dashboard/profile">
          <img
            id="topbar-profile-img"
            src={profileImage || `https://i.pravatar.cc/150?u=${id}`}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
          />
        </Link>
      </div>
    </div>
  );
};

export default Topbar;
