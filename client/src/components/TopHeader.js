import React, { memo, useEffect } from "react";
import { Link } from "react-router-dom";
import path from "../ultils/path";
import { getCurrent } from "../store/user/asyncActions";
import { useDispatch, useSelector } from "react-redux";
import icons from "../ultils/icons";
import { logout } from "../store/user/userStore";
import { useNavigate } from "react-router-dom";

const { IoIosLogOut } = icons;
const TopHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, current } = useSelector((state) => state.user);

  const logOut = () => {
    dispatch(logout());
    navigate(`/${path.LOGIN}`);
  };
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getCurrent());
    }
  }, [dispatch, isLoggedIn]);
  return (
    <div className="h-[38px] w-[1120px] px-4  flex items-center justify-end">
      <div className="w-main flex items-center justify-between text-xs ">
        <span className="text-sm text-red-500"></span>
        {isLoggedIn ? (
          <small className=" flex flex-row items-center ">
            <span className="text-sm text-red-500">{`Xin chào, ${current?.name}`}</span>
            <span onClick={() => logOut()}>
              <IoIosLogOut size={24} color="red" className="ml-[10px]" />
            </span>
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
