// controllers/authController.js
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Ensure you have this installed
require("dotenv").config();

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
      university: university || null,
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
    const user = await User.findById(userID).populate(
      "materialUploaded",
      "title url uploadedAt"
    );

    res.json({
      status: "ok",
      user: {
        name: user.name,
        email: user.email,
        university: user.university,
        uploads: user.materialUploaded,
      },
    });
  } catch (error) {
    console.log(error);
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

const getAllUsers = async (req, res) => {
  try {
    const userId = req.user.id;

    const users = await User.find({ _id: { $ne: userId } });

    res.json(users);
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
};
