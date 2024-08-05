import React, { useEffect, useState } from "react";
import { apiGetOrder } from "../apis/app";
import { InputFrom, Select } from "../components";
import { useForm } from "react-hook-form";
import useDebounce from "../components/useDebounce";
import Pagination from "../components/Pagination";
import moment from "moment";
import { statusOrder } from "../ultils/contants";
import icons from "../ultils/icons";
import { useSearchParams } from "react-router-dom";
import DetaiOder from "./DetaiOder";

const { MdRemoveRedEye } = icons;

const ManageOrder = () => {
  const [orders, setOrders] = useState(null);
  const [counts, setCounts] = useState(null);
  const [params] = useSearchParams();
  const [edit, setEdit] = useState(null);
  const [update, setUpdate] = useState(null);
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({});
  const q = watch("q");
  const status = watch("status");
  const fetchOrder = async (params) => {
    const response = await apiGetOrder({
      ...params,
      limit: 10,
    });
    if (response.success) {
      setOrders(response.orders);
      setCounts(response.counts);
    }
  };
  const render = () => {
    setUpdate(!update);
  };
  const queryDebounce = useDebounce(watch("q"), 800);
  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    if (queryDebounce) queries.q = queryDebounce;
    fetchOrder(queries);
    console.log(queries);
  }, [queryDebounce]);
  console.log(orders);
  useEffect(() => {
    fetchOrder();
  }, []);
  return (
    <div className="w-full flex-col gap-4 relative">
      {edit && (
        <div className="absolute inset-0 min-h-screen bg-gray-100 z-50 ">
          <DetaiOder edit={edit} render={render} setEdit={setEdit} />
        </div>
      )}
      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
        <span>Quản lý đơn hàng</span>
      </h1>
      <div className="w-full py-4 px-4">
        <form className="w-[45%]">
          <InputFrom
            id="q"
            register={register}
            errors={errors}
            fullwidth
            placeholder="Tìm kiếm sản phẩm"
          />
          {/* <SusSelect
            options={statusOrder}
            value={status}
            onChange={(val) => setValue("status", val)}
          /> */}
          {/* <SusSelect
            options={statusOrder}
            value={status}
            onChange={(val) => setValue("status", val)}
          /> */}
        </form>
        <table className="table-auto mb-6 text-left w-full ">
          <thead className="font-bold bg-gray-500 text-[13px] text-white">
            <tr>
              <th className="text-center py-2">STT</th>
              <th className="py-2">Đơn hàng</th>
              <th className="text-center py-2">Tiền</th>
              <th className="text-center py-2">Trạng thái</th>
              <th className="text-center py-2">Ngày</th>
              <th>Xem </th>
            </tr>
          </thead>

          <tbody>
            {orders?.map((el, idx) => {
              return (
                <tr className="border-b " key={el._id}>
                  <td className="text-center py-2">{idx + 1}</td>
                  <td className="text-center py-2">
                    <span className="flex flex-col items-start">
                      {el.products?.map((item) => (
                        <span key={item._id}>
                          {`${item.title}- ${item.color}`}
                        </span>
                      ))}
                    </span>
                  </td>
                  <td className="text-center py-2">{el.total + " " + "VND"}</td>
                  <td className="text-center py-2">{el.status}</td>
                  <td className="text-center py-2">
                    {moment(el.createdAt).format("DD / MM / YYYY")}
                  </td>
                  <td className=" py-2 flex-row gap-2">
                    <MdRemoveRedEye
                      size={24}
                      color="red"
                      onClick={() => {
                        setEdit(el);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="w-full flex justify-b">
        <Pagination totalCount={counts} />
      </div>
    </div>
  );
};

export default ManageOrder;
