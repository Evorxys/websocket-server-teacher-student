const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Update CORS options to allow requests from both teacher and student apps
const corsOptions = {
  origin: ['https://evorxys.github.io', 'https://your-teacher-app-url.com'], // Add both the student and teacher apps URLs
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
};

// Apply CORS middleware to Express
app.use(cors(corsOptions));

// Set up Socket.IO with CORS
const io = new Server(server, {
  cors: corsOptions
});

// Socket.IO connection event
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handling messages from teacher
  socket.on('teacherMessage', (data) => {
    console.log('Teacher sent message:', data);
    // Broadcast to students
    socket.broadcast.emit('receiveMessage', { from: 'Teacher', message: data });
  });

  // Handling messages from student
  socket.on('studentMessage', (data) => {
    console.log('Student sent message:', data);
    // Broadcast to teachers
    socket.broadcast.emit('receiveMessage', { from: 'Student', message: data });
  });

  // Handling disconnections
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Define port and start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
