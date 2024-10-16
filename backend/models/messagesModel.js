const mongoose = require("mongoose");

const privateMessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
  },
  delivered: {
    type: Boolean,
    default: false,
  },
  timestamp: { type: Date, default: Date.now },
});

const groupMessageSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  delivered: {
    type: Boolean,
    default: false,
  },
});

const GroupMessage = mongoose.model("GroupMessage", groupMessageSchema);
const PrivateMessage = mongoose.model("PrivateMessage", privateMessageSchema);

module.exports = { GroupMessage, PrivateMessage };
