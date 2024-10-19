import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify"; // Assuming you're using react-toastify for notifications

const IncomingRequestsPage = () => {
  
  const [incomingRequests, setIncomingRequests] = useState([]);

  const fetchIncomingRequests = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}api/v1/user/getAllRequests`,
        { withCredentials: true }
      );
      setIncomingRequests(res.data.incomingReq);
    } catch (error) {
      console.error("Error fetching incoming requests:", error);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/user/acceptRequest?requestId=${requestId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.status) {
        toast.success("Request accepted!");
        setIncomingRequests((prevRequests) =>
          prevRequests.filter((req) => req._id !== requestId)
        );
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}api/v1/user/declineRequest?requestId=${requestId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.status) {
        toast.success("Request declined!");
        setIncomingRequests((prevRequests) =>
          prevRequests.filter((req) => req._id !== requestId)
        );
      }
    } catch (error) {
      console.error("Error declining request:", error);
    }
  };

  useEffect(() => {
    fetchIncomingRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Incoming Requests</h1>

      {incomingRequests.length === 0 ? (
        <p className="text-center text-gray-500">No incoming requests.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {incomingRequests.map((req) => (
            <div
              key={req._id}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center"
            >
              {/* User's Avatar */}
              <img
                src={
                  req.senderProfilePicture || "https://via.placeholder.com/100"
                }
                alt={req.senderName}
                className="w-24 h-24 rounded-full mb-4"
              />

              {/* Sender's Name */}
              <h2 className="text-xl font-semibold mb-2">
                {req.senderId.name}
              </h2>

              {/* University or Additional Info */}
              <p className="text-gray-500 mb-4">
                {req.senderId.university || "No University Info"}
              </p>

              {/* Accept and Decline Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => handleAcceptRequest(req._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDeclineRequest(req._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncomingRequestsPage;
