// src/pages/ChangePicture.jsx

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateProfileImage } from '../redux/UserSlice'; // ✅ Correct path

const ChangePicture = () => {
  const [preview, setPreview] = useState(null);
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setPreview(base64Data);

        // ✅ Update Topbar image
        const topbarImg = document.querySelector('#topbar-profile-img');
        if (topbarImg) topbarImg.setAttribute('src', base64Data);

        // ✅ Save to Redux
        dispatch(updateProfileImage(base64Data));

        // ✅ Optional localStorage for persistence
        localStorage.setItem('profileImage', base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E2A38] to-[#2C3E50] text-white px-6 py-12 flex flex-col items-center">
      <div className="bg-[#2C3E50] p-8 rounded-xl shadow-xl flex flex-col items-center transition-transform hover:scale-[1.01]">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 rounded-full border-4 border-white shadow-md mb-6"
          />
        ) : (
          <div className="w-32 h-32 rounded-full border-4 border-gray-400 mb-6 flex items-center justify-center text-gray-500 text-sm">
            No Image
          </div>
        )}

        <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-[#1E2A38] px-6 py-3 rounded-md text-sm font-semibold transition-all">
          Upload New Photo
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <p className="text-gray-400 mt-4 text-sm text-center max-w-sm">
          This is just a live preview. Your picture will persist only on this device unless synced with backend storage later.
        </p>
      </div>
    </div>
  );
};

export default ChangePicture;
