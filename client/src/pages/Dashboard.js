import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { apiDashboard, apiDashboardTop, apiTopSellingProducts } from "../apis"; // Ensure this is defined

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [month, setMonth] = useState(null); // Initially set month to null (for whole year)
  const [selectedYear, setSelectedYear] = useState(2024);
  const [dataDashboard, setDataDashboard] = useState({
    labels: [],
    datasets: [],
  });
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [showTopSelling, setShowTopSelling] = useState(false);

  const years = [2024, 2025, 2026];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const options = {
    scales: {
      y1: {
        type: "linear",
        position: "left",
        ticks: {
          beginAtZero: true,
        },
        max: 100,
      },
      y2: {
        type: "linear",
        position: "right",
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  const fetchDashboard = async () => {
    const params = { year: selectedYear, month: month }; // month will be null for whole year
    try {
      const response = await apiDashboard(params);
      if (response) {
        setDataDashboard(response);
        console.log("response", response);
      }
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    }
  };

  const fetchTopSellingProducts = async () => {
    try {
      const response = await apiDashboardTop(); // Ensure this API exists
      if (response) {
        setTopSellingProducts(response.response);
        console.log(response);
      }
    } catch (error) {
      console.error("Error fetching top-selling products", error);
    }
    setShowTopSelling(!showTopSelling); // Toggle visibility
  };

  console.log(topSellingProducts);
  useEffect(() => {
    if (!showTopSelling) {
      fetchDashboard();
    }
  }, [selectedYear, month, showTopSelling]);

  return (
    <div className="px-[59px] mt-12 relative">
      {/* Chọn năm */}
      <div className="flex justify-between w-[410px] mb-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          disabled={showTopSelling}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {"Năm " + year}
            </option>
          ))}
        </select>

        {/* Chọn tháng hoặc cả năm */}
        <select
          value={month ?? "year"} // If month is null, display "Cả năm"
          onChange={(e) => {
            const selectedValue = e.target.value;
            setMonth(selectedValue === "year" ? null : Number(selectedValue)); // Set month to null for "Cả năm"
          }}
          disabled={showTopSelling}
        >
          <option value="year">Cả năm</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {"Tháng " + month}
            </option>
          ))}
        </select>

        <button
          className={`flex justify-between items-center text-white text-sm p-1.5 rounded-md shadow-md transition duration-300 ${
            showTopSelling
              ? "bg-red-500 hover:bg-red-600"
              : "bg-slate-500 hover:bg-slate-600"
          }`}
          onClick={fetchTopSellingProducts}
          // disabled={showTopSelling && !topSellingProducts.length}
        >
          {showTopSelling ? "Quay lại Dashboard" : "Sản phẩm bán chạy"}
        </button>
      </div>

      {/* Biểu đồ dữ liệu */}
      {!showTopSelling ? (
        <Line data={dataDashboard} options={options} />
      ) : (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">
            Danh sách sản phẩm bán chạy
          </h2>
          <ul>
            {topSellingProducts.map((product) => (
              <li
                key={product._id}
                className="flex items-center p-4 border rounded-md shadow-md bg-white"
              >
                <img
                  src={product.thumb} // Assuming each product object has an `image` property
                  alt={product.title}
                  className="w-24 h-24 object-cover rounded-md mr-4"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Đã bán: {product.sold}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Giá: ${product.price}
                  </p>
                  <p className="text-sm text-gray-600">
                    Danh mục: {product.category}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
