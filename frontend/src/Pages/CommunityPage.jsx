import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { NavLink } from "react-router-dom";

const CommunityPage = () => {
  const token = Cookies.get("userToken");

  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Only filter users dynamically for display, don't modify allUsers
  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}api/v1/user/getAllUsers`,
        {
          withCredentials: true,
        }
      );
      setAllUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return ""; // Handle empty strings
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    fetchAllUsers();
    if (!token) {
      window.location.href = "/";
    }
  }, []);

  const handleConnectionRequest = async (userId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}api/v1/user/sendConnection?user=${userId}`,
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

        <div className="mb-6">
          <input
            type="search"
            name="searchUser"
            id="searchUser"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
              >
                <NavLink
                  to={`/userProfile/${user._id}`}
                  className="flex flex-col items-center"
                >
                  <img
                    src={
                      user.profilePicture ||
                      "https://avatar.iran.liara.run/public/boy?username=Ash"
                    }
                    alt={user.fullName}
                    className="w-24 h-24 rounded-full mb-4 border border-gray-200"
                  />
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    {user.name}
                  </h3>
                </NavLink>

                {/* Role and University */}
                <div className="flex items-center justify-center mb-4">
                  <p className="text-blue-500">
                    {capitalizeFirstLetter(user.role)}
                  </p>
                  <span className="mx-2">at</span>
                  <p className="text-blue-500">
                    {user.university ? user.university : "No University"}
                  </p>
                </div>

                <button
                  onClick={() => handleConnectionRequest(user._id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                >
                  Add Connection
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">
              No users found with this search term.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
