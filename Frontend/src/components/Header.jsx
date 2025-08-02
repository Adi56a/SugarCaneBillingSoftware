import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaFileInvoice, FaUserPlus, FaSignOutAlt, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { MdSell } from 'react-icons/md';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem('language') || 'en');
    };
    
    // Listen for language changes
    window.addEventListener('storage', handleLanguageChange);
    return () => window.removeEventListener('storage', handleLanguageChange);
  }, []);

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('selectedFarmerNumber');
    localStorage.removeItem('selectedFarmerName');
    navigate('/login');
    setIsMenuOpen(false);
  };

  const isLoggedIn = localStorage.getItem('authToken') !== null;

  const translations = {
    en: {
      brandName: "Dhawle Sugar Mill",
      home: "Home",
      newBill: "New Bill",
      allFarmers: "All Farmers",
      sellingBills: "Selling Bills",
      register: "Register Farmer",
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      profile: "Profile"
    },
    mr: {
      brandName: "धावले साखर कारखाना",
      home: "होम",
      newBill: "नवीन बिल",
      allFarmers: "सर्व शेतकरी",
      sellingBills: "विक्री बिले",
      register: "शेतकरी नोंदणी",
      login: "लॉगिन",
      signup: "साइन अप",
      logout: "लॉगआउट",
      profile: "प्रोफाइल"
    }
  };

  const t = translations[language];

  const navigationItems = [
    { name: t.home, path: '/', icon: <FaHome /> },
    { name: t.newBill, path: '/farmer_billing', icon: <FaFileInvoice /> },
    { name: t.allFarmers, path: '/all_farmer', icon: <FaUsers /> },
    { name: t.sellingBills, path: '/selling-billing', icon: <MdSell /> },
    { name: t.register, path: '/farmer_register', icon: <FaUserPlus /> }
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white shadow-lg z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center space-x-3 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">D</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
                    {t.brandName}
                  </h1>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            {isLoggedIn && (
              <nav className="hidden lg:flex items-center space-x-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActivePath(item.path)
                        ? 'bg-blue-100 text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            )}

            {/* Desktop Auth Section */}
            <div className="hidden lg:flex items-center space-x-4">
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    {t.login}
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    {t.signup}
                  </Link>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <FaUser className="text-gray-600" />
                    <span className="text-sm text-gray-700 font-medium">Welcome</span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    <FaSignOutAlt />
                    <span>{t.logout}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              >
                {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-3 space-y-1">
              {isLoggedIn ? (
                <>
                  {navigationItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                        isActivePath(item.path)
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  ))}
                  
                  <div className="border-t border-gray-200 my-2"></div>
                  
                  <button
                    onClick={logout}
                    className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg text-base font-medium transition-all duration-200 w-full"
                  >
                    <FaSignOutAlt />
                    <span>{t.logout}</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg text-base font-medium transition-colors duration-200"
                  >
                    {t.login}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-base font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-center"
                  >
                    {t.signup}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-16"></div>
    </>
  );
};

export default Header;
