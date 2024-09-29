const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',  // Allow all origins (change in production)
        methods: ['GET', 'POST'],
    },
});

app.use(cors());

// Listen for incoming connections from the client
io.on('connection', (socket) => {
    console.log('A user connected: ', socket.id);

    // Listen for messages from the teacher
    socket.on('teacher-message', (data) => {
        console.log('Received message from Teacher:', data.message);
        // Broadcast the message to all connected students
        socket.broadcast.emit('receiveMessage', { message: data.message });
    });

    // Listen for messages from the student
    socket.on('sendMessage', (data) => {  // Updated to 'sendMessage'
        console.log('Received message from Student:', data);
        // Broadcast the message to all connected teachers
        socket.broadcast.emit('receiveMessage', data);  // Keep 'receiveMessage' for consistency with the student app
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected: ', socket.id);
    });
});

// Start the server
const PORT = process.env.PORT || 4000; // You can change the port number if needed
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
