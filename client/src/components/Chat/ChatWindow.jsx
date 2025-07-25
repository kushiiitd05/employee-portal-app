// src/components/Chat/ChatWindow.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import socket from '../../socket';
import axios from 'axios';
import MessageBubble from './MessageBubble';
import { Video, Phone, PhoneOff, Mic, MicOff, VideoOff, X } from 'lucide-react';


const ChatWindow = ({
  selectedUser,
  localStream,
  remoteStream,
  callInProgress,
  callOffer,
  onCallUser,
  onAnswerCall,
  onLeaveCall,
  onDeclineCall,
}) => {
  const [message, setMessage] = React.useState('');
  const [chat, setChat] = React.useState([]);
  const currentUser = useSelector((state) => state.user);
  
  const [micMuted, setMicMuted] = React.useState(false);
  const [cameraOff, setCameraOff] = React.useState(false);

  // A "ref" is like a direct connection to a specific UI element.
  const myVideo = React.useRef();
  const userVideo = React.useRef();
  
  // This 'useEffect' hook watches for your localStream.
  // When it's ready, it attaches it to your small preview video element.
  React.useEffect(() => {
    if (myVideo.current && localStream) {
      myVideo.current.srcObject = localStream;
    }
  }, [localStream, callInProgress]);
  

  // This 'useEffect' does the same for the other person's video.
  React.useEffect(() => {
    if (userVideo.current && remoteStream) {
      userVideo.current.srcObject = remoteStream;
    }
  }, [remoteStream, callInProgress]);

  // Fetch text chat history and set up listener for incoming messages
  React.useEffect(() => {
    if (selectedUser) {
      axios.get(`http://localhost:5001/chat/get-messages/${currentUser.id}/${selectedUser.employeeId}`)
        .then(res => setChat(res.data.messages || []));
      
      const handleReceiveMessage = (msg) => {
        if (msg.senderId === selectedUser.employeeId) {
          setChat(prev => [...prev, msg]);
        }
      };
      socket.on('receive-message', handleReceiveMessage);
      return () => socket.off('receive-message', handleReceiveMessage);
    }
  }, [selectedUser, currentUser.id]);
  
  // FIXED AND COMPLETE FUNCTION FOR SENDING TEXT MESSAGES
  const handleSend = () => {
    if (!message.trim() || !selectedUser) return;
    const msgData = {
      senderId: currentUser.id,
      receiverId: selectedUser.employeeId,
      message,
    };
    // 1. Send the message to the server for the other user and to save in the DB
    socket.emit('send-message', msgData);
    // 2. Immediately update your own UI for a fast experience
    setChat(prev => [...prev, { ...msgData, created_at: new Date().toISOString() }]);
    // 3. Clear the input field
    setMessage('');
  };

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks()[0].enabled = !localStream.getAudioTracks()[0].enabled;
      setMicMuted(!localStream.getAudioTracks()[0].enabled);
    }
  };

  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks()[0].enabled = !localStream.getVideoTracks()[0].enabled;
      setCameraOff(!localStream.getVideoTracks()[0].enabled);
    }
  };

  // --- UI RENDERING LOGIC ---
  if (callInProgress) {
    return (
      <div className="w-3/4 p-4 flex flex-col items-center justify-center bg-black relative">
        <video ref={userVideo} playsInline autoPlay className="w-full h-full rounded-lg" />
        <video ref={myVideo} playsInline autoPlay muted className="absolute w-48 bottom-24 right-8 rounded-lg border-2 border-white" />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
          <button onClick={toggleMic} className={`p-4 rounded-full ${micMuted ? 'bg-red-500' : 'bg-gray-700'}`}>{micMuted ? <MicOff color="white" /> : <Mic color="white" />}</button>
          <button onClick={toggleCamera} className={`p-4 rounded-full ${cameraOff ? 'bg-red-500' : 'bg-gray-700'}`}>{cameraOff ? <VideoOff color="white" /> : <Video color="white" />}</button>
          <button onClick={() => onLeaveCall(true)} className="p-4 rounded-full bg-red-500"><PhoneOff color="white" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-3/4 p-4 flex flex-col justify-between bg-[#1C2833] text-white relative">
      <div className="flex justify-between items-center mb-2">
        <div><h2 className="text-xl font-semibold mb-1">💬 Chat with {selectedUser?.name || 'Teammate'}</h2></div>
        {selectedUser && <button onClick={() => onCallUser(selectedUser.employeeId)} className="p-2 bg-green-500 rounded-full hover:bg-green-600"><Video color="white" /></button>}
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-2 bg-[#2C5282] p-3 rounded-md">
        {chat.map((msg, i) => (<MessageBubble key={i} message={msg.message} isOwn={msg.senderId === currentUser.id} timestamp={msg.created_at} />))}
      </div>
      
      {selectedUser && (
        <div className="mt-4 flex">
          <input 
            className="flex-1 p-2 rounded-l bg-[#34495E] text-white border-none outline-none" 
            placeholder="Type your message..." 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r" onClick={handleSend}>Send</button>
        </div>
      )}
      
      {callOffer && !callInProgress && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[#2D3748] p-6 rounded-xl shadow-lg flex items-center gap-4">
            <p className="text-white text-lg font-semibold">{callOffer.callerName} is calling...</p>
            <button onClick={onAnswerCall} className="bg-green-500 p-3 rounded-full hover:bg-green-600"><Phone color="white" /></button>
            <button onClick={onDeclineCall} className="bg-red-500 p-3 rounded-full hover:bg-red-600"><X size={24} color="white" /></button>
        </div>
      )}
    </div>
  );
};


export default ChatWindow;

