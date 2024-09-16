import React, { useState } from "react";
import { apiUpdateUser } from "../apis";
import { useForm } from "react-hook-form";

const DetaiUser = ({ show, render, setShow }) => {
  const [isBlock, setIsBlock] = useState(show.isBlocked);
  const handleCloseModal = () => {
    setShow(null);
    window.location.reload();
  };

  const handleLockApp = async () => {
    const data = {
      isBlocked: !show.isBlocked,
    };
    const response = await apiUpdateUser(data, show._id);
    if (response.success) {
      setIsBlock(!show.isBlocked);
    }
  };
  console.log("show", show.isBlocked);
  return (
    <div className="w-full flex flex-col gap-4 relative">
      <div className="h-6 w-full"></div>
      <div className="p-4 border-b w-full md:w-[80%] bg-gray-100 flex justify-between items-center fixed top-0 z-50 shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight">
          Chi tiết khách hàng
        </h1>
        <div className="flex items-center gap-4 mr-10">
          <button
            className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
            onClick={handleLockApp}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v-3m0 0a3 3 0 10-6 0v3m6 0h6v3m0 0a3 3 0 01-6 0v-3M12 6a4 4 0 118 0"
              />
            </svg>
            {isBlock ? "Mở khoá" : "Khóa Ứng Dụng"}
          </button>
          <button
            className="text-red-600 hover:underline cursor-pointer"
            onClick={handleCloseModal}
          >
            Trở về
          </button>
        </div>
      </div>

      <div className="pt-[85px] p-4">
        <div className="flex items-center mb-6">
          <img
            className="h-40 w-40 rounded-full shadow-lg"
            src={show?.avatar}
            alt="Avatar"
          />
          <div className="ml-6">
            <h2 className="text-2xl font-semibold">{show.name}</h2>
            <p className="text-gray-600">{show.email}</p>
            <p className="text-gray-600">{show.mobile}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Địa chỉ</h3>
          {show.address.map((addr, index) => (
            <div
              key={index}
              className="mb-4 p-4 border border-gray-300 rounded-lg shadow-sm bg-white"
            >
              <p className="font-medium text-lg">{addr.name}</p>
              <p className="text-gray-700">
                {addr.street}, {addr.ward}
              </p>
              <p className="text-gray-700">
                {addr.district}, {addr.city}
              </p>
              <p className="text-gray-700">Số điện thoại: {addr.phone}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetaiUser;
