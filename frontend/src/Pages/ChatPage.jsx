import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import Cookies from "js-cookie";
import ChatWindow from "../Components/ChatWindow"; // Import the new ChatWindow component

const ChatPage = () => {
  const loggedInUserId = Cookies.get("userid");
  const [users, setUsers] = useState([]);
  const [currentChatPartner, setCurrentChatPartner] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = Cookies.get("userToken");
    if (loggedInUserId || token) {
      const newSocket = io("http://localhost:5000", { query: { token } });
      setSocket(newSocket);

      // Emit user join event after socket is initialized
      // newSocket.emit("join", loggedInUserId);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [loggedInUserId]);

  // Fetch the list of users excluding the current user
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get("http://localhost:5000/api/v1/user/getUsers", {
        withCredentials: true,
      });
      setUsers(response.data);
    };

    if (loggedInUserId) {
      fetchUsers();
    }
  }, [loggedInUserId]);

  const selectUser = (userId, userName) => {
    // Set the current chat partner when a user is clicked
    setCurrentChatPartner({ _id: userId, name: userName });
  };

  return (
    <div className="flex h-screen">
      {/* User List */}
      <div className="w-1/4 border-r border-gray-300 p-4">
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        {users.map((object) => (
          <div
            key={object._id}
            onClick={() => selectUser(object._id, object.name)}
            className="cursor-pointer p-2 hover:bg-gray-200 rounded"
          >
            {object.name}
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
