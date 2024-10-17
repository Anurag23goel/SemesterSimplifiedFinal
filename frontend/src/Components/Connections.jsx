// src/components/Connections.js
import axios from "axios";
import React, { useEffect, useState } from "react";

const Connections = () => {

  const [connections, setConnections] = useState([]);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/user/getConnections",
        {
          withCredentials: true,
        }
      );

      const connectionsList = res.data || []; // Get connections from response

      console.log(connectionsList);

      // Set connections state
      setConnections((prev) => [...prev, ...connectionsList]);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Your Connections</h2>
      <ul className="space-y-2">
        {connections.map((conn) => (
          <li key={conn.id} className="flex items-center p-4 border rounded">
            <img
              src="https://avatar.iran.liara.run/public/boy?username=Ash"
              alt={conn.name}
              className="w-10 h-10 rounded-full mr-4"
            />
            <div>
              <p className="font-medium">{conn.name}</p>
              <p className="text-sm text-gray-500">{conn.university}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Connections;
