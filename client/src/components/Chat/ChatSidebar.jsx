// export default ChatSidebar;
// src/components/Chat/ChatSidebar.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import socket from '../../socket';

const ChatSidebar = ({ selectedUser, setSelectedUser }) => {
  const [users, setUsers] = useState([]);
  const [online, setOnline] = useState([]);
  const currentUserId = useSelector((state) => state.user.id);

  useEffect(() => {
    axios.get('http://localhost:5001/employees')
      .then(res => {
        const filtered = res.data.filter(u => u.employeeId !== currentUserId);
        setUsers(filtered);
      })
      .catch(err => console.error('Error fetching users:', err));
  }, [currentUserId]);

  // This hook handles all real-time socket events for the sidebar
  useEffect(() => {
    if (currentUserId) {
      socket.emit('join', currentUserId); // Tell the server we are online
    }

    // Listen for the 'online-users' event pushed from the server
    const handleOnlineUsers = (onlineUserIds) => {
      setOnline(onlineUserIds);
    };
    socket.on('online-users', handleOnlineUsers);// this was missing in the original code

    // Clean up the listener when the component is no longer visible
    return () => {
      socket.off('online-users', handleOnlineUsers);
    };
  }, [currentUserId]);

  return (
    <div className="w-72 bg-[#1F2A40] text-white p-4 space-y-4 overflow-y-auto border-r border-gray-700">
      <h2 className="text-xl font-semibold px-2">💬 Chats</h2>
      {users.map((user) => (
        <div
          key={user.employeeId}
          onClick={() => setSelectedUser(user)}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all hover:bg-[#2D3A52] ${selectedUser?.employeeId === user.employeeId ? 'bg-[#2D3A52]' : ''}`}
        >
          <span className={`h-3 w-3 rounded-full ${online.includes(user.employeeId) ? 'bg-green-400' : 'bg-gray-400'}`}></span>
          <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt="avatar" className="w-8 h-8 rounded-full" />
          <p className="text-sm truncate">{user.name}</p>
        </div>
      ))}
    </div>
  );
};

export default ChatSidebar;