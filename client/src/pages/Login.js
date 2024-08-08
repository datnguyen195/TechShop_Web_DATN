import React, { useState } from "react";
import { Button, InputField } from "../components";
import { apiLogin, apiRegister } from "../apis/user";
import { useNavigate } from "react-router-dom";
import path from "../ultils/path";
import { getCurrent } from "../store/user/asyncActions";
import Swal from "sweetalert2";
import { register } from "../store/user/userStore";
import { useDispatch } from "react-redux";
import { validate } from "../ultils/helper";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [payload, setPayload] = useState({
    email: "",
    password: "",
    name: "",
    mobile: "",
  });
  const resetPayload = () => {
    setPayload({
      email: "",
      password: "",
      name: "",
      mobile: "",
    });
  };

  const [isRegister, setIsRegister] = useState(false);
  const handleSubmit = async () => {
    const { name, mobile, ...data } = payload;
    const invalids = isRegister ? validate(payload) : validate(data);
    if (invalids === 0) {
      if (isRegister) {
        const response = await apiRegister(payload);
        {
          if (response.success) {
            Swal.fire("Thành công.", response.mes, "success");
            setIsRegister(false);
            resetPayload();
          } else {
            Swal.fire("Đã sảy ra lỗi.", response.mes, "error");
          }
        }
      } else {
        const res = await apiLogin(data);
        if (res.success) {
          dispatch(
            register({
              isLoggedIn: true,
              token: res.accessToken,
              userData: res.userData,
            })
          );

          Swal.fire("Thành công.", res.mes, "success");
          dispatch(getCurrent());
          navigate(`/${path.ADMIN}`);
        } else {
          Swal.fire("Đã sảy ra lỗi.", res.mes, "error");
        }
      }
    }
  };
  return (
    <div className="w-full h-screen relative">
      <img
        src="https://www.elle.vn/wp-content/uploads/2017/07/25/hinh-anh-dep-1.jpg"
        alt=""
        className="w-full h-full object cover"
      />
      <div className="absolute top-0 bottom-0 left-0 right-1/2 items-center justify-center flex">
        <div className="p-8 bg-white rounded-md min-w-[500px]">
          <h1 className=" text-[28px] font-semibold text-main">
            {isRegister ? "Register" : "Login"}
          </h1>
          {isRegister && (
            <div className="flex items-center gap-2">
              <InputField
                value={payload.name}
                setValue={setPayload}
                namekey={"name"}
              />
              <InputField
                value={payload.mobile}
                setValue={setPayload}
                namekey={"mobile"}
              />
            </div>
          )}
          <InputField
            value={payload.email}
            setValue={setPayload}
            namekey={"email"}
          />
          <InputField
            value={payload.password}
            setValue={setPayload}
            namekey={"password"}
            type="password"
          />

          <Button
            name={isRegister ? "Đăng ký" : "Đăng nhập"}
            handleOnClink={handleSubmit}
            fw
          />
          <div className="flex items-center my-2 w-full justify-between">
            {!isRegister && (
              <span
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={() => setIsRegister(true)}
              >
                Tạo tài khảo
              </span>
            )}
            {isRegister && (
              <span
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={() => setIsRegister(false)}
              >
                Đăng nhập
              </span>
            )}
            {!isRegister && (
              <span className="text-blue-500 hover:underline cursor-pointer">
                Quên mật khẩu?
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
