import React, { useEffect, useState } from "react";
import NavBar from "../Components/NavBar";
import AutoSuggestSearch from "../Components/AutoSuggestSearch";
import { NavLink, useLocation } from "react-router-dom";
import { UniversitiesList } from "../assets/UniversitiesList";
import { FaBook } from "react-icons/fa";
import axios from "axios";
import { data } from "../assets/Suggestions";
import Cookies from "js-cookie";
import { Toaster } from "react-hot-toast";
import Dialog from "@mui/material/Dialog"; // Material UI Dialog component
import LoginForm from "../Components/LoginForm"; // Assuming you have a LoginForm component
import RatingComponent from "../Components/RatingComponent";

const SubjectPage = () => {
  const [relatedSubjects, setRelatedSubjects] = useState([]);
  const [mostSearchedSubs, setMostSearchedSubs] = useState([]);
  const [allData, setAllData] = useState([]); // Store all documents
  const [dataToRender, setDataToRender] = useState([]); // Store filtered documents
  const [openLoginDialog, setOpenLoginDialog] = useState(false); // State for login dialog
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const course = queryParams.get("course");
  const subject = queryParams.get("subject");

  // Function to handle filter button click

  const filterButtonHandler = (e) => {
    const selectedCategory = e.target.value;
    const filteredData =
      selectedCategory === "all"
        ? allData
        : allData.filter((doc) => doc.category === selectedCategory);

    setDataToRender(filteredData);
  };

  const filterUniversityHandler = (e) => {
    const selectedUniversity = e.target.value;
    const filteredData =
      selectedUniversity === "Select University"
        ? allData
        : allData.filter((doc) => doc.university === selectedUniversity);

    setDataToRender(filteredData);
  };

  // Fetch data from backend
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}api/v1/documents/search`,
        {
          params: { course, subject },
          withCredentials: true,
        }
      );

      console.log(response.data);
      

      setAllData(response.data); // Store all documents
      setDataToRender(response.data); // Initially render all documents
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const settingRelatedSubjects = () => {
    const subjects =
      data.find((item) => item.degree === course)?.subjects || [];
    const shuffledSubjects = subjects.sort(() => 0.5 - Math.random());
    setRelatedSubjects(shuffledSubjects.slice(0, 3)); // Pick first 3 subjects from shuffled
  };

  const searchedSubsList = () => {
    const list = data.find((item) => item.degree === course)?.subjects || [];
    setMostSearchedSubs(list.slice(0, 3));
  };

  const handleOpenPdf = (url) => {
    const user = Cookies.get("userid");
    if (user) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      setOpenLoginDialog(true); // Open the login dialog
    }
  };

  const handleCloseDialog = () => {
    setOpenLoginDialog(false);
  };

  useEffect(() => {
    fetchData();
    settingRelatedSubjects();
    searchedSubsList();
  }, [course, subject]);

  return (
    <div className="min-h-screen">
      <Toaster />

      <NavBar />

      <div className="flex items-center justify-center mb-6 mt-6 min-w-full">
        <div className="w-full md:w-2/3 lg:w-1/2">
          <AutoSuggestSearch />
        </div>
      </div>

      <div className="mt-6 flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 bg-white rounded-lg shadow-md p-4 mr-0 md:mr-4">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>

          <div className="mb-4">
            <label
              htmlFor="universities"
              className="block text-sm font-medium mb-2"
            >
              Select University
            </label>
            <select
              name="universities"
              id="universities"
              onChange={filterUniversityHandler}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            >
              <option>Select University</option>
              {UniversitiesList.map((item) => (
                <option key={item.fullName} value={item.fullName}>
                  {item.fullName}
                </option>
              ))}
            </select>
          </div>

          <h4 className="font-semibold mb-2">Material Type:</h4>
          <div className="space-y-2">
            {["all", "assignments", "notes", "books", "papers"].map((type) => (
              <button
                key={type}
                onClick={filterButtonHandler}
                value={type}
                className="w-full p-2 text-left bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <h4 className="font-semibold mt-4 mb-2">Most Searched Subjects</h4>
          <ul className="list-disc list-inside space-y-1">
            {mostSearchedSubs.map((item, index) => (
              <NavLink
                key={index}
                to={`/search?course=${course}&subject=${encodeURIComponent(
                  item
                )}`}
              >
                <li className="hover:text-blue-500 hover:underline">{item}</li>
              </NavLink>
            ))}
          </ul>
        </div>

        <div className="w-full md:w-3/4 bg-white rounded-lg shadow-md p-4 mt-4 md:mt-0">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Related Subjects</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedSubjects.map((item, index) => (
                <NavLink
                  key={index}
                  to={`/search?course=${course}&subject=${encodeURIComponent(
                    item
                  )}`}
                >
                  <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition duration-200">
                    <div className="flex items-center">
                      <FaBook size={30} className="text-blue-500 mr-2" />
                      <span>{item}</span>
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2">{`Documents related to "${subject}"`}</h3>
          <div className="space-y-4">
            {dataToRender.length > 0 ? (
              dataToRender.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition duration-200"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <FaBook
                        size={40}
                        className="text-blue-500 mr-4 hover:cursor-pointer"
                        onClick={() => handleOpenPdf(doc.url)}
                      />
                      <div className="flex flex-col">
                        <span
                          className="font-medium hover:cursor-pointer"
                          onClick={() => handleOpenPdf(doc.url)}
                        >
                          {doc.title}
                        </span>
                        <span className="text-sm text-gray-500">
                          {doc.uploadedBy}
                        </span>
                      </div>
                    </div>

                    {/* Move the star rating to the right side */}
                    <div className="mt-2">
                      <RatingComponent
                        documentId={doc._id}
                        currentAverage={doc.averageRating}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No documents available for this selection.</p>
            )}
          </div>
        </div>
      </div>

      {/* Dialog for LoginForm */}
      <Dialog open={openLoginDialog} onClose={handleCloseDialog}>
        <LoginForm onClose={handleCloseDialog} />
      </Dialog>
    </div>
  );
};

export default SubjectPage;
