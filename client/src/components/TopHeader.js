import React, { memo, useEffect } from "react";
import { Link } from "react-router-dom";
import path from "../ultils/path";
import { getCurrent } from "../store/user/ asyncActions";
import { useDispatch, useSelector } from "react-redux";
import icons from "../ultils/icons";
import { logout } from "../store/user/userStore";

const { IoIosLogOut } = icons;
const TopHeader = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, current } = useSelector((state) => state.user);
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getCurrent());
    }
  }, [dispatch, isLoggedIn]);
  return (
    <div className="h-[38px] w-full bg-main flex items-center justify-center">
      <div className="w-main flex items-center justify-between text-xs text-white">
        <span className="text-xs">Hãy gọi cho tôi khi bạn cần</span>
        {isLoggedIn ? (
          <small className=" flex flex-row items-center ">
            <span
              className="text-xs"
              onClick={() => dispatch(logout())}
            >{`Xin chào, ${current?.name}`}</span>
            <IoIosLogOut size={20} color="white" className="ml-[20px] " />
          </small>
        ) : (
          <Link className="hover:text-gray-800" to={`/${path.LOGIN}`}>
            Đăng nhập Or Tạo Tài khoản
          </Link>
        )}
      </div>
    </div>
  );
};

export default TopHeader;
