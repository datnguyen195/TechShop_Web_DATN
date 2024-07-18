import React, { memo } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "../../components";
import { useSelector } from "react-redux";
import path from "../../ultils/path";
import TopHeader from "../../components/TopHeader";
const AdminHome = () => {
  const { isLoggedIn, current } = useSelector((state) => state.user);
  // console.log("current", isLoggedIn);
  // console.log("current", current);
  // if (!isLoggedIn || +current.role !== 0) {
  //   return <Navigate to={`/${path.LOGIN}`} replace={true} />;
  // }
  return (
    <div className="h-full flex bg-white min-h-screen">
      <div className="w-[290px] flex-none fixed top-0 left-0 bottom-0">
        <Sidebar />
      </div>

      <div className="flex-auto ml-[290px]">
        <TopHeader />
        <Outlet />
      </div>
    </div>
  );
};

export default memo(AdminHome);
