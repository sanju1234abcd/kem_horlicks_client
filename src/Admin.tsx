import React, { useState } from "react";
import toast from "react-hot-toast";
import ExcelJS from "exceljs";

interface SaleData {
  location: string;
  shift: string;
  horlicksSale: number;
  water500mlSale: number;
  water1000mlSale: number;
  subDate: string;
  _id: string;
}

const dateOptions = [
  "27/09/2025",
  "28/09/2025",
  "29/09/2025",
  "30/09/2025",
  "01/10/2025",
  "02/10/2025",
];

const ExportHorlicksExcel: React.FC = () => {
  const [shift, setShift] = useState("Morning");
  const [subDate, setSubDate] = useState(dateOptions[0]);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  const fetchAndExport = async () => {
    setLoading(true);
    if(password !== "G7p!xQ2r") {
      toast.error("Incorrect password!");
      setLoading(false);
      return;
    }
    else{
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/horlicks/get?shift=${shift}&subDate=${subDate}`
      );

      const result = await response.json()

      if(!result || !result.success){
        toast.error("Error fetching data");
        throw new Error(result.message)
      }
      const salesData: SaleData[] = result.data;

      if (salesData.length === 0) {
        toast.error("No data found for selected shift and date");
        return;
      }

      // Create workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Horlicks Sales");

      // Define columns
      worksheet.columns = [
        { header: "Date", key: "subDate", width: 15 },
        { header: "Location", key: "location", width: 20 },
        { header: "Shift", key: "shift", width: 15 },
        { header: "Horlicks Sale", key: "horlicksSale", width: 15 },
        { header: "Water 500ml Sale", key: "water500mlSale", width: 18 },
        { header: "Water 1000ml Sale", key: "water1000mlSale", width: 18 },
        { header: "Total Amount", key: "totalAmount", width: 18 },
      ];

      // Add rows
      salesData.forEach((sale) => {
        const total =
          Number(sale.horlicksSale) * 20 +
          Number(sale.water500mlSale) * 10 +
          Number(sale.water1000mlSale) * 20;

        worksheet.addRow({
          subDate: sale.subDate,
          location: sale.location,
          shift: sale.shift,
          horlicksSale: sale.horlicksSale,
          water500mlSale: sale.water500mlSale,
          water1000mlSale: sale.water1000mlSale,
          totalAmount: total,
        });
      });

      // Style header
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF1E3A8A" },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // Style data rows
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber !== 1) {
          row.eachCell((cell) => {
            cell.alignment = { horizontal: "center", vertical: "middle" };
            cell.border = {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            };
          });
        }
      });

      // Write to buffer
      const buffer = await workbook.xlsx.writeBuffer();

      // Create Blob and download via anchor
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Horlicks_Sales_${subDate}_${shift}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Excel file created successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error("Error fetching or creating Excel");
    }
    }
    setLoading(false);
    
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Export Horlicks Sales</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full max-w-md">
        {/* Shift */}
        <select
          value={shift}
          onChange={(e) => setShift(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Morning">Morning (10am-10pm)</option>
          <option value="Night">Night (10pm-10am)</option>
        </select>

        {/* Date */}
        <select
          value={subDate}
          onChange={(e) => setSubDate(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {dateOptions.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>


        {/*password*/}
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
          />
        </div>

        {/* Export Button */}
        <button
          onClick={fetchAndExport}
          disabled={loading}
          className={`w-full sm:w-auto px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Processing..." : "Export Excel"}
        </button>
      </div>
    </div>
  );
};

export default ExportHorlicksExcel;
