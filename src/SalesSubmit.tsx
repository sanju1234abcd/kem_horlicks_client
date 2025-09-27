import React, { useState } from "react";
import toast from "react-hot-toast";
import moment from "moment-timezone";
import logo from "./assets/kem_logo.png";

// 🔹 Fixed list of locations
const locations = [
  "Bagbazar",
  "Jodhpur Park",
  "Shib Mandir",
  "Garia Naba Durga",
  "Samaj Sebi",
];

// 🔹 Shift options
const shifts = ["Morning", "Night"];

// 🔹 Unique passwords for each location
const locationPasswords: Record<string, string> = {
  "Bagbazar": "B4g@z8r",
  "Jodhpur Park": "J0d!P7k",
  "Shib Mandir": "Sh1b#M3",
  "Garia Naba Durga": "G@N8D2",
  "Samaj Sebi": "S@m5S3b"
};

const SalesSubmit: React.FC = () => {
  const [formData, setFormData] = useState({
    location: locations[0],
    shift: shifts[0],
    horlicksSale: "",
    water500mlSale: "",
    water1000mlSale: "",
    password: "",
    subDate: "", // will be auto-added on submit
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔑 Validate password
      if (formData.password !== locationPasswords[formData.location]) {
        toast.error("Incorrect password for selected location!");
        setLoading(false);
        return;
      }

      // 🔹 Add submission date (India timezone)
      const subDate = moment().tz("Asia/Kolkata").format("DD/MM/YYYY");

      const finalData = { ...formData, subDate };

      // 🔹 Simulate API call
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/horlicks/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      })

      const result = await response.json() as {
        success: boolean;
        message: string;
      };

      if (!result || !result.success) {
        throw new Error(result.message);
      }

      console.log("Form submitted:", finalData);
      toast.success("Form submitted successfully!");
      setSubmitted(true);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-red-600 p-6">
        <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md text-center">
          <img
            src={logo}
            alt="KEM Events"
            className="mx-auto mb-4 w-24 h-24 object-contain"
          />
          <h1 className="text-2xl font-bold text-blue-700 mb-4">
            Submission Successful ✅
          </h1>
          <p className="text-gray-700">
            Your sales entry has been recorded successfully.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-red-500 p-6">
      <form
      onSubmit={handleSubmit}
        className="bg-white backdrop-blur-md shadow-2xl rounded-2xl p-6 w-full max-w-md space-y-6 border border-blue-200"
      >
        {/* Branding */}
        <div className="text-center">
          <img
            src={logo}
            alt="KEM Events"
            className="mx-auto mb-3 w-28 h-28 object-contain"
          />
          <h1 className="text-2xl font-bold text-blue-800">
            KEM Events Sales Form ( horlicks )
          </h1>
          <p className="text-sm text-gray-600">Salesperson Entry Portal for horlicks</p>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">
            Location
          </label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Shift */}
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">
            Shift
          </label>
          <select
            name="shift"
            value={formData.shift}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            {shifts.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Horlicks Sale */}
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">
            Horlicks Tetra Sale
          </label>
          <input
            type="number"
            name="horlicksSale"
            value={formData.horlicksSale}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
          />
        </div>

        {/* Water 500ml Sale */}
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">
            Mineral Water (500ml) Sale
          </label>
          <input
            type="number"
            name="water500mlSale"
            value={formData.water500mlSale}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
          />
        </div>

        {/* Water 1000ml Sale */}
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">
            Mineral Water (1000ml) Sale
          </label>
          <input
            type="number"
            name="water1000mlSale"
            value={formData.water1000mlSale}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
          />
        </div>

        {/*sales amount */}
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">
            Total Sales Amount
          </label>
          <input
            type="Number"
            disabled = {true}
            value={(Number(formData.horlicksSale) * 15 + Number(formData.water500mlSale) *10 + Number(formData.water1000mlSale) * 20)}
            className="w-full opacity-40 border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          disabled={loading}
          className={`w-full font-semibold py-3 rounded-lg text-lg flex items-center justify-center gap-2 transition ${
            loading
              ? "bg-gradient-to-r from-red-400 to-blue-400 text-white cursor-not-allowed"
              : "bg-gradient-to-r from-red-600 to-blue-700 text-white hover:opacity-90"
          }`}
        >
          {loading && (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default SalesSubmit;
