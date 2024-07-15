import React, { memo } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "../../components";
import { useSelector } from "react-redux";
import path from "../../ultils/path";
const AdminHome = () => {
  const { isLoggedIn, current } = useSelector((state) => state.user);
  console.log("current22", current);
  if (!isLoggedIn || !current || +current.role !== 0) {
    return <Navigate to={`/${path.LOGIN}`} replace={true} />;
  }
  return (
    <div className="h-full flex bg-white min-h-screen ">
      <div className="w-[327px] flex-none bottom-0 top-0 fixed">
        <Sidebar />
      </div>
      <div className="w-[327px]"></div>
      <div className="flex-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default memo(AdminHome);
