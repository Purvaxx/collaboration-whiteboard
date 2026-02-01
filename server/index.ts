
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { ClientToServerEvents, ServerToClientEvents, RoomState, Element } from './types';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

// In-memory database of board states
const rooms: Record<string, RoomState> = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join-room', (roomId, user) => {
    socket.join(roomId);
    
    // Initialize room if it doesn't exist
    if (!rooms[roomId]) {
      rooms[roomId] = {
        elements: [],
        users: {}
      };
    }

    // Add user to state
    rooms[roomId].users[socket.id] = { ...user, cursor: { x: 0, y: 0 } };

    // Send existing state to the new user
    socket.emit('init-state', rooms[roomId].elements);
    
    // Notify others
    socket.to(roomId).emit('user-joined', socket.id, user.name);
    console.log(`User ${user.name} joined room: ${roomId}`);
  });

  socket.on('elements-broadcast', (roomId, elements) => {
    if (rooms[roomId]) {
      rooms[roomId].elements = elements; // Persistent sync
      socket.to(roomId).emit('element-update', elements);
    }
  });

  socket.on('cursor-broadcast', (roomId, cursor) => {
    if (rooms[roomId] && rooms[roomId].users[socket.id]) {
      rooms[roomId].users[socket.id].cursor = cursor;
      socket.to(roomId).emit('cursor-update', socket.id, cursor);
    }
  });

  // Dedicated Sticky Note Handlers
  socket.on('sticky-note-create', (roomId, element) => {
    if (rooms[roomId]) {
      rooms[roomId].elements.push(element);
      io.in(roomId).emit('element-update', rooms[roomId].elements);
    }
  });

  socket.on('sticky-note-move', (roomId, noteId, position) => {
    if (rooms[roomId]) {
      rooms[roomId].elements = rooms[roomId].elements.map(el => 
        el.id === noteId ? { ...el, x: position.x, y: position.y } : el
      );
      socket.to(roomId).emit('element-update', rooms[roomId].elements);
    }
  });

  socket.on('sticky-note-update-text', (roomId, noteId, text) => {
    if (rooms[roomId]) {
      rooms[roomId].elements = rooms[roomId].elements.map(el => 
        el.id === noteId ? { ...el, text } : el
      );
      socket.to(roomId).emit('element-update', rooms[roomId].elements);
    }
  });

  socket.on('disconnecting', () => {
    socket.rooms.forEach(roomId => {
      if (rooms[roomId]) {
        delete rooms[roomId].users[socket.id];
        socket.to(roomId).emit('user-left', socket.id);
      }
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Brain is online! Running on http://localhost:${PORT}`);
});
