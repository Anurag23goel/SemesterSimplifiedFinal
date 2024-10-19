import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const ConnectionsPage = ({ userDetails }) => {
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    // fetchConnections();
    setConnections(userDetails.connections);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Your Connections
        </h2>
        {connections.length === 0 ? (
          <p className="text-gray-600 text-center">No connections yet.</p>
        ) : (
          <ul className="space-y-4">
            {connections.map((conn) => (
              <li
                key={conn._id}
                className="flex items-center bg-gray-50 p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
              >
                <NavLink to={`/userProfile/${conn._id}`}>
                  <img
                    src={
                      conn.profilePicture ||
                      "https://avatar.iran.liara.run/public/boy?username=Ash"
                    }
                    alt={conn.name}
                    className="w-16 h-16 rounded-full border-2 border-blue-500 mr-4"
                  />
                </NavLink>
                <div className="flex-grow">
                  <NavLink to={`/userProfile/${conn._id}`}>
                    <p className="text-lg font-semibold text-gray-800">
                      {conn.name}
                    </p>
                  </NavLink>
                  <p className="text-sm text-gray-500">
                    {conn.university || "University not specified"}
                  </p>
                </div>
                <NavLink to="/community/chat" className="ml-auto">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300">
                    Chat
                  </button>
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConnectionsPage;
