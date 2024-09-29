const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Update CORS options to allow requests from GitHub Pages
const corsOptions = {
  origin: 'https://evorxys.github.io', // Allow only the specific origin of your web app
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'], // Add more headers if needed
  credentials: true
};

// Apply CORS middleware to Express with specific options
app.use(cors(corsOptions));

// Set up Socket.IO with CORS
const io = new Server(server, {
  cors: corsOptions  // Same CORS options for Socket.IO
});

// Socket.IO connection event
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('sendMessage', (data) => {
    console.log('Received message:', data);
    socket.broadcast.emit('receiveMessage', data);  // Broadcast to all others
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Define port and start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
