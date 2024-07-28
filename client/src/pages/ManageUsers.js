import React, { useCallback, useEffect, useState } from "react";
import { apiDeleteUser, apiGetUser, apiUpdateUser } from "../apis/user";
import moment from "moment";
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
const { MdDelete, MdEditSquare, MdOutlineClear, MdSystemUpdateAlt } = icons;

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
    } else {
      console.log(3);
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
    <div className="w-full">
      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
        <span>ManageUsers</span>
      </h1>
      <div className="w-full py-4 px-4">
        <div className="flex justify-end ">
          <InputField
            namekey={"searchKey"}
            value={search.searchKey}
            setValue={setSearch}
            fw="w-[500px]"
            placeholder={"Tìm người dùng..."}
            title
          />
        </div>

        <form onSubmit={handleSubmit(handleUpdate)}>
          {edit && <Button type="submit" name="Cập nhật" />}
          <table className="table-auto mb-6 text-left w-full ">
            <thead className="font-bold bg-gray-500 text-[13px] text-white">
              <tr>
                <th className="px-2 py-2">STT</th>
                <th className="px-2 py-2">Email</th>
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Avatar</th>
                <th className="px-2 py-2">Phone</th>
                <th className="px-2 py-2">Role</th>
                <th className="px-2 py-2">Create At</th>
                <th className="px-5 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.users?.map((el, idx) => (
                <tr key={el._id} className="border border-b-1">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-2 py-2">
                    {edit?._id === el._id ? (
                      <InputFrom
                        register={register}
                        fullwidth
                        errors={errors}
                        defaulfValue={edit?.email}
                        id={"email"}
                        validate={{
                          required: true,
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Vui long nhap mail",
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
                        defaulfValue={edit?.name}
                        id={"name"}
                        validate={{ required: "Không được để trống" }}
                      />
                    ) : (
                      <span>{el.name}</span>
                    )}
                  </td>
                  <td className="px-2 py-2">
                    <img
                      src={el.avatar}
                      alt="logo"
                      className="w-[40px] h-[50px] "
                    />
                  </td>
                  <td className="px-2 py-2">
                    {edit?._id === el._id ? (
                      <InputFrom
                        register={register}
                        errors={errors}
                        defaulfValue={edit?.mobile}
                        id={"mobile"}
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
                        defaulfValue={+el.role}
                        id={"role"}
                        validate={{
                          required: "Không được để trống",
                        }}
                        options={roles}
                      />
                    ) : (
                      <span>
                        {roles.find((role) => +role.code === +el.role)?.title}
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-2">
                    {moment(el.createdAt).format("DD / MM / YYYY")}
                  </td>
                  <td className="px-2 py-2 flex-row gap-2">
                    <td className="px-3 py-2">
                      {edit?._id === el._id ? (
                        <MdOutlineClear
                          size={24}
                          color="red"
                          onClick={() => {
                            setEdit(null);
                          }}
                        />
                      ) : (
                        <MdEditSquare
                          size={24}
                          color="red"
                          onClick={() => {
                            setEdit(el);
                          }}
                        />
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {edit?._id === el._id ? (
                        <button type="submit">
                          <MdSystemUpdateAlt
                            size={24}
                            color="red"
                            onClick={() => {
                              setEdit(el);
                            }}
                          />
                        </button>
                      ) : (
                        <MdDelete
                          size={24}
                          color="red"
                          onClick={() => {
                            handleDeleteUser(el._id);
                          }}
                        />
                      )}
                    </td>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>
        <div className="w-full flex justify-b">
          <Pagination totalCount={users?.counts} />
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
