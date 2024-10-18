import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // Import useNavigate
import Cookies from "js-cookie";

const NavBar = () => {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const userID = Cookies.get("userid")

  useEffect(() => {
    const userToken = Cookies.get("userToken");
    if (userToken) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("userToken"); // Remove the token cookie
    Cookies.remove("userid")
    setIsLogin(false); // Update the login state
    navigate("/"); // Redirect to home page after logging out
  };

  return (
    <nav className="bg-[#F5F5F5] shadow-xl">
      <ul className="flex flex-row items-center justify-end gap-5 text-xl py-4 px-4 w-full transition-all duration-500 ease-in-out">
        <li className="hover:text-blue-500 transition-all duration-300 ease-in-out cursor-pointer">
          <NavLink to="/">Home</NavLink>
        </li>
        {
          isLogin && (<NavLink to={`/community`}><li>Community</li></NavLink>)
        }
        <li className="hover:text-blue-500 transition-all duration-300 ease-in-out cursor-pointer">
          <NavLink to="/about">About Us</NavLink>
        </li>
        <li className="hover:text-blue-500 transition-all duration-300 ease-in-out cursor-pointer">
          <NavLink to="/support">Support Us</NavLink>
        </li>
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
