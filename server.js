const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Set up Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: '*',  // Allow all origins
    methods: ['GET', 'POST']  // Allowed HTTP methods
  }
});

// Apply CORS middleware to Express
app.use(cors());

// Socket.IO connection event
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);  // Log when a user connects

  // Listen for 'sendMessage' event from clients
  socket.on('sendMessage', (data) => {
    console.log('Received message:', data);

    // Broadcast the message to all other clients, excluding the sender
    socket.broadcast.emit('receiveMessage', data);  // Excludes the sender

    // If you want to send the message to everyone, including the sender:
    // io.emit('receiveMessage', data);
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);  // Log when a user disconnects
  });
});

// Define port and start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
