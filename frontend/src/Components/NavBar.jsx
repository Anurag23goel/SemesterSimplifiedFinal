import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // Import useNavigate
import logo from "../assets/mainlogo.jpeg";

const NavBar = () => {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const userID = localStorage.getItem("userId");
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    if (userToken) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userToken");
    setIsLogin(false); // Update the login state
    navigate("/"); // Redirect to home page after logging out
  };

  return (
    <nav className="bg-[#F5F5F5] shadow-xl justify-between flex flex-row items-center">
      <figure className="flex flex-row items-center my-3 ml-3 bg-contain">
      <img src={logo} alt="Logo" className="h-16 w-16 rounded-full ml-2" />
      <figcaption className="font-bold ml-1 text-2xl">Semester</figcaption>
      <figcaption className="font-bold ml-1 text-2xl">Simplified</figcaption>
      </figure>
      <ul className="flex flex-row items-center justify-end gap-5 text-xl py-4 px-4 w-full transition-all duration-500 ease-in-out">
        {isLogin && (
          <li className="hover:text-blue-500 transition-all duration-300 ease-in-out cursor-pointer">
            <NavLink to="/">Home</NavLink>
          </li>
        )}
        {isLogin && (
          <NavLink to={`/community`}>
            <li>Community</li>
          </NavLink>
        )}
        {/* <li className="hover:text-blue-500 transition-all duration-300 ease-in-out cursor-pointer">
          <NavLink to="/about">About Us</NavLink>
        </li>
        <li className="hover:text-blue-500 transition-all duration-300 ease-in-out cursor-pointer">
          <NavLink to="/support">Support Us</NavLink>
        </li> */}
        {isLogin ? (
          <>
            <li>
              <NavLink to={`/myProfile?user=${userID}`}>
                <button className="border border-black px-2 py-1 rounded-lg transition-transform duration-300 hover:scale-110 hover:bg-gray-200">
                  Profile
                </button>
              </NavLink>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="border border-black px-2 py-1 rounded-lg bg-red-500 text-white transition-transform duration-300 hover:scale-110 hover:bg-red-600"
              >
                Log Out
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/login">
                <button className="border border-black px-2 py-1 rounded-lg transition-transform duration-300 hover:scale-110 hover:bg-gray-200">
                  Log In
                </button>
              </NavLink>
            </li>
            <li>
              <NavLink to="/register">
                <button className="border border-black px-2 py-1 rounded-lg bg-slate-800 text-white transition-transform duration-300 hover:scale-110 hover:bg-slate-700">
                  Register
                </button>
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
