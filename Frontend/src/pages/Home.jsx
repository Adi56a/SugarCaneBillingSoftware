import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // If you're using react-router for routing
import { FaLanguage } from 'react-icons/fa'; // For Language Toggle Icon
import Header from '../components/Header'; // Import Header component

const Home = () => {
  // Get the language from localStorage, default to 'en' if not set
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  // Handle language toggle
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'mr' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage); // Save the language to localStorage
  };

  return (
    <>
      {/* Include Header Component */}
      <Header />

      <div className="min-h-screen bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 text-white font-sans pt-20">
        {/* Main Content Section */}
        <div className="flex flex-col items-center justify-start space-y-6 py-20">

          {/* Heading */}
          <h1 className="text-6xl font-extrabold text-center">
            {language === 'en' ? 'Welcome to the Home Page' : 'होम पेजवर आपले स्वागत आहे'}
          </h1>

          {/* Options Section */}
          <div className="bg-white text-gray-900 p-10 rounded-3xl shadow-xl max-w-2xl w-full transform transition hover:scale-101 duration-300">
            <h2 className="text-4xl text-center font-semibold mb-8">
              {language === 'en' ? 'Select Billing Type' : 'बिलिंग प्रकार निवडा'}
            </h2>

            {/* Farmer / Buying Billing Option */}
            <div className="mb-6 hover:shadow-xl transition-all ease-in-out duration-300">
              <Link
                to="/farmer-billing"
                className="block text-2xl text-indigo-600 font-semibold text-center py-3 px-6 rounded-lg shadow-md hover:bg-indigo-100 transition duration-200"
              >
                {language === 'en' ? 'Farmer Billing / Buying Billing' : 'शेतकरी बिलिंग / खरेदी बिलिंग'}
              </Link>
            </div>

            {/* Selling Billing Option */}
            <div className="hover:shadow-xl transition-all ease-in-out duration-300">
              <Link
                to="/selling-billing"
                className="block text-2xl text-indigo-600 font-semibold text-center py-3 px-6 rounded-lg shadow-md hover:bg-indigo-100 transition duration-200"
              >
                {language === 'en' ? 'Selling Billing' : 'विक्री बिलिंग'}
              </Link>
            </div>

            {/* Farmer Registration Option */}
            <div className="mt-6 hover:shadow-xl transition-all ease-in-out duration-300">
              <Link
                to="/farmer_register" // Redirect to farmer registration page
                className="block text-2xl text-indigo-600 font-semibold text-center py-3 px-6 rounded-lg shadow-md hover:bg-indigo-100 transition duration-200"
              >
                {language === 'en' ? 'Farmer Registration' : 'शेतकरी नोंदणी'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Language Toggle Button - Positioned at the bottom */}
      <div className="fixed bottom-6 right-6 flex items-center space-x-2">
        <button
          onClick={toggleLanguage}
          className="flex items-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition ease-in-out duration-300"
        >
          <FaLanguage />
          <span>{language === 'en' ? 'Switch to Marathi' : 'Switch to English'}</span>
        </button>
      </div>
    </>
  );
};

export default Home;
