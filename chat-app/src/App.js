import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Username from './components/Username';
import Rooms from './components/Rooms';
import Chat from './components/Chat';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Username />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 