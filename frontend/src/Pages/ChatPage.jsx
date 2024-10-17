import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import Cookies from "js-cookie";
import ChatWindow from "../Components/ChatWindow"; // Import the new ChatWindow component
import avatar from "../assets/icons8-video-chat-40.png";

const ChatPage = () => {
  useEffect(() => {
    const token = Cookies.get("userToken");
    if (!token) {
      window.location.href = "/";
    }
  }, []);

  const loggedInUserId = Cookies.get("userid");
  const [users, setUsers] = useState([]);
  const [currentChatPartner, setCurrentChatPartner] = useState(null);
  const [socket, setSocket] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = Cookies.get("userToken");
    if (loggedInUserId || token) {
      const newSocket = io("http://localhost:5000", { query: { token } });
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [loggedInUserId]);

  // Fetch the list of users excluding the current user
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get(
        "http://localhost:5000/api/v1/user/getConnections",
        {
          withCredentials: true,
        }
      );
      setUsers(response.data);
    };

    if (loggedInUserId) {
      fetchUsers();
    }
  }, [loggedInUserId]);

  const selectUser = (userId, userName) => {
    setCurrentChatPartner({ _id: userId, name: userName });
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* User List */}
      <div className="w-1/4 border-r border-gray-300 p-4 bg-white">
        <h2 className="text-xl font-semibold mb-4">Connections</h2>

        {/* Search Field */}
        <input
          type="text"
          placeholder="Search users..."
          className="mb-4 w-full p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => selectUser(user._id, user.name)}
            className={`cursor-pointer p-2 rounded flex items-center ${
              currentChatPartner?._id === user._id
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
          >
            {/* Avatar Image */}
            <img
              src={user.avatar || avatar} // Use user's avatar or a placeholder
              alt={`${user.name}'s avatar`}
              className="w-10 h-10 rounded-full mr-2"
            />
            <span>{user.name}</span>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      {currentChatPartner ? (
        <ChatWindow
          currentChatPartner={currentChatPartner}
          loggedInUserId={loggedInUserId}
          socket={socket}
        />
      ) : (
        <div className="flex-1 p-4 flex items-center justify-center">
          <h2 className="text-xl font-semibold">Select a user to chat with</h2>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
