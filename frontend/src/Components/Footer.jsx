import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <footer className="transition-all duration-300 ease-in-out hover:-translate-y-1 bg-[#D9D9D9]">
        <div className="flex flex-row items-center justify-between px-5 min-h-16">
          {/* Left Section */}
          <div className="flex items-center">
            <ul className="flex flex-row items-center justify-center gap-3 text-lg font-semibold">
              <li>Terms of Use</li>
              <li>Privacy</li>
              <li>About Us</li>
              <li>FAQs</li>
            </ul>
          </div>

          {/* Language Button */}
          <div className="flex items-center">
            <select className="p-2 border border-gray-300 rounded-lg bg-transparent text-lg">
              <option value="EngUK">English {`(UK)`}</option>
              <option value="EngUS">English {`(US)`}</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>

          {/* Copyright Section */}
          <div className="flex items-center text-lg font-semibold">
            <span>
              Copyright © <NavLink to={"/"}>SemesterSimplified - 2024</NavLink>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
