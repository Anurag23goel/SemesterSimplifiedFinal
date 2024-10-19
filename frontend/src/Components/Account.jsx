import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UniversitiesList } from "../assets/UniversitiesList"; // Make sure the path is correct

const Account = ({ userDetails }) => {
  const [showPass, setShowPass] = useState(false);
  const [confirmPass, setConfirmPass] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: userDetails?.name || "",
    email: userDetails?.email || "",
    university: userDetails?.university || "",
    password: "",
    confirmPass: "",
  });

  // Handle input changes
  const changeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const updateHandler = async (e) => {
    e.preventDefault();

    // Validate passwords if they are being updated
    if (formData.password || formData.confirmPass) {
      if (formData.password !== formData.confirmPass) {
        toast.error("Passwords do not match");
        return;
      }
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        university: formData.university,
      };

      // Include password only if it's provided
      if (formData.password) {
        payload.password = formData.password;
      }

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}api/v1/user/updateUser`,
        payload,
        {
          withCredentials: true,
        }
      );

      // console.log("User updated successfully:", res.data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user info:", error);
      toast.error(error.response?.data?.message || "Error updating profile!");
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    if (userDetails) {
      setFormData((prevData) => ({
        ...prevData,
        name: userDetails.username || "",
        email: userDetails.email || "",
        university: userDetails.university || "",
      }));
    }
  }, [userDetails]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Update Profile Details
        </h2>

        {
          <form onSubmit={updateHandler} className="space-y-4">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={changeHandler}
                value={formData.name}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={changeHandler}
                value={formData.email}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type={showPass ? "text" : "password"}
                id="password"
                name="password"
                onChange={changeHandler}
                value={formData.password}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPass((prev) => !prev)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-sm leading-5 pt-5"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <label
                htmlFor="confirmPass"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type={confirmPass ? "text" : "password"}
                id="confirmPass"
                name="confirmPass"
                onChange={changeHandler}
                value={formData.confirmPass}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                onClick={() => setConfirmPass((prev) => !prev)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-sm leading-5 pt-5"
              >
                {confirmPass ? "Hide" : "Show"}
              </button>
            </div>

            {/* University Field (Dropdown) */}
            <div>
              <label
                htmlFor="university"
                className="block text-sm font-medium text-gray-700"
              >
                University
              </label>
              <select
                name="university"
                id="university"
                value={formData.university}
                onChange={changeHandler}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>
                  Select your university
                </option>
                {UniversitiesList.map((university, index) => (
                  <option key={index} value={university.fullName}>
                    {university.fullName}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  updateLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {updateLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        }
      </div>
    </div>
  );
};

export default Account;
