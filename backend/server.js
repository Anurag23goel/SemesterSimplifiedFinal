// server.js
const express = require("express");
const cors = require("cors");
const routes = require("./routes/index.js");
const dbConnection = require("./connections/connection.js");
require("dotenv").config();
const cookieParser = require("cookie-parser");
dbConnection();


// Import Socket.IO and HTTP
const { Server } = require("socket.io");
const http = require("http");

// Import socketHandler
const socketHandler = require("./socket/socketHandler");

// Initialize Express
const app = express();

// Middleware
app.use(
  cors({
    origin: true, // Specify your frontend URL if necessary
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Define Routes
app.use("/api/v1", routes);

// Default Route
app.get("/", (req, res) => {
  res.send(`<h1>This is default route</h1>`);
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: true, // Replace with your frontend URL if needed
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Use socket handler
socketHandler(io);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Database Connection
});
