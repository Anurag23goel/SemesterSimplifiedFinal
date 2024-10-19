import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import UpdateProfilePic from "./UpdateProfilePic"; // Import the component
import { IoClose } from "react-icons/io5";

const SidePanel = ({ activeTab, setActiveTab, userDetails }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

  const handleLogout = () => {
    Cookies.remove("userToken");
    Cookies.remove("userid");
    navigate("/");
  };

  const menuItems = [
    "Home",
    "Community",
    "Account",
    "My Uploads",
    "Connections",
    "Incoming Requests",
    "Requests Sent",
  ];

  const handleEscKey = (event) => {
    if (event.key === "Escape") {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      // Add event listener when the modal is open
      window.addEventListener("keydown", handleEscKey);
    }

    // Cleanup event listener when the modal is closed or component unmounts
    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [isModalOpen]); // Only run when isModalOpen changes

  return (
    <div className="w-64 bg-blue-800 text-white flex flex-col h-full">
      {/* User Info Section */}
      <div className="flex flex-col items-center p-6 border-b border-blue-700">
        <img
          src={
            userDetails.avatar ||
            "https://avatar.iran.liara.run/public/boy?username=Ash"
          }
          alt="Profile"
          className="w-24 h-24 rounded-full mb-4 object-cover cursor-pointer"
          onClick={() => setIsModalOpen(true)} // Open modal on image click
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

      {/* Update Profile Pic Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
            {" "}
            {/* Add relative positioning */}
            <button
              className="absolute text-2xl top-4 right-2 text-gray-500 hover:text-gray-800" // Change to absolute positioning
              onClick={() => setIsModalOpen(false)}
            >
              <IoClose />
            </button>
            <UpdateProfilePic closeModal={() => setIsModalOpen(false)} />{" "}
          </div>
        </div>
      )}
    </div>
  );
};

export default SidePanel;
