import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // success, error, info
  const [showMessage, setShowMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Handle language toggle
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'mr' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!username.trim()) {
      errors.username = language === 'en' ? 'Username is required' : 'वापरकर्तानाव आवश्यक आहे';
    } else if (username.length < 3) {
      errors.username = language === 'en' ? 'Username must be at least 3 characters' : 'वापरकर्तानाव किमान ३ अक्षरांचं असावं';
    }

    if (!password.trim()) {
      errors.password = language === 'en' ? 'Password is required' : 'पासवर्ड आवश्यक आहे';
    } else if (password.length < 6) {
      errors.password = language === 'en' ? 'Password must be at least 6 characters' : 'पासवर्ड किमान ६ अक्षरांचा असावा';
    }

    return errors;
  };

  // Show flash message
  const showFlashMessage = (msg, type = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 4000);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setFormErrors({});

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showFlashMessage(
        language === 'en' ? 'Please fix the errors below' : 'कृपया खालील त्रुटी दुरुस्त करा',
        'error'
      );
      return;
    }

    setIsLoading(true);
    const userData = { username, password };

    try {
      const baseUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:5000/api/admin/register' 
        : 'https://ltkpt3jvkqurdf3vh7gq37cgby0adqsm.lambda-url.ap-south-1.on.aws/api/admin/register';

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        showFlashMessage(
          result.message || (language === 'en' ? '🎉 Registration Successful!' : '🎉 नोंदणी यशस्वी!'),
          'success'
        );
        setUsername('');
        setPassword('');
      } else {
        showFlashMessage(
          result.error || (language === 'en' ? '❌ Registration failed!' : '❌ नोंदणी अयशस्वी!'),
          'error'
        );
      }
    } catch (error) {
      showFlashMessage(
        language === 'en' ? '⚠️ Something went wrong. Please try again.' : '⚠️ काहीतरी चुकलं, कृपया पुन्हा प्रयत्न करा.',
        'error'
      );
      setUsername('');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  // Content in both languages
  const texts = {
    en: {
      title: 'Create Your Account',
      subtitle: 'Join us today and get started',
      usernameLabel: 'Username',
      passwordLabel: 'Password',
      registerButton: 'Create Account',
      showPassword: 'Show Password',
      hidePassword: 'Hide Password',
      switchLang: 'मराठी',
    },
    mr: {
      title: 'तुमचं खाते तयार करा',
      subtitle: 'आजच आमच्यात सामील व्हा',
      usernameLabel: 'वापरकर्ता नाव',
      passwordLabel: 'पासवर्ड',
      registerButton: 'खाते तयार करा',
      showPassword: 'पासवर्ड दाखवा',
      hidePassword: 'पासवर्ड लपवा',
      switchLang: 'English',
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl animate-bounce delay-2000"></div>
      </div>

      {/* Include Header */}
      <Header />

      {/* Register Form */}
      <div className="flex flex-col items-center justify-center min-h-screen pt-20 px-4 relative z-10">
        <div className="bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-500 hover:scale-105">

          {/* Language Toggle Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={toggleLanguage}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm font-medium"
            >
              {texts[language].switchLang}
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              {texts[language].title}
            </h2>
            <p className="text-gray-600 text-sm">
              {texts[language].subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div className="relative">
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                {texts[language].usernameLabel}
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder={language === 'en' ? 'Enter your username' : 'तुमचं वापरकर्तानाव टाका'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-4 py-3 pl-12 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                    formErrors.username ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-purple-300'
                  }`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              {formErrors.username && (
                <p className="text-red-500 text-xs mt-1 animate-pulse">{formErrors.username}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                {texts[language].passwordLabel}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder={language === 'en' ? 'Enter your password' : 'तुमचा पासवर्ड टाका'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 pl-12 pr-12 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                    formErrors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-purple-300'
                  }`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-red-500 text-xs mt-1 animate-pulse">{formErrors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 active:scale-95'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {language === 'en' ? 'Creating...' : 'तयार करत आहे...'}
                  </div>
                ) : (
                  texts[language].registerButton
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Enhanced Flash Message */}
      {showMessage && (
        <div className={`fixed top-6 right-6 max-w-md p-4 rounded-xl shadow-2xl transform transition-all duration-500 z-50 ${
          messageType === 'success' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
            : messageType === 'error' 
            ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
            : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
        } ${showMessage ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                messageType === 'success' 
                  ? 'bg-white/20' 
                  : messageType === 'error' 
                  ? 'bg-white/20'
                  : 'bg-white/20'
              }`}>
                {messageType === 'success' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : messageType === 'error' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-sm font-medium">{message}</p>
            </div>
            <button
              onClick={() => setShowMessage(false)}
              className="ml-4 text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-2">
            <div className="w-full bg-white/20 rounded-full h-1">
              <div 
                className="bg-white h-1 rounded-full transition-all duration-4000 ease-linear" 
                style={{ 
                  width: showMessage ? '0%' : '100%',
                  animation: showMessage ? 'progress 4s linear forwards' : 'none'
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Register;