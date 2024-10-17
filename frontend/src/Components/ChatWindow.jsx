import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPaperPlane, FaUserCircle } from 'react-icons/fa'; // Import icons from react-icons

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
    <div className="flex-1 p-4 flex flex-col bg-gray-50 shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">
        Chat with {currentChatPartner.name}
      </h2>
      <div className="flex-1 overflow-y-auto border border-gray-300 p-4 rounded-lg bg-white mb-4 shadow-inner">
        {messages.map((object, index) => (
          <div key={index} className={`flex items-start mb-2 ${ (object.senderId || object.sender._id) === loggedInUserId ? 'justify-end' : 'justify-start'}`}>
            {(object.senderId || object.sender._id) === loggedInUserId ? (
              <div className="flex items-center">
                <FaUserCircle className="text-gray-400 mr-2" size={32} />
                <div className="bg-blue-500 text-white p-2 rounded-lg max-w-xs">
                  <strong>Me:</strong> {object.content}
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <FaUserCircle className="text-gray-400 mr-2" size={32} />
                <div className="bg-gray-200 p-2 rounded-lg max-w-xs">
                  <strong>{currentChatPartner.name}:</strong> {object.content}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center">
        <FaUserCircle className="text-gray-400 mr-2" size={24} />
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
        <button
          onClick={sendMessage}
          className="ml-2 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-200 flex items-center"
        >
          <FaPaperPlane className="mr-1" />
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
