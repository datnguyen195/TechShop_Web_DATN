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
  const [period, setPeriod] = useState("yearly");
  const [selectedYear, setSelectedYear] = useState(2024);
  const [dataDashboard, setDataDashboard] = useState({
    labels: [],
    datasets: [],
  });

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
    const params = { year: selectedYear, period: period };
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
  }, [selectedYear, period]);

  return (
    <div className="px-[59px] mt-12 relative">
      <div className="flex justify-between w-[210px]">
        <button onClick={() => setSelectedYear((prev) => prev - 1)}>
          {"<<"}
        </button>
        <div>{selectedYear}</div>
        <button onClick={() => setSelectedYear((prev) => prev + 1)}>
          {">>"}
        </button>
      </div>
      <div className="flex justify-between w-[210px]">
        <button onClick={() => setPeriod("yearly")}>Năm</button>
        <button onClick={() => setPeriod("quarterly")}>Quý</button>
      </div>
      <Line data={dataDashboard} options={options} />
    </div>
  );
};

export default Dashboard;
