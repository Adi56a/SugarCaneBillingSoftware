import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

// Language translations for EN and Marathi
const translations = {
  en: {
    title: "Register Farmer",
    farmer_name: "Farmer Name",
    farmer_number: "Farmer Number",
    register_button: "Register",
    success_message: "Farmer registered successfully",
    failure_message: "Error registering farmer",
    already_exists_message: "Farmer with this number already exists",
    required_fields: "Farmer name and number both are required",
    token_error: "Authorization failed. Please login again.",
    server_error: "Server error, please try again later."
  },
  mr: {
    title: "शेतकऱ्याची नोंदणी करा",
    farmer_name: "शेतकऱ्याचे नाव",
    farmer_number: "शेतकऱ्याचा नंबर",
    register_button: "नोंदणी करा",
    success_message: "शेतकरी यशस्वीरित्या नोंदवला गेला",
    failure_message: "शेतकरी नोंदवताना त्रुटी",
    already_exists_message: "या नंबरसह शेतकरी आधीच अस्तित्वात आहे",
    required_fields: "शेतकऱ्याचे नाव आणि नंबर आवश्यक आहेत",
    token_error: "अधिकार प्रमाणीकरण अयशस्वी. कृपया पुन्हा लॉगिन करा.",
    server_error: "सर्व्हर त्रुटी, कृपया नंतर पुन्हा प्रयत्न करा."
  }
};

const RegisterFarmer = () => {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");
  const [farmerName, setFarmerName] = useState("");
  const [farmerNumber, setFarmerNumber] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success or error
  const [showMessage, setShowMessage] = useState(false); // Controls visibility of flash message
  
  const [token, setToken] = useState(localStorage.getItem("authToken") || null); // Token from localStorage
  
  // Fetch translation based on language
  const t = translations[language];

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang); // Store in localStorage
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!farmerName || !farmerNumber) {
      setMessage(t.required_fields);
      setMessageType("error");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000); // Hide message after 3 seconds
      return;
    }

    if (!token) {
      setMessage(t.token_error);
      setMessageType("error");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000); // Hide message after 3 seconds
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/farmer/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Send token in header
        },
        body: JSON.stringify({ farmer_name: farmerName, farmer_number: farmerNumber })
      });

      const data = await response.json();

      if (response.status === 201) {
        setMessage(data.message || t.success_message);
        setMessageType("success");
        setShowMessage(true);
        // Clear form fields after successful registration
        setFarmerName("");
        setFarmerNumber("");
      } else if (response.status === 401) {
        setMessage(t.token_error);
        setMessageType("error");
        setShowMessage(true);
      } else if (response.status === 500) {
        setMessage(t.server_error);
        setMessageType("error");
        setShowMessage(true);
      } else {
        setMessage(data.message || t.failure_message);
        setMessageType("error");
        setShowMessage(true);
      }

      setTimeout(() => setShowMessage(false), 3000); // Hide message after 3 seconds

    } catch (error) {
      setMessage(t.server_error);
      setMessageType("error");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000); // Hide message after 3 seconds
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Header />
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-700">{t.title}</h2>
          <button 
            onClick={() => handleLanguageChange(language === "en" ? "mr" : "en")}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            {language === "en" ? "मराठी" : "English"}
          </button>
        </div>

        {showMessage && message && (
          <div
            className={`mb-4 p-4 rounded-md ${messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="farmer_name" className="block text-gray-600">{t.farmer_name}</label>
            <input
              type="text"
              id="farmer_name"
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder={t.farmer_name}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="farmer_number" className="block text-gray-600">{t.farmer_number}</label>
            <input
              type="text"
              id="farmer_number"
              value={farmerNumber}
              onChange={(e) => setFarmerNumber(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder={t.farmer_number}
            />
          </div>

          <button 
            type="submit" 
            className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-700"
          >
            {t.register_button}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterFarmer;
