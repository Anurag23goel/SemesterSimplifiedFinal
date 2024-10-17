const mongoose = require("mongoose");

const subjectDocs = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["assignments", "notes", "books", "papers"],
    default: "notes",
  },
  url: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  university: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 },
    },
  ], // Array of ratings from users
  averageRating: {
    type: Number,
    default: 0,
  }, // Calculated average rating
});

const SubjectMaterial = mongoose.model("SubjectMaterial", subjectDocs);

module.exports = SubjectMaterial;
