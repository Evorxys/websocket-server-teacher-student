const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('sendMessage', (data) => {
    io.emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
