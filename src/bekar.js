import React, { useState } from "react";
import toast from "react-hot-toast";

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

const GetHorlicksSales: React.FC = () => {
  const [shift, setShift] = useState("Morning");
  const [subDate, setSubDate] = useState(dateOptions[0]);
  const [salesData, setSalesData] = useState<SaleData[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!subDate) {
      toast.error("Please select a date");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/horlicks/get?shift=${shift}&subDate=${subDate}`
      );

      const result = await response.json();
      if(!result || !result.success){
        toast.error("Error fetching data");
        throw new Error(result.message)
      }
      else{
        setSalesData(result.data);
        toast.success("Data fetched successfully!");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error fetching data");
      setSalesData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Horlicks Sales Data</h1>

      {/* Filter */}
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

        {/* Fetch Button */}
        <button
          onClick={handleFetch}
          disabled={loading}
          className={`w-full sm:w-auto px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Fetching..." : "Fetch Data"}
        </button>
      </div>

      {/* Results Table */}
      {salesData.length > 0 && (
        <div className="overflow-x-auto w-full max-w-3xl">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead className="bg-blue-100">
              <tr>
                <th className="py-2 px-4 border-b">Location</th>
                <th className="py-2 px-4 border-b">Horlicks Sale</th>
                <th className="py-2 px-4 border-b">Water 500ml Sale</th>
                <th className="py-2 px-4 border-b">Water 1000ml Sale</th>
                <th className="py-2 px-4 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((sale) => (
                <tr key={sale._id} className="text-center">
                  <td className="py-2 px-4 border-b">{sale.location}</td>
                  <td className="py-2 px-4 border-b">{sale.horlicksSale}</td>
                  <td className="py-2 px-4 border-b">{sale.water500mlSale}</td>
                  <td className="py-2 px-4 border-b">{sale.water1000mlSale}</td>
                  <td className="py-2 px-4 border-b">{sale.subDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {salesData.length === 0 && !loading && (
        <p className="text-gray-500 mt-4">No data found for selected shift and date.</p>
      )}
    </div>
  );
};

export default GetHorlicksSales;
