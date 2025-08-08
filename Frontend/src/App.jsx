import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Header from './components/Header';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component
import RegisterFarmer from './pages/RegisterFarmer';
import FarmerBillingPage from './pages/FarmerBillingPage';
import UpdateFarmerPage from './pages/UpdateFarmerPage';
import AllFarmerPage from './pages/AllFarmerPage';

const App = () => {
  return (
    <BrowserRouter>
     
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected route, requires authentication */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/farmer_register" 
          element={
            <ProtectedRoute>
             <RegisterFarmer />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/farmer_billing" 
          element={
            <ProtectedRoute>
             <FarmerBillingPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/all_farmer" 
          element={
            <ProtectedRoute>
             <AllFarmerPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/update_farmer" 
          element={
            <ProtectedRoute>
             <UpdateFarmerPage />
            </ProtectedRoute>
          } 
        />


        {/* Other public routes */}
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
