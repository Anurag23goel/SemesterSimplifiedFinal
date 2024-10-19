// controllers/authController.js
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Ensure you have this installed
require("dotenv").config();
const ConnectionRequest = require("../models/connectionRequestModel");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const registerUser = async (req, res) => {
  const { name, email, password, university, role } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Added 'await'

    // Create a new user
    const user = await User.create({
      name,
      email,
      password,
      university: university || "",
      role: role || "student", // Optionally set a default role
    });

    // Optionally, create a JWT token upon registration
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET, // Ensure this is set in your environment variables
      { expiresIn: "1h" }
    );

    res.status(201).json({
      status: "ok",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error while registering:", error);
    res.status(500).json({
      message: "Error while registering.",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User does not exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (user) {
      const payload = {
        email: user.email,
        role: user.role,
        id: user._id,
      };

      // console.log("payload of jwt token:", payload);

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: rememberMe ? "7d" : "1h", // Token expiry based on "Remember Me"
      });

      const options = {
        expires: new Date(
          Date.now() + (rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000)
        ), // 7 days or 1 hour
      };

      res.cookie("userToken", token, options);
      res.cookie("userid", user.id, options);
      res.status(200).json({ status: "ok", message: "Login successful." });
    } else {
      res.status(401).json({ message: "Incorrect password." });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "An error occurred during login." });
  }
};

const getUserInfo = async (req, res) => {
  const userID = req.user.id;

  try {
    const myselfUser = await User.findById(userID)
      .populate("materialUploaded", "title url uploadedAt")
      .populate("connections", "name university profilePicture"); // Populate connections with name and university

    res.json({
      status: "ok",
      user: {
        name: myselfUser.name,
        email: myselfUser.email,
        university: myselfUser.university,
        uploads: myselfUser.materialUploaded,
        connections: myselfUser.connections,
        avatar: myselfUser.profilePicture
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
};

const getRequestedUserInfo = async (req, res) => {
  const reqUserId = req.params.id;

  // console.log(reqUserId);

  try {
    const requestedUser = await User.findById(reqUserId)
      .populate("connections", "name university")
      .populate("materialUploaded");

    res.json({
      status: "ok",
      requestedUser: requestedUser,
    });
  } catch (error) {
    res.json({
      status: "error",
      message: "Internal server error.",
    });
  }
};

const updateUser = async (req, res) => {
  const userID = req.user.id;
  const { name, email, password, university } = req.body;

  try {
    // Find the user by ID first
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the password only if it's provided
    let hashedPass = user.password; // Keep the existing password if none is provided
    if (password) {
      hashedPass = await bcrypt.hash(password, 10);
    }

    // Update the user's information
    const updatedUser = await User.findByIdAndUpdate(
      userID,
      {
        name,
        email,
        password: hashedPass,
        university,
      },
      { new: true } // Return the updated user object
    );

    // Send a success response with the updated user (exclude password)
    res.json({
      message: "User updated successfully",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        university: updatedUser.university,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllConnections = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findOne({ _id: userId }).populate("connections");

    const userConnections = user.connections || [];
    // console.log(userConnections);

    res.json(userConnections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch the current user's connections
    const currentUser = await User.findById(userId).select("connections");
    const myConnections = currentUser.connections.map((conn) =>
      conn.toString()
    );

    // Find all pending connection requests sent by the current user
    const connectionReq = await ConnectionRequest.find({
      senderId: userId,
      status: "pending",
    });

    // Get an array of all receiver IDs from the connection requests
    const usersAlreadyRequested = connectionReq.map((singleReq) =>
      singleReq.receiverId.toString()
    );

    // Combine connections and already requested users into one list to exclude
    const usersToExclude = [...myConnections, ...usersAlreadyRequested, userId];

    // Find all users except the ones in the usersToExclude list
    const users = await User.find({
      _id: { $nin: usersToExclude }, // Exclude connections, users with pending requests, and the current user
    }).select("-password -ratingsGiven");

    // Send response with the list of users
    res.json(users);
  } catch (error) {
    console.error("Error fetching users: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllRequests = async (req, res) => {
  const userId = req.user.id;

  try {
    const incomingReq = await ConnectionRequest.find({
      receiverId: userId,
      status: "pending",
    }).populate("senderId", "name university");

    const outgoingReq = await ConnectionRequest.find({
      senderId: userId,
      status: "pending",
    }).populate("receiverId", "name university");

    res.json({ incomingReq, outgoingReq });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const sendConnectionRequest = async (req, res) => {
  const receiver = req.query.user;
  const sender = req.user.id;

  try {
    const newConnectionReq = await ConnectionRequest.create({
      senderId: sender,
      receiverId: receiver,
      status: "pending",
    });

    if (newConnectionReq) {
      res.json({
        status: "ok",
        message: "Connection request sent successfully",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const acceptConnectionRequest = async (req, res) => {
  const receiver = req.user.id; // Current logged-in user (receiver)
  const reqId = req.query.requestId; // ID of the request

  try {
    // Check if the request exists and is still pending
    const request = await ConnectionRequest.findOne({
      _id: reqId,
      receiverId: receiver,
      status: "pending",
    });

    if (!request) {
      return res
        .status(404)
        .json({ message: "Request not found or already handled" });
    }

    // Update the status of the connection request to "accepted"
    await ConnectionRequest.findByIdAndUpdate(reqId, {
      status: "accepted",
    });

    // Add the sender to the receiver's connections
    await User.findByIdAndUpdate(
      receiver,
      { $push: { connections: request.senderId } },
      { new: true }
    );

    // Add the receiver to the sender's connections
    await User.findByIdAndUpdate(
      request.senderId,
      { $push: { connections: receiver } },
      { new: true }
    );

    // Return success response
    res.json({
      status: "ok",
      message: "Connection request accepted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const declineConnectionRequest = async (req, res) => {
  const reqId = req.query.requestId;
  try {
    await ConnectionRequest.findByIdAndDelete(reqId);
    res.json({ status: "ok", message: "Connection request declined" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const uploadAvatar = async (req, res) => {
  const file = req.files.file;

  try {
    // Construct the file path with correct extension
    const path = `./tempUploads/${Date.now()}.${file.name.split(".").pop()}`;

    // Move the file to the path
    await file.mv(path);

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(path, {
      public_id: req.user.id, // Assuming req.user.id is available
      tags: "profile",
    });

    // Remove file from local uploads folder
    fs.unlinkSync(path, (err) => {
      if (err) {
        console.error("Failed to delete local file:", err);
      }
    });

    // Update user in the database with the new profile picture URL
    const user = await User.findByIdAndUpdate(
      req.user.id, // Assuming the user ID is in req.user
      { profilePicture: result.secure_url },
      { new: true } // Return the updated user
    );

    // Send response
    res.status(200).json({
      message: "Avatar uploaded successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserInfo,
  updateUser,
  getAllUsers,
  getAllConnections,
  sendConnectionRequest,
  acceptConnectionRequest,
  getAllRequests,
  getRequestedUserInfo,
  declineConnectionRequest,
  uploadAvatar,
};
