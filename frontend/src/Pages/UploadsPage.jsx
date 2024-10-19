import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import UploadFileComponent from "../Components/UploadFileComponent";

const MyUploadsPage = ({ userDetails }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleView = (url) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      alert("URL not available for this file.");
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleEscKey = (event) => {
    if (event.key === "Escape") {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      // Add event listener when the modal is open
      window.addEventListener("keydown", handleEscKey);
    }

    // Cleanup event listener when the modal is closed or component unmounts
    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [isModalOpen]); // Only run when isModalOpen changes


  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex flex-row justify-between items-center">
        <div className="gap-y-0 mb-4 flex flex-col">
          <h2 className="text-2xl font-semibold">Your Uploads</h2>
          <p className="text-gray-500">
            Total Uploads: <span>{userDetails.uploads.length}</span>
          </p>
        </div>
        <div className="mr-7 text-2xl">
          <FaPlus
            className="text-blue-500 cursor-pointer"
            onClick={openModal}
          />
        </div>
      </div>

      {userDetails.uploads.length > 0 ? (
        <ul className="space-y-2">
          {userDetails.uploads.map((file) => (
            <li
              key={file._id}
              className="flex justify-between items-center p-4 border rounded hover:bg-gray-50 transition-colors"
            >
              <div>
                <span className="font-medium">{file.title}</span>
                <p className="text-sm text-gray-500">
                  {new Date(file.uploadedAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <button
                onClick={() => handleView(file.url)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                View
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No uploads found.</p>
      )}

      {/* Modal for UploadPage */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4 sm:p-6 lg:p-8">
          <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg w-full max-w-lg sm:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
            >
              &times;
            </button>
            <UploadFileComponent closeModal={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyUploadsPage;
