import React, { useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import FarmerBuyingBill from '../components/FarmerBuyingBill';

const FarmerBillingPage = () => {
  const [billHtml, setBillHtml] = useState('');
  const language = "mr";  // or "en" as per user selection

  // Example data for the bill (update numbers for your real case)
  const weightData = {
    second_cloumn: [10, 2, 8, 1, 7],  // Example: ton values for each row
    thrid_column: [10000, 2000, 8000, 1000, 7000], // Example: kg values for each row
  };

  const driverName = "Ram Kumar";
  const cutter = "Shyam Sundar"; // Not cutterName

  // Generate Bill HTML as static markup
  const generateBillHTML = () => {
    return ReactDOMServer.renderToStaticMarkup(
      <FarmerBuyingBill
        language={language}
        date="2023-10-25"
        farmerName="John Doe"
        farmerNumber="1234567890"
        sugarcaneQuality="High Quality"
        vehicleType="Truck"
        driverName={driverName}
        cutter={cutter}
        weightData={weightData}
        totalBill="₹10000"
        givenAmount="₹5000"
        remainingAmount="₹5000"
        paymentType="Cash"
      />
    );
  };

  // Handle Print: Trigger the browser's print dialog
  const handlePrint = () => {
    const billHTML = generateBillHTML();
    setBillHtml(billHTML);

    const printContainer = document.createElement('div');
    printContainer.innerHTML = billHTML;
    document.body.appendChild(printContainer);

    window.print();

    setTimeout(() => {
      document.body.removeChild(printContainer);
    }, 1000);
  };

  // Save Bill: Generate a PDF using html2pdf
  const handleSave = () => {
    const billHTML = generateBillHTML();

    const saveContainer = document.createElement('div');
    saveContainer.innerHTML = billHTML;
    document.body.appendChild(saveContainer);

    window.html2pdf()
      .from(saveContainer)
      .save('farmer-bill.pdf')
      .finally(() => {
        document.body.removeChild(saveContainer);
      });
  };

  return (
    <div>
      {/* This is the section you want to hide in the print version */}
      <h1 className="text-center text-2xl font-bold mb-8 no-print">Farmer Billing</h1>

      {/* Bill preview (visible only after Print/Save) */}
      <div dangerouslySetInnerHTML={{ __html: billHtml }} />

      {/* Print and Save buttons */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handlePrint}
          className="mx-2 p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Print Bill
        </button>
        <button
          onClick={handleSave}
          className="mx-2 p-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save Bill
        </button>
      </div>
    </div>
  );
};

export default FarmerBillingPage;
