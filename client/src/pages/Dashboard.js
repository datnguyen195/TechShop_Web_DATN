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
import { apiDashboard } from "../apis";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [month, setMonth] = useState();
  const [selectedYear, setSelectedYear] = useState(2024);
  const [dataDashboard, setDataDashboard] = useState({
    labels: [],
    datasets: [],
  });

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
    const params = { year: selectedYear, month: month };
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

  useEffect(() => {
    fetchDashboard();
  }, [selectedYear, month]);

  return (
    <div className="px-[59px] mt-12 relative">
      {/* Chọn năm */}
      <div className="flex justify-between w-[410px] mb-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {"Năm " + year}
            </option>
          ))}
        </select>
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {"Thàng  " + month}
            </option>
          ))}
        </select>
        {/* <button className="flex justify-between items-center bg-slate-500 text-white text-sm p-1.5 rounded-md shadow-md hover:bg-slate-600 transition duration-300">
          Sản phẩm bán chạy
        </button> */}
      </div>

      {/* Chọn tháng */}

      <Line data={dataDashboard} options={options} />
    </div>
  );
};

export default Dashboard;
