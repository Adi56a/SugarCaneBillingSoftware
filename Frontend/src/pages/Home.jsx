import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaLanguage, FaUsers, FaFileInvoice, FaUserPlus, FaCog } from 'react-icons/fa';
import { MdSell, MdHistory } from 'react-icons/md';
import Header from '../components/Header';

const Home = () => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'mr' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const translations = {
    en: {
      welcome: 'Welcome to Sugarcane Management',
      subtitle: 'Streamline your billing and farmer management processes',
      selectOption: 'Choose Your Action',
      farmerBilling: 'Create New Bill',
      farmerBillingDesc: 'Generate farmer buying bills and manage transactions',
      sellingBilling: 'Selling Bills',
      sellingBillingDesc: 'Manage selling transactions and invoices',
      farmerRegister: 'Farmer Registration',
      farmerRegisterDesc: 'Register new farmers in the system',
      allFarmers: 'All Farmers',
      allFarmersDesc: 'View and manage all registered farmers',
      switchLanguage: 'Switch to Marathi',
      billing: 'Billing',
      management: 'Management'
    },
    mr: {
      welcome: 'साखर कारखाना व्यवस्थापनात आपले स्वागत',
      subtitle: 'आपली बिलिंग आणि शेतकरी व्यवस्थापन प्रक्रिया सुव्यवस्थित करा',
      selectOption: 'आपली कृती निवडा',
      farmerBilling: 'नवीन बिल तयार करा',
      farmerBillingDesc: 'शेतकरी खरेदी बिले तयार करा आणि व्यवहार व्यवस्थापित करा',
      sellingBilling: 'विक्री बिले',
      sellingBillingDesc: 'विक्री व्यवहार आणि बीजक व्यवस्थापित करा',
      farmerRegister: 'शेतकरी नोंदणी',
      farmerRegisterDesc: 'सिस्टममध्ये नवीन शेतकरी नोंदवा',
      allFarmers: 'सर्व शेतकरी',
      allFarmersDesc: 'सर्व नोंदणीकृत शेतकरी पहा आणि व्यवस्थापित करा',
      switchLanguage: 'इंग्रजीमध्ये बदला',
      billing: 'बिलिंग',
      management: 'व्यवस्थापन'
    }
  };

  const t = translations[language];

  const menuItems = [
    {
      title: t.farmerBilling,
      description: t.farmerBillingDesc,
      link: '/farmer_billing',
      icon: <FaFileInvoice className="text-4xl" />,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      title: t.allFarmers,
      description: t.allFarmersDesc,
      link: '/all_farmer',
      icon: <FaUsers className="text-4xl" />,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    {
      title: t.sellingBilling,
      description: t.sellingBillingDesc,
      link: '/selling-billing',
      icon: <MdSell className="text-4xl" />,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    },
    {
      title: t.farmerRegister,
      description: t.farmerRegisterDesc,
      link: '/farmer_register',
      icon: <FaUserPlus className="text-4xl" />,
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700'
    }
  ];

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Hero Section */}
        <div className="pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                {t.welcome}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                {t.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t.selectOption}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="group"
              >
                <div className={`
                  relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 
                  transform hover:scale-105 hover:shadow-xl
                  bg-gradient-to-r ${item.color} ${item.hoverColor}
                  text-white p-8 min-h-[200px] flex flex-col justify-between
                `}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white"></div>
                    <div className="absolute -left-4 -bottom-4 w-16 h-16 rounded-full bg-white"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                        {item.icon}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3">
                      {item.title}
                    </h3>
                    
                    <p className="text-white text-opacity-90 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Stats Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="text-3xl font-bold text-blue-600 mb-2">Fast</div>
              <div className="text-gray-600">Quick bill generation</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="text-3xl font-bold text-green-600 mb-2">Secure</div>
              <div className="text-gray-600">Data protection</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="text-3xl font-bold text-purple-600 mb-2">Easy</div>
              <div className="text-gray-600">User-friendly interface</div>
            </div>
          </div>
        </div>
      </div>

      {/* Language Toggle Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={toggleLanguage}
          className="flex items-center space-x-3 bg-white text-gray-800 py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300"
        >
          <FaLanguage className="text-blue-500" />
          <span className="font-medium">{t.switchLanguage}</span>
        </button>
      </div>

      {/* Floating Action Buttons for Quick Access */}
      <div className="fixed bottom-8 left-8 z-50 flex flex-col space-y-4">
        <Link
          to="/farmer_billing"
          className="p-4 bg-blue-500 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-blue-600 transition-all duration-300 group"
          title={t.farmerBilling}
        >
          <FaFileInvoice className="text-xl" />
          <span className="absolute left-full ml-3 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            {t.farmerBilling}
          </span>
        </Link>
        
        <Link
          to="/all_farmer"
          className="p-4 bg-green-500 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-green-600 transition-all duration-300 group"
          title={t.allFarmers}
        >
          <FaUsers className="text-xl" />
          <span className="absolute left-full ml-3 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            {t.allFarmers}
          </span>
        </Link>
      </div>

     
    </>
  );
};

export default Home;
