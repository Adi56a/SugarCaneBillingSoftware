import React from 'react';

const translations = {
  en: {
    companyName: "Dhawle Gul Uddyog Samuha",
    address: "Wadgaw Rasai, District Pune, pin - 412211",
    contact: "Contact: Dhwale Brothers 35236532445",
    title: "Buying Bill Sugarcane Weight Bill",
    date: "Date",
    farmerName: "Farmer Name",
    farmerNumber: "Farmer Number",
    sugarcaneQuality: "Quality of Sugarcane",
    vehicleType: "Vehicle Type",
    driverName: "Driver Name",
    cutter: "Cutter",
    firs_column: [
      "Weight of Vehicle with Filled Sugarcane",
      "Weight of Empty Vehicle",
      "Sugarcane Weight",
      "Binding material",
      "Only Sugarcane Weight",
    ],
    second_cloumn: [0, 0, 0, 0, 0],
    thrid_column: [0, 0, 0, 0, 0],
    totalBill: "Total Bill",
    givenAmount: "Given Amount",
    remainingAmount: "Remaining Amount",
    paymentType: "Type of Payment",
  },
  mr: {
    companyName: "धवाले गुळ उद्योग समूह",
    address: "वडगाव रासाई, जिल्हा पुणे, पिन - ४१२२११",
    contact: "संपर्क: धवले भानुदु ३५२३६५३२४४५",
    title: "खरेदी बिल शेतकरी ऊस वजन बिल",
    date: "तारीख",
    farmerName: "शेतकऱ्याचे नाव",
    farmerNumber: "शेतकऱ्याचा नंबर",
    sugarcaneQuality: "ऊसाची गुणवत्ता",
    vehicleType: "वाहन प्रकार",
    driverName: "चालकाचे नाव",
    cutter: "कटर",
    firs_column: [
      "भरलेल्या ऊसासह वाहनाचे वजन",
      "रिकाम्या वाहनाचे वजन",
      "ऊसाचे वजन",
      "बांधणी साहित्य",
      "फक्त ऊसाचे वजन",
    ],
    second_cloumn: [0, 0, 0, 0, 0],
    thrid_column: [0, 0, 0, 0, 0],
    totalBill: "एकूण बिल",
    givenAmount: "दिलेली रक्कम",
    remainingAmount: "शिल्लक रक्कम",
    paymentType: "पेमेंट प्रकार",
  },
};

const FarmerBuyingBill = ({
  language = "en",
  date,
  farmerName,
  farmerNumber,
  sugarcaneQuality,
  vehicleType,
  driverName,
  cutter,
  weightData,
  totalBill,
  givenAmount,
  remainingAmount,
  paymentType,
}) => {
  const t = translations[language];
  const second_cloumn = weightData?.second_cloumn || t.second_cloumn;
  const thrid_column = weightData?.thrid_column || t.thrid_column;
  const logoSrc = "../public/bill_logo.jpg";

  return (
    <div
      className="max-w-[830px] mx-auto bg-white border text-[15px] leading-normal"
      style={{
        width: "20.5cm",
        minHeight: "15cm",
        margin: "0 auto",
        boxSizing: "border-box",
        padding: "24px 32px 12px 32px", // Reduced padding at top
      }}
    >
      {/* Print styles */}
      <style>{`
        @media print {
          body { margin: 0 !important; }
          .no-print { display: none !important; }
          img.print-logo {
            display: block !important;
            max-height: 56px !important;
            width: auto !important;
            margin: 0 auto 8px auto;
          }
        }
      `}</style>

      {/* Header */}
      <div className="text-center pb-2 mb-2 border-b-[2px] border-gray-200">
        <img
          src={logoSrc}
          alt="Logo"
          className="print-logo mx-auto mb-1"
          style={{ maxHeight: 56, width: "auto", display: "block" }}
          onError={e => { e.target.style.display = 'none'; }}
        />
        <div className="font-bold text-[1.5rem] text-indigo-800">{t.companyName}</div>
        <div className="font-medium text-gray-900 text-[1.07rem]">{t.address}</div>
        <div className="font-medium text-gray-700 text-[1rem]">{t.contact}</div>
        <div className="font-semibold text-gray-800 text-[1.1rem] pt-0 pb-1">{t.title}</div>
      </div>

      {/* Bill Info */}
      <div className="flex justify-between mb-2 text-[1rem]">
        <div>
          <div><b>{t.date}:</b> {date}</div>
          <div><b>{t.farmerName}:</b> {farmerName}</div>
          <div><b>{t.farmerNumber}:</b> {farmerNumber}</div>
          <div><b>{t.driverName}:</b> {driverName}</div>
        </div>
        <div className="text-right">
          <div><b>{t.sugarcaneQuality}:</b> {sugarcaneQuality}</div>
          <div><b>{t.vehicleType}:</b> {vehicleType}</div>
          <div><b>{t.cutter}:</b> {cutter}</div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full my-2">
        <table className="w-full border text-[1rem]">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2 text-left">{t.firs_column[0]}</th>
              <th className="border px-3 py-2 text-center">Weight in Ton</th>
              <th className="border px-3 py-2 text-center">Weight in Kg</th>
            </tr>
          </thead>
          <tbody>
            {t.firs_column.map((row, index) => (
              <tr key={index}>
                <td className="border px-3 py-2">{row}</td>
                <td className="border px-3 py-2 text-center">{second_cloumn[index] ?? 0}</td>
                <td className="border px-3 py-2 text-center">{thrid_column[index] ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bill Summary */}
      <div className="flex justify-between mt-4 mb-2 text-[1rem] border-t pt-2">
        <div>
          <div><b>{t.totalBill}:</b> {totalBill}</div>
          <div><b>{t.givenAmount}:</b> {givenAmount}</div>
        </div>
        <div className="text-right">
          <div><b>{t.remainingAmount}:</b> {remainingAmount}</div>
          <div><b>{t.paymentType}:</b> {paymentType}</div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full text-center text-xs text-gray-500 mt-2" style={{ fontSize: 12 }}>
        {t.companyName} - All Rights Reserved
      </div>
    </div>
  );
};

export default FarmerBuyingBill;
