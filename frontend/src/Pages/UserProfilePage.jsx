import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

const UserProfilePage = () => {
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState(null); // Set initial state to null

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}api/v1/user/getRequestedUserInfo/${userId}`,
        { withCredentials: true }
      );
      setUserDetails(response.data.requestedUser); // Store fetched user details
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return ""; // Handle empty strings
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    fetchUserInfo();
  }, [userId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {userDetails ? (
        <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
          {/* User Info Section */}
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={
                userDetails.profilePicture ||
                "https://avatar.iran.liara.run/public/boy?username=Ash"
              }
              alt={`${userDetails.name}'s avatar`}
              className="w-24 h-24 rounded-full"
            />
            <div>
              <h2 className="text-2xl font-semibold">{userDetails.name}</h2>
              <p className="text-gray-500">{userDetails.email}</p>
              <p className="text-gray-500">
                {capitalizeFirstLetter(userDetails.role)} at{" "}
                {userDetails.university}
              </p>
              <p className="text-gray-500">
                Joined: {new Date(userDetails.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* User Connections Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Connections</h3>
            <ul className="list-disc list-inside">
              {userDetails.connections.length > 0 ? (
                userDetails.connections.map((connection, index) => (
                  <li key={index} className="text-gray-600">
                    <NavLink to={`/userProfile/${connection._id}`}>
                      {connection.name}
                    </NavLink>
                    {/* Adjust based on connection object structure */}
                  </li>
                ))
              ) : (
                <li className="text-gray-600">No connections available.</li>
              )}
            </ul>
          </div>

          {/* User Uploads Section */}
          <div>
            <h3 className="text-lg font-medium mb-2">Uploaded Materials</h3>
            {userDetails.materialUploaded.length > 0 ? (
              <ul className="list-disc list-inside">
                {userDetails.materialUploaded.map((upload, index) => (
                  <li
                    key={index}
                    className="text-gray-600"
                    onClick={() => window.open(upload.url)}
                  >
                    {upload.title || "Untitled"}{" "}
                    {/* Adjust based on upload object structure */}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No materials uploaded.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-gray-500">Loading user information...</div>
      )}
    </div>
  );
};

export default UserProfilePage;
