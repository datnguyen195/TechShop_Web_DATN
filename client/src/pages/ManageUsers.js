import React, { useCallback, useEffect, useState } from "react";
import { apiDeleteUser, apiGetUser, apiUpdateUser } from "../apis/user";
import { roles } from "../ultils/contants";
import icons from "../ultils/icons";
import InputField from "../components/InputField";
import useDebounce from "../components/useDebounce";
import InputFrom from "../components/InputFrom";
import Pagination from "../components/Pagination";
import { useSearchParams } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Select } from "../components";
import Swal from "sweetalert2";
import DetaiUser from "./DetaiUser";
const {
  MdDelete,
  MdEditSquare,
  MdOutlineClear,
  MdSystemUpdateAlt,
  MdRemoveRedEye,
} = icons;

const ManageUsers = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    email: "",
    name: "",
    role: "",
    mobile: "",
  });
  const [users, setUsers] = useState(null);
  const [show, setShow] = useState(null);
  const [search, setSearch] = useState({ searchKey: "" });
  const [edit, setEdit] = useState(null);
  const [update, setUpdate] = useState(false);
  const [params] = useSearchParams();

  const fetchUser = async (parmas) => {
    const response = await apiGetUser(parmas);
    if (response.success) setUsers(response);
  };
  const searchDebounce = useDebounce(search.searchKey, 800);

  const render = useCallback(() => {
    setUpdate(!update);
  }, [update]);
  const handleUpdate = async (data) => {
    const response = await apiUpdateUser(data, edit._id);
    if (response.success) {
      setEdit(null);
      render();
    }
  };
  const handleDeleteUser = (uid) => {
    Swal.fire({
      title: "Are you sure...",
      text: "Are you ready remove this user?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log("uid", uid);
        const response = await apiDeleteUser(uid);
        console.log("response", uid);
        if (response.success) {
          render();
        } else {
        }
      }
    });
  };

  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    if (searchDebounce) queries.searchKey = searchDebounce;
    fetchUser(queries);
  }, [searchDebounce, params, update]);

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
    <div className="w-full flex flex-col gap-4 relative">
      {/* Modal nếu có */}
      {show && (
        <div className="absolute inset-0 min-h-screen bg-gray-100 z-50">
          <DetaiUser show={show} render={render} setShow={setShow} />
        </div>
      )}

      {/* Tiêu đề */}
      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b bg-white">
        <span>Quản lý khách hàng</span>
      </h1>

      {/* Nội dung chính */}
      <div className="w-full py-4 px-4">
        {/* Ô tìm kiếm */}
        <div className="flex justify-end mb-4">
          <InputField
            namekey="searchKey"
            value={search.searchKey}
            setValue={setSearch}
            fw="w-[500px]"
            placeholder="Tìm người dùng..."
            title
          />
        </div>

        {/* Biểu mẫu và bảng */}
        <form onSubmit={handleSubmit(handleUpdate)}>
          {edit && <Button type="submit" name="Cập nhật" />}

          <table className="table-auto mb-6 text-left w-full border-collapse">
            <thead className="font-bold bg-gray-500 text-white text-sm">
              <tr>
                <th className="px-2 py-2">STT</th>
                <th className="px-2 py-2">Email</th>
                <th className="px-2 py-2">Tên</th>
                <th className="px-2 py-2">Số điện thoại</th>
                <th className="px-2 py-2">Quyền</th>
                <th className="px-6 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users?.users?.map((el, idx) => (
                <tr key={el._id} className="border-b">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-2 py-2">
                    {edit?._id === el._id ? (
                      <InputFrom
                        register={register}
                        fullwidth
                        errors={errors}
                        defaultValue={edit?.email}
                        id="email"
                        validate={{
                          required: true,
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Vui lòng nhập email hợp lệ",
                          },
                        }}
                      />
                    ) : (
                      <span>{el.email}</span>
                    )}
                  </td>
                  <td className="px-2 py-2">
                    {edit?._id === el._id ? (
                      <InputFrom
                        register={register}
                        errors={errors}
                        defaultValue={edit?.name}
                        id="name"
                        validate={{ required: "Không được để trống" }}
                      />
                    ) : (
                      <span>{el.name}</span>
                    )}
                  </td>
                  <td className="px-2 py-2">
                    {edit?._id === el._id ? (
                      <InputFrom
                        register={register}
                        errors={errors}
                        defaultValue={edit?.mobile}
                        id="mobile"
                        validate={{
                          required: "Không được để trống",
                          pattern: {
                            value: /^[62|0]+\d{9}/gi,
                            message: "Số điện thoại không hợp lệ.",
                          },
                        }}
                      />
                    ) : (
                      <span>{el.mobile}</span>
                    )}
                  </td>
                  <td className="px-2 py-2">
                    {edit?._id === el._id ? (
                      <Select
                        register={register}
                        fullwidth
                        errors={errors}
                        defaultValue={+el.role}
                        id="role"
                        validate={{ required: "Không được để trống" }}
                        options={roles}
                      />
                    ) : (
                      <span>
                        {roles.find((role) => +role.code === +el.role)?.title}
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-2 flex gap-2 items-center">
                    <MdRemoveRedEye
                      size={24}
                      color="red"
                      onClick={() => setShow(el)}
                      className="cursor-pointer"
                    />

                    {edit?._id === el._id ? (
                      <>
                        <MdOutlineClear
                          size={24}
                          color="red"
                          onClick={() => setEdit(null)}
                          className="cursor-pointer"
                        />
                        <button
                          type="submit"
                          className="p-0 border-none bg-transparent cursor-pointer"
                        >
                          <MdSystemUpdateAlt
                            size={24}
                            color="red"
                            onClick={() => setEdit(el)}
                          />
                        </button>
                      </>
                    ) : (
                      <>
                        <MdEditSquare
                          size={24}
                          color="red"
                          onClick={() => setEdit(el)}
                          className="cursor-pointer"
                        />
                        <MdDelete
                          size={24}
                          color="red"
                          onClick={() => handleDeleteUser(el._id)}
                          className="cursor-pointer"
                        />
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>

        {/* Phân trang */}
        <div className="w-full flex justify-center mt-4">
          <Pagination totalCount={users?.counts} />
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
