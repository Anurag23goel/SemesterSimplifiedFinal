import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import SubjectPage from "./Pages/SubjectPage";
import DashboardPage from "./Pages/DashboardPage";
import ChatPage from "./Pages/ChatPage";
import CommunityPage from "./Pages/CommunityPage";
import UserProfilePage from "./Pages/UserProfilePage";

function App() {
  
  // const token = Cookies.get("userToken");
  // if (token) {
  //   axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  // }

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/search" element={<SubjectPage />} />
        <Route path="/myProfile" element={<DashboardPage />} />
        <Route path="/userProfile/:userId" element={<UserProfilePage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/Chat" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
