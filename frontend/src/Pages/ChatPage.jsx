import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import Cookies from "js-cookie";
import ChatWindow from "../Components/ChatWindow";
import avatar from "../assets/icons8-video-chat-40.png"; // Placeholder avatar

const ChatPage = () => {
  const loggedInUserId = Cookies.get("userid");
  const [users, setUsers] = useState([]);
  const [currentChatPartner, setCurrentChatPartner] = useState(null);
  const [socket, setSocket] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userStatuses, setUserStatuses] = useState({}); // New state for user statuses

  const fetchUsers = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}api/v1/user/getConnections`,
      {
        withCredentials: true,
      }
    );
    setUsers(response.data);
  };

  useEffect(() => {
    const token = Cookies.get("userToken");
    if (!token) {
      window.location.href = "/";
    }
  }, []);

  
  
  useEffect(() => {
    const token = Cookies.get("userToken");
    if (loggedInUserId || token) {
      const newSocket = io("http://localhost:5000", {
        query: { token: token },
      });
      setSocket(newSocket);

      // Listen for user status updates
      newSocket.on("userStatusUpdate", (updatedUsers) => {
        setUserStatuses(updatedUsers);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [loggedInUserId]);

  // Fetch the list of users excluding the current user
  useEffect(() => {
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

  console.log(filteredUsers);
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* User List Section */}
      <div className="w-1/4 bg-white p-4 border-r border-gray-200 overflow-y-auto">
        <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200">
          {/* Search Field with Icon */}
          <form className="flex items-center w-full">
            <i className="fa fa-search text-gray-400"></i>
            <input
              type="text"
              placeholder="Search users..."
              className="ml-2 w-full border-none focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>

        {/* User List */}
        <div className="mt-4">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => selectUser(user._id, user.name)}
              className={`flex items-center p-3 rounded-lg cursor-pointer mb-2 transition-colors duration-200 ${
                currentChatPartner?._id === user._id
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <img
                src={user.profilePicture || avatar} // Placeholder avatar if user has no avatar
                alt={`${user.name}'s avatar`}
                className="w-12 h-12 rounded-full mr-3"
              />
              <div>
                <span className="block text-lg font-medium">{user.name}</span>
                <span className="block text-sm">
                  {userStatuses[user._id]?.socketIds.length > 0
                    ? "Online"
                    : "Offline"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window Section */}
      {currentChatPartner ? (
        <ChatWindow
          currentChatPartner={currentChatPartner}
          loggedInUserId={loggedInUserId}
          socket={socket}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center p-6 bg-white">
          <h2 className="text-xl font-semibold">Select a user to chat with</h2>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
