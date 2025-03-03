const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"],
  },
});

let users = {}; // Store connected users

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins a chat
  socket.on("join_chat", (userId) => {
    users[userId] = socket.id;
    console.log(`User ${userId} connected with socket ID ${socket.id}`);
  });

  // Send message
  socket.on("send_message", (data) => {
    const { receiverId, message } = data;
    const receiverSocketId = users[receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive_message", data);
    }
  });

  // Disconnect user
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
