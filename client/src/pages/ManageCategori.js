import React, { useCallback, useEffect, useState } from "react";
import moment from "moment";
import icons from "../ultils/icons";
import InputFrom from "../components/InputFrom";
import Pagination from "../components/Pagination";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Select } from "../components";
import Swal from "sweetalert2";
import { apiDeleteCategores, apiGetCategores } from "../apis";
const { MdDelete, MdEditSquare, MdOutlineClear, MdSystemUpdateAlt } = icons;

const ManageCategori = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({});
  const [category, setCategory] = useState(null);
  const [edit, setEdit] = useState(null);
  const fetchCategory = async () => {
    const response = await apiGetCategores();
    if (response.success) setCategory(response.res);
  };

  // const handleUpdate = async (data) => {
  //   const response = await apiUpdateUser(data, edit._id);
  //   if (response.success) {
  //     setEdit(null);
  //     render();
  //   } else {
  //     console.log(3);
  //   }
  // };
  const handleDeleteUser = (uid) => {
    Swal.fire({
      title: "Are you sure...",
      text: "Are you ready remove this user?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log("uid", uid);
        const response = await apiDeleteCategores(uid);
        console.log("response", uid);
        if (response.success) {
          Swal.fire("Thành công.", response.mes, "success");
          window.location.reload();
        } else {
          Swal.fire("Đã sảy ra lỗi.", response.mes, "error");
        }
      }
    });
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    if (edit)
      reset({
        role: edit.role,
        email: edit.email,
        name: edit.name,
        mobile: edit.mobile,
      });
  }, [edit]);
  return (
    <div className="w-full">
      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
        <span>Quản lý thể loại</span>
      </h1>
      <div className="w-full py-4 px-4">
        <form>
          {edit && <Button type="submit" name="Cập nhật" />}
          <table className="table-auto mb-6 text-left w-full ">
            <thead className="font-bold bg-gray-500 text-[13px] text-white">
              <tr>
                <th className="px-2 py-2">STT</th>
                <th className="px-5 py-2">Ảnh</th>
                <th className="px-2 py-2">Tên</th>
                <th className="px-2 py-2">Ngày tạo</th>
                <th className="px-5 py-2">Xoá</th>
              </tr>
            </thead>
            <tbody>
              {category?.map((el, idx) => (
                <tr key={el._id} className="border border-b-1">
                  <td className="px-2 py-2">{idx + 1}</td>

                  <td className="px-2 py-2">
                    {el.image && (
                      <img
                        src={el.image}
                        alt="hu"
                        className="w-[60px] h-[60px] object-contain"
                      />
                    )}
                  </td>
                  <td className="px-2 py-2">
                    {edit?._id === el._id ? (
                      <InputFrom
                        register={register}
                        errors={errors}
                        defaulfValue={edit?.name}
                        id={"name"}
                        validate={{ required: "Không được để trống" }}
                      />
                    ) : (
                      <span>{el.title}</span>
                    )}
                  </td>

                  <td className="px-2 py-2">
                    {moment(el.createdAt).format("DD / MM / YYYY")}
                  </td>
                  <td className="px-2 py-2 flex-row gap-2">
                    <td className="px-3 py-2">
                      <MdDelete
                        size={24}
                        color="red"
                        onClick={() => {
                          handleDeleteUser(el._id);
                        }}
                      />
                    </td>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
};

export default ManageCategori;
