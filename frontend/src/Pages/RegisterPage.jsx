import React, { useEffect } from "react";
import RegisterForm from "../Components/RegisterForm";
import mainLogo from "../assets/mainlogo.jpeg";

import Cookies from "js-cookie";

const RegisterPage = () => {
  
  
  useEffect(() => {
    const token = Cookies.get("userToken");
    if (token) {
      window.location.href = "/";
    }
  }, []);


  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Wrapper to center the form and image */}
      <div className="flex flex-1 items-center justify-center">
        {/* Form section with fade-in animation */}
        <div className="w-1/2 flex justify-center animate-fadeInLeft transform scale-100 hover:scale-110 focus:scale-110 transition-transform duration-500">
          <RegisterForm />
        </div>

        {/* Image section with fade-in and scaling animation */}
        <div className="w-1/2 flex justify-center animate-fadeInRight">
          <img
            src={mainLogo}
            alt="Logo"
            height={643}
            width={635}
            className="rounded-full transform scale-100 hover:scale-110 transition-transform duration-500"
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
