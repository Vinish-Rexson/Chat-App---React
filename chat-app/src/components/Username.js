import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Username() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }
    navigate('/rooms', { state: { username } });
  };

  return (
    <div className="username-container">
      <div className="username-box">
        <h1>Welcome to Chat App</h1>
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError('');
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
          {error && <div className="error-message">{error}</div>}
        </div>
        <button onClick={handleSubmit} className="submit-btn">
          Continue
        </button>
      </div>
    </div>
  );
}

export default Username; 