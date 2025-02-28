import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

// Create a single socket instance
const socket = io.connect("http://localhost:3001");

function SystemMessage({ message }) {
  return (
    <div className="system-popup">
      <span>{message}</span>
    </div>
  );
}

function Chat() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [systemMessage, setSystemMessage] = useState(null);
  const messagesEndRef = useRef(null);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || !state?.roomName) {
      navigate('/');
      return;
    }

    socket.emit("join_room", {
      roomName: state.roomName,
      username: user.name,
      userImage: user.picture
    });

    // Listen for messages
    socket.on("receive_message", (data) => {
      if (data.username === "System") {
        // Show system message as popup
        setSystemMessage(data.message);
        setTimeout(() => setSystemMessage(null), 3000); // Hide after 3 seconds
      } else {
        setMessages(prev => [...prev, data]);
      }
    });

    // Listen for online users updates
    socket.on("users_in_room", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      // Cleanup: leave room and remove listeners
      socket.emit("leave_room", {
        roomName: state.roomName,
        username: user.name
      });
      socket.off("receive_message");
      socket.off("users_in_room");
    };
  }, [state, navigate, user]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e?.preventDefault(); // Prevent form submission if called from form

    if (message.trim()) {
      const messageData = {
        room: state.roomName,
        username: user.name,
        message: message.trim(),
        time: new Date().toLocaleTimeString()
      };

      console.log("Sending message:", messageData);
      socket.emit("send_message", messageData);
      setMessage('');
    }
  };

  const handleBack = () => {
    navigate('/rooms', { state: { username: user.name } });
  };

  return (
    <div className="chat-page">
      <div className="chat-container">
        {systemMessage && <SystemMessage message={systemMessage} />}
        <div className="chat-header">
          <button onClick={handleBack} className="back-button">
            ← Back to Rooms
          </button>
          <h2 className="room-title">Room: {state?.roomName}</h2>
          <div className="user-info">
            <img src={user?.picture} alt="" className="user-avatar" />
            <span className="user-name">{user?.name}</span>
          </div>
          <div className="online-users">
            <span>Online</span>
            <span className="online-count">{onlineUsers.length}</span>
          </div>
        </div>

        <div className="messages-container">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.username === user.name ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <span className="message-user">{msg.username}</span>
                <p>{msg.message}</p>
                <span className="message-time">{msg.time}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="message-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            autoComplete="off"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default Chat; 