// AutoSuggestSearch.jsx
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { data } from "../assets/Suggestions";

const AutoSuggestSearch = () => {
  const [query, setQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const navigate = useNavigate();

  // Handle course selection
  const handleCourseChange = (event) => {
    const selectedCourseValue = event.target.value;
    setSelectedCourse(selectedCourseValue);
    setQuery("");
    setSuggestions([]);
    setFilteredSubjects(
      selectedCourseValue
        ? data.find((item) => item.degree === selectedCourseValue).subjects
        : []
    );
  };

  // Handle subject input change
  const handleSubjectChange = (event) => {
    const input = event.target.value;
    setQuery(input);

    if (input && selectedCourse) {
      const filteredSuggestions = filteredSubjects.filter((subject) =>
        subject.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setSuggestions([]);
    navigate(
      `/search?course=${selectedCourse}&subject=${encodeURIComponent(
        suggestion
      )}`
    );
  };

  return (
    <div>
      {/* Course Selection Dropdown */}
      <select
        value={selectedCourse}
        onChange={handleCourseChange}
        className="w-full pl-4 pr-4 py-2 mb-4 border font-semibold border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Course</option>
        {data.map((course, index) => (
          <option key={index} value={course.degree}>
            {course.degree}
          </option>
        ))}
      </select>

      {/* Subject Search Input */}
      <div className="relative w-full">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Seach Subject"
          value={query}
          onChange={handleSubjectChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!selectedCourse}
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AutoSuggestSearch;
