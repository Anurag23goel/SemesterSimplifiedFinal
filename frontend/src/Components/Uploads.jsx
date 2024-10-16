// src/components/Uploads.js
import React from "react";

const MyUploads = ({ userDetails }) => {
  const handleView = (url) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      alert("URL not available for this file.");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Your Uploads</h2>
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
    </div>
  );
};

export default MyUploads;
