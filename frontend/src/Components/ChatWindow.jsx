import React, { useEffect, useState } from "react";
import axios from "axios";

const ChatWindow = ({ currentChatPartner, loggedInUserId, socket }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const fetchPreviousMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/chat/private/${loggedInUserId}/${currentChatPartner._id}`,
        { withCredentials: true }
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching previous messages:", error);
    }
  };

  const handleIncomingMessage = (message) => {
    // Check if the message is relevant to the current chat
    if (
      (message.senderId === currentChatPartner._id || 
      message.receiverId === currentChatPartner._id) && 
      message.senderId !== loggedInUserId // Prevent adding your own message
    ) {
      setMessages((prevMessages) => [...prevMessages, message]);
    }
  };

  useEffect(() => {
    if (currentChatPartner) {
      fetchPreviousMessages();
    }

    if (socket) {
      socket.on("message", handleIncomingMessage);
    }

    return () => {
      if (socket) {
        socket.off("message", handleIncomingMessage); // Use handleIncomingMessage for cleanup
      }
    };
  }, [currentChatPartner, loggedInUserId, socket]);

  const sendMessage = () => {
    if (newMessage && socket) {
      const messageData = {
        senderId: loggedInUserId,
        receiverId: currentChatPartner._id,
        content: newMessage,
      };
      socket.emit("private_message", messageData);
      // Add the message to the chat for immediate feedback
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...messageData, timestamp: new Date() },
      ]);
      setNewMessage(""); // Clear the input field
    }
  };

  return (
    <div className="flex-1 p-4 flex flex-col">
      <h2 className="text-xl font-semibold mb-4">
        Chat with {currentChatPartner.name}
      </h2>
      <div className="flex-1 overflow-y-auto border border-gray-300 p-4 rounded-lg mb-4">
        {messages.map((object, index) => (
          <div
            key={index}
            className={`mb-2 ${
              (object.senderId || object.sender._id) === loggedInUserId
                ? "text-right"
                : "text-left"
            }`}
          >
            <strong
              className={
                (object.senderId || object.sender._id) === loggedInUserId
                  ? "text-blue-600"
                  : "text-black"
              }
            >
              {(object.senderId || object.sender._id) === loggedInUserId
                ? "Me: "
                : `${currentChatPartner.name}: `}
            </strong>
            <span
              className={
                (object.senderId || object.sender._id) === loggedInUserId
                  ? "text-blue-600"
                  : "text-gray-800"
              }
            >
              {object.content}
            </span>
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 p-2 rounded-lg"
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
