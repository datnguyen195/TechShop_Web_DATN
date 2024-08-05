import React, { useCallback, useEffect, useState } from "react";
import { apiDeleteRating, apiGetRatings } from "../apis/app";
import moment from "moment";
import icons from "../ultils/icons";
import { useNavigate } from "react-router-dom";
import path from "../ultils/path";
import Swal from "sweetalert2";
const { MdRemoveRedEye, MdDelete } = icons;

const ManageRatings = () => {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState(null);
  const [update, setUpdate] = useState(false);
  const fetchRatings = async () => {
    const response = await apiGetRatings();
    if (response) {
      setRatings(response);
    }
  };

  console.log("ratings", ratings);
  const handleDeleteRatings = (rid, pid) => {
    Swal.fire({
      title: "Xác nhận hành động...",
      text: "Bạn có chắc chắn muốn xóa người dùng này không?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log("uid", rid);
        const response = await apiDeleteRating(rid, pid);
        window.location.reload();
      }
    });
  };

  useEffect(() => {
    fetchRatings();
  }, [update]);

  return (
    <div className="w-full">
      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
        <span>Quản lý bình luận</span>
      </h1>
      <div className="w-full py-4 px-4">
        <div className="flex justify-end "></div>

        <form>
          <table className="table-auto mb-6 text-left w-full ">
            <thead className="font-bold bg-gray-500 text-[13px] text-white">
              <tr>
                <th className="px-2 py-2">STT</th>
                <th className="px-2 py-2">Người bình luận</th>
                <th className="px-2 py-2">Sao</th>
                <th className="px-2 py-2">Bình luận</th>
                <th className="px-2 py-2">Ngày tạo</th>
                <th className="px-5 py-2">Xem</th>
              </tr>
            </thead>
            <tbody>
              {ratings?.ratings?.map((el, idx) => (
                <tr key={el._id} className="border border-b-1">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-2 py-2">{el.name}</td>
                  <td className="px-2 py-2">{el.star}</td>
                  <td className="px-2 py-2">{el.comment}</td>
                  <td className="px-2 py-2">
                    {moment(el.createdAt).format("DD / MM / YYYY")}
                  </td>
                  <td className="flex-row gap-2">
                    <td className="px-2 py-2">
                      <MdRemoveRedEye
                        size={24}
                        color="red"
                        onClick={() => {
                          navigate(`/detai/${el.productId}`);
                        }}
                      />
                    </td>
                    <td className=" py-2">
                      <MdDelete
                        size={24}
                        color="red"
                        onClick={() => {
                          handleDeleteRatings(el._id, el.productId);
                        }}
                      />
                    </td>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>
        <div className="w-full flex justify-b">
          {/* <Pagination totalCount={users?.counts} /> */}
        </div>
      </div>
    </div>
  );
};

export default ManageRatings;
