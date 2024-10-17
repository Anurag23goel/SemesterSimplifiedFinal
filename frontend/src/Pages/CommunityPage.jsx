import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const CommunityPage = () => {
  const token = Cookies.get("userToken");

  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    fetchAllUsers();
    if (!token) {
      window.location.href = "/";
    }
  }, []);

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/user/getAllUsers",
        {
          withCredentials: true,
        }
      );
      setAllUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleConnectionRequest = async (userId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/user/sendConnection?user=${userId}`,
        {},
        { withCredentials: true }
      );
      if (response.data.status === "ok") {
        toast.success("Connection Request Sent!");
        setAllUsers(allUsers.filter((user) => user._id !== userId));
      }
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-12 text-blue-600">
          Community Members
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {allUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
            >
              {/* User Profile Picture */}
              <img
                src={
                  user.profilePicture ||
                  "https://avatar.iran.liara.run/public/boy?username=Ash"
                }
                alt={user.fullName}
                className="w-24 h-24 rounded-full mb-4 border border-gray-200"
              />
              {/* User Name */}
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                {user.name}
              </h3>
              {/* User's University */}
              <p className="text-blue-500 mb-4">
                {user.university ? user.university : "No University"}
              </p>
              {/* Add Connection Button */}
              <button
                onClick={() => handleConnectionRequest(user._id)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
              >
                Add Connection
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
