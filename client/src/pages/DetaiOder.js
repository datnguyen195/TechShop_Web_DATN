import React, { memo } from "react";
import { ItemProduct } from "../components";

const DetaiOder = ({ edit, render, setEdit }) => {
  console.log("edir", edit.products);
  const handleCloseModal = () => {
    setEdit(null);
  };
  return (
    <div className="w-full flex flex-col gap-4 relative">
      <div className="h-[20px] w-full"></div>
      <div className="p-4 border-b w-[80%] bg-gray-100 flex justify-between items-center fixed top-0">
        <h1 className="text-3xl font-bold tracking-tight">Chi tiết đơn hàng</h1>
        <button
          className=" text-red-600 hover: underline cursor-pointer"
          onClick={handleCloseModal}
        >
          Trở về
        </button>
      </div>
      <div className="p-4 w-full flex flex-col ">
        {edit?.products?.map((el, xid) => {
          <img
            src="https://i.pinimg.com/736x/23/94/b3/2394b33e28979f104f63a9f9874b8719.jpg"
            alt="hu"
            className="w-[200px] h-[200px] object-contain"
          />;
        })}
      </div>
    </div>
  );
};

export default memo(DetaiOder);
