import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, InputFrom } from "../../components";
import { useSelector } from "react-redux";
import { apiUpdateCurrent } from "../../apis/user";
import moment from "moment";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { getCurrent } from "../../store/user/asyncActions";

const Profile = () => {
  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    reset,
  } = useForm();
  const { current } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleUpdateInfor = async (data) => {
    const formData = new FormData();
    if (data.avatar.length > 0) formData.append("avatar", data.avatar[0]);
    delete data.avatar;
    console.log(data);
    for (let i of Object.entries(data)) formData.append(i[0], i[1]);

    const response = await apiUpdateCurrent(formData);
    if (response.success) {
      dispatch(getCurrent());
      Swal.fire({
        icon: "success",
        title: "Xử lý thành công.",
        showConfirmButton: false,
        timer: 1000,
      });
    } else
      Swal.fire({
        icon: "error",
        title: "Xử lý thành công.",
        showConfirmButton: false,
        timer: 1000,
      });
  };
  console.log(current.avatar);
  useEffect(() => {
    reset({
      name: current?.name,
      email: current?.email,
      mobile: current?.mobile,
      gender: current?.gender,
      avatar: current?.avatar,
    });
  }, [current]);
  console.log("current", current?.avatar);
  return (
    <div className="container mx-auto px-4">
      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
        <span>Trang cá nhân</span>
      </h1>
      <div className="flex flex-col md:flex-row  mt-4">
        <div className="md:w-1/4 text-center mt-10 mb-4 md:mb-0">
          <label htmlFor="file">
            <img
              className="h-40 w-40 rounded-full mx-auto"
              src={current?.avatar}
              alt="Avatar"
            />
          </label>
          <input type="file" id="file" {...register("avatar")} hidden />
        </div>
        <form
          onSubmit={handleSubmit(handleUpdateInfor)}
          className="md:w-2/4 md:pl-8"
        >
          <InputFrom
            label="Tên"
            register={register}
            errors={errors}
            id="name"
            validate={{
              required: "Need fill this field",
            }}
          />
          <InputFrom
            label="Số điện thoai"
            register={register}
            errors={errors}
            id="mobile"
            validate={{
              required: "Need fill this field",
              pattern: {
                value: /^[62|0]+\d{9}/gi,
                message: "Số điện thoại không hợp lệ.",
              },
            }}
          />
          <InputFrom
            label="Email"
            register={register}
            errors={errors}
            id="email"
            validate={{
              required: "Need fill this field",
              pattern: {
                value: "^0d{9}$",
                message: "ko hợp lê",
              },
            }}
          />
          <div className="flex items-center gap-2 mt-8">
            <span className="font-medium">Vai trò:</span>
            <span>{current?.role == 0 ? "Admin" : "User"}</span>
          </div>
          <div className="flex items-center gap-2 mt-4 mb-6">
            <span className="font-medium">Ngày tạo:</span>
            <span>{moment(current?.createdAt).format("DD / MM / YYYY")}</span>
          </div>
          {isDirty && <Button type="submit" name="Cập nhật" />}
        </form>
      </div>
    </div>
  );
};

export default Profile;
