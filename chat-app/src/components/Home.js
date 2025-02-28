import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const joinChat = () => {
    if (username.trim()) {
      navigate('/chat', { state: { username } });
    }
  };

  const goToGroups = () => {
    if (username.trim()) {
      navigate('/groups', { state: { username } });
    }
  };

  return (
    <div className="home">
      <h1>Welcome to Real-time Chat</h1>
      <div className="join-chat-container">
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && joinChat()}
        />
        <button onClick={joinChat} className="enter-chat-btn">
          Join Public Chat
        </button>
        <button onClick={goToGroups} className="enter-chat-btn groups-btn">
          Join Groups
        </button>
      </div>
    </div>
  );
}

export default Home; 