import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
const LoginForm = ({ onClose, onLoginSuccess }) => {
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const navigate = useNavigate();

  const changeHandler = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevData) => {
      return {
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}api/v1/user/login`,
      {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      },
      { withCredentials: true }
    );

    if (res.data.status === "ok") {
      toast.success("Login Successfull");
      navigate("/");
    } else {
      toast.error(res.data.message);
    }
  };

  return (
    <form className="bg-[#F5F5F5] p-6 rounded-lg w-full max-w-xl mx-auto">
      <Toaster />
      <div className="text-left mb-6">
        <h1 className="text-3xl font-bold text-black">WELCOME</h1>
        <p className="mt-2 text-black text-lg">
          Please Login. Don’t have an account?{" "}
          <NavLink to="/register">
            <span className="text-blue-600">Sign up.</span>
          </NavLink>
        </p>
      </div>

      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-lg  text-black font-semibold"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          placeholder="johndoe@example.com"
          onChange={changeHandler}
          className="w-full p-2 mt-1 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-lg text-black font-semibold"
        >
          Password
        </label>
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            name="password"
            id="password"
            value={formData.password}
            placeholder="••••••••"
            onChange={changeHandler}
            className="w-full p-2 mt-1 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer">
            {showPass ? (
              <FaEyeSlash onClick={() => setShowPass((prev) => !prev)} />
            ) : (
              <FaEye onClick={() => setShowPass((prev) => !prev)} />
            )}
          </span>
        </div>
      </div>

      <div className="text-center text-black mb-4 font-bold">or</div>

      <div className="flex flex-col space-y-3 mb-6">
        <button
          onClick={(e) => {
            e.preventDefault();
          }}
          className="w-full p-2 rounded-lg bg-white text-gray-700 font-semibold border border-gray-300 flex items-center justify-center"
        >
          <img
            src="data:image/png;base64,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"
            alt="Google logo"
            className="h-5 w-5 mr-2"
          />
          Sign in with Google
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
          }}
          className="w-full p-2 rounded-lg bg-white text-gray-700 font-semibold border border-gray-300 flex items-center justify-center"
        >
          <img
            src="data:image/png;base64,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"
            alt="Apple logo"
            className="h-5 w-5 mr-2"
          />
          Sign in with GitHub
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="rememberMe"
            id="rememberMe"
            checked={formData.rememberMe}
            onChange={changeHandler}
            className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
          />
          <label
            htmlFor="rememberMe"
            className="ml-1 text-lg text-black font-semibold"
          >
            Remember me
          </label>
        </div>
        <NavLink to="/forgot-password" className="text-lg text-blue-600">
          Forgot password?
        </NavLink>
      </div>

      <button
        className="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        onClick={submitHandler}
      >
        Sign in to your account
      </button>
    </form>
  );
};

export default LoginForm;
