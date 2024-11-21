// server.js
const express = require("express");
const cors = require("cors");
const routes = require("./routes/index.js");
const dbConnection = require("./connections/connection.js");
const cloudinary = require("./connections/cloudinary.js");
require("dotenv").config();
const cookieParser = require("cookie-parser");

// Import Socket.IO and HTTP
const app = express();
const { Server } = require("socket.io");
const http = require("http");

// Import socketHandler
const socketHandler = require("./socket/socketHandler");

// CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.1.10:3000",
  "https://semester-simplified-front.vercel.app",
  "https://semester-simplified-backend.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.cookie("yourCookieName", "cookieValue", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
  next();
});

const fileUpload = require("express-fileupload");
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

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
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Use socket handler
socketHandler(io);

// Start Server
const PORT = process.env.PORT || 8000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  dbConnection();
  cloudinary.connect();
});
