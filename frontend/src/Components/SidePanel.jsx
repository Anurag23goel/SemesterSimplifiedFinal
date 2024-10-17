// src/components/SidePanel.js
import React from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const SidePanel = ({ activeTab, setActiveTab, userDetails }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    Cookies.remove("userToken"); // Remove the token cookie
    Cookies.remove("userid");
    navigate("/"); // Redirect to home page after logging out
  };

  const menuItems = [
    "Home",
    "Community",
    "Account",
    "My Uploads",
    "Connections",
    "Incoming Requests",
    "Requests Sent"
  ];

  return (
    <div className="w-64 bg-blue-800 text-white flex flex-col h-full">
      {/* User Info Section */}
      <div className="flex flex-col items-center p-6 border-b border-blue-700">
        <img
          src="https://avatar.iran.liara.run/public/boy?username=Ash"
          alt="Profile"
          className="w-24 h-24 rounded-full mb-4 object-cover"
        />
        <h3 className="text-xl font-semibold">{userDetails.username}</h3>
        <p className="text-sm">{userDetails.university}</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 mt-4">
        {menuItems.map((item) => (
          <button
            key={item}
            onClick={() => setActiveTab(item)}
            className={`w-full text-left px-6 py-3 hover:bg-blue-700 focus:outline-none ${
              activeTab === item ? "bg-blue-700" : ""
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Log Out Button */}
      <div className="p-6 border-t border-blue-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default SidePanel;
