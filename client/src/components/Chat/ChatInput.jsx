import React, { useState } from 'react';
import socket from '../../socket';

const ChatInput = ({ sender, recipient }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      socket.emit('chat message', { sender, recipient, text });
      setText('');
    }
  };

  return (
    <div className="flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 p-2 rounded-md text-black"
      />
      <button onClick={handleSend} className="bg-green-600 px-4 py-2 rounded-md">Send</button>
    </div>
  );
};


export default ChatInput;
