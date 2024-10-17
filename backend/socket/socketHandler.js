const { PrivateMessage, GroupMessage } = require("../models/messagesModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (io) => {
  const users = {}; // Store user socket IDs

  // MIDDLEWARE
  io.use((socket, next) => {
    const token = socket.handshake.query.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return next(new Error("Authentication error"));
        }
        socket.userId = decoded.id;
        next();
      });
    } else {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    // console.log(`User(${socket.userId}) with socket ID ${socket.id} connected`);

    const userId = socket.userId;
    if (users[userId]) {
      users[userId].push(socket.id);
    } else {
      users[userId] = [socket.id];
    }
    console.log(`User ${userId} connected with socket ID ${socket.id}`);

    // Private messaging
    socket.on("private_message", async ({ senderId, receiverId, content }) => {
      try {
        const receiverSocketIds = users[receiverId] || []; // Ensure it’s an array
        console.log(receiverSocketIds.length);

        const messageData = {
          senderId,
          receiverId,
          content,
          timestamp: new Date(),
        };

        // Emit the message to the receiver's active sockets
        if (receiverSocketIds.length > 0) {
          receiverSocketIds.forEach((eachId) => {
            io.to(eachId).emit("message", messageData);
          });
        } else {
          console.log(`User ${receiverId} is not connected.`);
        }

        // Also emit the message back to the sender
        socket.emit("message", messageData);

        // Save the message to the database
        await PrivateMessage.create({
          sender: senderId,
          receiver: receiverId,
          content,
          delivered: true,
        });
      } catch (error) {
        console.error("Error sending private message:", error);
        socket.emit("error", { message: "Failed to send message." });
      }
    });

    // Join a room - for group chat
    socket.on("joinRoom", (room) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    });

    // Group messaging
    socket.on("room_message", async (data) => {
      const { room, message } = data;

      // Emit the message to the specified room
      io.to(room).emit("message", {
        sender: message.sender,
        text: message.text,
        timestamp: new Date(),
      });

      // Optionally, save the message to the database
      await GroupMessage.create({
        room,
        sender: message.sender,
        text: message.text,
        timestamp: new Date(),
      });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      for (const [userId, socketIds] of Object.entries(users)) {
        const index = socketIds.indexOf(socket.id);
        if (index !== -1) {
          socketIds.splice(index, 1);
          console.log(`Socket ${socket.id} disconnected from user ${userId}`);

          // If no more socket IDs, remove the user entry
          if (socketIds.length === 0) {
            delete users[userId];
            console.log(`User ${userId} completely disconnected`);
          }
          break;
        }
      }
    });
  });
};
