// src/components/PopupMessage.jsx
import React, { useEffect } from 'react';

const PopupMessage = ({ message, type = 'success', onClose, autoClose = true }) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  return (
    <div
      onClick={onClose}
      className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-md shadow-md cursor-pointer transition-transform animate-bounce
        ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
      `}
    >
      {message}
    </div>
  );
};

export default PopupMessage;
