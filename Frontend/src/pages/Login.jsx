import React, { useState } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en'); // Default to English
  const navigate = useNavigate(); // Hook to navigate after successful login

  // Handle language toggle
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'mr' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage); // Store language preference in localStorage
  };

  // Handle form submission (Login)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare user data for login
    const userData = { username, password };

    try {
      // POST request to your backend (replace the URL with your API endpoint)
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json(); // Assuming the API returns a JSON response

      // Check if the response is successful
      if (response.ok) {
        setMessage(result.message || (language === 'en' ? 'Login Successful!' : 'लॉगिन यशस्वी!'));

        // Store token in localStorage
        localStorage.setItem('authToken', result.token); // Assuming the backend returns a `token`

        // Redirect to the home page (or any other route) after successful login
        navigate('/'); // Redirect to the '/' route (Home page)
      } else {
        setMessage(result.error || (language === 'en' ? 'Login failed!' : 'लॉगिन अयशस्वी!'));
      }

      setShowMessage(true);

      // Hide the message after 3 seconds
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    } catch (error) {
      // Handle error if the request fails
      setMessage(language === 'en' ? 'Something went wrong. Please try again.' : 'काहीतरी चुकलं, कृपया पुन्हा प्रयत्न करा.');
      setShowMessage(true);

      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }
  };

  // Content in both languages
  const texts = {
    en: {
      title: 'Login to Your Account',
      usernameLabel: 'Username',
      passwordLabel: 'Password',
      loginButton: 'Login',
      successMessage: 'Login Successful!',
    },
    mr: {
      title: 'तुमच्या खात्यात लॉगिन करा',
      usernameLabel: 'वापरकर्ता नाव',
      passwordLabel: 'पासवर्ड',
      loginButton: 'लॉगिन करा',
      successMessage: 'लॉगिन यशस्वी!',
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-600">
      {/* Include Header */}
      <Header />

      {/* Login Form */}
      <div className="flex flex-col items-center justify-center min-h-screen pt-24"> {/* Adjusted padding-top to 24 to account for header */}
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          {/* Language Toggle Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleLanguage}
              className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition ease-in-out duration-300"
            >
              {language === 'en' ? 'Switch to Marathi' : 'Switch to English'}
            </button>
          </div>

          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            {texts[language].title}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                {texts[language].usernameLabel}
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder={language === 'en' ? 'Enter your username' : 'तुमचं वापरकर्तानाव टाका'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {texts[language].passwordLabel}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder={language === 'en' ? 'Enter your password' : 'तुमचा पासवर्ड टाका'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition ease-in-out duration-300"
              >
                {texts[language].loginButton}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success/Error Message Popup */}
      {showMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 p-4 bg-green-500 text-white rounded-lg shadow-lg w-3/4 sm:w-1/2 md:w-1/3">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default Login;
