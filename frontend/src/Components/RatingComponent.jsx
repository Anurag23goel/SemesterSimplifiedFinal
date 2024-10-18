// src/components/RatingComponent.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

const RatingComponent = ({
  documentId,
  currentAverage,
  initialRatingsCount,
}) => {
  const [rating, setRating] = useState(0); // User's current selected rating
  const [hover, setHover] = useState(0); // User's current hover rating
  const [average, setAverage] = useState(currentAverage || 0); // Document's average rating
  const [ratingsCount, setRatingsCount] = useState(initialRatingsCount || 0); // Number of ratings

  const handleRatingSubmit = async (newRating) => {
    if (newRating === 0) return; // Prevent submitting a rating of 0

    const userID = Cookies.get('userid')

    if(!userID){
      toast.error("You Must Login To Rate")
      return
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}api/v1/documents/${documentId}/rate`,
        { rating: newRating },
        { withCredentials: true }
      );
      const updatedDocument = response.data;
      setAverage(updatedDocument.averageRating);
      setRatingsCount(updatedDocument.ratingsCount); // Corrected line
      setRating(newRating); // Keep the user's rating displayed
    } catch (error) {
      console.error("Error submitting rating:", error);
      // Optionally, you can set an error state here to display a message to the user
    }
  };

  // Optionally, fetch initial ratings count if not provided via props
  useEffect(() => {
    if (typeof initialRatingsCount === "undefined") {
      const fetchInitialData = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}api/v1/documents/${documentId}`,
            { withCredentials: true }
          );

          setAverage(response.data.averageRating || 0);
          setRatingsCount(response.data.ratingsCount || 0);
        } catch (error) {
          console.error("Error fetching initial document data:", error);
        }
      };
      fetchInitialData();
    }
  }, [documentId, initialRatingsCount]);

  return (
    <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md">
      <div className="flex mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesomeIcon
            key={star}
            icon={hover >= star || rating >= star ? solidStar : regularStar}
            className={`cursor-pointer text-2xl ${
              hover >= star || rating >= star
                ? "text-yellow-400"
                : "text-gray-300"
            } transition-colors duration-200 ease-in-out`}
            onClick={() => {
              setRating(star);
              handleRatingSubmit(star);
            }}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          />
        ))}
      </div>
      {ratingsCount > 0 && (
        <div className="mt-3 text-center">
          <p className="text-gray-600 font-medium">
            Average Rating:{" "}
            <span className="font-bold">{average.toFixed(1)} / 5</span>
          </p>
          <p className="text-gray-500 text-sm">
            Based on {ratingsCount} ratings
          </p>
        </div>
      )}
    </div>
  );
};

export default RatingComponent;
