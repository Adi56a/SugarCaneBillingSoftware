import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();  // Use useNavigate for React Router v6

  // Logout function to clear the authToken from localStorage and redirect
  const logout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');  // Redirect to login page
  };

  // Check if the user is logged in (i.e., if authToken exists in localStorage)
  const isLoggedIn = localStorage.getItem('authToken') !== null;

  return (
    <div className="fixed top-0 left-0 w-full bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-600 p-4 shadow-md z-50">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Logo or brand */}
        <div className="text-white text-3xl font-semibold">
          <Link to="/">धावले गुरल</Link>
        </div>

        {/* Navigation Links */}
        <div className="space-x-6">
          {!isLoggedIn ? (
            <>
              {/* Register Link */}
              <span className="text-white text-lg font-medium hover:text-gray-300 transition duration-300">
                <Link to="/register" className="border-b-2 border-transparent hover:border-white">
                  Register
                </Link>
              </span>

              {/* Login Link */}
              <span className="text-white text-lg font-medium hover:text-gray-300 transition duration-300">
                <Link to="/login" className="border-b-2 border-transparent hover:border-white">
                  Login
                </Link>
              </span>
            </>
          ) : (
            // Show logout button if user is logged in
            <button
              onClick={logout}
              className="text-white text-lg font-medium hover:text-gray-300 transition duration-300"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
