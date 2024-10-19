import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateProfilePic = ({closeModal}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Handle file selection
  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // Set a preview URL for the image
    const filePreview = URL.createObjectURL(file);
    setPreview(filePreview);
  };

  // Handle file upload
  const uploadHandler = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select a file to upload.");
      return;
    }

    // Create FormData to send the file
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setIsUploading(true);

      // Assuming the endpoint to upload is '/api/v1/user/uploadAvatar'
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}api/v1/user/addAvatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // If you're using cookies for auth
        }
      );

      if (res.status === 200) {
        toast.success("Profile picture updated successfully!");
        closeModal();
      } else {
        toast.error("Failed to upload profile picture.");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("An error occurred while uploading.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">
        Update Profile Picture
      </h2>

      <form onSubmit={uploadHandler} className="space-y-4">
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={fileChangeHandler}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="Preview"
              className="h-40 w-40 object-cover rounded-full mx-auto"
            />
          </div>
        )}

        <div className="text-center">
          <button
            type="submit"
            disabled={isUploading}
            className={`bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg ${
              isUploading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            } transition-colors duration-200`}
          >
            {isUploading ? "Uploading..." : "Update Avatar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfilePic;
