import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:3001");

function Rooms() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!state?.username) {
      navigate('/');
      return;
    }

    socket.emit("request_rooms");

    socket.on("rooms_list", (roomsList) => {
      console.log("Received rooms:", roomsList);
      setRooms(roomsList);
    });

    socket.on("room_created", (roomName) => {
      console.log("Room created:", roomName);
      // Redirect to chat room after creation
      navigate('/chat', { 
        state: { 
          username: state.username,
          roomName: roomName
        } 
      });
    });

    socket.on("room_error", (message) => {
      console.log("Error:", message);
      setError(message);
    });

    return () => {
      socket.off("rooms_list");
      socket.off("room_created");
      socket.off("room_error");
    };
  }, [navigate, state?.username]);

  const handleCreateRoom = () => {
    if (newRoomName.trim().length < 3) {
      setError("Room name must be at least 3 characters");
      return;
    }

    console.log("Attempting to create room:", newRoomName);
    socket.emit("create_room", {
      roomName: newRoomName.trim(),
      creator: state?.username
    });
    setNewRoomName('');
  };

  const handleJoinRoom = (roomName) => {
    navigate('/chat', { 
      state: { 
        username: state.username,
        roomName: roomName
      } 
    });
  };

  if (!state?.username) {
    navigate('/');
    return null;
  }

  return (
    <div className="rooms-page">
      <div className="rooms-container">
        <div className="rooms-header">
          <h2>Welcome to Chat Rooms</h2>
          <p className="username-display">Logged in as: {state.username}</p>
          
          <div className="create-room-container">
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Enter room name"
              className="room-input"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
            />
            <button onClick={handleCreateRoom} className="create-room-btn">
              Create Room
            </button>
          </div>
          
          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="rooms-grid-container">
          <h3>Available Rooms</h3>
          {rooms.length === 0 ? (
            <div className="no-rooms-message">
              <p>No rooms available</p>
              <p>Create your first room to get started!</p>
            </div>
          ) : (
            <div className="rooms-grid">
              {rooms.map((room, index) => (
                <div key={index} className="room-card">
                  <div className="room-card-content">
                    <h4>{room}</h4>
                    <button onClick={() => handleJoinRoom(room)}>
                      Join Room
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Rooms; 