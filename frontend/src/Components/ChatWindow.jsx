import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPaperPlane, FaUserCircle } from "react-icons/fa"; 

const ChatWindow = ({ currentChatPartner, loggedInUserId, socket }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const fetchPreviousMessages = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}api/v1/chat/private/${loggedInUserId}/${currentChatPartner._id}`,
        { withCredentials: true }
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching previous messages:", error);
    }
  };

  const handleIncomingMessage = (message) => {
    if (
      (message.senderId === currentChatPartner._id ||
        message.receiverId === currentChatPartner._id) &&
      message.senderId !== loggedInUserId
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
        socket.off("message", handleIncomingMessage);
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
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...messageData, timestamp: new Date() },
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex-1 p-6 flex flex-col bg-gray-50 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">
        Chat with {currentChatPartner.name}
      </h2>
      <div className="flex-1 overflow-y-auto border border-gray-300 p-4 rounded-lg bg-white mb-4 shadow-inner">
        {messages.map((object, index) => (
          <div
            key={index}
            className={`flex items-start mb-3 ${
              (object.senderId || object.sender._id) === loggedInUserId
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <FaUserCircle
              className="text-gray-400 mr-2"
              size={32}
            />
            <div
              className={`p-3 rounded-lg max-w-md shadow ${
                (object.senderId || object.sender._id) === loggedInUserId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <strong>
                {(object.senderId || object.sender._id) === loggedInUserId
                  ? "Me"
                  : currentChatPartner.name}
                :
              </strong>{" "}
              {object.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center mt-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
        <button
          onClick={sendMessage}
          className="ml-2 p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-200 flex items-center"
        >
          <FaPaperPlane className="mr-1" />
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
