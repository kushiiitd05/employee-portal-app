// src/pages/Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Peer from 'simple-peer';
import socket from '../socket';
import ChatSidebar from '../components/Chat/ChatSidebar';
import ChatWindow from '../components/Chat/ChatWindow';
import { Phone, PhoneOff } from 'lucide-react';

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  
  // --- VIDEO CHAT STATE ---
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerName, setCallerName] = useState('');
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  const currentUser = useSelector((state) => state.user);

  useEffect(() => {
    // Get user's camera and microphone permissions
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
      setStream(currentStream);
      if (myVideo.current) {
        myVideo.current.srcObject = currentStream;
      }
    });

    // Listen for incoming calls
    socket.on('call-incoming', (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerName(data.name);
      setCallerSignal(data.signal);
    });

    socket.on('call-ended', () => {
      leaveCall();
    });
  }, []);

  const callUser = (id) => {
    if (!stream) {
      alert("Your camera is not ready yet. Please wait a moment and try again.");
      return;
    }
    setCallEnded(false);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', (data) => {
      socket.emit('call-user', {
        userToCall: id,
        signalData: data,
        from: currentUser.id,
        name: currentUser.name
      });
    });

    peer.on('stream', (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    socket.on('call-accepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    setCallEnded(false);
    setReceivingCall(false);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on('signal', (data) => {
      socket.emit('accept-call', { signal: data, to: caller });
    });
    peer.on('stream', (stream) => {
      if (userVideo.current) userVideo.current.srcObject = stream;
    });
    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    setReceivingCall(false);
    setCallAccepted(false);
    if(connectionRef.current) {
        const otherUserId = selectedUser?.employeeId || caller;
        if(otherUserId) socket.emit('end-call', { to: otherUserId });
    }
    if (connectionRef.current) connectionRef.current.destroy();
    if (stream) stream.getTracks().forEach(track => track.stop());
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
      setStream(currentStream);
      if (myVideo.current) myVideo.current.srcObject = currentStream;
    });
  };

  // ✅ This function is passed to ChatWindow to handle the call button click
  const handleInitiateCall = () => {
    if (selectedUser && selectedUser.employeeId) {
      callUser(selectedUser.employeeId);
    } else {
      console.error('Cannot call: No user selected.');
    }
  };

  return (
    <div className="flex h-[90vh] rounded-xl bg-[#1C2833] relative">
      <ChatSidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
      
      {(callAccepted && !callEnded) ? (
        <div className="w-3/4 p-4 flex flex-col items-center justify-center bg-black">
            <video playsInline ref={userVideo} autoPlay className="w-full h-full rounded-lg" />
            <video playsInline muted ref={myVideo} autoPlay className="absolute w-48 bottom-8 right-8 rounded-lg border-2 border-white" />
            <button onClick={leaveCall} className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-red-500 p-4 rounded-full hover:bg-red-600">
                <PhoneOff size={28} color="white" />
            </button>
        </div>
      ) : (
        // ✅ THE FIX: We now pass the 'handleInitiateCall' function as the onCall prop
        <ChatWindow selectedUser={selectedUser} onCall={handleInitiateCall} />
      )}

      {receivingCall && !callAccepted && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[#2D3748] p-6 rounded-xl shadow-lg flex items-center gap-6 animate-pulse">
            <p className="text-white text-lg font-semibold">{callerName} is calling...</p>
            <button onClick={answerCall} className="bg-green-500 p-3 rounded-full hover:bg-green-600">
                <Phone size={24} color="white" />
            </button>
        </div>
      )}
    </div>
  );
};

export default Chat;