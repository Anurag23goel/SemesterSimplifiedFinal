import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaLock, FaKey } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UniversitiesList } from "../assets/UniversitiesList";

const RegisterForm = () => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const navigate = useNavigate();

  const changeHandler = (event) => {
    const { name, type, checked, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!formData.terms) {
      toast.error("Please accept the Terms and Conditions.");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}api/v1/user/register`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );
      if (res.data.status === "ok") {
        toast.success("User Created Successfully!");
        console.log(res.data.user);
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          terms: false,
        });
        navigate("/login");
      } else {
        toast.error("Failed to create user.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during registration.");
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="bg-[#F5F5F5] p-6 rounded-lg w-full max-w-xl mx-auto space-y-6"
    >
      <div className="text-left mb-6">
        <h1 className="text-3xl font-bold text-black text-center">REGISTER</h1>
      </div>

      <div className="flex flex-col space-y-2">
        <label
          htmlFor="name"
          className=" text-lg text-black font-semibold flex items-center"
        >
          <IoPersonSharp className="mr-2" />
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          placeholder="John Doe"
          onChange={changeHandler}
          className="p-3 rounded-md bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label
          htmlFor="email"
          className=" text-lg text-black font-semibold flex items-center"
        >
          <IoIosMail className="mr-2" />
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          placeholder="johndoe@example.com"
          onChange={changeHandler}
          className="p-3 rounded-md bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="w-full max-w-sm mx-auto my-4">
        <select
          name="university"
          id="university"
          className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Select University" disabled>
            Select University
          </option>
          {UniversitiesList.map((university, index) => (
            <option key={index} value={university.fullName}>
              {university.fullName}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col space-y-2">
        <label
          htmlFor="password"
          className=" text-lg text-black font-semibold flex items-center"
        >
          <FaLock className="mr-2" />
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
            className="p-3 rounded-md bg-white text-black border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showPass ? (
            <FaEyeSlash
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPass(false)}
            />
          ) : (
            <FaEye
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPass(true)}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <label
          htmlFor="confirmPassword"
          className=" text-lg text-black font-semibold flex items-center"
        >
          <FaKey className="mr-2" />
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPass ? "text" : "password"}
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            placeholder="••••••••"
            onChange={changeHandler}
            className="p-3 rounded-md bg-white text-black border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showConfirmPass ? (
            <FaEyeSlash
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowConfirmPass(false)}
            />
          ) : (
            <FaEye
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowConfirmPass(true)}
            />
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="terms"
          name="terms"
          className="h-4 w-4 text-blue-600 bg-gray-700 border border-gray-600 rounded"
          checked={formData.terms}
          onChange={changeHandler}
        />
        <label htmlFor="terms" className="text-black text-sm">
          I agree to all statements in the Terms of Service
        </label>
      </div>

      <div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Register
        </button>
        <p className="text-center text-black">
          Already Have an Account?{" "}
          <NavLink to="/login">
            <span className="text-blue-600">Log In</span>
          </NavLink>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
