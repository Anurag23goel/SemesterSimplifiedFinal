const mongoose = require("mongoose"); // Import mongoose
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    university: {
      type: String,
      default: "",
    }, // Required field for university
    materialUploaded: [
      { type: mongoose.Schema.Types.ObjectId, ref: "SubjectMaterial" },
    ],
    role: {
      type: String,
      enum: ["student", "admin"],
      required: true,
    },
    ratingsGiven: [
      {
        document: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SubjectMaterial",
        },
        rating: { type: Number, min: 1, max: 5 },
      },
    ], // New field to track ratings given by the user
    connections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    profilePicture: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Create a model from the schema
const User = mongoose.model("User", userSchema); // Best practice is to use singular model names

module.exports = User;
