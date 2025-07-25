// 3️⃣ MessageBubble.jsx
import React from 'react';

const MessageBubble = ({ message, isOwn, timestamp }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs p-3 rounded-lg shadow text-sm whitespace-pre-wrap break-words ${
          isOwn
            ? 'bg-green-600 text-white rounded-br-none'
            : 'bg-gray-600 text-white rounded-bl-none'
        }`}
      >
        <p>{message}</p>
        <p className="text-xs text-right text-gray-300 mt-1">
          {new Date(timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;