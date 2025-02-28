const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Store rooms and their users
let rooms = [];
let roomUsers = new Map(); // Store users for each room

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Send rooms list when requested
  socket.on("request_rooms", () => {
    socket.emit("rooms_list", rooms);
  });

  // Create a room
  socket.on("create_room", (data) => {
    const { roomName, creator } = data;
    if (!rooms.includes(roomName)) {
      rooms.push(roomName);
      roomUsers.set(roomName, new Map()); // Initialize with a new Map for each room
      io.emit("rooms_list", rooms);
      socket.emit("room_created", roomName);
    } else {
      socket.emit("room_error", "Room already exists");
    }
  });

  // Handle joining room
  socket.on("join_room", ({ roomName, username, userImage }) => {
    // Leave previous room if any
    if (socket.currentRoom) {
      handleLeaveRoom(socket, socket.currentRoom, socket.username);
    }

    socket.join(roomName);
    socket.username = username;
    socket.userImage = userImage;
    socket.currentRoom = roomName;

    // Initialize room's user Map if it doesn't exist
    if (!roomUsers.has(roomName)) {
      roomUsers.set(roomName, new Map());
    }
    
    // Add user to room's user Map
    roomUsers.get(roomName).set(username, { userImage });

    // Send updated users list to all clients in the room
    const usersInRoom = Array.from(roomUsers.get(roomName)).map(([name, data]) => ({
      name,
      image: data.userImage
    }));
    
    io.to(roomName).emit("users_in_room", usersInRoom);

    // Notify room of new user
    io.to(roomName).emit("receive_message", {
      username: "System",
      message: `${username} has joined the room`,
      time: new Date().toLocaleTimeString()
    });
  });

  // Handle sending messages
  socket.on("send_message", (data) => {
    console.log("Message received on server:", data);
    io.to(data.room).emit("receive_message", {
      room: data.room,
      username: data.username,
      message: data.message,
      time: data.time
    });
  });

  // Helper function to handle leaving room
  const handleLeaveRoom = (socket, roomName, username) => {
    socket.leave(roomName);
    
    if (roomUsers.has(roomName)) {
      roomUsers.get(roomName).delete(username);
      
      // Send updated users list
      const usersInRoom = Array.from(roomUsers.get(roomName));
      io.to(roomName).emit("users_in_room", usersInRoom);
      
      // Notify room that user has left
      io.to(roomName).emit("receive_message", {
        username: "System",
        message: `${username} has left the room`,
        time: new Date().toLocaleTimeString()
      });
    }
  };

  // Handle leaving room
  socket.on("leave_room", ({ roomName, username }) => {
    handleLeaveRoom(socket, roomName, username);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
    if (socket.currentRoom && socket.username) {
      handleLeaveRoom(socket, socket.currentRoom, socket.username);
    }
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING ON PORT 3001");
}); 