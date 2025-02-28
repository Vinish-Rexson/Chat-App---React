import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:3001");

function Groups() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!state?.username) {
      navigate('/');
      return;
    }

    socket.on("groups_list", (groupsList) => {
      console.log("Received groups:", groupsList); // Debug log
      setGroups(groupsList);
    });

    socket.on("group_error", (errorMessage) => {
      setError(errorMessage);
      setIsCreating(false);
    });

    socket.on("join_group_success", (groupName) => {
      navigate('/chat', { 
        state: { 
          username: state.username, 
          groupName: groupName 
        } 
      });
    });

    // Request initial groups list
    socket.emit("request_groups");

    return () => {
      socket.off("groups_list");
      socket.off("group_error");
      socket.off("join_group_success");
    };
  }, [state?.username, navigate]);

  const createGroup = () => {
    if (isCreating) return;
    
    if (newGroupName.trim().length < 3) {
      setError('Group name must be at least 3 characters long');
      return;
    }

    setIsCreating(true);
    setError('');
    
    socket.emit("create_group", {
      groupName: newGroupName.trim(),
      creator: state.username
    });

    // Reset form
    setNewGroupName('');
  };

  const joinGroup = (groupName) => {
    socket.emit("join_group", {
      groupName,
      username: state.username
    });
  };

  return (
    <div className="groups-page">
      <div className="groups-container">
        <div className="groups-header">
          <h2>Welcome, {state?.username}</h2>
          <div className="create-group">
            <input
              type="text"
              placeholder="Enter new group name"
              value={newGroupName}
              onChange={(e) => {
                setNewGroupName(e.target.value);
                setError('');
              }}
              onKeyPress={(e) => e.key === 'Enter' && createGroup()}
            />
            <button onClick={createGroup}>Create Group</button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </div>
        <div className="groups-list">
          <h3>Available Groups</h3>
          {groups.length === 0 ? (
            <p className="no-groups">No groups available. Create one!</p>
          ) : (
            <div className="groups-grid">
              {groups.map((group, index) => (
                <div key={index} className="group-card">
                  <h4>{group}</h4>
                  <button onClick={() => joinGroup(group)}>Join Group</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Groups; 