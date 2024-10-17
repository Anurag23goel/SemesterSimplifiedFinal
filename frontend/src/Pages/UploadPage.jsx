import React, { useEffect, useState } from "react";
import { storage } from "../firebase"; // Adjust the path as necessary
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { data } from "../assets/Suggestions"; // Import your degree and subjects data
import { UniversitiesList } from "../assets/UniversitiesList";
import Cookies from "js-cookie";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = Cookies.get("userToken");
    if (!token) {
      window.location.href = "/";
    }
  }, []);

  // Form data state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course: "", // The selected course
    subject: "", // The selected subject
    category: "select", // Default value
    uploadedBy: "",
    university: "",
  });

  // State to store subjects based on selected course
  const [subjects, setSubjects] = useState([]);

  // Handle input changes for the form fields
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // When course is changed, update the subjects accordingly
    if (name === "course") {
      const selectedDegree = data.find((d) => d.degree === value);
      setSubjects(selectedDegree ? selectedDegree.subjects : []);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    setUploading(true);

    try {
      const storageRef = ref(storage, `pdfs/${file.name}-${Date.now()}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Send form data along with the file's URL to your backend
      const res = await axios.post(
        "http://localhost:5000/api/v1/documents/upload",
        {
          ...formData,
          url: downloadURL,
        },
        { withCredentials: true }
      );

      if (res.data.status === "success") {
        toast.success("File uploaded successfully!");
        setFile(null); // Clear the file input
        setFormData({
          title: "",
          description: "",
          course: "",
          subject: "",
          category: "select",
          uploadedBy: "",
          university: "",
        });
        // navigate('/myUploads')
      } else {
        toast.error("Failed to save file information.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("An error occurred during file upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form
        onSubmit={submitHandler}
        className="bg-[#F5F5F5] p-6 rounded-lg w-full max-w-xl mx-auto space-y-6"
      >
        <div className="text-left mb-6">
          <h1 className="text-3xl font-bold text-black text-center">
            UPLOAD PDF
          </h1>
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="title"
            className="block text-lg text-black font-semibold"
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={changeHandler}
            placeholder="Enter Title"
            className="p-3 rounded-md bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="description"
            className="block text-lg text-black font-semibold"
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={changeHandler}
            placeholder="Enter Description"
            className="p-3 rounded-md bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="course"
            className="block text-lg text-black font-semibold"
          >
            Course
          </label>
          <select
            name="course"
            id="course"
            value={formData.course}
            onChange={changeHandler}
            className="p-3 rounded-md bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Course</option>
            {data.map((degree, index) => (
              <option key={index} value={degree.degree}>
                {degree.degree}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="subject"
            className="block text-lg text-black font-semibold"
          >
            Subject
          </label>
          <select
            name="subject"
            id="subject"
            value={formData.subject}
            onChange={changeHandler}
            className="p-3 rounded-md bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={!formData.course} // Disable if no course selected
          >
            <option value="">Select Subject</option>
            {subjects.map((subject, index) => (
              <option key={index} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="category"
            className="block text-lg text-black font-semibold"
          >
            Category
          </label>
          <select
            name="category"
            id="category"
            value={formData.category}
            onChange={changeHandler}
            className="p-3 rounded-md bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="select">Select Category</option>
            <option value="assignments">Assignments</option>
            <option value="notes">Notes</option>
            <option value="books">Books</option>
            <option value="papers">Previous Year Papers</option>
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="university"
            className="block text-lg text-black font-semibold"
          >
            University
          </label>
          <select
            name="university"
            id="university"
            value={formData.university}
            onChange={changeHandler}
            className="p-3 rounded-md bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select University</option>
            {UniversitiesList.map((university, index) => (
              <option key={index} value={university.fullName}>
                {university.fullName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="pdf"
            className="block text-lg text-black font-semibold"
          >
            PDF File
          </label>
          <input
            type="file"
            name="pdf"
            id="pdf"
            onChange={(e) => setFile(e.target.files[0])}
            accept="application/pdf"
            className="p-3 rounded-md bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={uploading}
            className={`w-full bg-blue-600 text-white font-semibold py-3 rounded-md transition-colors duration-200 ${
              uploading ? "bg-gray-400 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {uploading ? "Uploading..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadPage;
