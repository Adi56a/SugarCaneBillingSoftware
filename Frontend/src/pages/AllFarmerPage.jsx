import React, { useState, useEffect } from 'react';

const AllFarmerPage = () => {
  const [farmerData, setFarmerData] = useState({
    farmer_number: '',
    farmer_name: '',
    bills: []
  });
  const [farmersList, setFarmersList] = useState([]); // List of all farmers
  const [filteredFarmers, setFilteredFarmers] = useState([]); // Filtered farmers for suggestions
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFarmerId, setSelectedFarmerId] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [flashMessages, setFlashMessages] = useState([]);

  // Fetch all farmers when the component mounts
  useEffect(() => {
    const fetchFarmers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5000/api/farmer/all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        
        if (response.ok && data.success) {
          setFarmersList(data.data || []); // Set the farmers list from the response
          setError(null);
        } else {
          setError(data.message || 'Failed to fetch farmers');
        }
      } catch (error) {
        console.error('Fetch farmers error:', error);
        setError('An error occurred while fetching the farmers.');
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  // Auto-select farmer if coming from bill creation
  useEffect(() => {
    const selectedFarmerNumber = localStorage.getItem('selectedFarmerNumber');
    const selectedFarmerName = localStorage.getItem('selectedFarmerName');
    
    if (selectedFarmerNumber && selectedFarmerName && farmersList.length > 0) {
      const farmer = farmersList.find(f => f.farmer_number === selectedFarmerNumber);
      if (farmer) {
        selectFarmer(farmer);
        // Clear the stored data after using it
        localStorage.removeItem('selectedFarmerNumber');
        localStorage.removeItem('selectedFarmerName');
        
        // Show success message
        showFlashMessage(`✅ Showing bills for: ${selectedFarmerName}`, 'success', 3000);
      }
    }
  }, [farmersList]);

  // Flash message system
  const showFlashMessage = (message, type, duration = 5000) => {
    const id = Date.now();
    const newMessage = { id, message, type };
    
    setFlashMessages(prev => [...prev, newMessage]);
    
    setTimeout(() => {
      setFlashMessages(prev => prev.filter(msg => msg.id !== id));
    }, duration);
  };

  // Remove flash message manually
  const removeFlashMessage = (id) => {
    setFlashMessages(prev => prev.filter(msg => msg.id !== id));
  };

  // Handler for changes in the farmer number
  const handleFarmerNumberChange = (e) => {
    const { value } = e.target;
    
    setFarmerData((prev) => ({
      ...prev,
      farmer_number: value,
      farmer_name: '', // Clear name when number changes
      bills: [] // Clear bills when number changes
    }));

    setSelectedFarmerId(null);
    setError(null);

    // Filter farmers based on input
    if (value.length >= 1 && farmersList.length > 0) {
      const filtered = farmersList.filter(farmer => 
        farmer.farmer_number?.toString().includes(value) ||
        farmer.farmer_name?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredFarmers(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredFarmers([]);
      setShowSuggestions(false);
    }

    // Auto-select if exact match found
    const exactMatch = farmersList.find(farmer => 
      farmer.farmer_number?.toString() === value
    );
    
    if (exactMatch) {
      selectFarmer(exactMatch);
    }
  };

  // Function to select a farmer
  const selectFarmer = (farmer) => {
    setFarmerData({
      farmer_number: farmer.farmer_number || '',
      farmer_name: farmer.farmer_name || '',
      bills: []
    });
    setSelectedFarmerId(farmer._id);
    setShowSuggestions(false);
    setError(null);
  };

  // Fetch and display bills for the selected farmer
  useEffect(() => {
    if (selectedFarmerId) {
      const fetchBills = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem('authToken');
          const response = await fetch(`http://localhost:5000/api/farmer/${selectedFarmerId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();

          if (response.ok && data.success) {
            // Updated to match your API response structure
            const farmerInfo = data.farmer;
            
            // Sort bills by createdAt in descending order (most recent first)
            const sortedBills = (farmerInfo.bills || []).sort((a, b) => {
              const dateA = new Date(a.createdAt || a.updatedAt || 0);
              const dateB = new Date(b.createdAt || b.updatedAt || 0);
              return dateB - dateA; // Descending order (newest first)
            });

            setFarmerData((prev) => ({
              ...prev,
              farmer_name: farmerInfo.name || prev.farmer_name,
              farmer_number: farmerInfo.farmer_number || prev.farmer_number,
              bills: sortedBills
            }));
            setError(null);
          } else {
            setError(data.message || 'Failed to fetch farmer bills');
          }
        } catch (error) {
          console.error('Fetch bills error:', error);
          setError('An error occurred while fetching the farmer bills.');
        } finally {
          setLoading(false);
        }
      };

      fetchBills();
    }
  }, [selectedFarmerId]);

  // Calculate total bill amount
  const calculateTotalBill = (bill) => {
    const sugarcaneWeight = parseFloat(bill.only_sugarcane_weight) || 0;
    const rate = parseFloat(bill.sugarcane_rate) || 0;
    return (sugarcaneWeight * rate).toFixed(2);
  };

  // Action handlers
  const handleWhatsAppShare = (bill) => {
    const message = `🧾 *Farmer Bill Details*
📅 Date: ${new Date(bill.createdAt).toLocaleDateString('en-IN')}
👨‍🌾 Farmer: ${farmerData.farmer_name}
📱 Mobile: ${farmerData.farmer_number}
🚛 Driver: ${bill.driver_name}
🚗 Vehicle: ${bill.vehicle_type}
🌾 Quality: ${bill.sugarcane_quality}
⚖️ Weight: ${bill.only_sugarcane_weight} kg
💰 Rate: ₹${bill.sugarcane_rate}/kg
💵 Total: ₹${calculateTotalBill(bill)}
💳 Given: ₹${bill.given_money}
📊 Remaining: ₹${bill.remaining_money}
💸 Payment: ${bill.payment_type}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${farmerData.farmer_number}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDeleteBill = async (billId) => {
    if (!window.confirm('Are you sure you want to delete this bill? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/bill/delete/${billId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        showFlashMessage('✅ Bill deleted successfully!', 'success');
        // Refresh the bills list
        const updatedBills = farmerData.bills.filter(bill => bill._id !== billId);
        setFarmerData(prev => ({ ...prev, bills: updatedBills }));
      } else {
        const errorData = await response.json();
        showFlashMessage(`❌ Failed to delete bill: ${errorData.message}`, 'error');
      }
    } catch (error) {
      showFlashMessage('❌ Network error while deleting bill', 'error');
    }
  };

  const handleUpdateBill = (billId) => {
    // Navigate to update page or open modal
    showFlashMessage('🔄 Update functionality coming soon!', 'info');
    // You can implement navigation to update page here
    // navigate(`/update-bill/${billId}`);
  };

  const handlePrintBill = (bill) => {
    // Generate print content
    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="text-align: center; color: #333;">Farmer Bill</h2>
        <hr>
        <div style="margin: 20px 0;">
          <strong>Date:</strong> ${new Date(bill.createdAt).toLocaleDateString('en-IN')}<br>
          <strong>Farmer Name:</strong> ${farmerData.farmer_name}<br>
          <strong>Mobile:</strong> ${farmerData.farmer_number}<br>
          <strong>Driver:</strong> ${bill.driver_name}<br>
          <strong>Vehicle Type:</strong> ${bill.vehicle_type}<br>
          <strong>Sugarcane Quality:</strong> ${bill.sugarcane_quality}<br>
          <strong>Weight:</strong> ${bill.only_sugarcane_weight} kg<br>
          <strong>Rate:</strong> ₹${bill.sugarcane_rate}/kg<br>
          <strong>Total Amount:</strong> ₹${calculateTotalBill(bill)}<br>
          <strong>Given Amount:</strong> ₹${bill.given_money}<br>
          <strong>Remaining Amount:</strong> ₹${bill.remaining_money}<br>
          <strong>Payment Type:</strong> ${bill.payment_type}<br>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  // Display the farmer's bill history
  const displayBills = () => {
    if (!selectedFarmerId) {
      return <p className="text-gray-500 mt-4">Please select a farmer to view bills.</p>;
    }

    if (loading) {
      return (
        <div className="text-center mt-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-blue-500">Loading bills...</p>
        </div>
      );
    }

    if (farmerData.bills.length === 0) {
      return <p className="text-gray-500 mt-4">No bills found for this farmer.</p>;
    }

    return (
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Bill History ({farmerData.bills.length} bills) - <span className="text-sm text-green-600">Most Recent First</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 bg-white shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold min-w-[160px]">Actions</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                  Date
                  <span className="text-xs text-green-500 ml-1">(Recent First)</span>
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Driver Name</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Vehicle Type</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Sugarcane Quality</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Weight (kg)</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Rate (₹/kg)</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Total (₹)</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Given (₹)</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Remaining (₹)</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Payment Type</th>
              </tr>
            </thead>
            <tbody>
              {farmerData.bills.map((bill, index) => {
                // Add visual indicator for recent bills (last 7 days)
                const billDate = new Date(bill.createdAt || bill.updatedAt);
                const now = new Date();
                const daysDiff = Math.floor((now - billDate) / (1000 * 60 * 60 * 24));
                const isRecent = daysDiff <= 7;
                
                return (
                  <tr 
                    key={bill._id} 
                    className={`hover:bg-gray-50 transition-colors ${
                      isRecent ? 'bg-green-50 border-l-4 border-l-green-400' : ''
                    }`}
                  >
                    {/* Actions Column */}
                    <td className="border border-gray-300 px-2 py-3">
                      <div className="flex flex-wrap gap-1">
                        {/* WhatsApp Button */}
                        <button
                          onClick={() => handleWhatsAppShare(bill)}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors"
                          title="Send on WhatsApp"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                          </svg>
                          WhatsApp
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteBill(bill._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors"
                          title="Delete Bill"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                          Delete
                        </button>

                        {/* Update Button */}
                        <button
                          onClick={() => handleUpdateBill(bill._id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors"
                          title="Update Bill"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="m18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                          Update
                        </button>

                        {/* Print Button */}
                        <button
                          onClick={() => handlePrintBill(bill)}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors"
                          title="Print Bill"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <polyline points="6,9 6,2 18,2 18,9"/>
                            <path d="M6,18H4a2 2 0 01-2-2v-5a2 2 0 012-2H20a2 2 0 012,2v5a2 2 0 01-2,2H18"/>
                            <rect x="6" y="14" width="12" height="8"/>
                          </svg>
                          Print
                        </button>
                      </div>
                    </td>

                    {/* Date Column */}
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {bill.createdAt 
                            ? new Date(bill.createdAt).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: '2-digit', 
                                year: 'numeric'
                              })
                            : 'N/A'
                          }
                        </span>
                        <span className="text-xs text-gray-500">
                          {bill.createdAt 
                            ? new Date(bill.createdAt).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : ''
                          }
                        </span>
                        {isRecent && (
                          <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded-full mt-1 text-center">
                            New
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Other Columns */}
                    <td className="border border-gray-300 px-4 py-3">
                      {bill.driver_name || 'N/A'}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      {bill.vehicle_type || 'N/A'}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      {bill.sugarcane_quality || 'N/A'}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right">
                      {bill.only_sugarcane_weight || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right">
                      ₹{bill.sugarcane_rate || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-green-600">
                      ₹{calculateTotalBill(bill)}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right">
                      ₹{bill.given_money || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-red-600">
                      ₹{bill.remaining_money || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      {bill.payment_type || 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bill Summary */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-lg font-semibold mb-2 text-blue-800">Bill Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded shadow">
              <p className="text-sm text-gray-600">Total Bills</p>
              <p className="text-xl font-bold text-blue-600">{farmerData.bills.length}</p>
            </div>
            <div className="bg-white p-3 rounded shadow">
              <p className="text-sm text-gray-600">Recent Bills (7 days)</p>
              <p className="text-xl font-bold text-green-600">
                {farmerData.bills.filter(bill => {
                  const billDate = new Date(bill.createdAt || bill.updatedAt);
                  const now = new Date();
                  const daysDiff = Math.floor((now - billDate) / (1000 * 60 * 60 * 24));
                  return daysDiff <= 7;
                }).length}
              </p>
            </div>
            <div className="bg-white p-3 rounded shadow">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-xl font-bold text-green-600">
                ₹{farmerData.bills.reduce((sum, bill) => sum + parseFloat(calculateTotalBill(bill)), 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-white p-3 rounded shadow">
              <p className="text-sm text-gray-600">Total Remaining</p>
              <p className="text-xl font-bold text-red-600">
                ₹{farmerData.bills.reduce((sum, bill) => sum + parseFloat(bill.remaining_money || 0), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Flash Message Component
  const FlashMessage = ({ message, type, onClose, position }) => (
    <div className={`
      fixed ${position === 'top' ? 'top-4' : 'bottom-4'} left-1/2 transform -translate-x-1/2 
      z-50 max-w-md w-full mx-4 p-4 rounded-lg shadow-lg animate-slideIn
      ${type === 'success' 
        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
        : type === 'info'
        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
        : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
      }
    `}>
      <div className="flex items-center justify-between">
        <span className="font-medium">{message.message}</span>
        <button 
          onClick={() => onClose(message.id)}
          className="ml-4 text-white hover:text-gray-200 font-bold text-lg"
        >
          ×
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Flash Messages */}
      {flashMessages.slice(0, 2).map((msg) => (
        <FlashMessage 
          key={msg.id} 
          message={msg} 
          type={msg.type}
          onClose={removeFlashMessage} 
          position="top"
        />
      ))}

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Farmer Bill History
        </h2>

        {/* Loading Indicator */}
        {loading && (
          <div className="text-center mb-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-blue-500">Loading...</p>
          </div>
        )}

        {/* Farmer Information */}
        <div className="space-y-6">
          {/* Farmer Number Input */}
          <div className="flex flex-col relative">
            <label htmlFor="farmer_number" className="text-lg font-semibold text-gray-700 mb-2">
              Farmer's Mobile Number:
            </label>
            <input
              type="text"
              id="farmer_number"
              name="farmer_number"
              value={farmerData.farmer_number}
              onChange={handleFarmerNumberChange}
              placeholder="Enter farmer's mobile number"
              className="p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300"
              required
            />
            
            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto mt-1">
                {filteredFarmers.length > 0 ? (
                  <>
                    <div className="p-2 bg-gray-50 text-xs text-gray-600 border-b">
                      Found {filteredFarmers.length} farmers
                    </div>
                    {filteredFarmers.map((farmer) => (
                      <div
                        key={farmer._id}
                        className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 transition-colors duration-200 last:border-b-0"
                        onClick={() => selectFarmer(farmer)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-gray-800">
                              {farmer.farmer_name || 'No Name'}
                            </div>
                            <div className="text-sm text-gray-600">
                              📱 {farmer.farmer_number || 'No Mobile'}
                            </div>
                          </div>
                          <div className="text-xs text-blue-500 px-2 py-1 bg-blue-100 rounded">
                            Click to select
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="p-3 text-gray-500 text-center">
                    No farmers found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Farmer Name Input (Auto-filled) */}
          <div className="flex flex-col">
            <label htmlFor="farmer_name" className="text-lg font-semibold text-gray-700 mb-2">
              Farmer's Name:
            </label>
            <input
              type="text"
              id="farmer_name"
              name="farmer_name"
              value={farmerData.farmer_name}
              readOnly
              placeholder="Name will appear when farmer is selected"
              className="p-4 border-2 border-gray-300 rounded-xl bg-gray-100 focus:outline-none"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Success Message when farmer is selected */}
        {selectedFarmerId && !error && !loading && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <strong>Farmer Selected:</strong> {farmerData.farmer_name} ({farmerData.farmer_number})
          </div>
        )}
      </div>

      {/* Display the Farmer's Bills */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        {displayBills()}
      </div>

   
    </div>
  );
};

export default AllFarmerPage;
