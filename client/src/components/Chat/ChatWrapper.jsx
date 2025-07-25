// src/components/Chat/ChatWrapper.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import socket from '../../socket';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';

const ChatWrapper = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  
  // --- NATIVE WEBRTC LOGIC IS CORRECTLY PLACED IN THE PARENT ---
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callOffer, setCallOffer] = useState(null);
  const [callInProgress, setCallInProgress] = useState(false);

  const pc = useRef(null); // The Peer Connection
  const currentUser = useSelector((state) => state.user);

  const stunServers = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setLocalStream(stream);
    });

    const handleOffer = (payload) => setCallOffer(payload);
    const handleAnswer = (payload) => pc.current?.setRemoteDescription(new RTCSessionDescription(payload.answer));
    const handleIceCandidate = (payload) => pc.current?.addIceCandidate(new RTCIceCandidate(payload.candidate));
    const handleCallEnded = () => leaveCall(false);
    const handleCallDeclined = ({ declinerName }) => {
        alert(`${declinerName} declined your call.`);
        if (pc.current) leaveCall(false);
    };

    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);
    socket.on('call-ended', handleCallEnded);
    socket.on('call-declined', handleCallDeclined);

    return () => { // Cleanup listeners on unmount
        socket.off('offer', handleOffer);
        socket.off('answer', handleAnswer);
        socket.off('ice-candidate', handleIceCandidate);
        socket.off('call-ended', handleCallEnded);
        socket.off('call-declined', handleCallDeclined);
    }
  }, []);
  
  const createPeerConnection = (otherUserId) => {
    const peerConnection = new RTCPeerConnection(stunServers);
    peerConnection.ontrack = (event) => setRemoteStream(event.streams[0]);
    if (localStream) {
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
    }
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { to: otherUserId, candidate: event.candidate, from: currentUser.id });
      }
    };
    return peerConnection;
  }
  
  const callUser = async (calleeId) => {
    if (!localStream) return alert("Camera not ready.");
    pc.current = createPeerConnection(calleeId);
    const offer = await pc.current.createOffer();
    await pc.current.setLocalDescription(offer);
    socket.emit('offer', { callerId: currentUser.id, callerName: currentUser.name, calleeId, offer });
    setCallInProgress(true);
  };
  
  const answerCall = async () => {
    if (!callOffer || !localStream) return;
    setCallInProgress(true);
    pc.current = createPeerConnection(callOffer.callerId);
    await pc.current.setRemoteDescription(new RTCSessionDescription(callOffer.offer));
    const answer = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answer);
    socket.emit('answer', { callerId: callOffer.callerId, answer });
    setCallOffer(null);
  };

  const declineCall = () => {
    if (callOffer) {
        socket.emit('decline-call', {
            callerId: callOffer.callerId,
            declinerName: currentUser.name
        });
    }
    setCallOffer(null);
  };
  
  const leaveCall = (notify = true) => {
    if (notify) {
        const otherUserId = selectedUser?.employeeId || callOffer?.callerId;
        if (otherUserId) socket.emit('end-call', { to: otherUserId });
    }
    if (pc.current) {
      pc.current.close();
      pc.current = null;
    }
    setCallInProgress(false);
    setRemoteStream(null);
    setCallOffer(null);
  };

  return (
    <div className="flex h-[90vh] bg-[#1E2A38] text-white rounded-xl shadow-xl overflow-hidden">
      <ChatSidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
      <ChatWindow
        selectedUser={selectedUser}
        localStream={localStream}
        remoteStream={remoteStream}
        callInProgress={callInProgress}
        callOffer={callOffer}
        onCallUser={callUser}
        onAnswerCall={answerCall}
        onLeaveCall={leaveCall}
        onDeclineCall={declineCall}
      />
    </div>
  );
};

export default ChatWrapper;