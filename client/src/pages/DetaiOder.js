import React, { memo, useState } from "react";
import { Button, ItemProduct } from "../components";
import moment from "moment";
import { statusOrder } from "../ultils/contants";
import { apiBuyOrder, apiDeteOrder, apiUpdateOrder } from "../apis";
import { useParams } from "react-router-dom";

const DetaiOder = ({ edit, render, setEdit }) => {
  const [detai, setDetai] = useState(null);
  const handleCloseModal = () => {
    setEdit(null);
  };

  const fetchUpdateOder = async () => {
    const response = await apiBuyOrder(edit._id);
    setDetai(response);
  };
  const fetchDeteOder = async () => {
    const response = await apiDeteOrder(edit._id);
    setDetai(response);
  };

  return (
    <div className="w-full flex flex-col gap-4 relative">
      <div className="h-[20px] w-full"></div>
      <div className="p-4 border-b w-[80%] bg-gray-100 flex justify-between items-center fixed top-0">
        <h1 className="text-3xl font-bold tracking-tight ">
          Chi tiết đơn hàng
        </h1>
        <button
          className=" text-red-600 hover: underline cursor-pointer mr-10"
          onClick={handleCloseModal}
        >
          Trở về
        </button>
      </div>
      <div className="p-4 w-full flex flex-col ">
        <div className="py-5 bg-slate-200 rounded-2xl">
          {edit?.products?.map((el, xid) => (
            <ItemProduct productData={el} />
          ))}
        </div>
      </div>
      <div className="px-10">
        <div className="flex flex-row mt-4 justify-between">
          <div>
            <span className=" text-base">Ngày đặt đơn: </span>
            <span className=" text-base">
              {moment(edit.createdAt).format("DD / MM / YYYY")}
            </span>
          </div>

          <div>
            <span className=" text-base">Người đặt: </span>
            <span className=" text-base">{}</span>
          </div>
        </div>
        <div className="flex flex-row mt-4 justify-between">
          <div></div>
          <div>
            <span className="text-base">Trạng thái đơn: </span>
            <span className="text-base">
              {
                statusOrder.find((status) => +status.code === +edit.status)
                  ?.title
              }
            </span>
          </div>
        </div>
        <div className="flex flex-row mt-4 justify-between">
          <div></div>
          <div>
            <span className="text-red-600 text-lg">Tổng cộng: </span>
            <span className="text-red-600 text-lg">{edit.total}</span>
          </div>
        </div>
        <div className="flex flex-row mt-4 justify-between">
          <div></div>
          <div className="flex flex-row gap-4 ">
            <Button name="Xác nhận đơn" onClick={{ fetchUpdateOder }} />
            <Button name="Huỷ đơn" onClick={{ fetchDeteOder }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(DetaiOder);
