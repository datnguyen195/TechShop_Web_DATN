import React, { useCallback, useState } from "react";
import { Button, InputField } from "../../components";

const Login = () => {
  const [payload, setPayload] = useState({
    email: "",
    passwword: "",
    name: "",
  });
  const handleSubmit = useCallback(() => {
    console.log(payload);
  }, [payload]);
  return (
    <div className="w-full h-screen relative">
      <img
        src="https://www.elle.vn/wp-content/uploads/2017/07/25/hinh-anh-dep-1.jpg"
        alt=""
        className="w-full h-full object cover"
      />
      <div className="absolute top-0 bottom-0 left-0 right-1/2 items-center justify-center flex">
        <div className="p-8 bg-white rounded-md min-w-[500px]">
          <h1 className=" text-[28px] font-semibold text-main"> Login</h1>
          <InputField
            value={payload.email}
            setValue={setPayload}
            namekey={"email"}
          />
          <InputField
            value={payload.email}
            setValue={setPayload}
            namekey={"passwword"}
          />
          <InputField
            value={payload.email}
            setValue={setPayload}
            namekey={"name"}
          />
          <Button name="Login" handleOnClink={handleSubmit} fw />
          <div className="flex items-center my-2 w-full justify-between">
            <span className="text-blue-500 hover:underline cursor-pointer">
              SingIn
            </span>
            <span className="text-blue-500 hover:underline cursor-pointer">
              Forgot pass
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
