const { PrivateMessage, GroupMessage } = require("../models/messagesModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (io) => {
  const users = {}; // Store user socket IDs and online status

  // MIDDLEWARE
  io.use((socket, next) => {
    const token = socket.handshake.query.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return next(new Error("Authentication error"));
        }
        socket.userId = decoded.id; // Store the user ID on the socket
        next();
      });
    } else {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;

    // Manage user socket IDs and set online status
    if (users[userId]) {
      users[userId].socketIds.push(socket.id);
    } else {
      users[userId] = {
        socketIds: [socket.id],
        online: true, // User is online
      };
    }

    // Emit user status update
    io.emit("userStatusUpdate", users);

    // Private messaging
    socket.on("private_message", async ({ senderId, receiverId, content }) => {
      try {
        const receiverSocketIds = users[receiverId]?.socketIds || []; // Ensure it’s an array

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
      if (users[userId]) {
        const socketIds = users[userId].socketIds;
        const index = socketIds.indexOf(socket.id);
        if (index !== -1) {
          socketIds.splice(index, 1);

          // If no more socket IDs, remove the user entry and set offline status
          if (socketIds.length === 0) {
            delete users[userId];
          }
        }

        // Emit user status update
        io.emit("userStatusUpdate", users);
      }
    });
  });
};
