import React, { memo } from "react";

const DetaiOder = ({ edit, render, setEdit, onClose }) => {
  const handleCloseModal = () => {
    setEdit(null);
  };
  return (
    <div className="w-full flex flex-col gap-4 relative">
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b w-[80%] bg-gray-100 flex justify-between items-center fixed top-0">
        <h1 className="text-3xl font-bold tracking-tight">Update products</h1>
        <button
          className=" text-red-600 hover: underline cursor-pointer"
          onClick={handleCloseModal}
        >
          Trở về
        </button>
      </div>
      DetaiOder
    </div>
  );
};

export default memo(DetaiOder);
