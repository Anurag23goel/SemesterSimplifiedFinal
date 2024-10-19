import axios from "axios";
import React, { useEffect, useState } from "react";

const SentRequestsPage = () => {
  const [outgoingRequests, setOutgoingRequests] = useState([]);

  const fetchOutgoingRequests = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}api/v1/user/getAllRequests`,
        { withCredentials: true }
      );
      setOutgoingRequests(res.data.outgoingReq);
      console.log(res.data.outgoingReq);
    } catch (error) {
      console.error("Error fetching outgoing requests:", error);
    }
  };

  useEffect(() => {
    fetchOutgoingRequests();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Sent Requests</h2>
      {outgoingRequests.length === 0 ? (
        <p className="text-gray-500">You haven't sent any requests yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {outgoingRequests.map((obj) => (
            <div
              key={obj._id}
              className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
            >
              <div className="flex items-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt={obj.receiverId.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-xl font-semibold">
                    {obj.receiverId.name}
                  </h3>
                  <p className="text-gray-500">
                    {obj.receiverId.university || "No University"}
                  </p>
                </div>
              </div>
              <div>
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                  Cancel Request
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SentRequestsPage;
