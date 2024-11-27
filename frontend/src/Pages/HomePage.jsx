import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import AutoSuggestSearch from "../Components/AutoSuggestSearch";
import UniversitiesListed from "../Components/UniversitiesListed";
import CoursesListed from "../Components/CoursesListed";
import { useEffect, useState } from "react";
import { UniversitiesList } from "../assets/UniversitiesList";
import { CoursesList } from "../assets/CoursesList";
import { Toaster } from "react-hot-toast";
import chatIcon from "../assets/chatIcon.jpeg";
import docsIcon from "../assets/docs.png";
import hatIcon from "../assets/hat.png";

const HomePage = () => {
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    setUniversities(UniversitiesList);
    setCourses(CoursesList);
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      {/* Navigation Bar */}
      <NavBar />

      {/* Main Content */}
      <main className="opacity-0 animate-fadeIn">
        {/* Centered Logo and Search Field */}
        <div className="flex flex-col items-center justify-center text-center border border-gray-950 min-h-96 mt-4">
          {/* Main Heading */}
          <div>
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg mt-8">
              Your One Stop Solution for University and Course Search.
            </h1>
            <p className="text-3xl mb-6 font-semibold mt-7">
              Study Easier, Faster & Better
            </p>
          </div>

          {/* Centered Search Bar */}
          <div className="flex flex-col items-center justify-center w-full mt-6">
            <div className="relative w-1/2">
              <AutoSuggestSearch className="transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-400 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Data Number Section */}
        <div className="flex items-center justify-evenly py-5 max-w-full min-h-fit border border-gray-950 mt-4 transition-colors duration-300 bg-[#F5F5F5] hover:bg-[#e5e5e5]">
          <figure className="flex flex-col items-center rounded-full">
            <img src={hatIcon} alt="" className="h-20 w-20" />
            <figcaption className="font-bold text-center text-xl">x</figcaption>
            <figcaption>Happy Students</figcaption>
          </figure>
          <figure className="flex flex-col items-center rounded-full">
            <img src={docsIcon} alt="" className="h-20 w-20" />
            <figcaption className="font-bold text-center text-xl">x</figcaption>
            <figcaption>Helpful Documents</figcaption>
          </figure>
          <figure className="flex flex-col items-center rounded-full">
            <img src={chatIcon} alt="" className="h-20 w-20" />
            <figcaption className="font-bold text-center text-xl">x</figcaption>
            <figcaption>Answered Questions</figcaption>
          </figure>
        </div>

        {/* Universities Listed */}
        <div className="flex-col items-center justify-evenly max-w-full min-h-fit bg-[#F5F5F5] transition-colors duration-300 hover:bg-[#e5e5e5] mt-4 border border-gray-950">
          <h2 className="text-center text-3xl font-bold pt-5">
            Universities Listed
          </h2>
          <div className="flex flex-row w-full items-center justify-evenly py-5 my-5 animate-marquee">
            {universities.map((university, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-40 mx-5 transform transition-transform duration-500 hover:scale-105"
              >
                <UniversitiesListed university={university} />
              </div>
            ))}
          </div>
        </div>

        {/* Features of Website (Bullets and A video clip)*/}

        <div>
          {/* Bullet Points */}
          <div></div>
          {/* Video Clip */}
          <div></div>
        </div>

        {/* Courses Listed */}
        <div className="flex-col items-center justify-center min-h-fit bg-[#F5F5F5] transition-colors duration-300 hover:bg-[#e5e5e5] mt-4 border border-gray-950">
          <h2 className="text-center text-3xl font-bold pt-5">
            Courses Available
          </h2>
          <div className="flex w-9/12 mx-auto gap-6 items-center justify-center py-5 my-5 flex-wrap">
            {courses.map((course, index) => (
              <CoursesListed key={index} course={course} />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="mt-4">
        <Footer />
      </div>

      <Toaster />
    </div>
  );
};

export default HomePage;
