import React, { useState, useEffect } from "react";
import axios from "axios";
import Account from "../Components/Account";
import MyUploadsPage from "../Pages/UploadsPage";
import ConnectionsPage from "../Pages/ConnectionsPage";
import SidePanel from "../Components/SidePanel";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import SentRequestsPage from "../Pages/SentRequestsPage";
import IncomingRequestsPage from "../Pages/IncomingRequestsPage";

const DashboardPage = () => {
  useEffect(() => {
    const token = Cookies.get("userToken");
    if (!token) {
      window.location.href = "/";
    }
  }, []);

  const [activeTab, setActiveTab] = useState("");
  const [userDetails, setuserDetails] = useState({
    username: "",
    university: "",
    uploads: "",
    email: "",
    connections: "",
  });

  const userData = async () => {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/v1/user/getInfo`, {
      withCredentials: true,
    });

    const userDetails = res.data.user;

    setuserDetails({
      username: userDetails.name,
      university: userDetails.university,
      uploads: userDetails.uploads,
      email: userDetails.email,
      connections: userDetails.connections,
      avatar: userDetails.avatar,
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Home":
        return <Navigate to="/" />; // Redirect to home page
      case "Community":
        return <Navigate to="/community" />; // Redirect to home page
      case "Account":
        return <Account userDetails={userDetails} />;
      case "My Uploads":
        return <MyUploadsPage userDetails={userDetails} />;
      case "Connections":
        return <ConnectionsPage userDetails={userDetails} />;
      case "Incoming Requests":
        return <IncomingRequestsPage />;
      case "Requests Sent":
        return <SentRequestsPage />;
      default:
        return <Account userDetails={userDetails} />;
    }
  };

  useEffect(() => {
    userData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <SidePanel
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userDetails={userDetails}
      />
      <div className="flex-1 p-6 overflow-auto">{renderContent()}</div>
    </div>
  );
};

export default DashboardPage;