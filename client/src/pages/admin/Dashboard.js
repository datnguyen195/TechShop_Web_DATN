import React from "react";

const Dashboard = () => {
  const data = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
    datasets: [
      {
        label: "Doanh thu",
        data: [3500, 4200, 2800, 5200, 6300, 4100],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Số đơn hàng",
        data: [15, 18, 12, 20, 25, 16],
        fill: false,
        borderColor: "rgb(54, 162, 235)",
        tension: 0.1,
      },
      {
        label: "Lợi nhuận",
        data: [1500, 1800, 1200, 2000, 2500, 1600],
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="px-[59px] mt-12 relative">
      <div className="absolute top-0 2-10 left-[59px] bg-[rgba(77,34,104,0.9)] right-[59px] bottom-0"></div>
      <div className="absolute top-0 2-20 left-[59px] right-[59px] bottom-0 p-5">
        <h3 className="text-2x1 text-white font-bold">#zingchart</h3>
        <div className="flex gap-4">
          <div className="flex-4 border border-white">rank</div>
          <div className="flex-6 border border-white">
            {/* <Line data={data} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
