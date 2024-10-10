import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import SubjectPage from "./Pages/SubjectPage";
import UploadPage from "./Pages/UploadPage";
import ProfilePage from "./Pages/ProfilePage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/search" element={<SubjectPage />}/>
        <Route path="/upload" element={<UploadPage />}/>
        <Route path="/profile" element={<ProfilePage />}/>
      </Routes>
    </div>
  );
}

export default App;
